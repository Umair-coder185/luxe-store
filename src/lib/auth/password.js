// lib/auth/password.js
// ─────────────────────────────────────────────────────────────
// Stateless password utilities.
//
// Why this file exists alongside model methods:
//   User.comparePassword()  → requires a User document instance
//   hashPassword()          → standalone, no document needed
//   validateStrength()      → runs BEFORE creating a user
//
// Model handles auto-hashing on save. This file handles
// everything outside that flow.
// ─────────────────────────────────────────────────────────────

import bcrypt from 'bcryptjs';

// ── Password Policy ──────────────────────────────────────────

/**
 * Password requirements enforced at the server boundary.
 * Frontend should mirror these rules for UX, but the
 * server is the final authority — never trust client validation.
 */
export const PASSWORD_POLICY = Object.freeze({
  MIN_LENGTH: 8,
  MAX_LENGTH: 72,
  UPPERCASE_REQUIRED: true,
  LOWERCASE_REQUIRED: true,
  NUMBER_REQUIRED: true,
  SPECIAL_REQUIRED: true,
  SPECIAL_CHARS: '!@#$%^&*()_+-=[]{}|;:,.<>?',
});

// ── Hash ─────────────────────────────────────────────────────

/**
 * Hash a plain-text password.
 *
 * Use cases where this is needed instead of the model's
 * pre-save hook:
 *   - Seed scripts (pre-hashed passwords for test users)
 *   - Import/migration scripts
 *   - Any context where a User document isn't being saved
 *
 * @param {string} plainText - The raw password
 * @param {number} [rounds=12] - bcrypt salt rounds (12 = ~250ms, production safe)
 * @returns {Promise<string>} The bcrypt hash
 */
export async function hashPassword(plainText, rounds = 12) {
  if (!plainText || typeof plainText !== 'string') {
    throw new Error('hashPassword requires a non-empty string');
  }

  const salt = await bcrypt.genSalt(rounds);
  return bcrypt.hash(plainText, salt);
}

// ── Verify ───────────────────────────────────────────────────

/**
 * Verify a plain-text password against a bcrypt hash.
 *
 * Note: For login flow, prefer `user.comparePassword(candidate)`
 * on the User model instance — it's the same function but
 * attached to the document for convenience.
 *
 * This standalone version exists for contexts where you
 * have a hash but no User document (rare, but possible
 * in migration or audit scripts).
 *
 * @param {string} plainText - The raw password to check
 * @param {string} hash - The stored bcrypt hash
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(plainText, hash) {
  if (!plainText || !hash) {
    return false;
  }

  return bcrypt.compare(plainText, hash);
}

// ── Strength Validation ──────────────────────────────────────

/**
 * Validate password against the security policy.
 * Runs BEFORE hashing — reject weak passwords early.
 *
 * Returns detailed errors so the frontend can show
 * specific feedback ("missing uppercase letter").
 *
 * @param {string} password - Plain text password to validate
 * @returns {{ valid: boolean, errors: string[] }}
 *
 * @example
 * const { valid, errors } = validateStrength('weak');
 * // valid: false, errors: ['at least 8 characters', 'uppercase letter', ...]
 */
export function validateStrength(password) {
  if (!password || typeof password !== 'string') {
    return {
      valid: false,
      errors: ['Password is required'],
    };
  }

  const errors = [];
  const policy = PASSWORD_POLICY;

  if (password.length < policy.MIN_LENGTH) {
    errors.push(`At least ${policy.MIN_LENGTH} characters`);
  }

  if (password.length > policy.MAX_LENGTH) {
    errors.push(`At most ${policy.MAX_LENGTH} characters`);
  }

  if (policy.UPPERCASE_REQUIRED && !/[A-Z]/.test(password)) {
    errors.push('At least one uppercase letter');
  }

  if (policy.LOWERCASE_REQUIRED && !/[a-z]/.test(password)) {
    errors.push('At least one lowercase letter');
  }

  if (policy.NUMBER_REQUIRED && !/\d/.test(password)) {
    errors.push('At least one number');
  }

  if (policy.SPECIAL_REQUIRED) {
    const hasSpecial = [...policy.SPECIAL_CHARS].some(
      (char) => password.includes(char)
    );
    if (!hasSpecial) {
      errors.push('At least one special character (!@#$%^&*...)');
    }
  }

  // Common weak password check
  const COMMON_PASSWORDS = [
    'password', 'password123', '12345678', 'qwerty123',
    'admin123', 'letmein1', 'welcome1', 'abc12345',
  ];
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('This password is too common');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}