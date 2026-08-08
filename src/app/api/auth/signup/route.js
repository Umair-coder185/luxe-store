// app/api/auth/signup/route.js
// ─────────────────────────────────────────────────────────────
// POST /api/auth/signup
//
// Creates a new user account and logs them in immediately.
//
// Flow:
//   Validate input → Check email unique → Create user
//   → Generate tokens → Set HTTP-only cookies → Return user
//
// Security:
//   - Password is auto-hashed by User model pre-save hook
//   - Duplicate email returns 409, not 500 (checked BOTH
//     before create, and via the DB unique-index error in
//     case of a race condition between two concurrent signups)
//   - User enumeration on signup is acceptable (public endpoint,
//     the info "email exists" is not sensitive here)
// ─────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import User from '@/models/User.js';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt.js';
import { getAuthCookieHeaders } from '@/lib/auth/session.js';
import { validateSignup } from '@/lib/validation/auth.js';
import dbConnect from '@/lib/db/index.js';

export async function POST(request) {
  try {
    // 1. Parse body
    const body = await request.json();

    // 2. Validate input
    const { valid, errors } = validateSignup(body);
    if (!valid) {
      return NextResponse.json(
        { message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // 3. Connect to DB (cached — no reconnection on every request)
    await dbConnect();

    // 4. Check email uniqueness
    const existingUser = await User.findOne({ email: body.email.trim().toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // 5. Create user — password auto-hashed by pre-save hook
    const user = await User.create({
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim().toLowerCase(),
      password: body.password,
    });

    // 6. Generate tokens (need fresh document to get _id and defaults)
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // 7. Build response with cookies
    const response = NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    // 8. Attach HTTP-only cookies
    const cookieHeaders = getAuthCookieHeaders({ accessToken, refreshToken });
    cookieHeaders.forEach((header) => {
      response.headers.append('Set-Cookie', header);
    });

    return response;
  } catch (error) {
    // Race-condition guard: if two signup requests for the SAME email
    // land at nearly the same time, both can pass the findOne() check
    // above before either finishes creating the user. The database's
    // unique index on `email` then rejects the second create() with a
    // MongoDB duplicate-key error (code 11000). Without this check,
    // that second request would incorrectly fall through to the
    // generic 500 handler below instead of the correct 409 response.
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Catch unexpected errors (DB connection, etc.)
    // Don't leak error details to the client
    console.error('[signup] Error:', error.message);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}