// app/api/auth/sign-in/route.js

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, signAccessToken } from '@/lib/auth';
import { COOKIES } from '@/lib/constants';

// Equalizes response time when no user is found — prevents user
// enumeration via timing. Generate once with:
//   node -e "require('bcryptjs').hash('dummy', 12).then(console.log)"
// Must use the SAME cost factor your hashPassword uses.
const DUMMY_HASH = process.env.AUTH_DUMMY_HASH;

if (!DUMMY_HASH) {
  throw new Error('AUTH_DUMMY_HASH is not set in environment variables');
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (
      !email || typeof email !== 'string' ||
      !password || typeof password !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        password: true,
      },
    });

    const isMatch = await verifyPassword(
      password,
      user?.password ?? DUMMY_HASH,
    );

    if (!user || !user.isActive || !isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const token = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(COOKIES.ACCESS_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    return response;
  } catch (error) {
    console.error('[sign-in]', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}