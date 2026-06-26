import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { SITE } from "@/lib/site-config";
import type { TutorProfile } from "@/lib/types";

export function Footer({ profile }: { profile: TutorProfile }) {
  return (
    <footer className="relative mt-24 border-t border-line py-12">
      <div className="container-px">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-sm text-center md:text-left">
            <div className="flex items-center justify-center gap-2.5 md:justify-start">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-sage-grad text-black">
                <GraduationCap size={18} />
              </span>
              <span className="font-display text-lg font-semibold text-cloud">
                {profile.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ash">
              {SITE.tagline}. Personalised mentorship with transparent, live
              progress tracking for students and parents.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            <div className="space-y-2">
              <p className="mb-1 text-xs uppercase tracking-wider text-sage-400">Explore</p>
              <a href="#about" className="block text-mist hover:text-cloud">About</a>
              <a href="#success" className="block text-mist hover:text-cloud">Success Stories</a>
              <a href="#reviews" className="block text-mist hover:text-cloud">Reviews</a>
            </div>
            <div className="space-y-2">
              <p className="mb-1 text-xs uppercase tracking-wider text-sage-400">Access</p>
              <Link href="/report" className="block text-mist hover:text-cloud">Parent Report</Link>
              <a href="#contact" className="block text-mist hover:text-cloud">Contact</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-ash sm:flex-row">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p>Crafted as a premium tutoring experience.</p>
        </div>
      </div>
    </footer>
  );
}
