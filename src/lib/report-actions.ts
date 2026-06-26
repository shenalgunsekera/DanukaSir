"use server";

import { getStudentByToken, recordParentView } from "./data";
import type { Student } from "./types";

export interface ReportResult {
  ok: boolean;
  error?: string;
  student?: Student;
}

/** Server-side validation of the parent access code for a given private
 *  token. Student data is only ever returned after the code matches and
 *  access is enabled — it is never sent to the client beforehand. */
export async function unlockReportAction(token: string, code: string): Promise<ReportResult> {
  const student = await getStudentByToken(token);
  if (!student) return { ok: false, error: "This report link is invalid." };
  if (!student.access.enabled) return { ok: false, error: "Access to this report is currently disabled. Please contact the tutor." };

  const normalised = code.trim().toUpperCase().replace(/\s/g, "");
  const expected = student.access.code.toUpperCase();
  if (normalised !== expected) return { ok: false, error: "Incorrect access code. Please check and try again." };

  await recordParentView(student.id);
  return { ok: true, student: { ...student, access: { ...student.access, viewCount: student.access.viewCount + 1 } } };
}

/** Lightweight existence/enabled check for the landing gate — returns no
 *  private data, only whether a code prompt should be shown. */
export async function checkReportTokenAction(token: string): Promise<{ exists: boolean; enabled: boolean }> {
  const student = await getStudentByToken(token);
  if (!student) return { exists: false, enabled: false };
  return { exists: true, enabled: student.access.enabled };
}
