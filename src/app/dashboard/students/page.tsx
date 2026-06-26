import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { getStudents } from "@/lib/data";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";
import { StudentsList } from "@/components/dashboard/StudentsList";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={`${students.length} student${students.length === 1 ? "" : "s"} in your practice`}
        action={
          <Link href="/dashboard/students/new" className="btn-gold !py-2.5">
            <Plus size={16} /> Add student
          </Link>
        }
      />
      {students.length === 0 ? (
        <EmptyState
          icon={<Users size={26} />}
          title="No students yet"
          body="Create your first student profile to start tracking progress and sharing live reports with parents."
          action={<Link href="/dashboard/students/new" className="btn-gold"><Plus size={16} /> Add your first student</Link>}
        />
      ) : (
        <StudentsList students={students} />
      )}
    </div>
  );
}
