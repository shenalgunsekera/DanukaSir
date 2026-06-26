import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  action,
  back,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-8">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex items-center gap-1.5 text-sm text-ash transition-colors hover:text-cloud">
          <ChevronLeft size={16} /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-mist">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  accent,
  hint,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  accent?: boolean;
  hint?: string;
}) {
  return (
    <div className={cn("card rounded-2xl p-5", accent && "ring-1 ring-sage-500/20")}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-ash">{label}</p>
        {icon && <span className="text-sage-400">{icon}</span>}
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-cloud">{value}</p>
      {hint && <p className="mt-1 text-xs text-ash">{hint}</p>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center rounded-3xl px-6 py-16 text-center">
      {icon && <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-sage-500/10 text-sage-400">{icon}</div>}
      <h3 className="font-display text-lg font-semibold text-cloud">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-sm text-mist">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SectionCard({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("card rounded-2xl p-6", className)}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between">
          {title && <h2 className="font-display text-lg font-semibold text-cloud">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
