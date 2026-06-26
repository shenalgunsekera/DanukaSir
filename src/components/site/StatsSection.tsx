import { Reveal } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";
import type { StatItem } from "@/lib/types";

export function StatsSection({ stats }: { stats: StatItem[] }) {
  return (
    <section id="stats" className="relative py-16">
      <div className="container-px">
        <div className="card grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-line/40 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.id}
              delay={i * 0.08}
              className="bg-surface/60 p-8 text-center backdrop-blur-sm"
            >
              <p className="font-display text-4xl font-bold text-sage-grad sm:text-5xl">
                <StatCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-mist">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
