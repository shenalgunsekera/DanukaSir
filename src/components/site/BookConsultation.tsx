"use client";

import { useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { CalendarCheck, Send, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { submitBookingAction } from "@/lib/actions";
import type { Availability } from "@/lib/types";

const EMPTY = {
  studentName: "",
  email: "",
  phone: "",
  grade: "",
  subject: "",
  preferredDate: "",
  preferredTime: "",
  mode: "online" as "online" | "in-person",
  message: "",
};

export function BookConsultation({
  subjects = [],
  availability,
  className,
  children,
}: {
  subjects?: string[];
  availability?: Availability;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const close = () => {
    setOpen(false);
    // reset after the close animation
    setTimeout(() => {
      setDone(false);
      setForm({ ...EMPTY });
    }, 250);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await submitBookingAction({ ...form, subject: form.subject || subjects[0] || "" });
    setBusy(false);
    if (res.ok) {
      setDone(true);
      toast.success("Request sent — Danuka will be in touch.");
    } else {
      toast.error(res.error || "Something went wrong.");
    }
  };

  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      <Modal open={open} onClose={close} title="Book a consultation">
        {done ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-white/10 text-cloud">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="font-display text-xl font-semibold text-cloud">Request received</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-mist">
              Thanks, {form.studentName.split(" ")[0] || "there"}! Your consultation request has
              been sent. You'll get a reply at <span className="text-cloud">{form.email}</span> shortly.
            </p>
            <button onClick={close} className="btn-gold mt-6">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <p className="text-sm text-mist">
              Share a few details and your preferred time — Danuka will confirm your session.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field" htmlFor="bk-name">Student name</label>
                <input id="bk-name" required className="input-field" value={form.studentName} onChange={(e) => set("studentName", e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label className="label-field" htmlFor="bk-email">Email</label>
                <input id="bk-email" type="email" required className="input-field" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="label-field" htmlFor="bk-phone">Phone <span className="text-ash">(optional)</span></label>
                <input id="bk-phone" className="input-field" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+94 …" />
              </div>
              <div>
                <label className="label-field" htmlFor="bk-grade">Grade / Level <span className="text-ash">(optional)</span></label>
                <input id="bk-grade" className="input-field" value={form.grade} onChange={(e) => set("grade", e.target.value)} placeholder="e.g. Grade 12" />
              </div>
            </div>

            <div>
              <label className="label-field" htmlFor="bk-subject">Subject</label>
              {subjects.length ? (
                <select id="bk-subject" required className="input-field" value={form.subject} onChange={(e) => set("subject", e.target.value)}>
                  <option value="" disabled>Choose a subject</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <input id="bk-subject" required className="input-field" value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="Subject" />
              )}
            </div>

            {availability && (availability.weekdays?.length ?? 0) > 0 ? (
              <div>
                <span className="label-field">Pick a date &amp; time</span>
                <AvailabilityCalendar
                  availability={availability}
                  date={form.preferredDate}
                  time={form.preferredTime}
                  onPick={(d, t) => setForm((f) => ({ ...f, preferredDate: d, preferredTime: t }))}
                />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-field" htmlFor="bk-date">Preferred date</label>
                  <input id="bk-date" type="date" required min={minDate} className="input-field" value={form.preferredDate} onChange={(e) => set("preferredDate", e.target.value)} />
                </div>
                <div>
                  <label className="label-field" htmlFor="bk-time">Preferred time <span className="text-ash">(optional)</span></label>
                  <input id="bk-time" type="time" className="input-field" value={form.preferredTime} onChange={(e) => set("preferredTime", e.target.value)} />
                </div>
              </div>
            )}

            <div>
              <span className="label-field">Session mode</span>
              <div className="flex gap-2">
                {(["online", "in-person"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => set("mode", m)}
                    className={`flex-1 rounded-md border px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                      form.mode === m ? "border-white/40 bg-white/10 text-cloud" : "border-line text-mist hover:bg-white/5"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label-field" htmlFor="bk-msg">Message <span className="text-ash">(optional)</span></label>
              <textarea id="bk-msg" className="input-field min-h-[80px] resize-y" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Goals, exam, availability…" maxLength={800} />
            </div>

            <button type="submit" disabled={busy} className="btn-gold w-full disabled:opacity-60">
              {busy ? "Sending…" : (<><CalendarCheck size={16} /> Request consultation</>)}
            </button>
            <p className="text-center text-xs text-ash">No payment required · you'll receive a confirmation by email.</p>
          </form>
        )}
      </Modal>
    </>
  );
}
