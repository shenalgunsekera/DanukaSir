import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/ui";
import { StudentEditor } from "@/components/dashboard/StudentEditor";
import { getStudent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  const student = await getStudent(params.id);
  if (!student) notFound();

  return (
    <div>
      <PageHeader title="Student profile" back={{ href: "/dashboard/students", label: "Back to students" }} />
      <StudentEditor initial={student} isNew={false} />
    </div>
  );
}
