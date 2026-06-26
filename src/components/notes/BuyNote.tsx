"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Upload, Copy, CheckCircle2, Clock, Download, ShieldCheck, Landmark, XCircle,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { uploadFile } from "@/lib/upload";
import { formatBytes } from "@/lib/utils";
import { submitPurchaseAction, getPurchaseStatusAction } from "@/lib/actions";
import type { BankDetails, Note } from "@/lib/types";

const lkr = (n: number) => `LKR ${n.toLocaleString()}`;
const keyFor = (id: string) => `note_purchase_${id}`;

export function BuyNote({ note, bank }: { note: Note; bank: BankDetails }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ studentName: "", email: "", phone: "" });
  const [slip, setSlip] = useState<{ url: string; name: string; size: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ status: string; fileUrl: string; fileName: string } | null>(null);

  const openModal = () => {
    try {
      const saved = localStorage.getItem(keyFor(note.id));
      if (saved) setPurchaseId(saved);
    } catch {}
    setOpen(true);
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied.`);
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Slip must be under 5MB."); return; }
    setUploading(true);
    try {
      const res = await uploadFile(file, "slips");
      setSlip(res);
    } catch {
      toast.error("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slip) { toast.error("Please attach your payment slip."); return; }
    setBusy(true);
    const res = await submitPurchaseAction({
      noteId: note.id,
      studentName: form.studentName,
      email: form.email,
      phone: form.phone,
      slipUrl: slip.url,
      slipName: slip.name,
    });
    setBusy(false);
    if (res.ok && res.id) {
      try { localStorage.setItem(keyFor(note.id), res.id); } catch {}
      setPurchaseId(res.id);
      setStatus({ status: "pending", fileUrl: "", fileName: "" });
      toast.success("Slip submitted — awaiting confirmation.");
    } else {
      toast.error(res.error || "Could not submit.");
    }
  };

  const checkStatus = async () => {
    if (!purchaseId) return;
    setBusy(true);
    const res = await getPurchaseStatusAction(purchaseId);
    setBusy(false);
    if (res.ok) setStatus({ status: res.status, fileUrl: res.fileUrl, fileName: res.fileName });
    else { toast.error("Could not find your purchase."); setPurchaseId(null); }
  };

  const showStatusView = !!purchaseId;

  return (
    <>
      <button onClick={openModal} className="btn-gold w-full !py-2.5">
        Buy · {lkr(note.price)}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={note.title} maxWidth="max-w-lg">
        {showStatusView ? (
          <div className="space-y-4">
            {(!status || status.status === "pending") && (
              <div className="rounded-lg border border-line bg-white/[0.02] p-5 text-center">
                <Clock className="mx-auto h-8 w-8 text-warning" />
                <p className="mt-3 font-medium text-cloud">Payment under review</p>
                <p className="mt-1 text-sm text-mist">Your slip was submitted. Once it's verified you can download here.</p>
                <button onClick={checkStatus} disabled={busy} className="btn-ghost mt-4 !py-2.5">{busy ? "Checking…" : "Check status"}</button>
              </div>
            )}
            {status?.status === "approved" && (
              <div className="rounded-lg border border-success/30 bg-success/5 p-5 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
                <p className="mt-3 font-medium text-cloud">Payment approved</p>
                <p className="mt-1 text-sm text-mist">Your material is ready to download.</p>
                <a href={status.fileUrl || "#"} download={status.fileName} target="_blank" rel="noreferrer" className="btn-gold mt-4 !py-2.5">
                  <Download size={16} /> Download {note.fileName}
                </a>
              </div>
            )}
            {status?.status === "rejected" && (
              <div className="rounded-lg border border-danger/30 bg-danger/5 p-5 text-center">
                <XCircle className="mx-auto h-8 w-8 text-danger" />
                <p className="mt-3 font-medium text-cloud">Payment not verified</p>
                <p className="mt-1 text-sm text-mist">Please contact the tutor or submit a new slip.</p>
              </div>
            )}
            <button onClick={() => { try { localStorage.removeItem(keyFor(note.id)); } catch {}; setPurchaseId(null); setStatus(null); }} className="w-full text-center text-xs text-ash hover:text-cloud">
              Make a new purchase instead
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div className="flex items-center justify-between rounded-lg border border-line bg-white/[0.02] p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-ash">Total</p>
                <p className="font-display text-2xl font-semibold text-cloud">{lkr(note.price)}</p>
              </div>
              <span className="chip">{note.subject}</span>
            </div>

            {/* Bank details */}
            <div className="rounded-lg border border-line p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-cloud"><Landmark size={15} /> Bank transfer details</p>
              <dl className="space-y-2 text-sm">
                {[
                  ["Bank", bank.bankName],
                  ["Account name", bank.accountName],
                  ["Account no.", bank.accountNumber],
                  ["Branch", bank.branch],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <dt className="text-ash">{label}</dt>
                    <dd className="flex items-center gap-2 text-cloud">
                      <span className="font-medium">{value}</span>
                      {value && <button type="button" onClick={() => copy(value, label)} className="text-ash hover:text-cloud" aria-label={`Copy ${label}`}><Copy size={13} /></button>}
                    </dd>
                  </div>
                ))}
              </dl>
              {bank.instructions && <p className="mt-3 border-t border-line pt-3 text-xs text-mist">{bank.instructions}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field" htmlFor="bn-name">Your name</label>
                <input id="bn-name" required className="input-field" value={form.studentName} onChange={(e) => setForm((f) => ({ ...f, studentName: e.target.value }))} />
              </div>
              <div>
                <label className="label-field" htmlFor="bn-email">Email</label>
                <input id="bn-email" type="email" required className="input-field" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="To send the file" />
              </div>
            </div>
            <div>
              <label className="label-field" htmlFor="bn-phone">Phone <span className="text-ash">(optional)</span></label>
              <input id="bn-phone" className="input-field" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>

            {/* Slip upload */}
            <div>
              <span className="label-field">Payment slip</span>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-line px-4 py-4 text-sm text-mist transition-colors hover:border-white/30 hover:text-cloud">
                <Upload size={16} />
                {uploading ? "Uploading…" : slip ? `${slip.name} · ${formatBytes(slip.size)}` : "Upload slip (image or PDF, max 5MB)"}
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
              {slip && <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 size={12} /> Slip attached</p>}
            </div>

            <button type="submit" disabled={busy || uploading} className="btn-gold w-full disabled:opacity-60">
              {busy ? "Submitting…" : "Submit payment slip"}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ash">
              <ShieldCheck size={13} /> Access is granted once the tutor verifies your slip.
            </p>
          </form>
        )}
      </Modal>
    </>
  );
}
