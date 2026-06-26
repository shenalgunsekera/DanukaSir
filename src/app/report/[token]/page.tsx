import type { Metadata } from "next";
import { getStudentByToken } from "@/lib/data";
import { ReportGate } from "@/components/report/ReportGate";

export const dynamic = "force-dynamic";

// Private reports must never be indexed.
export const metadata: Metadata = {
  title: "Private Progress Report",
  robots: { index: false, follow: false },
};

export default async function ReportPage({ params }: { params: { token: string } }) {
  // Only check existence/enabled here — no private data leaves the server
  // until the parent enters the correct access code (validated server-side).
  const student = await getStudentByToken(params.token);
  return (
    <ReportGate
      token={params.token}
      exists={!!student}
      enabled={!!student?.access.enabled}
    />
  );
}
