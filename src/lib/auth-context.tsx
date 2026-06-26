"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { auth } from "./firebase";
import { FIREBASE_ENABLED, SITE } from "./site-config";

interface AuthUser {
  email: string;
  uid: string;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  demoMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);
const DEMO_KEY = "tutor_demo_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (FIREBASE_ENABLED && auth) {
      const { onAuthStateChanged } = require("firebase/auth");
      const unsub = onAuthStateChanged(auth, (u: any) => {
        setUser(u ? { email: u.email ?? "", uid: u.uid } : null);
        setLoading(false);
      });
      return () => unsub();
    }
    // Demo mode — restore session from localStorage
    try {
      const raw = localStorage.getItem(DEMO_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    if (FIREBASE_ENABLED && auth) {
      const { signInWithEmailAndPassword } = require("firebase/auth");
      await signInWithEmailAndPassword(auth, email, password);
      return;
    }
    // Demo gate: accept the owner email with any non-empty password.
    if (email.trim().toLowerCase() !== SITE.ownerEmail.toLowerCase()) {
      throw new Error(`Demo mode: sign in with ${SITE.ownerEmail}`);
    }
    if (!password) throw new Error("Enter any password to continue in demo mode.");
    const demoUser = { email: email.trim(), uid: "demo-owner" };
    localStorage.setItem(DEMO_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const signOut = async () => {
    if (FIREBASE_ENABLED && auth) {
      const { signOut: fbSignOut } = require("firebase/auth");
      await fbSignOut(auth);
      return;
    }
    localStorage.removeItem(DEMO_KEY);
    setUser(null);
  };

  const value = useMemo<AuthCtx>(
    () => ({ user, loading, demoMode: !FIREBASE_ENABLED, signIn, signOut }),
    [user, loading]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
