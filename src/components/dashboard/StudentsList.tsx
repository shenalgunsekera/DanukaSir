"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Eye, TrendingUp, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { average, cn, timeAgo } from "@/lib/utils";
import type { Student } from "@/lib/types";

export function StudentsList({ students }: { students: Student[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");
  const [subject, setSubject] = useState("all");

  const subjects = useMemo(
    () => Array.from(new Set(students.flatMap((s) => s.subjects))).sort(),
    [students]
  );

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (filter !== "all" && s.status !== filter) return false;
      if (subject !== "all" && !s.subjects.includes(subject)) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.grade.toLowerCase().includes(q) ||
          (s.parentName ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [students, query, filter, subject]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ash" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, grade, parent…"
            className="input-field pl-10"
          />
        </div>
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field sm:w-48">
          <option value="all">All subjects</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex rounded-xl border border-line p-1">
          {(["all", "active", "archived"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                filter === f ? "bg-sage-500/15 text-sage-100" : "text-mist hover:text-cloud"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card rounded-2xl py-16 text-center text-sm text-ash">
          No students match your filters.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => {
            const avgLevel = average(s.performance.map((p) => p.level));
            const improvement = average(s.performance.map((p) => p.level - p.baseline));
            return (
              <Link
                key={s.id}
                href={`/dashboard/students/${s.id}`}
                className="card group rounded-2xl p-5 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} src={s.image} size={48} ring />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-semibold text-cloud">{s.name}</p>
                    <p className="text-xs text-ash">{s.grade}</p>
                  </div>
                  <ChevronRight size={18} className="text-ash transition-transform group-hover:translate-x-1" />
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.subjects.slice(0, 3).map((sub) => (
                    <span key={sub} className="chip text-[11px]">{sub}</span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
                  <div>
                    <p className="font-display text-lg font-bold text-cloud">{avgLevel}%</p>
                    <p className="text-[10px] uppercase tracking-wide text-ash">Level</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-success">+{improvement}</p>
                    <p className="text-[10px] uppercase tracking-wide text-ash">Growth</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-sage-300">{s.access.viewCount}</p>
                    <p className="text-[10px] uppercase tracking-wide text-ash">Views</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-ash">
                  <span className="inline-flex items-center gap-1">
                    <span className={cn("h-1.5 w-1.5 rounded-full", s.access.enabled ? "bg-success" : "bg-danger")} />
                    Parent access {s.access.enabled ? "on" : "off"}
                  </span>
                  <span className="inline-flex items-center gap-1"><Eye size={11} /> {timeAgo(s.access.lastViewedAt)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
