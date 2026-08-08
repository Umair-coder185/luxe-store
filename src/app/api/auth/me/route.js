// app/api/auth/me/route.js
// ─────────────────────────────────────────────────────────────
// GET /api/auth/me
//
// Returns the currently authenticated user.
// All security checks are handled by requireAuth():
//   token verification, user existence, tv match, isActive.
// ─────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/guards.js';

export async function GET(request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  return NextResponse.json({ user });
}