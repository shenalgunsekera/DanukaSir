import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Milestone } from "@/lib/types";

export function Milestones({ milestones }: { milestones: Milestone[] }) {
  if (!milestones.length) return null;
  return (
    <section className="relative py-20">
      <div className="container-px">
        <SectionHeading
          eyebrow="Journey"
          title="Career milestones"
          subtitle="A decade of refining how students learn and succeed."
        />

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-sage-500/60 via-line to-transparent sm:left-1/2" />
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.08}>
                <div
                  className={`relative flex items-start gap-5 sm:w-1/2 ${
                    i % 2 === 0 ? "sm:ml-auto sm:flex-row-reverse sm:pl-8 sm:text-right" : "sm:pr-8"
                  }`}
                >
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sage-500/40 bg-base text-sm font-bold text-sage-300">
                    {m.year.slice(2)}
                  </span>
                  <div className="card flex-1 rounded-2xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-sage-400">
                      {m.year}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-cloud">
                      {m.title}
                    </h3>
                    <p className="mt-1 text-sm text-mist">{m.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
