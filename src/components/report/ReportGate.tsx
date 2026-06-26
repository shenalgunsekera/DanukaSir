"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, GraduationCap, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { unlockReportAction } from "@/lib/report-actions";
import { ParentReport } from "./ParentReport";
import { useBrand } from "@/lib/brand";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import type { Student } from "@/lib/types";

export function ReportGate({ token, exists, enabled }: { token: string; exists: boolean; enabled: boolean }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const { name } = useBrand();

  if (student) return <ParentReport student={student} />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await unlockReportAction(token, code);
    setBusy(false);
    if (res.ok && res.student) setStudent(res.student);
    else setError(res.error ?? "Unable to open report.");
  };

  const blocked = !exists;

  return (
    <main className="relative grid min-h-screen place-items-center px-5 py-10">
      <LanguageToggle className="absolute right-5 top-5" />
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-sage-grad text-black"><GraduationCap size={20} /></span>
          <span className="font-display text-xl font-semibold text-cloud">{name}</span>
        </Link>

        <div className="card rounded-3xl p-8">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-sage-500/10 text-sage-400">
            <Lock size={24} />
          </div>
          <h1 className="text-center font-display text-2xl font-semibold text-cloud">Private Progress Report</h1>
          <p className="mt-1.5 text-center text-sm text-mist">
            {blocked
              ? "This report link is not valid."
              : "Enter the access code your tutor shared to view the live report."}
          </p>

          {blocked ? (
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              Please check the link, or contact the tutor for an updated one.
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="code" className="label-field">Access code</label>
                <input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="XXX-XXXX"
                  className="input-field text-center font-mono text-lg tracking-[0.3em]"
                  autoComplete="off"
                  autoFocus
                  required
                />
              </div>
              {error && (
                <p className="flex items-center gap-2 rounded-lg bg-danger/10 p-2.5 text-sm text-danger">
                  <AlertCircle size={15} /> {error}
                </p>
              )}
              <button type="submit" disabled={busy} className="btn-gold w-full disabled:opacity-60">
                {busy ? "Verifying…" : (<>View report <ArrowRight size={16} /></>)}
              </button>
            </form>
          )}

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-ash">
            <ShieldCheck size={13} className="text-sage-400" /> Secure access · no account needed
          </p>
        </div>
      </div>
    </main>
  );
}
