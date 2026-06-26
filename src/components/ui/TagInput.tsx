"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
  suggestions,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const v = raw.trim();
    if (!v || value.includes(v)) return;
    onChange([...value, v]);
    setDraft("");
  };

  const remove = (v: string) => onChange(value.filter((x) => x !== v));

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-black/30 p-2.5 focus-within:border-sage-500/60">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1.5 rounded-lg bg-sage-500/10 px-2.5 py-1 text-sm text-sage-100">
            {tag}
            <button type="button" onClick={() => remove(tag)} className="text-sage-300/70 hover:text-sage-100" aria-label={`Remove ${tag}`}>
              <X size={13} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) {
              remove(value[value.length - 1]);
            }
          }}
          placeholder={value.length ? "" : placeholder}
          className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-sm text-cloud placeholder:text-ash focus:outline-none"
        />
      </div>
      {suggestions && suggestions.filter((s) => !value.includes(s)).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.filter((s) => !value.includes(s)).map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs text-ash transition-colors hover:border-sage-500/40 hover:text-sage-200">
              <Plus size={11} /> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
