"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/dashboard/ui";
import { StudentEditor } from "@/components/dashboard/StudentEditor";
import { blankStudent } from "@/lib/factories";

export default function NewStudentPage() {
  const initial = useMemo(() => blankStudent(), []);
  return (
    <div>
      <PageHeader title="Add student" back={{ href: "/dashboard/students", label: "Back to students" }} />
      <StudentEditor initial={initial} isNew />
    </div>
  );
}
