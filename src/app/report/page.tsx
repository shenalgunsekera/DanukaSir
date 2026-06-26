"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Link2, ArrowRight, ShieldCheck } from "lucide-react";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import { useBrand } from "@/lib/brand";

export default function ReportLanding() {
  const router = useRouter();
  const { name } = useBrand();
  const [value, setValue] = useState("");

  const open = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    // Accept a full link or a bare token
    const token = v.includes("/report/") ? v.split("/report/")[1].split(/[?#/]/)[0] : v;
    if (token) router.push(`/report/${token}`);
  };

  return (
    <main className="relative grid min-h-screen place-items-center px-5 py-10">
      <LanguageToggle className="absolute right-5 top-5" />
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-sage-grad text-black"><GraduationCap size={20} /></span>
          <span className="font-display text-xl font-semibold text-cloud">{name}</span>
        </Link>
        <div className="card rounded-3xl p-8">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-sage-500/10 text-sage-400"><Link2 size={24} /></div>
          <h1 className="text-center font-display text-2xl font-semibold text-cloud">Open a progress report</h1>
          <p className="mt-1.5 text-center text-sm text-mist">Paste the private report link your tutor shared with you.</p>
          <form onSubmit={open} className="mt-6 space-y-4">
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Paste report link or token" className="input-field" autoFocus />
            <button type="submit" className="btn-gold w-full">Continue <ArrowRight size={16} /></button>
          </form>
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-ash">
            <ShieldCheck size={13} className="text-sage-400" /> You'll be asked for your access code next
          </p>
        </div>
      </div>
    </main>
  );
}
