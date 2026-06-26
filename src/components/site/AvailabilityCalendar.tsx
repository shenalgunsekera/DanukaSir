"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Availability } from "@/lib/types";
import { cn } from "@/lib/utils";

const WD = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const iso = (d: Date) => d.toISOString().slice(0, 10);

export function AvailabilityCalendar({
  availability,
  date,
  time,
  onPick,
}: {
  availability: Availability;
  date: string;
  time: string;
  onPick: (date: string, time: string) => void;
}) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const blocked = new Set(availability.blockedDates ?? []);
  const weekdays = new Set(availability.weekdays ?? []);

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(view.getFullYear(), view.getMonth(), d));
    return out;
  }, [view]);

  const selectable = (d: Date) =>
    d >= today && weekdays.has(d.getDay()) && !blocked.has(iso(d));

  const move = (delta: number) =>
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));

  const canGoBack = view > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className="rounded-lg border border-line bg-black/20 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-cloud">
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </p>
        <div className="flex gap-1">
          <button type="button" disabled={!canGoBack} onClick={() => move(-1)} className="grid h-7 w-7 place-items-center rounded-md border border-line text-mist transition-colors hover:bg-white/5 disabled:opacity-30" aria-label="Previous month">
            <ChevronLeft size={15} />
          </button>
          <button type="button" onClick={() => move(1)} className="grid h-7 w-7 place-items-center rounded-md border border-line text-mist transition-colors hover:bg-white/5" aria-label="Next month">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WD.map((w) => (
          <div key={w} className="py-1 text-[11px] font-medium text-ash">{w}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const ok = selectable(d);
          const isSel = date === iso(d);
          return (
            <button
              key={i}
              type="button"
              disabled={!ok}
              onClick={() => onPick(iso(d), time)}
              className={cn(
                "aspect-square rounded-md text-sm transition-colors",
                isSel
                  ? "bg-cloud font-semibold text-base"
                  : ok
                  ? "text-cloud hover:bg-white/10"
                  : "text-ash/40 line-through"
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      {date && availability.slots.length > 0 && (
        <div className="mt-4">
          <p className="label-field">Available times</p>
          <div className="flex flex-wrap gap-2">
            {availability.slots.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onPick(date, s)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                  time === s
                    ? "border-white/40 bg-white/10 text-cloud"
                    : "border-line text-mist hover:bg-white/5"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {availability.note && (
        <p className="mt-3 text-xs text-ash">{availability.note}</p>
      )}
    </div>
  );
}
