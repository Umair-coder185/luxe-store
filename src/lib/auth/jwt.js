// lib/auth/jwt.js
// ─────────────────────────────────────────────────────────────
// JWT token operations (Node.js runtime only — NOT Edge compatible).
//
// Two token types with separate secrets:
//   Access Token  → short-lived (15 min),  used in every API request
//   Refresh Token → long-lived (7 days),  used only to get new access tokens
//
// If the access token secret is compromised, the attacker gets
// 15 minutes of access. The refresh token remains safe because
// it uses a completely different secret.
//
// NOTE: For Edge Runtime (middleware.js), use lib/auth/jwt-edge.js
// with the 'jose' library instead. This file uses 'jsonwebtoken'
// which relies on Node.js crypto module.
// ─────────────────────────────────────────────────────────────

import jwt from 'jsonwebtoken';
import env from '@/config/env.js';

// ── Payload Builders ─────────────────────────────────────────

/**
 * Build the access token payload.
 * Keep it minimal — look up fresh data from DB when needed.
 *
 * Why role is here:
 *   Middleware and guards need role without a DB round-trip
 *   on every request. The 15-min lifetime limits staleness.
 *
 * Why tokenVersion is here:
 *   On refresh, we compare this value against the DB.
 *   If the user logged out (tokenVersion incremented in DB),
 *   the refresh is rejected — server-side token revocation.
 *
 * @param {{ _id: string, role: string, tokenVersion: number }} user
 * @returns {{ sub: string, role: string, tv: number }}
 */
function buildAccessPayload(user) {
  return {
    sub: user._id.toString(),
    role: user.role,
    tv: user.tokenVersion,
  };
}

/**
 * Build the refresh token payload.
 * No role — role is fetched fresh from DB during refresh
 * so a role change takes effect on the next access token.
 *
 * @param {{ _id: string, tokenVersion: number }} user
 * @returns {{ sub: string, tv: number }}
 */
function buildRefreshPayload(user) {
  return {
    sub: user._id.toString(),
    tv: user.tokenVersion,
  };
}

// ── Sign ─────────────────────────────────────────────────────

/**
 * Sign a new access token.
 *
 * @param {{ _id: string, role: string, tokenVersion: number }} user
 * @param {object} [options] - Override defaults (useful for testing)
 * @returns {string} Signed JWT string
 */
export function signAccessToken(user, options = {}) {
  return jwt.sign(
    buildAccessPayload(user),
    options.secret || env.jwt.accessSecret,
    {
      expiresIn: options.expiresIn || env.jwt.accessExpiresIn,
      issuer: 'capsule-hub',
      audience: 'capsule-hub:access',
    }
  );
}

/**
 * Sign a new refresh token.
 *
 * @param {{ _id: string, tokenVersion: number }} user
 * @param {object} [options] - Override defaults (useful for testing)
 * @returns {string} Signed JWT string
 */
export function signRefreshToken(user, options = {}) {
  return jwt.sign(
    buildRefreshPayload(user),
    options.secret || env.jwt.refreshSecret,
    {
      expiresIn: options.expiresIn || env.jwt.refreshExpiresIn,
      issuer: 'capsule-hub',
      audience: 'capsule-hub:refresh',
    }
  );
}

// ── Verify ───────────────────────────────────────────────────

/**
 * Verify an access token and return its decoded payload.
 *
 * @param {string} token - The raw JWT string from the cookie
 * @returns {{ sub: string, role: string, tv: number, iat: number, exp: number }}
 * @throws {TokenExpiredError}   If token has expired
 * @throws {JsonWebTokenError}   If token is malformed or signature invalid
 */

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret, {
    algorithms: ['HS256'],
    issuer: 'capsule-hub',
    audience: 'capsule-hub:access',
  });
}

/**
 * Verify a refresh token and return its decoded payload.
 *
 * @param {string} token - The raw JWT string from the cookie
 * @returns {{ sub: string, tv: number, iat: number, exp: number }}
 * @throws {TokenExpiredError}   If token has expired
 * @throws {JsonWebTokenError}   If token is malformed or signature invalid
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret, {
    issuer: 'capsule-hub',
    audience: 'capsule-hub:refresh',
  });
}

// ── Utility ──────────────────────────────────────────────────

/**
 * Check if an error is a JWT token expiration error.
 * Useful in API routes to return the correct HTTP status
 * (401 for expired, 401 for invalid — but different message).
 *
 * @param {unknown} error
 * @returns {boolean}
 */
export function isTokenExpired(error) {
  return (
    error &&
    error.name === 'TokenExpiredError'
  );
}

/**
 * Check if an error is any JWT-related error
 * (expired, invalid, malformed, wrong signature, etc.).
 *
 * @param {unknown} error
 * @returns {boolean}
 */
export function isTokenError(error) {
  return (
    error &&
    (error.name === 'JsonWebTokenError' ||
     error.name === 'TokenExpiredError' ||
     error.name === 'NotBeforeError')
  );
}