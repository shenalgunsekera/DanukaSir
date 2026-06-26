"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { submitReviewAction } from "@/lib/actions";

export function ReviewForm({ onDone }: { onDone?: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "parent">("student");
  const [anonymous, setAnonymous] = useState(false);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (body.trim().length < 10) {
      toast.error("Please write at least a sentence.");
      return;
    }
    setBusy(true);
    const res = await submitReviewAction({ reviewerName: name, reviewerRole: role, anonymous, rating, body });
    setBusy(false);
    if (res.ok) {
      toast.success("Thank you! Your review is awaiting approval.");
      setName("");
      setBody("");
      setRating(5);
      onDone?.();
    } else {
      toast.error(res.error || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <span className="label-field">Your rating</span>
        <StarRating value={rating} onChange={setRating} size={28} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="rv-name">Name</label>
          <input
            id="rv-name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            disabled={anonymous}
          />
        </div>
        <div>
          <span className="label-field">I am a</span>
          <div className="flex gap-2">
            {(["student", "parent"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  role === r
                    ? "border-sage-500/50 bg-sage-500/10 text-sage-100"
                    : "border-line text-mist hover:bg-white/5"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="rv-body">Your review</label>
        <textarea
          id="rv-body"
          className="input-field min-h-[120px] resize-y"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your experience…"
          maxLength={1200}
          required
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-mist">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="h-4 w-4 accent-sage-500"
        />
        Submit anonymously
      </label>

      <button type="submit" disabled={busy} className="btn-gold w-full disabled:opacity-60">
        {busy ? "Submitting…" : (<>Submit review <Send size={15} /></>)}
      </button>
      <p className="text-center text-xs text-ash">
        Reviews are published only after the tutor approves them.
      </p>
    </form>
  );
}
