import Link from "next/link";
import {
  Users, UserCheck, Star, Eye, TrendingUp, Award, ArrowRight, Clock, Plus, CalendarCheck,
} from "lucide-react";
import { getBookings, getProfile, getReviews, getStudents } from "@/lib/data";
import { PageHeader, StatCard, SectionCard } from "@/components/dashboard/ui";
import { Avatar } from "@/components/ui/Avatar";
import { average, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const [profile, students, reviews, bookings] = await Promise.all([
    getProfile(),
    getStudents(),
    getReviews(),
    getBookings(),
  ]);
  const newBookings = bookings.filter((b) => b.status === "new").length;

  const active = students.filter((s) => s.status === "active");
  const pendingReviews = reviews.filter((r) => r.status === "pending");
  const approvedReviews = reviews.filter((r) => r.status === "approved");
  const avgRating = average(approvedReviews.map((r) => r.rating)) || 5;
  const totalViews = students.reduce((a, s) => a + s.access.viewCount, 0);

  const improvements = students.flatMap((s) =>
    s.performance.map((p) => p.level - p.baseline)
  );
  const avgImprovement = average(improvements);

  const recentAchievements = students
    .flatMap((s) => s.achievements.map((a) => ({ ...a, student: s.name })))
    .slice(0, 4);

  const recentlyViewed = [...students]
    .filter((s) => s.access.lastViewedAt)
    .sort((a, b) => (b.access.lastViewedAt ?? 0) - (a.access.lastViewedAt ?? 0))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${profile.name}`}
        subtitle="Here's how your tutoring practice is performing."
        action={
          <Link href="/dashboard/students/new" className="btn-gold !py-2.5">
            <Plus size={16} /> Add student
          </Link>
        }
      />

      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={students.length} icon={<Users size={18} />} accent />
        <StatCard label="Active Students" value={active.length} icon={<UserCheck size={18} />} />
        <StatCard label="Avg. Rating" value={avgRating.toFixed(1)} icon={<Star size={18} />} hint={`${approvedReviews.length} approved reviews`} />
        <StatCard label="Report Views" value={totalViews} icon={<Eye size={18} />} hint="by parents" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg. Improvement" value={`+${avgImprovement}%`} icon={<TrendingUp size={18} />} hint="vs. baseline" />
        <StatCard label="Pending Reviews" value={pendingReviews.length} icon={<Clock size={18} />} hint="awaiting approval" />
        <StatCard label="Achievements" value={students.reduce((a, s) => a + s.achievements.length, 0)} icon={<Award size={18} />} />
        <StatCard label="New Requests" value={newBookings} icon={<CalendarCheck size={18} />} hint="consultations" accent={newBookings > 0} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent parent views */}
        <SectionCard
          title="Recent parent activity"
          action={<Link href="/dashboard/students" className="text-sm text-sage-400 hover:text-sage-200">View all</Link>}
        >
          {recentlyViewed.length ? (
            <ul className="space-y-3">
              {recentlyViewed.map((s) => (
                <li key={s.id}>
                  <Link href={`/dashboard/students/${s.id}`} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5">
                    <Avatar name={s.name} src={s.image} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-cloud">{s.name}</p>
                      <p className="text-xs text-ash">{s.parentName ?? "Parent"} viewed the report</p>
                    </div>
                    <span className="text-xs text-ash">{timeAgo(s.access.lastViewedAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-ash">No parent views yet.</p>
          )}
        </SectionCard>

        {/* Recent achievements */}
        <SectionCard
          title="Recent achievements"
          action={pendingReviews.length > 0 ? <Link href="/dashboard/reviews" className="text-sm text-sage-400 hover:text-sage-200">{pendingReviews.length} reviews to approve →</Link> : undefined}
        >
          {recentAchievements.length ? (
            <ul className="space-y-3">
              {recentAchievements.map((a) => (
                <li key={a.id + a.student} className="flex items-start gap-3 rounded-xl border border-line bg-white/[0.02] p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sage-grad text-black">
                    <Award size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-cloud">{a.title}</p>
                    <p className="text-xs text-ash">{a.student} · {a.year}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-ash">No achievements logged yet.</p>
          )}
        </SectionCard>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/dashboard/bookings", label: "Consultation requests", desc: "Review & schedule bookings", icon: CalendarCheck },
          { href: "/dashboard/students", label: "Manage students", desc: "Profiles, progress & feedback", icon: Users },
          { href: "/dashboard/reviews", label: "Moderate reviews", desc: "Approve, feature or remove", icon: Star },
        ].map((q) => (
          <Link key={q.href} href={q.href} className="card group flex items-center gap-4 rounded-2xl p-5 transition-transform hover:-translate-y-0.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-sage-500/10 text-sage-400"><q.icon size={20} /></span>
            <div className="flex-1">
              <p className="font-medium text-cloud">{q.label}</p>
              <p className="text-xs text-ash">{q.desc}</p>
            </div>
            <ArrowRight size={16} className="text-ash transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
