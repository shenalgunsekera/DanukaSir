"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Mail, Phone, Calendar, Clock, Trash2, Monitor, MapPin, GraduationCap,
} from "lucide-react";
import { formatDate, cn, timeAgo } from "@/lib/utils";
import { deleteBookingAction, updateBookingStatusAction } from "@/lib/actions";
import type { Booking, BookingStatus } from "@/lib/types";

const STATUSES: BookingStatus[] = ["new", "contacted", "scheduled", "declined"];
const statusStyle: Record<BookingStatus, string> = {
  new: "bg-white/15 text-cloud",
  contacted: "bg-info/15 text-info",
  scheduled: "bg-success/15 text-success",
  declined: "bg-danger/15 text-danger",
};

export function BookingsManager({ initial }: { initial: Booking[] }) {
  const [bookings, setBookings] = useState(initial);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [busy, setBusy] = useState<string | null>(null);

  const counts = {
    all: bookings.length,
    new: bookings.filter((b) => b.status === "new").length,
    contacted: bookings.filter((b) => b.status === "contacted").length,
    scheduled: bookings.filter((b) => b.status === "scheduled").length,
    declined: bookings.filter((b) => b.status === "declined").length,
  };
  const filtered = bookings.filter((b) => (filter === "all" ? true : b.status === filter));

  const setStatus = async (id: string, status: BookingStatus) => {
    setBusy(id);
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
    await updateBookingStatusAction(id, status);
    setBusy(null);
    toast.success(`Marked as ${status}.`);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this booking request?")) return;
    setBusy(id);
    setBookings((bs) => bs.filter((b) => b.id !== id));
    await deleteBookingAction(id);
    setBusy(null);
    toast.success("Booking deleted.");
  };

  if (!bookings.length) {
    return (
      <div className="card rounded-xl py-16 text-center">
        <Calendar className="mx-auto h-7 w-7 text-ash" />
        <p className="mt-3 font-medium text-cloud">No booking requests yet</p>
        <p className="mt-1 text-sm text-ash">Requests from your homepage's "Book a consultation" form appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-md px-3.5 py-2 text-sm font-medium capitalize transition-colors",
              filter === f ? "bg-white/15 text-cloud" : "border border-line text-mist hover:bg-white/5"
            )}
          >
            {f} <span className="ml-1.5 text-xs text-ash">{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((b) => (
          <div key={b.id} className="card rounded-xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold text-cloud">{b.studentName}</p>
                <p className="text-xs text-ash">Requested {timeAgo(b.createdAt)}</p>
              </div>
              <span className={cn("rounded-md px-2.5 py-1 text-[11px] font-medium capitalize", statusStyle[b.status])}>{b.status}</span>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-mist">
              <a href={`mailto:${b.email}`} className="inline-flex items-center gap-2 hover:text-cloud"><Mail size={14} className="text-ash" /> {b.email}</a>
              {b.phone && <a href={`tel:${b.phone}`} className="inline-flex items-center gap-2 hover:text-cloud"><Phone size={14} className="text-ash" /> {b.phone}</a>}
              <p className="inline-flex items-center gap-2"><GraduationCap size={14} className="text-ash" /> {b.subject}{b.grade ? ` · ${b.grade}` : ""}</p>
              <p className="inline-flex items-center gap-2"><Calendar size={14} className="text-ash" /> {formatDate(b.preferredDate)}{b.preferredTime ? ` at ${b.preferredTime}` : ""}</p>
              <p className="inline-flex items-center gap-2">
                {b.mode === "online" ? <Monitor size={14} className="text-ash" /> : <MapPin size={14} className="text-ash" />}
                <span className="capitalize">{b.mode}</span>
              </p>
            </div>

            {b.message && <p className="mt-3 rounded-md border border-line bg-white/[0.02] p-3 text-sm text-mist">{b.message}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
              <select
                value={b.status}
                disabled={busy === b.id}
                onChange={(e) => setStatus(b.id, e.target.value as BookingStatus)}
                className="input-field !w-auto !py-1.5 text-xs"
                aria-label="Update status"
              >
                {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
              <button disabled={busy === b.id} onClick={() => remove(b.id)} className="ml-auto inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
