// providers/SessionProvider.js

'use client';

import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pure async fetcher: returns the user (or null), does not set state directly.
  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const { user } = await res.json();
        return user;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  // Initial load: uses the fetcher and safely sets state only if still mounted.
  useEffect(() => {
    let mounted = true;
    fetchSession().then((fetchedUser) => {
      if (mounted) {
        setUser(fetchedUser);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [fetchSession]);

  // Refetch for consumers (e.g. after login/signup)
  const refetchSession = useCallback(async () => {
    const fetchedUser = await fetchSession();
    setUser(fetchedUser);
  }, [fetchSession]);

  // Sync session across tabs when window gains focus
  useEffect(() => {
    const onFocus = () => {
      fetchSession().then((fetchedUser) => setUser(fetchedUser));
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchSession]);

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' });
    } catch {
      // Clear local state even if API call fails
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refetchSession }}>
      {children}
    </AuthContext.Provider>
  );
}