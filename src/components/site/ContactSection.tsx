import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { BookConsultation } from "./BookConsultation";
import type { TutorProfile } from "@/lib/types";

export function ContactSection({ profile }: { profile: TutorProfile }) {
  const items = [
    profile.email && { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}` },
    profile.location && { icon: MapPin, label: "Location", value: profile.location },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <section id="contact" className="relative scroll-mt-24 py-20">
      <div className="container-px">
        <Reveal>
          <div className="card relative overflow-hidden rounded-[2rem] p-10 text-center sm:p-16">
            <span className="eyebrow justify-center">Get started</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold text-cloud sm:text-4xl">
              Ready to transform your results?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-mist">
              Book a no-pressure consultation. We'll map out a personalised plan
              and you'll get live progress reports from day one.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <BookConsultation subjects={profile.subjects} availability={profile.availability} className="btn-gold">
                Book a consultation <ArrowRight size={16} />
              </BookConsultation>
              {profile.socials?.map((s) => (
                <a key={s.label} href={s.url} className="btn-ghost">
                  {s.label}
                </a>
              ))}
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {items.map((it) => (
                <div key={it.label} className="rounded-2xl border border-line bg-white/[0.02] p-5">
                  <it.icon className="mx-auto h-5 w-5 text-sage-400" />
                  <p className="mt-2 text-xs uppercase tracking-wider text-ash">{it.label}</p>
                  {it.href ? (
                    <a href={it.href} className="mt-1 block text-sm font-medium text-cloud hover:text-sage-200">
                      {it.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-cloud">{it.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
