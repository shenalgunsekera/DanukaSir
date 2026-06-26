"use client";

import { Globe, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, toggle, busy } = useLanguage();

  return (
    <button
      onClick={toggle}
      data-no-translate
      aria-label={lang === "en" ? "Translate site to Sinhala" : "Switch site to English"}
      title={lang === "en" ? "සිංහලට පරිවර්තනය කරන්න" : "Switch to English"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-xs font-semibold text-cloud transition-colors hover:border-white/25 hover:bg-white/[0.05]",
        className
      )}
    >
      {busy ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
      <span className="tabular-nums">{lang === "en" ? "EN" : "සිං"}</span>
    </button>
  );
}
