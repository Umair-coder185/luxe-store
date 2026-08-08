// hooks/auth/useAuth.js

'use client';

import { useContext } from 'react';
import { AuthContext } from '@/providers/SessionProvider';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a SessionProvider');
  }

  return {
    ...context,
    isAuthenticated: !!context.user,
    isAdmin: context.user?.role === 'admin',
  };
}