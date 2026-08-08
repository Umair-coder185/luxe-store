// providers/SessionProvider.js

'use client';

import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const { user } = await res.json();
        setUser(user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    window.addEventListener('focus', fetchSession);
    return () => window.removeEventListener('focus', fetchSession);
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
    <AuthContext.Provider value={{ user, loading, signOut, refetchSession: fetchSession }}>
      {children}
    </AuthContext.Provider>
  );
}