// constants/cookies.js
// ─────────────────────────────────────────────────────────────
// Every cookie name used in the entire project lives here.
// No file should ever hardcode a cookie string like "token"
// or "refreshToken" — import from here instead.
// ─────────────────────────────────────────────────────────────

/**
 * Cookie names used for authentication.
 * These are the actual cookie keys sent to the browser.
 */
export const COOKIES = Object.freeze({
  /** JWT access token — short-lived (15 min). */
  ACCESS_TOKEN: 'ch_at',

  /** JWT refresh token — long-lived (7 days). */
  REFRESH_TOKEN: 'ch_rt',

  /** Guest session identifier for non-logged-in users. */
  GUEST_SESSION: 'ch_gs',
});

/**
 * Cookie configuration defaults.
 * Used by lib/auth/session.js when setting cookies.
 */
export const COOKIE_CONFIG = Object.freeze({
  /** Access token cookie options. */
  ACCESS: {
    httpOnly: true,
    secure: true,       // HTTPS only — Next.js middleware will flip this to false in dev
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,    // 15 minutes (matches JWT expiry)
  },

  /** Refresh token cookie options. */
  REFRESH: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,  // 7 days
  },

  /** Guest session cookie options. */
  GUEST: {
    httpOnly: false,     // Client needs to read this for cart/wishlist sync
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,  // 30 days
  },
});