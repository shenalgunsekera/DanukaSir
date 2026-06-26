"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  baseline,
  label,
  className,
}: {
  value: number;
  baseline?: number;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-mist">{label}</span>
          <span className="font-semibold text-cloud">{value}%</span>
        </div>
      )}
      <div className="relative h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
        {typeof baseline === "number" && (
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/10"
            style={{ width: `${baseline}%` }}
            aria-hidden
          />
        )}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-sage-grad"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
