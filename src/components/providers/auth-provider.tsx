'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { getCurrentAuthUser, subscribeToAuth } from '@/lib/auth';
import { isFirebaseConfigured } from '@/lib/firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

function getDemoUser(): User | null {
  if (typeof window === 'undefined' || isFirebaseConfigured()) return null;
  const stored = window.localStorage.getItem('demo-admin');
  return stored
    ? ({
        uid: 'demo',
        email: 'info@sign-d.net',
      } as User)
    : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getDemoUser() ?? getCurrentAuthUser());
  const [loading, setLoading] = useState(() => (isFirebaseConfigured() ? true : false));

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      return;
    }
    const currentUser = getCurrentAuthUser();
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
    }
    const timeout = window.setTimeout(() => {
      setLoading(false);
    }, 4000);

    const unsubscribe = subscribeToAuth((nextUser) => {
      window.clearTimeout(timeout);
      setUser(nextUser);
      setLoading(false);
    });
    return () => {
      window.clearTimeout(timeout);
      unsubscribe?.();
    };
  }, []);

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
