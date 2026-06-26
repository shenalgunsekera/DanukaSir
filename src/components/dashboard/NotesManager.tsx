"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Plus, Upload, Trash2, Pencil, Eye, EyeOff, FileText, Check, X, ExternalLink, Clock,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { cn, formatDate, timeAgo, formatBytes, fileKind } from "@/lib/utils";
import { uploadFile, makePdfPreview } from "@/lib/upload";
import {
  saveNoteAction, deleteNoteAction, moderatePurchaseAction, deletePurchaseAction,
} from "@/lib/actions";
import type { Note, Purchase, PurchaseStatus } from "@/lib/types";

const lkr = (n: number) => `LKR ${n.toLocaleString()}`;

function blankNote(): Note {
  return {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: "", description: "", subject: "", grade: "", price: 500,
    fileUrl: "", fileName: "", fileKind: "pdf", fileSize: 0, pages: undefined,
    previewUrl: "", previewPages: 0,
    published: true, purchases: 0, createdAt: Date.now(),
  };
}

export function NotesManager({ initialNotes, initialPurchases }: { initialNotes: Note[]; initialPurchases: Purchase[] }) {
  const [tab, setTab] = useState<"materials" | "purchases">("materials");
  const [notes, setNotes] = useState(initialNotes);
  const [purchases, setPurchases] = useState(initialPurchases);
  const pending = purchases.filter((p) => p.status === "pending").length;

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <button onClick={() => setTab("materials")} className={cn("rounded-md px-4 py-2 text-sm font-medium", tab === "materials" ? "bg-white/15 text-cloud" : "border border-line text-mist hover:bg-white/5")}>Materials <span className="ml-1 text-xs text-ash">{notes.length}</span></button>
        <button onClick={() => setTab("purchases")} className={cn("rounded-md px-4 py-2 text-sm font-medium", tab === "purchases" ? "bg-white/15 text-cloud" : "border border-line text-mist hover:bg-white/5")}>Purchases <span className="ml-1 text-xs text-ash">{pending} new</span></button>
      </div>
      {tab === "materials" ? <Materials notes={notes} setNotes={setNotes} /> : <Purchases purchases={purchases} setPurchases={setPurchases} />}
    </div>
  );
}

function Materials({ notes, setNotes }: { notes: Note[]; setNotes: (f: (n: Note[]) => Note[]) => void }) {
  const [editing, setEditing] = useState<Note | null>(null);

  const remove = async (id: string) => {
    if (!confirm("Delete this material?")) return;
    setNotes((ns) => ns.filter((n) => n.id !== id));
    await deleteNoteAction(id);
    toast.success("Material deleted.");
  };
  const togglePublish = async (n: Note) => {
    const next = { ...n, published: !n.published };
    setNotes((ns) => ns.map((x) => (x.id === n.id ? next : x)));
    await saveNoteAction(next);
    toast.success(next.published ? "Published." : "Unpublished.");
  };

  return (
    <div>
      <button onClick={() => setEditing(blankNote())} className="btn-gold mb-5 !py-2.5"><Plus size={16} /> Add material</button>

      {notes.length === 0 ? (
        <div className="card rounded-xl py-14 text-center text-sm text-ash">No materials yet.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {notes.map((n) => (
            <div key={n.id} className="card rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white/10 text-cloud"><FileText size={18} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-cloud">{n.title || "Untitled"}</p>
                  <p className="text-xs text-ash">{n.subject || "—"} · {lkr(n.price)} · {n.purchases} sold</p>
                </div>
                <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium", n.published ? "bg-success/15 text-success" : "bg-white/10 text-mist")}>{n.published ? "Live" : "Hidden"}</span>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-xs">
                <button onClick={() => setEditing(n)} className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-mist hover:bg-white/5"><Pencil size={13} /> Edit</button>
                <button onClick={() => togglePublish(n)} className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-mist hover:bg-white/5">{n.published ? <EyeOff size={13} /> : <Eye size={13} />} {n.published ? "Hide" : "Publish"}</button>
                <button onClick={() => remove(n.id)} className="ml-auto inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-danger hover:bg-danger/10"><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <NoteEditor
          note={editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            setNotes((ns) => (ns.some((x) => x.id === saved.id) ? ns.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...ns]));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function NoteEditor({ note, onClose, onSaved }: { note: Note; onClose: () => void; onSaved: (n: Note) => void }) {
  const [n, setN] = useState<Note>(note);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<Note>) => setN((x) => ({ ...x, ...patch }));

  const onFile = async (file?: File) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) { toast.error("File must be under 15MB."); return; }
    setUploading(true);
    try {
      const kind = fileKind(file.name);
      const res = await uploadFile(file, "notes");
      const patch: Partial<Note> = { fileUrl: res.url, fileName: res.name, fileSize: res.size, fileKind: kind, previewUrl: "", previewPages: 0 };
      if (kind === "pdf") {
        try {
          const pv = await makePdfPreview(file, 2);
          patch.previewUrl = pv.previewUrl;
          patch.previewPages = pv.shown;
          patch.pages = pv.total;
        } catch { /* preview optional */ }
      }
      set(patch);
      toast.success(kind === "pdf" ? "Uploaded — 2-page preview generated." : "File uploaded.");
    } catch { toast.error("Upload failed."); }
    finally { setUploading(false); }
  };

  const save = async () => {
    if (!n.title.trim()) { toast.error("Add a title."); return; }
    if (!n.fileUrl) { toast.error("Upload the file."); return; }
    setSaving(true);
    await saveNoteAction(n);
    setSaving(false);
    toast.success("Material saved.");
    onSaved(n);
  };

  return (
    <Modal open onClose={onClose} title={note.title ? "Edit material" : "Add material"}>
      <div className="space-y-4">
        <div>
          <span className="label-field">File (PDF, Word, Excel)</span>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-line px-4 py-4 text-sm text-mist hover:border-white/30 hover:text-cloud">
            <Upload size={16} />
            {uploading ? "Uploading…" : n.fileName ? `${n.fileName} · ${formatBytes(n.fileSize)}` : "Upload file (max 15MB)"}
            <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
        </div>
        <div><label className="label-field">Title</label><input className="input-field" value={n.title} onChange={(e) => set({ title: e.target.value })} /></div>
        <div><label className="label-field">Description</label><textarea className="input-field min-h-[80px]" value={n.description} onChange={(e) => set({ description: e.target.value })} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label-field">Subject</label><input className="input-field" value={n.subject} onChange={(e) => set({ subject: e.target.value })} /></div>
          <div><label className="label-field">Grade / Level</label><input className="input-field" value={n.grade} onChange={(e) => set({ grade: e.target.value })} /></div>
          <div><label className="label-field">Price (LKR)</label><input type="number" className="input-field" value={n.price} onChange={(e) => set({ price: +e.target.value })} /></div>
          <div><label className="label-field">Pages (optional)</label><input type="number" className="input-field" value={n.pages ?? ""} onChange={(e) => set({ pages: e.target.value ? +e.target.value : undefined })} /></div>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-mist">
          <input type="checkbox" checked={n.published} onChange={(e) => set({ published: e.target.checked })} className="h-4 w-4 accent-white" /> Publish to the public notes page
        </label>
        <button onClick={save} disabled={saving || uploading} className="btn-gold w-full disabled:opacity-60">{saving ? "Saving…" : "Save material"}</button>
      </div>
    </Modal>
  );
}

function Purchases({ purchases, setPurchases }: { purchases: Purchase[]; setPurchases: (f: (p: Purchase[]) => Purchase[]) => void }) {
  const [busy, setBusy] = useState<string | null>(null);

  const setStatus = async (id: string, status: PurchaseStatus) => {
    setBusy(id);
    setPurchases((ps) => ps.map((p) => (p.id === id ? { ...p, status } : p)));
    await moderatePurchaseAction(id, status);
    setBusy(null);
    toast.success(`Marked ${status}.`);
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this purchase record?")) return;
    setBusy(id);
    setPurchases((ps) => ps.filter((p) => p.id !== id));
    await deletePurchaseAction(id);
    setBusy(null);
  };

  if (!purchases.length) return <div className="card rounded-xl py-14 text-center text-sm text-ash">No purchases yet.</div>;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {purchases.map((p) => (
        <div key={p.id} className="card rounded-xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-cloud">{p.studentName}</p>
              <p className="text-xs text-ash">{p.email}{p.phone ? ` · ${p.phone}` : ""}</p>
            </div>
            <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium capitalize", p.status === "approved" ? "bg-success/15 text-success" : p.status === "rejected" ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning")}>{p.status}</span>
          </div>
          <div className="mt-3 space-y-1 text-sm text-mist">
            <p className="inline-flex items-center gap-2"><FileText size={14} className="text-ash" /> {p.noteTitle}</p>
            <p className="font-semibold text-cloud">{lkr(p.amount)}</p>
            <p className="inline-flex items-center gap-2 text-xs text-ash"><Clock size={12} /> {timeAgo(p.createdAt)} · {formatDate(p.createdAt)}</p>
          </div>
          <a href={p.slipUrl || "#"} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs text-mist hover:bg-white/5"><ExternalLink size={13} /> View payment slip</a>
          <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
            {p.status !== "approved" && <button disabled={busy === p.id} onClick={() => setStatus(p.id, "approved")} className="inline-flex items-center gap-1.5 rounded-md bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/20"><Check size={14} /> Approve</button>}
            {p.status !== "rejected" && <button disabled={busy === p.id} onClick={() => setStatus(p.id, "rejected")} className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-3 py-1.5 text-xs font-medium text-mist hover:bg-white/10"><X size={14} /> Reject</button>}
            <button disabled={busy === p.id} onClick={() => remove(p.id)} className="ml-auto inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/10"><Trash2 size={14} /> Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
