// app/api/auth/refresh/route.js
// ─────────────────────────────────────────────────────────────
// POST /api/auth/refresh
//
// Exchanges a valid refresh token for new access + refresh tokens.
//
// Token rotation:
//   Every refresh increments tokenVersion in DB, invalidating
//   the just-used refresh token. Each token is single-use.
//
//   If a stolen token is used BEFORE the legitimate user,
//   the attacker obtains a fresh session. The legitimate user
//   is forced to re-login. Rotation limits but does NOT
//   eliminate damage — full reuse detection (invalidating
//   all sessions on stale-token reuse) is a future enhancement.
//
// Race condition handling:
//   Optimistic locking (CAS on tokenVersion). If two refresh
//   requests arrive simultaneously, only one succeeds.
//   Client-side single-flight (in useAuth hook) prevents
//   legitimate multi-tab races.
//
// Order matters:
//   1. Verify JWT            (no DB)
//   2. Fetch user + check tv (1 DB read)
//   3. Increment tv          (1 DB write, with optimistic lock)
//   4. Generate tokens       (CPU only — uses incremented tv)
//   5. Set cookies           (response headers)
// ─────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import User from '@/models/User.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  isTokenExpired,
} from '@/lib/auth/jwt.js';
import { getCookie, getAuthCookieHeaders, getClearCookieHeaders } from '@/lib/auth/session.js';
import { COOKIES } from '@/constants/cookies.js';
import dbConnect from '@/lib/db/index.js';

// ── Error helpers ────────────────────────────────────────────

function unauthorized(message) {
  return NextResponse.json({ message }, { status: 401 });
}

function forbidden(message) {
  return NextResponse.json({ message }, { status: 403 });
}

// ── Route Handler ────────────────────────────────────────────

export async function POST(request) {
  try {
    // 1. Extract refresh token from cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const token = getCookie(cookieHeader, COOKIES.REFRESH_TOKEN);

    if (!token) {
      return unauthorized('Authentication required');
    }

    // 2. Verify refresh token (signature + expiry)
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      return unauthorized(
        isTokenExpired(err) ? 'Session expired' : 'Invalid session'
      );
    }

    // 3. DB connect + fetch user
    await dbConnect();
    const user = await User.findById(payload.sub).select(
      'firstName lastName email role isActive isVerified avatar tokenVersion'
    );

    // 4. Verify: user exists, tv matches, account is active
    if (!user || payload.tv !== user.tokenVersion) {
      return unauthorized('Session invalidated');
    }

    if (!user.isActive) {
      return forbidden('Account has been suspended');
    }

    // 5. Rotate — increment tv FIRST, then generate tokens.
    //    Optimistic lock prevents concurrent refreshes from
    //    both succeeding (only one request wins the CAS).
    const result = await User.updateOne(
      { _id: user._id, tokenVersion: user.tokenVersion },
      { $inc: { tokenVersion: 1 } }
    );

    if (result.modifiedCount === 0) {
      // CAS failed — another request rotated first.
      // Clear cookies so the client gets a clean state
      // and can redirect to login without retry loops.
      const failResponse = unauthorized('Session invalidated');
      getClearCookieHeaders().forEach((header) => {
        failResponse.headers.append('Set-Cookie', header);
      });
      return failResponse;
    }

    // Update in-memory user so new tokens carry the new tv
    user.tokenVersion += 1;

    // 6. Generate new tokens (with incremented tv)
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // 7. Response with new cookies + fresh user data
    const response = NextResponse.json({
      message: 'Session refreshed',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });

    const cookieHeaders = getAuthCookieHeaders({ accessToken, refreshToken });
    cookieHeaders.forEach((header) => {
      response.headers.append('Set-Cookie', header);
    });

    return response;

  } catch (error) {
    console.error('[refresh] Error:', error.message);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}