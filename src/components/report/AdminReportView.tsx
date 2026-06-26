"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ParentReport } from "./ParentReport";
import type { Student } from "@/lib/types";

/** Owner-only view of a student's full progress report, reusing the exact
 *  parent-facing layout so the tutor can print/save it as a polished PDF. */
export function AdminReportView({ student }: { student: Student }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center text-ash">
        <div className="h-8 w-8 animate-spin-slow rounded-full border-2 border-white/20 border-t-white/70" />
      </div>
    );
  }

  return <ParentReport student={student} />;
}
