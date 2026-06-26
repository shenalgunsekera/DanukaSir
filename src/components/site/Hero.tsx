"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, CheckCircle2 } from "lucide-react";
import type { TutorProfile } from "@/lib/types";
import { SmartImage } from "@/components/ui/SmartImage";
import { BookConsultation } from "./BookConsultation";

export function Hero({ profile }: { profile: TutorProfile }) {
  const ease = [0.22, 1, 0.36, 1] as const;
  const highlight = profile.stats[2] ?? profile.stats[0];

  return (
    <section className="relative overflow-hidden pb-12 pt-24 sm:pt-28">
      <div className="container-px grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left: copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="chip"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cloud" />
            {profile.yearsExperience}+ years · {profile.subjects[0]} & beyond
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="mt-6 font-display text-4xl font-semibold leading-[1.04] tracking-tight text-cloud sm:text-5xl lg:text-[3.6rem]"
          >
            Learn with {profile.name}.
            <br />
            Achieve more than grades.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-mist"
          >
            {profile.headline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <BookConsultation subjects={profile.subjects} availability={profile.availability} className="btn-gold">
              Book a consultation <ArrowRight size={16} />
            </BookConsultation>
            <a href="#success" className="btn-ghost">
              See student results
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ash"
          >
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={15} className="fill-cloud text-cloud" />
                ))}
              </span>
              Loved by students &amp; parents
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={15} className="text-cloud" />
              Live progress reports
            </span>
          </motion.div>
        </div>

        {/* Right: portrait card — full photo, caption below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="mx-auto w-full max-w-[290px] lg:mx-0 lg:ml-auto"
        >
          <div className="card overflow-hidden rounded-xl">
            <SmartImage
              src={profile.avatar}
              alt={`${profile.name}, private tutor`}
              name={profile.name}
              className="aspect-[2/3] w-full"
            />
            <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4">
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold text-cloud">
                  {profile.name}
                </p>
                <p className="truncate text-sm text-mist">{profile.location}</p>
              </div>
              {highlight && (
                <div className="shrink-0 text-right">
                  <p className="font-display text-2xl font-semibold text-cloud">
                    {highlight.value}
                    {highlight.suffix}
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-ash">
                    {highlight.label}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
