// lib/auth/guards.js
// ─────────────────────────────────────────────────────────────
// Route protection guards — for BOTH Route Handlers and
// Server Components.
//
// Route Handlers (app/api/**/route.js) receive a `request` object
// and must return a Response, so their error is a ready-to-return
// NextResponse:
//
//   const { user, error } = await requireAuth(request);
//   if (error) return error;
//
//   const { user, error } = await requireAdmin(request);
//   if (error) return error;
//
// Server Components (app/(admin)/admin/layout.js, etc.) have no
// `request` object — they read cookies via next/headers — and
// they cannot return a Response. They get the raw error/status
// back and decide what to do themselves (redirect(), notFound()):
//
//   const { user, error, status } = await requireAdminSC();
//   if (error) redirect('/sign-in');
// ─────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from './jwt';
import { getCookie } from './session';
import { COOKIES } from '../../constants/cookies';
import User from '../../models/User';
import { ROLES } from '../../constants/roles';

// ── Core (shared by both contexts) ───────────────────────────
// Returns PLAIN DATA only — never a Response. Response wrapping
// happens one layer up, only in the Route Handler exports below.

async function authenticate(accessToken) {
  if (!accessToken) {
    return { user: null, error: 'Authentication required', status: 401 };
  }

  let payload;
  try {
    payload = verifyAccessToken(accessToken);
  } catch {
    return { user: null, error: 'Invalid or expired token', status: 401 };
  }

  const user = await User.findById(payload.sub).select('-password').lean();

  if (!user) {
    return { user: null, error: 'User not found', status: 401 };
  }

  if (user.tokenVersion !== payload.tv) {
    return { user: null, error: 'Session revoked', status: 401 };
  }

  if (!user.isActive) {
    return { user: null, error: 'Account suspended', status: 403 };
  }

  return { user, error: null, status: null };
}

function authorize(user, requiredRole) {
  if (user.role !== requiredRole) {
    return { error: 'Insufficient permissions', status: 403 };
  }
  return { error: null, status: null };
}

// ── Route Handlers (receive `request`, must return NextResponse) ──

/**
 * @param {Request} request
 * @returns {Promise<{ user: object, error: null } | { user: null, error: NextResponse }>}
 */
export async function requireAuth(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = getCookie(cookieHeader, COOKIES.ACCESS_TOKEN);

  const result = await authenticate(token);

  if (result.error) {
    return {
      user: null,
      error: NextResponse.json({ message: result.error }, { status: result.status }),
    };
  }

  return { user: result.user, error: null };
}

/**
 * @param {Request} request
 * @returns {Promise<{ user: object, error: null } | { user: null, error: NextResponse }>}
 */
export async function requireAdmin(request) {
  const authResult = await requireAuth(request);
  if (authResult.error) return authResult;

  const auth = authorize(authResult.user, ROLES.ADMIN);
  if (auth.error) {
    return {
      user: null,
      error: NextResponse.json({ message: auth.error }, { status: auth.status }),
    };
  }

  return { user: authResult.user, error: null };
}

// ── Server Components (use `cookies()`, return plain data) ───

/**
 * @returns {Promise<{ user: object|null, error: string|null, status: number|null }>}
 */
export async function requireAuthSC() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIES.ACCESS_TOKEN)?.value ?? null;
  return authenticate(token);
}

/**
 * @returns {Promise<{ user: object|null, error: string|null, status: number|null }>}
 */
export async function requireAdminSC() {
  const { user, error, status } = await requireAuthSC();
  if (error) return { user: null, error, status };

  const auth = authorize(user, ROLES.ADMIN);
  if (auth.error) return { user: null, ...auth };

  return { user, error: null, status: null };
}