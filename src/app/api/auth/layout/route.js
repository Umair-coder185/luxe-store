// app/api/auth/logout/route.js
// ─────────────────────────────────────────────────────────────
// POST /api/auth/logout
//
// Clears cookies AND invalidates tokens server-side.
//
// Design: logout always succeeds from the client's perspective.
// The response always clears cookies, regardless of token state.
// Server-side token invalidation is best-effort.
//
// Uses the REFRESH token (not access token) to identify the user.
// Reason: refresh token has a 7-day lifetime and its cookie path
// covers /api/auth/*, so it's reliably available at logout time.
// The access token's 15-minute cookie lifetime means it's often
// already expired/deleted by the browser when the user logs out.
//
// Scenarios handled:
//   - Valid refresh token   → bump tokenVersion, clear cookies
//   - Expired refresh token  → clear cookies (user was already
//     effectively logged out — refresh token is the last lifeline)
//   - No token at all        → clear cookies (idempotent)
//   - DB error               → still clear cookies (graceful)
// ─────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import User from '@/models/User.js';
import { verifyRefreshToken } from '@/lib/auth/jwt.js';
import { getCookie, getClearCookieHeaders } from '@/lib/auth/session.js';
import { COOKIES } from '@/constants/cookies.js';
import dbConnect from '@/lib/db/index.js';

export async function POST(request) {
  // Build success response with cookies cleared — FIRST.
  // This guarantees the client always gets its cookies cleared,
  // even if server-side cleanup fails.
  const response = NextResponse.json({ message: 'Logged out successfully' });
  const clearHeaders = getClearCookieHeaders();
  clearHeaders.forEach((header) => {
    response.headers.append('Set-Cookie', header);
  });

  // Server-side token invalidation — best-effort
  try {
    await dbConnect();

    const cookieHeader = request.headers.get('cookie') || '';
    const token = getCookie(cookieHeader, COOKIES.REFRESH_TOKEN);

    if (!token) return response;

    // Verify refresh token — signature + expiry check.
    // A forged or expired token is rejected here.
    const payload = verifyRefreshToken(token);

    // Increment tokenVersion to invalidate ALL existing
    // refresh tokens for this user. One atomic operation.
    await User.updateOne(
      { _id: payload.sub },
      { $inc: { tokenVersion: 1 } }
    );

  } catch (error) {
    // Token expired, invalid, or DB error — doesn't matter.
    // Cookies are already cleared in the response above.
    // Only log unexpected DB failures (not JWT errors).
    if (error?.name !== 'JsonWebTokenError' && error?.name !== 'TokenExpiredError') {
      console.error('[logout] Error:', error.message);
    }
  }

  return response;
}