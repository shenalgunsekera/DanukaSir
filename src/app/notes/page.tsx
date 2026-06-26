import type { Metadata } from "next";
import { FileText, FileSpreadsheet, FileType, File as FileIcon, BookOpen, Download } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BuyNote } from "@/components/notes/BuyNote";
import { NotePreview } from "@/components/notes/NotePreview";
import { getProfile, getPublishedNotes } from "@/lib/data";
import { formatBytes } from "@/lib/utils";
import type { NoteFileKind } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Study Notes & Materials" };

const kindIcon: Record<NoteFileKind, typeof FileText> = {
  pdf: FileText,
  word: FileType,
  excel: FileSpreadsheet,
  other: FileIcon,
};

export default async function NotesPage() {
  const [profile, notes] = await Promise.all([getProfile(), getPublishedNotes()]);

  return (
    <main className="relative isolate">
      <AnimatedBackground theme={profile.theme} />
      <Navbar />

      <section className="pt-32 sm:pt-40">
        <div className="container-px">
          <SectionHeading
            eyebrow="Study Materials"
            title="Premium notes & resources"
            subtitle="Concise, exam-ready notes prepared by your tutor. Purchase securely by bank transfer and download once verified."
          />

          {notes.length === 0 ? (
            <div className="mx-auto mt-14 max-w-md card rounded-xl py-16 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-ash" />
              <p className="mt-3 font-medium text-cloud">No materials published yet</p>
              <p className="mt-1 text-sm text-ash">Check back soon — new notes are added regularly.</p>
            </div>
          ) : (
            <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((n, i) => {
                const Icon = kindIcon[n.fileKind] ?? FileIcon;
                return (
                  <Reveal key={n.id} delay={i * 0.06}>
                    <article className="card flex h-full flex-col rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-md bg-white/10 text-cloud"><Icon size={20} /></span>
                        <span className="chip uppercase">{n.fileKind}</span>
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-cloud">{n.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-mist">{n.description}</p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        <span className="chip">{n.subject}</span>
                        {n.grade && <span className="chip">{n.grade}</span>}
                      </div>

                      <div className="mt-4 flex items-center gap-3 border-t border-line pt-4 text-xs text-ash">
                        {n.pages ? <span className="inline-flex items-center gap-1"><FileText size={12} /> {n.pages} pages</span> : null}
                        <span className="inline-flex items-center gap-1"><Download size={12} /> {formatBytes(n.fileSize)}</span>
                        {n.purchases > 0 && <span className="ml-auto">{n.purchases} sold</span>}
                      </div>

                      <div className="mt-4 space-y-2">
                        <NotePreview note={n} />
                        <BuyNote note={n} bank={profile.bankDetails} />
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer profile={profile} />
    </main>
  );
}
