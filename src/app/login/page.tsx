"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { GraduationCap, Lock, Mail, ArrowRight, Info } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { SITE } from "@/lib/site-config";
import { useBrand } from "@/lib/brand";
import { LanguageToggle } from "@/components/site/LanguageToggle";

export default function LoginPage() {
  const { signIn, user, loading, demoMode } = useAuth();
  const { name: brandName } = useBrand();
  const router = useRouter();
  const [email, setEmail] = useState(demoMode ? SITE.ownerEmail : "");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back, Danuka.");
      router.replace("/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center px-5 py-10">
      <LanguageToggle className="absolute right-5 top-5" />
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-sage-grad text-black">
            <GraduationCap size={20} />
          </span>
          <span className="font-display text-xl font-semibold text-cloud">{brandName}</span>
        </Link>

        <div className="card rounded-3xl p-8">
          <h1 className="font-display text-2xl font-semibold text-cloud">Tutor Portal</h1>
          <p className="mt-1.5 text-sm text-mist">Sign in to manage your platform.</p>

          {demoMode && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-sage-500/20 bg-sage-500/5 p-3 text-xs text-sage-100">
              <Info size={15} className="mt-0.5 shrink-0 text-sage-400" />
              <span>
                <strong>Demo mode.</strong> Firebase isn't configured yet — sign in
                with <strong>{SITE.ownerEmail}</strong> and any password to explore
                the dashboard.
              </span>
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label-field" htmlFor="email">Email</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ash" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="label-field" htmlFor="password">Password</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ash" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>
            <button type="submit" disabled={busy} className="btn-gold w-full disabled:opacity-60">
              {busy ? "Signing in…" : (<>Sign in <ArrowRight size={16} /></>)}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ash">
          <Link href="/" className="hover:text-cloud">← Back to website</Link>
        </p>
      </div>
    </main>
  );
}
