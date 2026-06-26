"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/StarRating";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { ReviewForm } from "./ReviewForm";
import { average, formatDate } from "@/lib/utils";
import type { Review } from "@/lib/types";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const featured = useMemo(() => {
    const f = reviews.filter((r) => r.featured);
    return (f.length ? f : reviews).slice(0, 8);
  }, [reviews]);

  const avg = average(reviews.map((r) => r.rating));
  const count = reviews.length;

  const go = (dir: number) => {
    if (!featured.length) return;
    setIndex((i) => (i + dir + featured.length) % featured.length);
  };

  const current = featured[index];

  return (
    <section id="reviews" className="relative scroll-mt-24 py-20">
      <div className="container-px">
        <SectionHeading
          eyebrow="What students & parents say"
          title="Trusted by families"
          subtitle="Real feedback from the people who matter most — every review verified and approved."
        />

        {/* Rating summary */}
        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-6 rounded-2xl">
          <div className="text-center">
            <p className="font-display text-5xl font-bold text-sage-grad">
              {(avg || 5).toFixed(1)}
            </p>
            <StarRating value={avg || 5} size={16} className="mt-1 justify-center" />
          </div>
          <div className="h-12 w-px bg-line" />
          <div className="text-left text-sm text-mist">
            <p className="font-semibold text-cloud">{count} verified reviews</p>
            <p>from students & parents</p>
          </div>
        </div>

        {/* Carousel */}
        {current && (
          <div className="relative mx-auto mt-12 max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="card rounded-3xl p-8 sm:p-10"
              >
                <Quote className="h-9 w-9 text-sage-500/40" />
                <p className="mt-4 font-display text-xl leading-relaxed text-cloud sm:text-2xl">
                  “{current.body}”
                </p>
                <div className="mt-7 flex items-center gap-4">
                  <Avatar name={current.reviewerName} ring />
                  <div className="flex-1">
                    <p className="font-semibold text-cloud">{current.reviewerName}</p>
                    <p className="text-sm capitalize text-ash">
                      {current.reviewerRole} · {formatDate(current.createdAt)}
                    </p>
                  </div>
                  <StarRating value={current.rating} />
                </div>
              </motion.div>
            </AnimatePresence>

            {featured.length > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button onClick={() => go(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-line text-mist transition-colors hover:bg-white/5 hover:text-cloud" aria-label="Previous review">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-1.5">
                  {featured.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      aria-label={`Go to review ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-sage-400" : "w-1.5 bg-line"}`}
                    />
                  ))}
                </div>
                <button onClick={() => go(1)} className="grid h-10 w-10 place-items-center rounded-full border border-line text-mist transition-colors hover:bg-white/5 hover:text-cloud" aria-label="Next review">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 text-center">
          <button onClick={() => setOpen(true)} className="btn-ghost">
            <Plus size={16} /> Leave a review
          </button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Share your experience">
        <ReviewForm onDone={() => setOpen(false)} />
      </Modal>
    </section>
  );
}
