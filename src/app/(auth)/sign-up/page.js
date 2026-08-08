// app/(auth)/sign-up/page.js

'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';

function getSafeRedirect(path) {
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) {
    return '/';
  }
  return path;
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get('redirectTo') || '/');
  const { refetchSession } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const { error: message } = await res.json();
        setError(message || 'Something went wrong. Please try again.');
        return;
      }

      await refetchSession();
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      {/* ── Card ── */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white px-8 pb-8 pt-8 shadow-sm shadow-neutral-200/50 sm:px-10 sm:pt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            No credit card required to get started
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700 ring-1 ring-inset ring-red-200/60">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-700"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-sm text-neutral-900 shadow-sm transition-shadow placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-sm text-neutral-900 shadow-sm transition-shadow placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-sm text-neutral-900 shadow-sm transition-shadow placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
              placeholder="8+ characters"
            />
            <p className="mt-1.5 text-xs text-neutral-400">
              Must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-neutral-700"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-sm text-neutral-900 shadow-sm transition-shadow placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
            />
          </div>

          {/* Terms */}
          <p className="text-xs leading-relaxed text-neutral-400">
            By creating an account, you agree to our{' '}
            <Link
              href="/terms"
              className="font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
            >
              Privacy Policy
            </Link>.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-neutral-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link
          href="/sign-in"
          className="font-semibold text-neutral-900 underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}