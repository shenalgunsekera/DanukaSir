"use client";

import { useState } from "react";
import { Eye, Lock } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import type { Note } from "@/lib/types";

export function NotePreview({ note }: { note: Note }) {
  const [open, setOpen] = useState(false);
  const hasPreview = !!note.previewUrl && note.fileKind === "pdf";

  if (!hasPreview) {
    return (
      <button disabled className="btn-ghost w-full !py-2.5 opacity-50" title="No preview available">
        <Eye size={15} /> No preview
      </button>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-ghost w-full !py-2.5">
        <Eye size={15} /> Preview
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={note.title} maxWidth="max-w-3xl">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-line bg-black/30">
            <iframe
              src={`${note.previewUrl}#toolbar=0&navpanes=0`}
              title={`${note.title} preview`}
              className="h-[64vh] w-full"
            />
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-line bg-white/[0.02] p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white/10 text-cloud">
              <Lock size={18} />
            </span>
            <div className="text-sm">
              <p className="font-medium text-cloud">
                Showing the first {note.previewPages} page{note.previewPages === 1 ? "" : "s"} only
              </p>
              <p className="text-mist">
                {note.pages ? `All ${note.pages} pages` : "The full document"} unlock after purchase
                {note.price ? ` · LKR ${note.price.toLocaleString()}` : ""}.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
