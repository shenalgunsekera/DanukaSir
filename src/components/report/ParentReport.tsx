"use client";

import {
  GraduationCap, TrendingUp, CalendarCheck, Award, MessageSquare,
  FileText, Target, Sparkles, Printer, CheckCircle2, Clock, AlertCircle,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ExamTrendChart, SubjectBarChart } from "@/components/ui/Charts";
import { Reveal } from "@/components/ui/Reveal";
import { average, cn, formatDate } from "@/lib/utils";
import { useBrand } from "@/lib/brand";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import type { Student } from "@/lib/types";

export function ParentReport({ student: s }: { student: Student }) {
  const { name: brandName } = useBrand();
  const avgLevel = average(s.performance.map((p) => p.level));
  const improvement = average(s.performance.map((p) => p.level - p.baseline));
  const attendancePct = s.attendance.total ? Math.round((s.attendance.present / s.attendance.total) * 100) : 0;

  const examTrend = [...s.exams]
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .map((e) => ({ label: `${e.subject.slice(0, 4)} ${formatDate(e.date, { month: "short" })}`, score: Math.round((e.score / e.maxScore) * 100) }));

  const timeline = [...s.timeline].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <div className="min-h-screen pb-20">
      {/* Top bar */}
      <header className="border-b border-line bg-ink/60 backdrop-blur-xl print:hidden">
        <div className="container-px flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-sage-grad text-black"><GraduationCap size={18} /></span>
            <div>
              <p className="font-display font-semibold text-cloud">{brandName}</p>
              <p className="text-[11px] text-ash">Live Progress Report</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button onClick={() => window.print()} className="btn-ghost !py-2.5"><Printer size={15} /> Print / PDF</button>
          </div>
        </div>
      </header>

      <div className="container-px mt-8 max-w-5xl">
        {/* Student header */}
        <Reveal>
          <div className="card relative overflow-hidden rounded-3xl p-7 sm:p-9">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <Avatar name={s.name} src={s.image} size={88} ring />
              <div className="flex-1">
                <span className="chip border-success/30 bg-success/10 text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> Live · updates automatically
                </span>
                <h1 className="mt-2 font-display text-3xl font-semibold text-cloud">{s.name}</h1>
                <p className="text-mist">{s.grade}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                  {s.subjects.map((sub) => <span key={sub} className="chip">{sub}</span>)}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* KPI cards */}
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPI icon={<Target size={18} />} label="Current level" value={`${avgLevel}%`} />
          <KPI icon={<TrendingUp size={18} />} label="Improvement" value={`+${improvement}%`} accent />
          <KPI icon={<CalendarCheck size={18} />} label="Attendance" value={`${attendancePct}%`} hint={`${s.attendance.present}/${s.attendance.total}`} />
          <KPI icon={<Award size={18} />} label="Achievements" value={String(s.achievements.length)} />
        </div>

        {/* Goals */}
        {s.goals && (
          <Reveal className="mt-5">
            <div className="card rounded-2xl p-6">
              <p className="eyebrow mb-2">Learning goals</p>
              <p className="text-mist">{s.goals}</p>
              {s.currentLevel && <p className="mt-2 text-sm text-ash">Current standing: <span className="text-cloud">{s.currentLevel}</span></p>}
            </div>
          </Reveal>
        )}

        {/* Progress dashboard */}
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {s.performance.length > 0 && (
            <Reveal>
              <Panel title="Subject progress" icon={<TrendingUp size={18} />}>
                <SubjectBarChart data={s.performance.map((p) => ({ subject: p.subject, current: p.level, baseline: p.baseline }))} />
                <p className="mt-3 text-xs text-ash">Sage = current level · faint = starting point</p>
              </Panel>
            </Reveal>
          )}
          {examTrend.length > 1 && (
            <Reveal delay={0.05}>
              <Panel title="Exam performance trend" icon={<FileText size={18} />}>
                <ExamTrendChart data={examTrend} />
              </Panel>
            </Reveal>
          )}
        </div>

        {/* Strengths & focus */}
        {(s.strengths.length > 0 || s.improvementAreas.length > 0) && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {s.strengths.length > 0 && (
              <Reveal><Panel title="Strengths" icon={<Sparkles size={18} />}>
                <div className="flex flex-wrap gap-2">{s.strengths.map((x) => <span key={x} className="chip border-success/20 text-success">{x}</span>)}</div>
              </Panel></Reveal>
            )}
            {s.improvementAreas.length > 0 && (
              <Reveal delay={0.05}><Panel title="Focus areas" icon={<Target size={18} />}>
                <div className="flex flex-wrap gap-2">{s.improvementAreas.map((x) => <span key={x} className="chip border-warning/20 text-warning">{x}</span>)}</div>
              </Panel></Reveal>
            )}
          </div>
        )}

        {/* Teacher feedback */}
        {s.feedback.length > 0 && (
          <Reveal className="mt-5">
            <Panel title="Teacher updates" icon={<MessageSquare size={18} />}>
              <div className="space-y-4">
                {s.feedback.map((f) => (
                  <div key={f.id} className="rounded-xl border border-line bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-cloud">{f.title}</p>
                      <span className="chip text-[11px] capitalize">{f.category}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{f.body}</p>
                    <p className="mt-2 text-xs text-ash">{formatDate(f.date)}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </Reveal>
        )}

        {/* Academic records */}
        {s.exams.length > 0 && (
          <Reveal className="mt-5">
            <Panel title="Exam results" icon={<FileText size={18} />}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ash">
                      <th className="pb-3 pr-4 font-medium">Exam</th>
                      <th className="pb-3 pr-4 font-medium">Subject</th>
                      <th className="pb-3 pr-4 font-medium">Date</th>
                      <th className="pb-3 pr-4 font-medium">Score</th>
                      <th className="pb-3 font-medium">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.exams.map((e) => (
                      <tr key={e.id} className="border-b border-line/50">
                        <td className="py-3 pr-4 font-medium text-cloud">{e.title}</td>
                        <td className="py-3 pr-4 text-mist">{e.subject}</td>
                        <td className="py-3 pr-4 text-ash">{formatDate(e.date)}</td>
                        <td className="py-3 pr-4 text-mist">{e.score}/{e.maxScore}</td>
                        <td className="py-3"><span className="chip border-sage-500/30 text-sage-200">{e.grade || `${Math.round((e.score / e.maxScore) * 100)}%`}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </Reveal>
        )}

        {/* Assignments */}
        {s.assignments.length > 0 && (
          <Reveal className="mt-5">
            <Panel title="Homework & assignments" icon={<CheckCircle2 size={18} />}>
              <div className="space-y-2">
                {s.assignments.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
                    <AssignmentIcon status={a.status} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-cloud">{a.title}</p>
                      <p className="text-xs capitalize text-ash">{a.type} · due {formatDate(a.dueDate)}</p>
                    </div>
                    {typeof a.score === "number" && <span className="text-sm font-semibold text-sage-200">{a.score}%</span>}
                    <span className={cn("chip text-[11px] capitalize", statusColor(a.status))}>{a.status}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </Reveal>
        )}

        {/* Achievements */}
        {s.achievements.length > 0 && (
          <Reveal className="mt-5">
            <Panel title="Achievements & milestones" icon={<Award size={18} />}>
              <div className="grid gap-3 sm:grid-cols-2">
                {s.achievements.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 rounded-xl border border-line bg-white/[0.02] p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sage-grad text-black"><Award size={18} /></span>
                    <div><p className="font-medium text-cloud">{a.title}</p><p className="text-xs text-ash">{a.description} · {a.year}</p></div>
                  </div>
                ))}
              </div>
            </Panel>
          </Reveal>
        )}

        {/* Growth timeline */}
        {timeline.length > 0 && (
          <Reveal className="mt-5">
            <Panel title="Growth timeline" icon={<Clock size={18} />}>
              <ol className="relative space-y-5 border-l border-line pl-6">
                {timeline.map((t) => (
                  <li key={t.id} className="relative">
                    <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-sage-400 ring-4 ring-base" />
                    <p className="text-xs text-sage-400">{formatDate(t.date)}</p>
                    <p className="font-medium text-cloud">{t.title}</p>
                    <p className="text-sm text-mist">{t.description}</p>
                  </li>
                ))}
              </ol>
            </Panel>
          </Reveal>
        )}

        <p className="mt-10 text-center text-xs text-ash">
          This is a private live report for {s.name}. Last updated {formatDate(s.updatedAt)} · {brandName}
        </p>
      </div>
    </div>
  );
}

function KPI({ icon, label, value, hint, accent }: { icon: React.ReactNode; label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className={cn("card rounded-2xl p-5", accent && "ring-1 ring-sage-500/30")}>
      <span className="text-sage-400">{icon}</span>
      <p className="mt-3 font-display text-2xl font-bold text-cloud">{value}</p>
      <p className="text-xs text-ash">{label}{hint ? ` · ${hint}` : ""}</p>
    </div>
  );
}
function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card h-full rounded-2xl p-6">
      <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-cloud"><span className="text-sage-400">{icon}</span>{title}</h2>
      {children}
    </div>
  );
}
function AssignmentIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 size={18} className="text-success" />;
  if (status === "pending") return <Clock size={18} className="text-warning" />;
  return <AlertCircle size={18} className="text-danger" />;
}
function statusColor(status: string) {
  return { completed: "border-success/20 text-success", pending: "border-warning/20 text-warning", late: "border-warning/20 text-warning", missing: "border-danger/20 text-danger" }[status] ?? "";
}
