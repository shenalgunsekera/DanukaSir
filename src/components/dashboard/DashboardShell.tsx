"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Star,
  CalendarCheck,
  FileText,
  UserCircle,
  LogOut,
  GraduationCap,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { useBrand } from "@/lib/brand";
import { LanguageToggle } from "@/components/site/LanguageToggle";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/students", label: "Students", icon: Users },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/dashboard/notes", label: "Notes & Materials", icon: FileText },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/profile", label: "Profile & Site", icon: UserCircle },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, loading, signOut, demoMode } = useAuth();
  const { name } = useBrand();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => setOpen(false), [pathname]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-3 text-ash">
          <div className="h-8 w-8 animate-spin-slow rounded-full border-2 border-sage-500/30 border-t-sage-400" />
          <p className="text-sm">Loading your portal…</p>
        </div>
      </div>
    );
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2.5 px-2 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-sage-grad text-black">
          <GraduationCap size={18} />
        </span>
        <div>
          <p className="font-display text-base font-semibold leading-none text-cloud">{name}</p>
          <p className="text-[11px] text-ash">Tutor Portal</p>
        </div>
      </Link>

      <nav className="mt-4 flex-1 space-y-1">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sage-500/10 text-sage-100 ring-1 ring-sage-500/20"
                  : "text-mist hover:bg-white/5 hover:text-cloud"
              )}
            >
              <item.icon size={18} className={active ? "text-sage-400" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-line pt-3">
        <div className="px-1 pb-1">
          <LanguageToggle className="w-full justify-center !py-2.5" />
        </div>
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-mist hover:bg-white/5 hover:text-cloud">
          <ExternalLink size={18} /> View public site
        </Link>
        <button
          onClick={() => { signOut(); router.replace("/login"); }}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-mist hover:bg-danger/10 hover:text-danger"
        >
          <LogOut size={18} /> Sign out
        </button>
        <div className="px-3.5 pt-2 text-[11px] text-ash">
          <p className="truncate">{user.email}</p>
          {demoMode && (
            <span className="mt-1 inline-flex items-center gap-1 text-sage-400">
              <ShieldCheck size={11} /> Demo mode
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-line bg-ink/60 px-4 py-3 backdrop-blur-xl lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-line bg-ink/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-sage-grad text-black">
            <GraduationCap size={16} />
          </span>
          <span className="font-display font-semibold text-cloud">Portal</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-cloud" aria-label="Open menu">
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <aside className="glass-strong absolute left-0 top-0 h-full w-72 px-4 py-3">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 text-ash" aria-label="Close menu">
              <X size={20} />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      <main className="min-w-0 flex-1 px-5 pb-16 pt-20 sm:px-8 lg:pt-8">{children}</main>
    </div>
  );
}
