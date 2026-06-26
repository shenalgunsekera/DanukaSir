import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStudent } from "@/lib/data";
import { AdminReportView } from "@/components/report/AdminReportView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Progress Report Card",
  robots: { index: false, follow: false },
};

export default async function ReportCardPage({ params }: { params: { id: string } }) {
  const student = await getStudent(params.id);
  if (!student) notFound();
  return <AdminReportView student={student} />;
}
