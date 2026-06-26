import { Award, GraduationCap, Medal, Trophy, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { TutorProfile } from "@/lib/types";

const iconMap: Record<string, typeof Award> = {
  Trophy,
  Medal,
  Award,
  BadgeCheck,
};

export function Credentials({ profile }: { profile: TutorProfile }) {
  return (
    <section className="relative py-20">
      <div className="container-px">
        <SectionHeading
          eyebrow="Credentials"
          title="Qualified, certified, recognised"
          subtitle="A foundation of formal training and proven results."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Qualifications & certifications */}
          <Reveal>
            <div className="card h-full rounded-3xl p-7">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-cloud">
                <GraduationCap size={20} className="text-sage-400" />
                Qualifications & Certifications
              </h3>
              <div className="mt-6 space-y-5">
                {[...profile.qualifications, ...profile.certifications].map((q) => (
                  <div key={q.id} className="flex items-start gap-4">
                    <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sage-500/10 text-xs font-bold text-sage-300">
                      {q.year}
                    </span>
                    <div>
                      <p className="font-medium text-cloud">{q.title}</p>
                      <p className="text-sm text-ash">{q.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Achievements */}
          <Reveal delay={0.1}>
            <div className="card h-full rounded-3xl p-7">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-cloud">
                <Trophy size={20} className="text-sage-400" />
                Awards & Achievements
              </h3>
              <div className="mt-6 space-y-4">
                {profile.achievements.map((a) => {
                  const Icon = iconMap[a.icon ?? "Award"] ?? Award;
                  return (
                    <div
                      key={a.id}
                      className="flex items-start gap-4 rounded-2xl border border-line bg-white/[0.02] p-4"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sage-grad text-black">
                        <Icon size={20} />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-cloud">{a.title}</p>
                          <span className="text-xs text-sage-400">{a.year}</span>
                        </div>
                        <p className="mt-0.5 text-sm text-mist">{a.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
