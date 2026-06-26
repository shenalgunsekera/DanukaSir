import { BookOpen, Compass, Target, Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { TutorProfile } from "@/lib/types";

export function AboutSection({ profile }: { profile: TutorProfile }) {
  const pillars = [
    { icon: Target, title: "Teaching Philosophy", body: profile.philosophy },
    { icon: Compass, title: "My Approach", body: profile.approach },
    { icon: BookOpen, title: "Experience", body: profile.experienceOverview },
  ];

  return (
    <section id="about" className="relative scroll-mt-24 py-20">
      <div className="container-px">
        <SectionHeading
          eyebrow="About"
          title="A mentor invested in real outcomes"
          subtitle="Beyond lessons — a structured, transparent partnership in your academic growth."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="card relative rounded-3xl p-8">
              <Quote className="absolute -top-3 left-8 h-8 w-8 rounded-full bg-sage-grad p-1.5 text-black" />
              <p className="text-lg leading-relaxed text-mist">{profile.bio}</p>

              <div className="mt-8 flex flex-wrap gap-2">
                {profile.subjects.map((s) => (
                  <span key={s} className="chip border-sage-500/20 text-sage-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div className="card flex gap-4 rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sage-500/10 text-sage-400">
                    <p.icon size={22} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-cloud">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mist">
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Teaching methods */}
        <Reveal className="mt-12">
          <div className="card rounded-3xl p-8">
            <p className="eyebrow mb-5">Teaching Methods</p>
            <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {profile.teachingMethods.map((m) => (
                <div key={m} className="flex items-center gap-3 text-mist">
                  <span className="h-1.5 w-1.5 rounded-full bg-sage-400" />
                  {m}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
