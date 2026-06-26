"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  size = 16,
  onChange,
  className,
}: {
  value: number;
  size?: number;
  onChange?: (v: number) => void;
  className?: string;
}) {
  const interactive = !!onChange;
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)} role={interactive ? "radiogroup" : undefined} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(value);
        const star = (
          <Star
            size={size}
            className={cn(
              "transition-colors",
              filled ? "fill-sage-400 text-sage-400" : "fill-transparent text-ash"
            )}
          />
        );
        return interactive ? (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className="rounded p-0.5 transition-transform hover:scale-110"
            aria-label={`${i} star${i > 1 ? "s" : ""}`}
            aria-checked={i === Math.round(value)}
            role="radio"
          >
            {star}
          </button>
        ) : (
          <span key={i}>{star}</span>
        );
      })}
    </div>
  );
}
