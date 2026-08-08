// lib/auth/session.js
// ─────────────────────────────────────────────────────────────
// HTTP-only cookie helpers for authentication.
//
// Security decisions:
//   1. All auth cookies are httpOnly — JavaScript cannot read them.
//      This is the primary defense against token theft via XSS.
//
//   2. Refresh token cookie has path: '/api/auth'.
//      It is ONLY sent to auth endpoints (/api/auth/refresh,
//      /api/auth/login, /api/auth/logout, etc.) — not on every
//      request like the access token. If somehow the access
//      token is stolen, the refresh token is not automatically
//      sent alongside it on unrelated endpoints like /api/products
//      or /api/orders.
//
//      NOTE: This path was widened from '/api/auth/refresh' to
//      '/api/auth' specifically so that POST /api/auth/logout can
//      read the refresh token cookie and bump tokenVersion for
//      server-side revocation. A narrower path would mean logout
//      almost never sees a valid refresh token in practice (see
//      lib/auth/session.js history / Day 3 review notes).
//
//   3. SameSite: 'lax' — protects against CSRF while still
//      allowing top-level navigations (e.g., email links).
//      'strict' would block cross-site navigation entirely.
//
//   4. secure flag is flipped based on environment:
//      - Production: true  (HTTPS only)
//      - Development: false (localhost has no HTTPS)
// ─────────────────────────────────────────────────────────────

import { stringifyCookie as serialize, parseCookie as parse } from 'cookie';
import env from '@/config/env.js';
import { COOKIES, COOKIE_CONFIG } from '@/constants/cookies.js';

// ── Shared path constant ─────────────────────────────────────
// Single source of truth — used when SETTING and when CLEARING
// the refresh cookie. These two values must always match exactly,
// or the browser will fail to clear the cookie (path mismatch).
const REFRESH_COOKIE_PATH = '/api/auth';

// ── Internal: Build Options ──────────────────────────────────

/**
 * Merge the default cookie config with runtime adjustments.
 * This is the single place where environment-specific
 * behavior is decided — no if/else scattered across files.
 */
function buildOptions(baseConfig, overrides = {}) {
  return {
    ...baseConfig,
    httpOnly: baseConfig.httpOnly,
    secure: env.isDev ? false : baseConfig.secure,
    sameSite: baseConfig.sameSite,
    path: baseConfig.path,
    maxAge: baseConfig.maxAge,
    domain: env.cookie.domain || undefined,
    ...overrides,
  };
}

// ── Set Cookies ──────────────────────────────────────────────

/**
 * Serialize both auth cookies (access + refresh) as Set-Cookie
 * header strings. Attach them to your NextResponse:
 *
 * @example
 * const cookieHeaders = getAuthCookieHeaders({ accessToken, refreshToken });
 * const response = NextResponse.json(data);
 * cookieHeaders.forEach(header => response.headers.append('Set-Cookie', header));
 * return response;
 *
 * @param {{ accessToken: string, refreshToken: string }} tokens
 * @returns {string[]} Array of Set-Cookie header strings
 */
export function getAuthCookieHeaders({ accessToken, refreshToken }) {
  const accessOptions = buildOptions(COOKIE_CONFIG.ACCESS);
  const refreshOptions = buildOptions(COOKIE_CONFIG.REFRESH, {
    // Security: refresh cookie is only sent to /api/auth/* endpoints.
    // Access token cookie goes everywhere (path: '/').
    path: REFRESH_COOKIE_PATH,
  });

  return [
    serialize(COOKIES.ACCESS_TOKEN, accessToken, accessOptions),
    serialize(COOKIES.REFRESH_TOKEN, refreshToken, refreshOptions),
  ];
}

// ── Clear Cookies ────────────────────────────────────────────

/**
 * Serialize both auth cookies with maxAge: 0 to delete them.
 * Browser immediately removes the cookies.
 *
 * @example
 * const clearHeaders = getClearCookieHeaders();
 * const response = NextResponse.json({ message: 'Logged out' });
 * clearHeaders.forEach(header => response.headers.append('Set-Cookie', header));
 * return response;
 *
 * @returns {string[]} Array of Set-Cookie header strings
 */
export function getClearCookieHeaders() {
  const accessClear = serialize(COOKIES.ACCESS_TOKEN, '', {
    ...buildOptions(COOKIE_CONFIG.ACCESS),
    maxAge: 0,
    path: '/',                    // Must match the original path
  });

  const refreshClear = serialize(COOKIES.REFRESH_TOKEN, '', {
    ...buildOptions(COOKIE_CONFIG.REFRESH),
    maxAge: 0,
    path: REFRESH_COOKIE_PATH,    // Must match the original path exactly
  });

  return [accessClear, refreshClear];
}

// ── Parse Cookies ────────────────────────────────────────────

/**
 * Parse the raw Cookie header string into an object.
 *
 * @example
 * // In API route:
 * const cookieHeader = request.headers.get('cookie') || '';
 * const cookies = parseCookies(cookieHeader);
 * const accessToken = cookies[COOKIES.ACCESS_TOKEN];
 *
 * @param {string} cookieHeader - Raw value of the Cookie header
 * @returns {Record<string, string>}
 */
export function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return parse(cookieHeader);
}

/**
 * Extract a single cookie value by name from the Cookie header.
 *
 * @param {string} cookieHeader - Raw value of the Cookie header
 * @param {string} name - Cookie name (use COOKIES constants)
 * @returns {string|undefined}
 */
export function getCookie(cookieHeader, name) {
  const cookies = parseCookies(cookieHeader);
  return cookies[name];
}