import { ArrowRight, TrendingUp } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import type { SuccessStory } from "@/lib/types";

export function SuccessStories({ stories }: { stories: SuccessStory[] }) {
  if (!stories.length) return null;
  return (
    <section id="success" className="relative scroll-mt-24 py-20">
      <div className="container-px">
        <SectionHeading
          eyebrow="Student Success"
          title="Real journeys. Measurable growth."
          subtitle="A glimpse of the transformations achieved through consistent, personalised guidance."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08}>
              <article className="card group flex h-full flex-col overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1.5">
                <div className="relative">
                  <SmartImage
                    src={s.image}
                    alt={s.studentName}
                    name={s.studentName}
                    className="aspect-[16/10] w-full"
                  />
                  <span className="absolute left-4 top-4 chip border-none bg-black/60 text-sage-200 backdrop-blur">
                    {s.subject}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="font-display text-lg font-semibold text-cloud">
                    {s.studentName}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="chip bg-white/[0.03] text-ash">{s.fromGrade}</span>
                    <ArrowRight size={14} className="text-sage-400" />
                    <span className="chip border-sage-500/30 bg-sage-500/10 font-semibold text-sage-100">
                      {s.toGrade}
                    </span>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-mist">
                    “{s.comment}”
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-medium text-success">
                    <TrendingUp size={14} /> Verified improvement
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
