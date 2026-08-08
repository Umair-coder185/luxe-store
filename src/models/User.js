// models/User.js
// ─────────────────────────────────────────────────────────────
// Mongoose User Model — single source of truth for user data.
//
// Security rules:
//   1. Password is NEVER returned in any query response
//      (handled by toJSON transform below).
//   2. Password is auto-hashed on save ONLY when modified
//      (handled by pre-save hook below).
//   3. tokenVersion invalidates all refresh tokens on change
//      (logout / password reset / forced logout).
//   4. isActive allows admin to suspend accounts without
//      deleting them.
//   5. passwordResetToken is stored as SHA-256 hash, never raw.
// ─────────────────────────────────────────────────────────────

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { VALID_ROLES } from '@/constants/roles.js';

// ── Schema Definition ────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    // ── Identity ────────────────────────────────────────────

    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name must be at most 50 characters'],
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name must be at most 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },

    phone: {
      type: String,
      trim: true,
      default: '',
    },

    // ── Authentication ──────────────────────────────────────

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    // ── Role & Status ───────────────────────────────────────

    role: {
      type: String,
      enum: {
        values: VALID_ROLES,
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
      index: true,
    },

    /**
     * isActive — admin can suspend accounts without deleting.
     * Login guards check this field. Inactive users
     * cannot authenticate even with valid credentials.
     */
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    /**
     * isVerified — email verification status.
     * Unverified users can still log in but may have
     * restricted access (configurable).
     */
    isVerified: {
      type: Boolean,
      default: false,
    },

    // ── Token Security ──────────────────────────────────────

    /**
     * tokenVersion — incremented on:
     *   - Logout (server-side token invalidation)
     *   - Password change
     *   - Password reset
     *   - Admin forced logout
     *
     * Stored in JWT payload. On refresh, server compares
     * tokenVersion in JWT against DB. If they don't match,
     * the refresh token is rejected.
     *
     * This is our server-side token revocation mechanism.
     * Without it, a stolen refresh token is valid for 7 days
     * even after the user logs out.
     */
    tokenVersion: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ── Password Reset (Forgot Password — Day 8 flow) ──────

    /**
     * SHA-256 hash of the reset token.
     * The raw token is emailed to the user; only the hash
     * is stored. On verification, the incoming token is hashed
     * and compared against this field.
     *
     * Why hash instead of storing raw?
     *   If the database is compromised (backup leak, injection, etc.),
     *   an attacker cannot use the stored hash to reset accounts —
     *   same principle as hashing passwords.
     */
    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    // ── Profile ─────────────────────────────────────────────

    avatar: {
      type: String,
      default: '',
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: '',
    },

    // ── Addresses ───────────────────────────────────────────

    addresses: {
      type: [
        {
          label: {
            type: String,
            enum: ['home', 'office', 'other'],
            default: 'home',
          },
          firstName: { type: String, trim: true, default: '' },
          lastName:  { type: String, trim: true, default: '' },
          phone:     { type: String, trim: true, default: '' },
          address:   { type: String, required: true, trim: true },
          city:      { type: String, required: true, trim: true },
          province:  { type: String, trim: true, default: '' },
          postalCode: { type: String, trim: true, default: '' },
          country:   { type: String, required: true, trim: true, default: 'Pakistan' },
          isDefault: { type: Boolean, default: false },
        },
      ],
      default: [],
    },

    // ── Metadata ────────────────────────────────────────────

    lastLoginAt: {
      type: Date,
      default: null,
    },

    loginCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    // FIX #1: Removed toJSON/toObject from here.
    // Schema.set('toJSON') below replaces, not merges.
    // All toJSON config lives in one place below.
    toObject: { virtuals: true },
  }
);

// ── Indexes ──────────────────────────────────────────────────

// Compound index for admin user listing (sort by createdAt + filter by role)
userSchema.index({ role: 1, createdAt: -1 });

// Text index for admin search by name or email
userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

// ── Virtuals ─────────────────────────────────────────────────

/**
 * Virtual: fullName
 * Returns "FirstName LastName" without storing redundant data.
 * Available on document instances and JSON output (via toJSON virtuals: true).
 */
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

// ── Pre-Save Hook: Auto-Hash Password ────────────────────────

/**
 * Hashes the password before saving — but ONLY when:
 *   1. The password field is being modified (new user or password change)
 *   2. The password is not already a bcrypt hash
 *
 * bcrypt hashes start with "$2b$" or "$2a$".
 * If the value already looks like a hash, we skip re-hashing
 * (prevents double-hashing when admin updates user via seed/script).
 */
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();

  // Skip if already a bcrypt hash (protects seed scripts & tests)
  if (this.password && /^\$2[ab]\$\d{2}\$/.test(this.password)) {
    return next();
  }

  try {
    // FIX #4: Static import — models only run in Node.js, never Edge.
    // Dynamic import was unnecessary overhead on every save/compare.
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ── toJSON Transform: Strip Sensitive Fields ─────────────────

/**
 * FIX #1 (merged): Single toJSON config with virtuals + transform.
 * This runs every time a document is converted to JSON/object
 * (API responses, res.json(), etc.).
 *
 * Removes:
 *   - password       (defense in depth — select:false is first layer)
 *   - passwordResetToken
 *   - passwordResetExpires
 *   - __v            (Mongoose internal version key)
 *   - id             (conflicts with _id, causes duplicate fields)
 */
userSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.__v;
    delete ret.id;
    return ret;
  },
});

// ── Instance Methods ─────────────────────────────────────────

/**
 * Compare a plain-text password against the stored hash.
 *
 * @param {string} candidatePassword - Plain text password from user input
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Increment tokenVersion to invalidate all existing
 * refresh tokens. Call this on logout, password change,
 * and password reset.
 *
 * validateBeforeSave: false because we don't want
 * Mongoose to re-validate all required fields — we're
 * only incrementing a number.
 *
 * @returns {Promise<number>} The new tokenVersion value
 */
userSchema.methods.incrementTokenVersion = async function () {
  this.tokenVersion += 1;
  await this.save({ validateBeforeSave: false });
  return this.tokenVersion;
};

/**
 * Check if this user is allowed to authenticate.
 * Blocked users (isActive: false) are rejected at the gate.
 *
 * @returns {{ allowed: boolean, reason?: string }}
 */
userSchema.methods.canAuthenticate = function () {
  if (!this.isActive) {
    return { allowed: false, reason: 'Account has been suspended' };
  }
  return { allowed: true };
};

/**
 * Generate a password reset token.
 * Returns the RAW token (to email to user).
 * Stores the SHA-256 HASH in the DB.
 *
 * FIX #2: Raw token never touches the database.
 * If DB leaks, attacker gets a hash, not a usable token.
 *
 * @returns {Promise<string>} The raw reset token (send this via email)
 */
userSchema.methods.createPasswordResetToken = async function () {
  // Generate a cryptographically secure random token
  const rawToken = crypto.randomBytes(32).toString('hex');

  // Hash it before storing — DB only ever sees the hash
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  this.passwordResetToken = hashedToken;
  // Token expires in 15 minutes
  this.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

  await this.save({ validateBeforeSave: false });

  // Return raw token — this goes in the email, NEVER in the DB
  return rawToken;
};

/**
 * Verify a password reset token against the stored hash.
 * Also checks expiration.
 *
 * @param {string} rawToken - Token from the user's email link
 * @returns {Promise<boolean>}
 */
userSchema.methods.verifyPasswordResetToken = async function (rawToken) {
  // Hash the incoming token to compare against stored hash
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  // Token must match AND not be expired
  return (
    this.passwordResetToken === hashedToken &&
    this.passwordResetExpires > new Date()
  );
};

/**
 * Clear password reset fields after successful reset.
 */
userSchema.methods.clearPasswordResetToken = async function () {
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;
  await this.save({ validateBeforeSave: false });
};

// ── Static Methods ───────────────────────────────────────────

/**
 * Find a user by email and INCLUDE the password field
 * (needed for login credential verification).
 * Normal User.findById() won't include password (select: false).
 *
 * @param {string} email
 * @returns {Promise<import('mongoose').Document>}
 */
userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

// ── Export ───────────────────────────────────────────────────

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;