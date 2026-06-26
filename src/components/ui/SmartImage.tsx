"use client";

import { useState } from "react";
import { initials, cn } from "@/lib/utils";

/** Image that elegantly falls back to a sage-gradient monogram if the
 *  src is missing or fails to load (e.g. before the real photo is added). */
export function SmartImage({
  src,
  alt,
  name,
  className,
  imgClassName,
}: {
  src?: string;
  alt: string;
  name: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <div className={cn("relative overflow-hidden bg-elevated", className)}>
      {showFallback ? (
        <div className="grid h-full w-full place-items-center bg-[radial-gradient(120%_120%_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]">
          <span className="font-display text-5xl font-semibold text-mist">
            {initials(name)}
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      )}
    </div>
  );
}
