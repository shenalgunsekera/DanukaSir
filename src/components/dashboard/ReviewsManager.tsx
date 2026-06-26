"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Check, X, Trash2, Star as StarIcon, Sparkles } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, cn } from "@/lib/utils";
import {
  deleteReviewAction,
  moderateReviewAction,
} from "@/lib/actions";
import type { Review, ReviewStatus } from "@/lib/types";

const tabs: { key: ReviewStatus | "all"; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

export function ReviewsManager({ initial }: { initial: Review[] }) {
  const [reviews, setReviews] = useState(initial);
  const [tab, setTab] = useState<ReviewStatus | "all">("pending");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = reviews.filter((r) => (tab === "all" ? true : r.status === tab));
  const counts = {
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
    all: reviews.length,
  };

  const patch = (id: string, p: Partial<Review>) =>
    setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, ...p } : r)));

  const setStatus = async (id: string, status: ReviewStatus) => {
    setBusy(id);
    patch(id, status === "approved" ? { status } : { status, featured: false });
    await moderateReviewAction(id, { status, ...(status !== "approved" ? { featured: false } : {}) });
    setBusy(null);
    toast.success(`Review ${status}.`);
  };

  const toggleFeatured = async (r: Review) => {
    setBusy(r.id);
    const next = !r.featured;
    patch(r.id, { featured: next });
    await moderateReviewAction(r.id, { featured: next });
    setBusy(null);
    toast.success(next ? "Featured on homepage." : "Removed from featured.");
  };

  const remove = async (id: string) => {
    if (!confirm("Permanently delete this review?")) return;
    setBusy(id);
    setReviews((rs) => rs.filter((r) => r.id !== id));
    await deleteReviewAction(id);
    setBusy(null);
    toast.success("Review deleted.");
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === t.key ? "bg-sage-500/15 text-sage-100 ring-1 ring-sage-500/30" : "border border-line text-mist hover:bg-white/5"
            )}
          >
            {t.label}
            <span className="ml-2 text-xs text-ash">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card rounded-2xl py-16 text-center text-sm text-ash">
          No {tab === "all" ? "" : tab} reviews.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((r) => (
            <div key={r.id} className={cn("card rounded-2xl p-5", r.featured && "ring-1 ring-sage-500/30")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={r.reviewerName} size={40} />
                  <div>
                    <p className="font-medium text-cloud">{r.reviewerName}</p>
                    <p className="text-xs capitalize text-ash">{r.reviewerRole} · {formatDate(r.createdAt)}</p>
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <StarRating value={r.rating} className="mt-3" />
              <p className="mt-2 text-sm leading-relaxed text-mist">“{r.body}”</p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                {r.status !== "approved" && (
                  <button disabled={busy === r.id} onClick={() => setStatus(r.id, "approved")} className="inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/20">
                    <Check size={14} /> Approve
                  </button>
                )}
                {r.status !== "rejected" && (
                  <button disabled={busy === r.id} onClick={() => setStatus(r.id, "rejected")} className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-mist transition-colors hover:bg-white/10">
                    <X size={14} /> Reject
                  </button>
                )}
                {r.status === "approved" && (
                  <button disabled={busy === r.id} onClick={() => toggleFeatured(r)} className={cn("inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", r.featured ? "bg-sage-500/20 text-sage-100" : "bg-white/5 text-mist hover:bg-white/10")}>
                    {r.featured ? <Sparkles size={14} /> : <StarIcon size={14} />}
                    {r.featured ? "Featured" : "Feature"}
                  </button>
                )}
                <button disabled={busy === r.id} onClick={() => remove(r.id)} className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const map = {
    pending: "bg-warning/15 text-warning",
    approved: "bg-success/15 text-success",
    rejected: "bg-danger/15 text-danger",
  };
  return <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium capitalize", map[status])}>{status}</span>;
}
