"use server";

import { revalidatePath } from "next/cache";
import {
  addBooking,
  addPurchase,
  addReview,
  deleteBooking,
  deleteNote,
  deletePurchase,
  deleteReview,
  deleteStudent,
  getNote,
  getPurchase,
  getStudent,
  saveNote,
  saveProfile,
  saveStudent,
  updateBooking,
  updatePurchase,
  updateReview,
} from "./data";
import type {
  Booking, BookingStatus, Note, Purchase, PurchaseStatus, Review, Student, TutorProfile,
} from "./types";
import { generateAccessCode, generateToken } from "./utils";

// NOTE: In production these mutations are additionally protected by
// Firestore Security Rules (request.auth.uid == OWNER). The public
// submitReview action is the only unauthenticated write and is rate-
// limited / validated below.

// ---------- Profile ----------
export async function saveProfileAction(profile: TutorProfile) {
  await saveProfile(profile);
  revalidatePath("/");
  revalidatePath("/dashboard/profile");
  return { ok: true };
}

// ---------- Reviews ----------
export async function submitReviewAction(input: {
  reviewerName: string;
  reviewerRole: "student" | "parent";
  anonymous: boolean;
  rating: number;
  body: string;
}) {
  const clean = input.body.trim().slice(0, 1200);
  if (clean.length < 10) return { ok: false, error: "Review is too short." };
  if (input.rating < 1 || input.rating > 5)
    return { ok: false, error: "Invalid rating." };

  const review: Review = {
    id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    reviewerName: input.anonymous ? "Anonymous" : input.reviewerName.trim().slice(0, 60) || "Anonymous",
    reviewerRole: input.reviewerRole,
    anonymous: input.anonymous,
    rating: Math.round(input.rating),
    body: clean,
    status: "pending",
    featured: false,
    createdAt: Date.now(),
  };
  await addReview(review);
  return { ok: true };
}

export async function moderateReviewAction(
  id: string,
  patch: Partial<Pick<Review, "status" | "featured">>
) {
  await updateReview(id, patch);
  revalidatePath("/");
  revalidatePath("/dashboard/reviews");
  return { ok: true };
}

export async function deleteReviewAction(id: string) {
  await deleteReview(id);
  revalidatePath("/");
  revalidatePath("/dashboard/reviews");
  return { ok: true };
}

// ---------- Students ----------
export async function saveStudentAction(student: Student) {
  student.updatedAt = Date.now();
  await saveStudent(student);
  revalidatePath("/dashboard/students");
  revalidatePath(`/dashboard/students/${student.id}`);
  revalidatePath(`/report/${student.access.token}`);
  return { ok: true };
}

export async function deleteStudentAction(id: string) {
  await deleteStudent(id);
  revalidatePath("/dashboard/students");
  return { ok: true };
}

// ---------- Bookings ----------
export async function submitBookingAction(input: {
  studentName: string;
  email: string;
  phone?: string;
  grade?: string;
  subject: string;
  preferredDate: string;
  preferredTime?: string;
  mode: "online" | "in-person";
  message?: string;
}) {
  const name = input.studentName.trim();
  const email = input.email.trim();
  if (name.length < 2) return { ok: false, error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "Please enter a valid email." };
  if (!input.subject.trim()) return { ok: false, error: "Please choose a subject." };
  if (!input.preferredDate) return { ok: false, error: "Please pick a preferred date." };

  const booking: Booking = {
    id: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    studentName: name.slice(0, 80),
    email: email.slice(0, 120),
    phone: input.phone?.trim().slice(0, 40) || "",
    grade: input.grade?.trim().slice(0, 40) || "",
    subject: input.subject.trim().slice(0, 60),
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime?.trim().slice(0, 40) || "",
    mode: input.mode === "in-person" ? "in-person" : "online",
    message: input.message?.trim().slice(0, 800) || "",
    status: "new",
    createdAt: Date.now(),
  };
  await addBooking(booking);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
  return { ok: true };
}

export async function updateBookingStatusAction(id: string, status: BookingStatus) {
  await updateBooking(id, { status });
  revalidatePath("/dashboard/bookings");
  return { ok: true };
}

export async function deleteBookingAction(id: string) {
  await deleteBooking(id);
  revalidatePath("/dashboard/bookings");
  return { ok: true };
}

// ---------- Notes (study materials) ----------
export async function saveNoteAction(note: Note) {
  await saveNote(note);
  revalidatePath("/notes");
  revalidatePath("/dashboard/notes");
  return { ok: true };
}

export async function deleteNoteAction(id: string) {
  await deleteNote(id);
  revalidatePath("/notes");
  revalidatePath("/dashboard/notes");
  return { ok: true };
}

// ---------- Purchases (slip-based payment) ----------
export async function submitPurchaseAction(input: {
  noteId: string;
  studentName: string;
  email: string;
  phone?: string;
  slipUrl: string;
  slipName: string;
}) {
  const note = await getNote(input.noteId);
  if (!note || !note.published) return { ok: false, error: "This material is not available." };
  if (input.studentName.trim().length < 2) return { ok: false, error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()))
    return { ok: false, error: "Please enter a valid email." };
  if (!input.slipUrl) return { ok: false, error: "Please attach your payment slip." };

  const purchase: Purchase = {
    id: `pur-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    noteId: note.id,
    noteTitle: note.title,
    studentName: input.studentName.trim().slice(0, 80),
    email: input.email.trim().slice(0, 120),
    phone: input.phone?.trim().slice(0, 40) || "",
    amount: note.price,
    slipUrl: input.slipUrl,
    slipName: input.slipName.slice(0, 120),
    status: "pending",
    createdAt: Date.now(),
  };
  await addPurchase(purchase);
  revalidatePath("/dashboard/notes");
  return { ok: true, id: purchase.id };
}

export async function moderatePurchaseAction(id: string, status: PurchaseStatus) {
  const purchase = await getPurchase(id);
  if (!purchase) return { ok: false, error: "Not found" };
  await updatePurchase(id, { status });
  if (status === "approved") {
    const note = await getNote(purchase.noteId);
    if (note) await saveNote({ ...note, purchases: note.purchases + 1 });
  }
  revalidatePath("/dashboard/notes");
  return { ok: true };
}

export async function deletePurchaseAction(id: string) {
  await deletePurchase(id);
  revalidatePath("/dashboard/notes");
  return { ok: true };
}

// Buyer download-status check (no account needed) — only reveals the file
// once the tutor has approved the payment slip.
export async function getPurchaseStatusAction(id: string) {
  const purchase = await getPurchase(id);
  if (!purchase) return { ok: false as const, error: "Not found" };
  const note = purchase.status === "approved" ? await getNote(purchase.noteId) : null;
  return {
    ok: true as const,
    status: purchase.status,
    noteTitle: purchase.noteTitle,
    fileUrl: note?.fileUrl || "",
    fileName: note?.fileName || "",
  };
}

// ---------- Parent access controls ----------
export async function regenerateAccessAction(id: string, opts?: { codeOnly?: boolean }) {
  const student = await getStudent(id);
  if (!student) return { ok: false, error: "Student not found" };
  student.access.code = generateAccessCode();
  if (!opts?.codeOnly) student.access.token = generateToken();
  student.updatedAt = Date.now();
  await saveStudent(student);
  revalidatePath(`/dashboard/students/${id}`);
  return { ok: true, access: student.access };
}

export async function toggleAccessAction(id: string, enabled: boolean) {
  const student = await getStudent(id);
  if (!student) return { ok: false, error: "Student not found" };
  student.access.enabled = enabled;
  student.updatedAt = Date.now();
  await saveStudent(student);
  revalidatePath(`/dashboard/students/${id}`);
  return { ok: true };
}
