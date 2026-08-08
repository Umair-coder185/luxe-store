// app/api/auth/login/route.js
// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
//
// Verifies credentials and issues tokens.
//
// Security decisions:
//   - "User not found" and "Wrong password" return the SAME
//     message. Attacker cannot determine if an email is registered.
//   - Password is verified BEFORE checking account status.
//     This prevents suspended-account enumeration — an attacker
//     must know the correct password before learning that an
//     account is suspended.
//   - Suspended accounts reveal status ONLY after password
//     verification succeeds (403 vs 401).
//
// Timing note:
//   "User not found" returns faster than "wrong password" (~250ms
//   bcrypt difference). This is a known timing side-channel.
//   Rate limiting (planned) makes this impractical to exploit.
// ─────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import User from '@/models/User.js';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt.js';
import { getAuthCookieHeaders } from '@/lib/auth/session.js';
import { validateLogin } from '@/lib/validation/auth.js';
import dbConnect from '@/lib/db/index.js';

export async function POST(request) {
  try {
    // 1. Parse & validate
    const body = await request.json();
    const { valid, errors } = validateLogin(body);
    if (!valid) {
      return NextResponse.json(
        { message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // 2. DB connect
    await dbConnect();

    // 3. Find user — static method includes password field
    const user = await User.findByEmailWithPassword(body.email);
    if (!user) {
      // Same message as wrong password — prevents enumeration
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 4. Compare passwords FIRST — before revealing account status.
    //    This ensures suspended status is only exposed to someone
    //    who knows the correct password (the legitimate user).
    const isMatch = await user.comparePassword(body.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 5. Now check if account is allowed to authenticate.
    //    Only reached if password is correct — safe to reveal status.
    const { allowed, reason } = user.canAuthenticate();
    if (!allowed) {
      return NextResponse.json(
        { message: reason },
        { status: 403 }
      );
    }

    // 6. Generate tokens
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // 7. Update login metadata (non-critical, best-effort)
    //    Wrapped in its own try/catch so that a DB hiccup here
    //    does not kill a successful login.
    try {
      await user.updateOne({
        $set: { lastLoginAt: new Date() },
        $inc: { loginCount: 1 },
      });
    } catch (metaError) {
      console.error('[login] Failed to update login metadata:', metaError.message);
    }

    // 8. Response with cookies
    const response = NextResponse.json(
      {
        message: 'Logged in successfully',
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
      },
      { status: 200 }
    );

    const cookieHeaders = getAuthCookieHeaders({ accessToken, refreshToken });
    cookieHeaders.forEach((header) => {
      response.headers.append('Set-Cookie', header);
    });

    return response;

  } catch (error) {
    console.error('[login] Error:', error.message);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}