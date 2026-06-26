"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Save, Plus, X, User, BookOpen, GraduationCap, Sparkles, LayoutTemplate, Eye,
  CalendarClock, Landmark, Palette,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ImagePicker } from "./ImagePicker";
import { TagInput } from "@/components/ui/TagInput";
import { cn } from "@/lib/utils";
import { uid } from "@/lib/factories";
import { saveProfileAction } from "@/lib/actions";
import type {
  TutorProfile, Qualification, Achievement, Milestone, StatItem, SuccessStory, BackgroundPattern,
} from "@/lib/types";

const tabs = [
  { key: "identity", label: "Identity", icon: User },
  { key: "story", label: "Story", icon: BookOpen },
  { key: "credentials", label: "Credentials", icon: GraduationCap },
  { key: "showcase", label: "Showcase", icon: Sparkles },
  { key: "schedule", label: "Schedule", icon: CalendarClock },
  { key: "payments", label: "Payments", icon: Landmark },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "sections", label: "Homepage", icon: LayoutTemplate },
] as const;

export function ProfileEditor({ initial }: { initial: TutorProfile }) {
  const router = useRouter();
  const [p, setP] = useState<TutorProfile>(initial);
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("identity");
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof TutorProfile>(k: K, v: TutorProfile[K]) => setP((x) => ({ ...x, [k]: v }));

  const save = async () => {
    setSaving(true);
    const res = await saveProfileAction(p);
    setSaving(false);
    if (res.ok) { toast.success("Public site updated."); router.refresh(); }
    else toast.error("Failed to save.");
  };

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-5 mb-6 flex items-center justify-between border-b border-line bg-base/80 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:top-0">
        <div className="flex items-center gap-3">
          <Avatar name={p.name} src={p.avatar} size={40} ring />
          <p className="font-display font-semibold text-cloud">Public profile</p>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" className="btn-ghost !py-2.5"><Eye size={16} /> Preview</a>
          <button onClick={save} disabled={saving} className="btn-gold !py-2.5 disabled:opacity-60"><Save size={16} /> {saving ? "Saving…" : "Save"}</button>
        </div>
      </div>

      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors", tab === t.key ? "bg-sage-500/15 text-sage-100 ring-1 ring-sage-500/30" : "border border-line text-mist hover:bg-white/5")}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl space-y-4">
        {tab === "identity" && <Identity p={p} set={set} />}
        {tab === "story" && <Story p={p} set={set} />}
        {tab === "credentials" && <Credentials p={p} setP={setP} />}
        {tab === "showcase" && <Showcase p={p} setP={setP} />}
        {tab === "schedule" && <Schedule p={p} setP={setP} />}
        {tab === "payments" && <Payments p={p} setP={setP} />}
        {tab === "appearance" && <Appearance p={p} setP={setP} />}
        {tab === "sections" && <Sections p={p} setP={setP} />}
      </div>
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <div><span className="label-field">{label}</span>{children}{hint && <p className="mt-1 text-xs text-ash">{hint}</p>}</div>;
}
function Card({ children }: { children: React.ReactNode }) { return <div className="card space-y-5 rounded-2xl p-6">{children}</div>; }
function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-line px-4 py-2.5 text-sm text-mist hover:border-sage-500/40 hover:text-sage-200"><Plus size={15} /> {label}</button>;
}
function Del({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ash hover:bg-danger/10 hover:text-danger"><X size={15} /></button>;
}

function Identity({ p, set }: { p: TutorProfile; set: any }) {
  return (
    <Card>
      <ImagePicker name={p.name} value={p.avatar} onChange={(url) => set("avatar", url)} label="Profile photo" size={72} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name"><input className="input-field" value={p.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="Years of experience"><input type="number" className="input-field" value={p.yearsExperience} onChange={(e) => set("yearsExperience", +e.target.value)} /></Field>
      </div>
      <Field label="Headline" hint="One-line professional introduction shown in the hero."><textarea className="input-field min-h-[70px]" value={p.headline} onChange={(e) => set("headline", e.target.value)} /></Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Email"><input className="input-field" value={p.email} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="Phone"><input className="input-field" value={p.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field label="Location"><input className="input-field" value={p.location ?? ""} onChange={(e) => set("location", e.target.value)} /></Field>
      </div>
      <Field label="Subjects taught"><TagInput value={p.subjects} onChange={(v) => set("subjects", v)} /></Field>
      <Field label="Teaching methods"><TagInput value={p.teachingMethods} onChange={(v) => set("teachingMethods", v)} /></Field>
    </Card>
  );
}

function Story({ p, set }: { p: TutorProfile; set: any }) {
  return (
    <Card>
      <Field label="Biography"><textarea className="input-field min-h-[140px]" value={p.bio} onChange={(e) => set("bio", e.target.value)} /></Field>
      <Field label="Teaching philosophy"><textarea className="input-field min-h-[90px]" value={p.philosophy} onChange={(e) => set("philosophy", e.target.value)} /></Field>
      <Field label="Teaching approach"><textarea className="input-field min-h-[90px]" value={p.approach} onChange={(e) => set("approach", e.target.value)} /></Field>
      <Field label="Experience overview"><textarea className="input-field min-h-[90px]" value={p.experienceOverview} onChange={(e) => set("experienceOverview", e.target.value)} /></Field>
    </Card>
  );
}

function Credentials({ p, setP }: { p: TutorProfile; setP: any }) {
  const qList = (key: "qualifications" | "certifications") => ({
    add: () => setP((x: TutorProfile) => ({ ...x, [key]: [...x[key], { id: uid("q"), title: "", institution: "", year: "" }] })),
    upd: (id: string, patch: Partial<Qualification>) => setP((x: TutorProfile) => ({ ...x, [key]: x[key].map((i) => i.id === id ? { ...i, ...patch } : i) })),
    del: (id: string) => setP((x: TutorProfile) => ({ ...x, [key]: x[key].filter((i) => i.id !== id) })),
  });
  const addAch = () => setP((x: TutorProfile) => ({ ...x, achievements: [...x.achievements, { id: uid("a"), title: "", description: "", year: "", icon: "Award" }] }));
  const updAch = (id: string, patch: Partial<Achievement>) => setP((x: TutorProfile) => ({ ...x, achievements: x.achievements.map((i) => i.id === id ? { ...i, ...patch } : i) }));
  const delAch = (id: string) => setP((x: TutorProfile) => ({ ...x, achievements: x.achievements.filter((i) => i.id !== id) }));
  const addMs = () => setP((x: TutorProfile) => ({ ...x, milestones: [...x.milestones, { id: uid("m"), year: "", title: "", description: "" }] }));
  const updMs = (id: string, patch: Partial<Milestone>) => setP((x: TutorProfile) => ({ ...x, milestones: x.milestones.map((i) => i.id === id ? { ...i, ...patch } : i) }));
  const delMs = (id: string) => setP((x: TutorProfile) => ({ ...x, milestones: x.milestones.filter((i) => i.id !== id) }));

  const renderQ = (key: "qualifications" | "certifications", label: string) => {
    const ops = qList(key);
    return (
      <Card>
        <div className="flex items-center justify-between"><p className="text-sm font-medium text-sage-300">{label}</p><AddBtn onClick={ops.add} label="Add" /></div>
        {p[key].map((q) => (
          <div key={q.id} className="flex items-center gap-2 rounded-xl border border-line p-3">
            <input className="input-field flex-1" placeholder="Title" value={q.title} onChange={(e) => ops.upd(q.id, { title: e.target.value })} />
            <input className="input-field flex-1" placeholder="Institution" value={q.institution} onChange={(e) => ops.upd(q.id, { institution: e.target.value })} />
            <input className="input-field w-24" placeholder="Year" value={q.year} onChange={(e) => ops.upd(q.id, { year: e.target.value })} />
            <Del onClick={() => ops.del(q.id)} />
          </div>
        ))}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {renderQ("qualifications", "Qualifications")}
      {renderQ("certifications", "Certifications")}
      <Card>
        <div className="flex items-center justify-between"><p className="text-sm font-medium text-sage-300">Awards & achievements</p><AddBtn onClick={addAch} label="Add" /></div>
        {p.achievements.map((a) => (
          <div key={a.id} className="flex items-start gap-2 rounded-xl border border-line p-3">
            <div className="grid flex-1 gap-2">
              <div className="flex gap-2">
                <input className="input-field flex-1" placeholder="Title" value={a.title} onChange={(e) => updAch(a.id, { title: e.target.value })} />
                <input className="input-field w-24" placeholder="Year" value={a.year} onChange={(e) => updAch(a.id, { year: e.target.value })} />
                <select className="input-field w-32" value={a.icon} onChange={(e) => updAch(a.id, { icon: e.target.value })}>
                  <option value="Trophy">Trophy</option><option value="Medal">Medal</option><option value="Award">Award</option><option value="BadgeCheck">Badge</option>
                </select>
              </div>
              <input className="input-field" placeholder="Description" value={a.description} onChange={(e) => updAch(a.id, { description: e.target.value })} />
            </div>
            <Del onClick={() => delAch(a.id)} />
          </div>
        ))}
      </Card>
      <Card>
        <div className="flex items-center justify-between"><p className="text-sm font-medium text-sage-300">Career milestones</p><AddBtn onClick={addMs} label="Add" /></div>
        {p.milestones.map((m) => (
          <div key={m.id} className="flex items-start gap-2 rounded-xl border border-line p-3">
            <div className="grid flex-1 gap-2">
              <div className="flex gap-2">
                <input className="input-field w-24" placeholder="Year" value={m.year} onChange={(e) => updMs(m.id, { year: e.target.value })} />
                <input className="input-field flex-1" placeholder="Title" value={m.title} onChange={(e) => updMs(m.id, { title: e.target.value })} />
              </div>
              <input className="input-field" placeholder="Description" value={m.description} onChange={(e) => updMs(m.id, { description: e.target.value })} />
            </div>
            <Del onClick={() => delMs(m.id)} />
          </div>
        ))}
      </Card>
    </div>
  );
}

function Showcase({ p, setP }: { p: TutorProfile; setP: any }) {
  const addStat = () => setP((x: TutorProfile) => ({ ...x, stats: [...x.stats, { id: uid("s"), label: "", value: 0, suffix: "" }] }));
  const updStat = (id: string, patch: Partial<StatItem>) => setP((x: TutorProfile) => ({ ...x, stats: x.stats.map((i) => i.id === id ? { ...i, ...patch } : i) }));
  const delStat = (id: string) => setP((x: TutorProfile) => ({ ...x, stats: x.stats.filter((i) => i.id !== id) }));
  const addStory = () => setP((x: TutorProfile) => ({ ...x, successStories: [...x.successStories, { id: uid("ss"), studentName: "", subject: "", fromGrade: "", toGrade: "", comment: "", featured: true }] }));
  const updStory = (id: string, patch: Partial<SuccessStory>) => setP((x: TutorProfile) => ({ ...x, successStories: x.successStories.map((i) => i.id === id ? { ...i, ...patch } : i) }));
  const delStory = (id: string) => setP((x: TutorProfile) => ({ ...x, successStories: x.successStories.filter((i) => i.id !== id) }));

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between"><p className="text-sm font-medium text-sage-300">Statistics</p><AddBtn onClick={addStat} label="Add stat" /></div>
        {p.stats.map((st) => (
          <div key={st.id} className="flex items-center gap-2 rounded-xl border border-line p-3">
            <input className="input-field flex-1" placeholder="Label" value={st.label} onChange={(e) => updStat(st.id, { label: e.target.value })} />
            <input type="number" className="input-field w-24" placeholder="Value" value={st.value} onChange={(e) => updStat(st.id, { value: +e.target.value })} />
            <input className="input-field w-20" placeholder="Suffix" value={st.suffix ?? ""} onChange={(e) => updStat(st.id, { suffix: e.target.value })} />
            <Del onClick={() => delStat(st.id)} />
          </div>
        ))}
      </Card>
      <Card>
        <div className="flex items-center justify-between"><p className="text-sm font-medium text-sage-300">Student success stories</p><AddBtn onClick={addStory} label="Add story" /></div>
        {p.successStories.map((s) => (
          <div key={s.id} className="space-y-2 rounded-xl border border-line p-3">
            <div className="flex gap-2">
              <input className="input-field flex-1" placeholder="Student name (or Anonymous)" value={s.studentName} onChange={(e) => updStory(s.id, { studentName: e.target.value })} />
              <input className="input-field w-40" placeholder="Subject" value={s.subject} onChange={(e) => updStory(s.id, { subject: e.target.value })} />
              <Del onClick={() => delStory(s.id)} />
            </div>
            <div className="flex gap-2">
              <input className="input-field flex-1" placeholder="From (e.g. Average)" value={s.fromGrade} onChange={(e) => updStory(s.id, { fromGrade: e.target.value })} />
              <input className="input-field flex-1" placeholder="To (e.g. A)" value={s.toGrade} onChange={(e) => updStory(s.id, { toGrade: e.target.value })} />
            </div>
            <textarea className="input-field min-h-[70px]" placeholder="Your comment about their growth…" value={s.comment} onChange={(e) => updStory(s.id, { comment: e.target.value })} />
            <label className="flex cursor-pointer items-center gap-2 text-sm text-mist">
              <input type="checkbox" checked={s.featured} onChange={(e) => updStory(s.id, { featured: e.target.checked })} className="h-4 w-4 accent-sage-500" /> Feature on homepage
            </label>
          </div>
        ))}
      </Card>
    </div>
  );
}

function hexAlpha(hex: string, a: number) {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(v.slice(0, 2), 16) || 255;
  const g = parseInt(v.slice(2, 4), 16) || 255;
  const b = parseInt(v.slice(4, 6), 16) || 255;
  return `rgba(${r},${g},${b},${a})`;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Schedule({ p, setP }: { p: TutorProfile; setP: any }) {
  const a = p.availability;
  const setA = (patch: Partial<TutorProfile["availability"]>) =>
    setP((x: TutorProfile) => ({ ...x, availability: { ...x.availability, ...patch } }));
  const toggleDay = (i: number) =>
    setA({ weekdays: a.weekdays.includes(i) ? a.weekdays.filter((d) => d !== i) : [...a.weekdays, i].sort((x, y) => x - y) });

  return (
    <Card>
      <p className="text-sm font-medium text-cloud">Weekly availability for consultations</p>
      <Field label="Available days">
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((d, i) => (
            <button type="button" key={i} onClick={() => toggleDay(i)} className={cn("rounded-md border px-3.5 py-2 text-sm font-medium", a.weekdays.includes(i) ? "border-white/40 bg-white/10 text-cloud" : "border-line text-mist hover:bg-white/5")}>{d}</button>
          ))}
        </div>
      </Field>
      <Field label="Time slots" hint="Add times students can pick, e.g. 16:00, 17:30">
        <TagInput value={a.slots} onChange={(v) => setA({ slots: v })} placeholder="Add a time slot" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Session length (minutes)"><input type="number" className="input-field" value={a.sessionMinutes} onChange={(e) => setA({ sessionMinutes: +e.target.value })} /></Field>
      </div>
      <Field label="Blocked dates" hint="Specific dates you're away (YYYY-MM-DD)">
        <TagInput value={a.blockedDates} onChange={(v) => setA({ blockedDates: v })} placeholder="2026-07-01" />
      </Field>
      <Field label="Note shown on the calendar"><input className="input-field" value={a.note} onChange={(e) => setA({ note: e.target.value })} /></Field>
    </Card>
  );
}

function Payments({ p, setP }: { p: TutorProfile; setP: any }) {
  const b = p.bankDetails;
  const setB = (patch: Partial<TutorProfile["bankDetails"]>) =>
    setP((x: TutorProfile) => ({ ...x, bankDetails: { ...x.bankDetails, ...patch } }));
  return (
    <Card>
      <p className="text-sm font-medium text-cloud">Bank details for note purchases</p>
      <p className="text-xs text-ash">Shown to students at checkout so they can transfer the fee and upload a slip.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Bank name"><input className="input-field" value={b.bankName} onChange={(e) => setB({ bankName: e.target.value })} /></Field>
        <Field label="Account name"><input className="input-field" value={b.accountName} onChange={(e) => setB({ accountName: e.target.value })} /></Field>
        <Field label="Account number"><input className="input-field" value={b.accountNumber} onChange={(e) => setB({ accountNumber: e.target.value })} /></Field>
        <Field label="Branch"><input className="input-field" value={b.branch} onChange={(e) => setB({ branch: e.target.value })} /></Field>
      </div>
      <Field label="Payment instructions"><textarea className="input-field min-h-[80px]" value={b.instructions} onChange={(e) => setB({ instructions: e.target.value })} /></Field>
    </Card>
  );
}

function Appearance({ p, setP }: { p: TutorProfile; setP: any }) {
  const t = p.theme;
  const setT = (patch: Partial<TutorProfile["theme"]>) =>
    setP((x: TutorProfile) => ({ ...x, theme: { ...x.theme, ...patch } }));
  const presets = [
    { label: "Charcoal", bg: "#0A0A0A" },
    { label: "Midnight", bg: "#0B1220" },
    { label: "Espresso", bg: "#140F0C" },
    { label: "Forest", bg: "#0B140F" },
    { label: "Plum", bg: "#150B18" },
    { label: "Slate", bg: "#0E1216" },
  ];
  const patterns: BackgroundPattern[] = ["sparkles", "grid", "dots", "aurora", "none"];
  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm font-medium text-cloud">Background colour</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((pr) => (
            <button type="button" key={pr.bg} onClick={() => setT({ bgColor: pr.bg })} className={cn("inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm", t.bgColor.toLowerCase() === pr.bg.toLowerCase() ? "border-white/40 text-cloud" : "border-line text-mist hover:bg-white/5")}>
              <span className="h-4 w-4 rounded-full border border-white/20" style={{ background: pr.bg }} /> {pr.label}
            </button>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Custom background"><input type="color" value={t.bgColor} onChange={(e) => setT({ bgColor: e.target.value })} className="h-11 w-full cursor-pointer rounded-md border border-line bg-transparent" /></Field>
          <Field label="Accent / sparkle colour"><input type="color" value={t.accent} onChange={(e) => setT({ accent: e.target.value })} className="h-11 w-full cursor-pointer rounded-md border border-line bg-transparent" /></Field>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-medium text-cloud">Background pattern</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {patterns.map((pt) => (
            <button type="button" key={pt} onClick={() => setT({ pattern: pt })} className={cn("rounded-md border px-3 py-2 text-sm capitalize", t.pattern === pt ? "border-white/40 bg-white/10 text-cloud" : "border-line text-mist hover:bg-white/5")}>{pt}</button>
          ))}
        </div>
        <div className="overflow-hidden rounded-lg border border-line">
          <div className="relative h-36 overflow-hidden" style={{ background: t.bgColor }}>
            {t.pattern === "grid" && (
              <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, ${hexAlpha(t.accent, 0.14)} 1px, transparent 1px), linear-gradient(to bottom, ${hexAlpha(t.accent, 0.14)} 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
            )}
            {(t.pattern === "dots" || t.pattern === "sparkles") &&
              [14, 32, 50, 68, 84, 22, 60, 90].map((x, i) => (
                <span key={i} className="absolute rounded-full" style={{ height: t.pattern === "sparkles" ? 3 : 4, width: t.pattern === "sparkles" ? 3 : 4, left: `${x}%`, top: `${(i * 29) % 78 + 8}%`, background: t.accent, opacity: 0.85, boxShadow: `0 0 6px ${t.accent}` }} />
              ))}
            {t.pattern === "aurora" && (
              <div className="absolute -left-6 top-2 h-40 w-40 rounded-full blur-2xl" style={{ background: `radial-gradient(circle, ${hexAlpha(t.accent, 0.4)}, transparent 60%)` }} />
            )}
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-sm capitalize" style={{ color: t.accent }}>{t.pattern} · live preview</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-ash">Save, then refresh the homepage to see the new background live.</p>
      </Card>
    </div>
  );
}

function Sections({ p, setP }: { p: TutorProfile; setP: any }) {
  const items: { key: keyof TutorProfile["sections"]; label: string; desc: string }[] = [
    { key: "stats", label: "Statistics band", desc: "Headline numbers strip" },
    { key: "successStories", label: "Success stories", desc: "Student transformation cards" },
    { key: "qualifications", label: "Credentials", desc: "Qualifications & achievements" },
    { key: "milestones", label: "Career timeline", desc: "Journey milestones" },
    { key: "reviews", label: "Reviews", desc: "Approved testimonials carousel" },
    { key: "contact", label: "Contact / CTA", desc: "Booking call-to-action" },
  ];
  return (
    <Card>
      <p className="text-sm font-medium text-sage-300">Show or hide homepage sections</p>
      {items.map((it) => {
        const on = p.sections[it.key];
        return (
          <div key={it.key} className="flex items-center justify-between rounded-xl border border-line p-4">
            <div><p className="font-medium text-cloud">{it.label}</p><p className="text-xs text-ash">{it.desc}</p></div>
            <button
              onClick={() => setP((x: TutorProfile) => ({ ...x, sections: { ...x.sections, [it.key]: !on } }))}
              className={cn("relative h-7 w-12 rounded-full transition-colors", on ? "bg-sage-500" : "bg-white/10")}
              role="switch" aria-checked={on} aria-label={it.label}
            >
              <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white transition-all", on ? "left-6" : "left-1")} />
            </button>
          </div>
        );
      })}
    </Card>
  );
}
