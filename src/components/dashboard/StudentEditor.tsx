"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Save, Trash2, Plus, X, User, Brain, BarChart3, FileText,
  MessageSquare, Award, Link2, RefreshCw, Copy, Power, Eye, Check, FileDown,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ImagePicker } from "./ImagePicker";
import { TagInput } from "@/components/ui/TagInput";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import { SITE } from "@/lib/site-config";
import { uid } from "@/lib/factories";
import {
  saveStudentAction, deleteStudentAction, regenerateAccessAction, toggleAccessAction,
} from "@/lib/actions";
import type {
  Student, SubjectPerformance, ExamResult, AssignmentRecord, FeedbackNote, Achievement, TimelineEvent,
} from "@/lib/types";

const SUBJECT_SUGGESTIONS = ["Mathematics", "Combined Mathematics", "Physics", "Chemistry", "Biology", "English", "ICT"];

const tabs = [
  { key: "profile", label: "Profile", icon: User },
  { key: "learning", label: "Learning", icon: Brain },
  { key: "performance", label: "Performance", icon: BarChart3 },
  { key: "records", label: "Records", icon: FileText },
  { key: "feedback", label: "Feedback", icon: MessageSquare },
  { key: "achievements", label: "Achievements", icon: Award },
  { key: "access", label: "Parent Access", icon: Link2 },
] as const;

export function StudentEditor({ initial, isNew }: { initial: Student; isNew: boolean }) {
  const router = useRouter();
  const [s, setS] = useState<Student>(initial);
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("profile");
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Student>(key: K, val: Student[K]) =>
    setS((prev) => ({ ...prev, [key]: val }));

  const save = async () => {
    if (!s.name.trim()) { toast.error("Student name is required."); setTab("profile"); return; }
    setSaving(true);
    const res = await saveStudentAction(s);
    setSaving(false);
    if (res.ok) {
      toast.success(isNew ? "Student created." : "Changes saved.");
      if (isNew) router.push(`/dashboard/students/${s.id}`);
      else router.refresh();
    } else toast.error("Failed to save.");
  };

  const remove = async () => {
    if (!confirm(`Delete ${s.name}? This cannot be undone.`)) return;
    await deleteStudentAction(s.id);
    toast.success("Student deleted.");
    router.push("/dashboard/students");
  };

  return (
    <div>
      {/* Sticky action bar */}
      <div className="sticky top-16 z-20 -mx-5 mb-6 flex items-center justify-between gap-3 border-b border-line bg-base/80 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:top-0">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={s.name || "New"} src={s.image} size={40} />
          <div className="min-w-0">
            <p className="truncate font-display font-semibold text-cloud">{s.name || "New student"}</p>
            <p className="text-xs text-ash">{s.grade || "Set up the profile"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <>
              <a
                href={`/report-card/${s.id}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost !py-2.5"
                title="Open a printable report card to save as PDF"
              >
                <FileDown size={16} /> <span className="hidden sm:inline">Report PDF</span>
              </a>
              <button onClick={remove} className="grid h-10 w-10 place-items-center rounded-xl border border-line text-danger transition-colors hover:bg-danger/10" aria-label="Delete student">
                <Trash2 size={16} />
              </button>
            </>
          )}
          <button onClick={save} disabled={saving} className="btn-gold !py-2.5 disabled:opacity-60">
            <Save size={16} /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === t.key ? "bg-sage-500/15 text-sage-100 ring-1 ring-sage-500/30" : "border border-line text-mist hover:bg-white/5"
            )}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        {tab === "profile" && <ProfileTab s={s} set={set} setS={setS} />}
        {tab === "learning" && <LearningTab s={s} set={set} />}
        {tab === "performance" && <PerformanceTab s={s} setS={setS} />}
        {tab === "records" && <RecordsTab s={s} setS={setS} />}
        {tab === "feedback" && <FeedbackTab s={s} setS={setS} />}
        {tab === "achievements" && <AchievementsTab s={s} setS={setS} />}
        {tab === "access" && <AccessTab s={s} setS={setS} isNew={isNew} />}
      </div>
    </div>
  );
}

/* ───────────── shared field helpers ───────────── */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <span className="label-field">{label}</span>
      {children}
      {hint && <p className="mt-1 text-xs text-ash">{hint}</p>}
    </div>
  );
}
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card space-y-5 rounded-2xl p-6">{children}</div>;
}
function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-line px-4 py-2.5 text-sm text-mist transition-colors hover:border-sage-500/40 hover:text-sage-200">
      <Plus size={15} /> {label}
    </button>
  );
}
function RowDelete({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ash transition-colors hover:bg-danger/10 hover:text-danger" aria-label="Remove">
      <X size={15} />
    </button>
  );
}

/* ───────────── Profile ───────────── */
function ProfileTab({ s, set, setS }: { s: Student; set: any; setS: any }) {
  return (
    <Card>
      <ImagePicker name={s.name} value={s.image} onChange={(url) => set("image", url)} label="Student photo" size={64} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name"><input className="input-field" value={s.name} onChange={(e) => set("name", e.target.value)} placeholder="Student name" /></Field>
        <Field label="Grade / Class"><input className="input-field" value={s.grade} onChange={(e) => set("grade", e.target.value)} placeholder="e.g. Grade 12 (A/L)" /></Field>
      </div>
      <Field label="Subjects">
        <TagInput value={s.subjects} onChange={(v) => set("subjects", v)} suggestions={SUBJECT_SUGGESTIONS} placeholder="Add subjects" />
      </Field>
      <div className="rule-gold my-2" />
      <p className="text-sm font-medium text-sage-300">Parent / Guardian</p>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Name"><input className="input-field" value={s.parentName ?? ""} onChange={(e) => set("parentName", e.target.value)} /></Field>
        <Field label="Email"><input className="input-field" value={s.parentEmail ?? ""} onChange={(e) => set("parentEmail", e.target.value)} /></Field>
        <Field label="Phone"><input className="input-field" value={s.parentPhone ?? ""} onChange={(e) => set("parentPhone", e.target.value)} /></Field>
      </div>
      <Field label="Status">
        <div className="flex gap-2">
          {(["active", "archived"] as const).map((st) => (
            <button key={st} onClick={() => set("status", st)} className={cn("rounded-xl border px-4 py-2 text-sm capitalize", s.status === st ? "border-sage-500/50 bg-sage-500/10 text-sage-100" : "border-line text-mist")}>{st}</button>
          ))}
        </div>
      </Field>
    </Card>
  );
}

/* ───────────── Learning ───────────── */
function LearningTab({ s, set }: { s: Student; set: any }) {
  return (
    <Card>
      <Field label="Learning goals"><textarea className="input-field min-h-[90px]" value={s.goals} onChange={(e) => set("goals", e.target.value)} placeholder="What is this student working towards?" /></Field>
      <Field label="Current level"><input className="input-field" value={s.currentLevel} onChange={(e) => set("currentLevel", e.target.value)} placeholder="e.g. Advanced — scoring above 75%" /></Field>
      <Field label="Strengths"><TagInput value={s.strengths} onChange={(v) => set("strengths", v)} placeholder="Add a strength" /></Field>
      <Field label="Weaknesses"><TagInput value={s.weaknesses} onChange={(v) => set("weaknesses", v)} placeholder="Add a weakness" /></Field>
      <Field label="Improvement areas"><TagInput value={s.improvementAreas} onChange={(v) => set("improvementAreas", v)} placeholder="Add a focus area" /></Field>
    </Card>
  );
}

/* ───────────── Performance ───────────── */
function PerformanceTab({ s, setS }: { s: Student; setS: any }) {
  const update = (i: number, patch: Partial<SubjectPerformance>) =>
    setS((p: Student) => ({ ...p, performance: p.performance.map((x, idx) => (idx === i ? { ...x, ...patch } : x)) }));
  const add = () => setS((p: Student) => ({ ...p, performance: [...p.performance, { subject: p.subjects[0] ?? "Subject", level: 50, baseline: 30 }] }));
  const del = (i: number) => setS((p: Student) => ({ ...p, performance: p.performance.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm font-medium text-sage-300">Subject performance</p>
        {s.performance.map((p, i) => (
          <div key={i} className="rounded-xl border border-line p-4">
            <div className="flex items-center gap-2">
              <input className="input-field flex-1" value={p.subject} onChange={(e) => update(i, { subject: e.target.value })} placeholder="Subject" />
              <RowDelete onClick={() => del(i)} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <label className="text-xs text-ash">Starting level: <b className="text-cloud">{p.baseline}%</b>
                <input type="range" min={0} max={100} value={p.baseline} onChange={(e) => update(i, { baseline: +e.target.value })} className="mt-1 w-full accent-sage-500" />
              </label>
              <label className="text-xs text-ash">Current level: <b className="text-cloud">{p.level}%</b>
                <input type="range" min={0} max={100} value={p.level} onChange={(e) => update(i, { level: +e.target.value })} className="mt-1 w-full accent-sage-500" />
              </label>
            </div>
            <ProgressBar value={p.level} baseline={p.baseline} className="mt-3" />
          </div>
        ))}
        <AddBtn onClick={add} label="Add subject" />
      </Card>

      <Card>
        <p className="text-sm font-medium text-sage-300">Attendance</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Sessions attended"><input type="number" className="input-field" value={s.attendance.present} onChange={(e) => setS((p: Student) => ({ ...p, attendance: { ...p.attendance, present: +e.target.value } }))} /></Field>
          <Field label="Total sessions"><input type="number" className="input-field" value={s.attendance.total} onChange={(e) => setS((p: Student) => ({ ...p, attendance: { ...p.attendance, total: +e.target.value } }))} /></Field>
        </div>
      </Card>
    </div>
  );
}

/* ───────────── Records (exams + assignments) ───────────── */
function RecordsTab({ s, setS }: { s: Student; setS: any }) {
  const addExam = () => setS((p: Student) => ({ ...p, exams: [...p.exams, { id: uid("e"), title: "", subject: p.subjects[0] ?? "", date: new Date().toISOString().slice(0, 10), score: 0, maxScore: 100, grade: "" }] }));
  const updExam = (id: string, patch: Partial<ExamResult>) => setS((p: Student) => ({ ...p, exams: p.exams.map((x) => x.id === id ? { ...x, ...patch } : x) }));
  const delExam = (id: string) => setS((p: Student) => ({ ...p, exams: p.exams.filter((x) => x.id !== id) }));

  const addAsg = () => setS((p: Student) => ({ ...p, assignments: [...p.assignments, { id: uid("as"), title: "", type: "homework", dueDate: new Date().toISOString().slice(0, 10), status: "pending" }] }));
  const updAsg = (id: string, patch: Partial<AssignmentRecord>) => setS((p: Student) => ({ ...p, assignments: p.assignments.map((x) => x.id === id ? { ...x, ...patch } : x) }));
  const delAsg = (id: string) => setS((p: Student) => ({ ...p, assignments: p.assignments.filter((x) => x.id !== id) }));

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm font-medium text-sage-300">Exam results</p>
        {s.exams.map((e) => (
          <div key={e.id} className="flex items-start gap-2 rounded-xl border border-line p-3">
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <input className="input-field" placeholder="Exam title" value={e.title} onChange={(ev) => updExam(e.id, { title: ev.target.value })} />
              <input className="input-field" placeholder="Subject" value={e.subject} onChange={(ev) => updExam(e.id, { subject: ev.target.value })} />
              <input type="date" className="input-field" value={e.date} onChange={(ev) => updExam(e.id, { date: ev.target.value })} />
              <div className="flex gap-2">
                <input type="number" className="input-field" placeholder="Score" value={e.score} onChange={(ev) => updExam(e.id, { score: +ev.target.value })} />
                <input type="number" className="input-field" placeholder="Max" value={e.maxScore} onChange={(ev) => updExam(e.id, { maxScore: +ev.target.value })} />
                <input className="input-field w-20" placeholder="Grade" value={e.grade ?? ""} onChange={(ev) => updExam(e.id, { grade: ev.target.value })} />
              </div>
            </div>
            <RowDelete onClick={() => delExam(e.id)} />
          </div>
        ))}
        <AddBtn onClick={addExam} label="Add exam result" />
      </Card>

      <Card>
        <p className="text-sm font-medium text-sage-300">Homework & assignments</p>
        {s.assignments.map((a) => (
          <div key={a.id} className="flex items-start gap-2 rounded-xl border border-line p-3">
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <input className="input-field" placeholder="Title" value={a.title} onChange={(ev) => updAsg(a.id, { title: ev.target.value })} />
              <select className="input-field" value={a.type} onChange={(ev) => updAsg(a.id, { type: ev.target.value as any })}>
                <option value="homework">Homework</option><option value="assignment">Assignment</option><option value="project">Project</option>
              </select>
              <input type="date" className="input-field" value={a.dueDate} onChange={(ev) => updAsg(a.id, { dueDate: ev.target.value })} />
              <select className="input-field" value={a.status} onChange={(ev) => updAsg(a.id, { status: ev.target.value as any })}>
                <option value="completed">Completed</option><option value="pending">Pending</option><option value="late">Late</option><option value="missing">Missing</option>
              </select>
            </div>
            <RowDelete onClick={() => delAsg(a.id)} />
          </div>
        ))}
        <AddBtn onClick={addAsg} label="Add assignment" />
      </Card>
    </div>
  );
}

/* ───────────── Feedback ───────────── */
function FeedbackTab({ s, setS }: { s: Student; setS: any }) {
  const add = () => setS((p: Student) => ({ ...p, feedback: [{ id: uid("f"), date: new Date().toISOString().slice(0, 10), category: "monthly", title: "", body: "" }, ...p.feedback] }));
  const upd = (id: string, patch: Partial<FeedbackNote>) => setS((p: Student) => ({ ...p, feedback: p.feedback.map((x) => x.id === id ? { ...x, ...patch } : x) }));
  const del = (id: string) => setS((p: Student) => ({ ...p, feedback: p.feedback.filter((x) => x.id !== id) }));

  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-sage-300">Teacher feedback & notes</p>
        <AddBtn onClick={add} label="Add note" />
      </div>
      {s.feedback.length === 0 && <p className="text-sm text-ash">No feedback yet.</p>}
      {s.feedback.map((f) => (
        <div key={f.id} className="rounded-xl border border-line p-4">
          <div className="flex gap-2">
            <input className="input-field flex-1" placeholder="Title" value={f.title} onChange={(e) => upd(f.id, { title: e.target.value })} />
            <select className="input-field w-40" value={f.category} onChange={(e) => upd(f.id, { category: e.target.value as any })}>
              <option value="monthly">Monthly</option><option value="observation">Observation</option><option value="behaviour">Behaviour</option><option value="improvement">Improvement</option><option value="goal">Future goal</option><option value="recommendation">Recommendation</option>
            </select>
            <input type="date" className="input-field w-40" value={f.date} onChange={(e) => upd(f.id, { date: e.target.value })} />
            <RowDelete onClick={() => del(f.id)} />
          </div>
          <textarea className="input-field mt-2 min-h-[80px]" placeholder="Write your feedback…" value={f.body} onChange={(e) => upd(f.id, { body: e.target.value })} />
        </div>
      ))}
    </Card>
  );
}

/* ───────────── Achievements + Timeline ───────────── */
function AchievementsTab({ s, setS }: { s: Student; setS: any }) {
  const addAch = () => setS((p: Student) => ({ ...p, achievements: [...p.achievements, { id: uid("sa"), title: "", description: "", year: String(new Date().getFullYear()), icon: "Award" }] }));
  const updAch = (id: string, patch: Partial<Achievement>) => setS((p: Student) => ({ ...p, achievements: p.achievements.map((x) => x.id === id ? { ...x, ...patch } : x) }));
  const delAch = (id: string) => setS((p: Student) => ({ ...p, achievements: p.achievements.filter((x) => x.id !== id) }));

  const addTl = () => setS((p: Student) => ({ ...p, timeline: [{ id: uid("t"), date: new Date().toISOString().slice(0, 10), type: "milestone", title: "", description: "" }, ...p.timeline] }));
  const updTl = (id: string, patch: Partial<TimelineEvent>) => setS((p: Student) => ({ ...p, timeline: p.timeline.map((x) => x.id === id ? { ...x, ...patch } : x) }));
  const delTl = (id: string) => setS((p: Student) => ({ ...p, timeline: p.timeline.filter((x) => x.id !== id) }));

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between"><p className="text-sm font-medium text-sage-300">Achievements & awards</p><AddBtn onClick={addAch} label="Add" /></div>
        {s.achievements.map((a) => (
          <div key={a.id} className="flex items-start gap-2 rounded-xl border border-line p-3">
            <div className="grid flex-1 gap-2">
              <div className="flex gap-2">
                <input className="input-field flex-1" placeholder="Title" value={a.title} onChange={(e) => updAch(a.id, { title: e.target.value })} />
                <input className="input-field w-24" placeholder="Year" value={a.year} onChange={(e) => updAch(a.id, { year: e.target.value })} />
              </div>
              <input className="input-field" placeholder="Description" value={a.description} onChange={(e) => updAch(a.id, { description: e.target.value })} />
            </div>
            <RowDelete onClick={() => delAch(a.id)} />
          </div>
        ))}
      </Card>

      <Card>
        <div className="flex items-center justify-between"><p className="text-sm font-medium text-sage-300">Growth timeline</p><AddBtn onClick={addTl} label="Add event" /></div>
        {s.timeline.map((t) => (
          <div key={t.id} className="flex items-start gap-2 rounded-xl border border-line p-3">
            <div className="grid flex-1 gap-2">
              <div className="flex gap-2">
                <input className="input-field flex-1" placeholder="Title" value={t.title} onChange={(e) => updTl(t.id, { title: e.target.value })} />
                <select className="input-field w-36" value={t.type} onChange={(e) => updTl(t.id, { type: e.target.value as any })}>
                  <option value="milestone">Milestone</option><option value="exam">Exam</option><option value="feedback">Feedback</option><option value="achievement">Achievement</option><option value="enrolled">Enrolled</option>
                </select>
                <input type="date" className="input-field w-40" value={t.date} onChange={(e) => updTl(t.id, { date: e.target.value })} />
              </div>
              <input className="input-field" placeholder="Description" value={t.description} onChange={(e) => updTl(t.id, { description: e.target.value })} />
            </div>
            <RowDelete onClick={() => delTl(t.id)} />
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ───────────── Parent Access ───────────── */
function AccessTab({ s, setS, isNew }: { s: Student; setS: any; isNew: boolean }) {
  const [busy, setBusy] = useState(false);
  const link = `${SITE.url}/report/${s.access.token}`;

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied.`);
  };

  const regen = async (codeOnly: boolean) => {
    if (isNew) { toast.error("Save the student first."); return; }
    if (!confirm(codeOnly ? "Regenerate the access code? The old code stops working." : "Regenerate the private link? The old link stops working.")) return;
    setBusy(true);
    const res = await regenerateAccessAction(s.id, { codeOnly });
    setBusy(false);
    if (res.ok && res.access) { setS((p: Student) => ({ ...p, access: res.access! })); toast.success("Regenerated."); }
  };

  const toggle = async () => {
    const next = !s.access.enabled;
    setS((p: Student) => ({ ...p, access: { ...p.access, enabled: next } }));
    if (!isNew) await toggleAccessAction(s.id, next);
    toast.success(next ? "Parent access enabled." : "Parent access disabled.");
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-cloud">Parent access</p>
            <p className="text-sm text-ash">Parents view the live report with the link + code. No account needed.</p>
          </div>
          <button onClick={toggle} className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium", s.access.enabled ? "bg-success/15 text-success" : "bg-danger/15 text-danger")}>
            <Power size={15} /> {s.access.enabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        <Field label="Private report link">
          <div className="flex gap-2">
            <input readOnly className="input-field flex-1 font-mono text-xs" value={link} />
            <button onClick={() => copy(link, "Link")} className="btn-ghost !px-4 !py-2.5"><Copy size={15} /></button>
            <button onClick={() => regen(false)} disabled={busy} className="btn-ghost !px-4 !py-2.5" aria-label="Regenerate link"><RefreshCw size={15} /></button>
          </div>
        </Field>

        <Field label="Access code" hint="Share this separately from the link for security.">
          <div className="flex gap-2">
            <input readOnly className="input-field flex-1 font-mono text-lg tracking-[0.3em] text-sage-200" value={s.access.code} />
            <button onClick={() => copy(s.access.code, "Code")} className="btn-ghost !px-4 !py-2.5"><Copy size={15} /></button>
            <button onClick={() => regen(true)} disabled={busy} className="btn-ghost !px-4 !py-2.5" aria-label="Regenerate code"><RefreshCw size={15} /></button>
          </div>
        </Field>

        {isNew && <p className="rounded-lg bg-sage-500/10 p-3 text-xs text-sage-100">Save the student to activate the link and enable regeneration.</p>}
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card rounded-2xl p-5 text-center">
          <Eye className="mx-auto h-5 w-5 text-sage-400" />
          <p className="mt-2 font-display text-2xl font-bold text-cloud">{s.access.viewCount}</p>
          <p className="text-xs text-ash">Total views</p>
        </div>
        <div className="card rounded-2xl p-5 text-center">
          <Check className="mx-auto h-5 w-5 text-success" />
          <p className="mt-2 font-display text-sm font-bold text-cloud">{timeAgo(s.access.lastViewedAt)}</p>
          <p className="text-xs text-ash">Last viewed</p>
        </div>
        <div className="card rounded-2xl p-5 text-center">
          <Power className={cn("mx-auto h-5 w-5", s.access.enabled ? "text-success" : "text-danger")} />
          <p className="mt-2 font-display text-sm font-bold text-cloud">{s.access.enabled ? "Active" : "Off"}</p>
          <p className="text-xs text-ash">Status · enrolled {formatDate(s.enrolledAt)}</p>
        </div>
      </div>
    </div>
  );
}
