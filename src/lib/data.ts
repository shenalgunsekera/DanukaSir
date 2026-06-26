import "server-only";
import { adminDb, ADMIN_ENABLED } from "./firebase-admin";
import { demoDB } from "./store";
import type { Booking, Note, Purchase, Review, Student, TutorProfile } from "./types";
import { SEED_PROFILE } from "./seed-data";

// ─────────────────────────────────────────────────────────────
//  Unified data access. Routes to Firestore (Admin SDK) when
//  credentials exist, otherwise the in-memory demo store.
// ─────────────────────────────────────────────────────────────

const PROFILE_DOC = "profile/main";

// ---------- Profile ----------
export async function getProfile(): Promise<TutorProfile> {
  if (ADMIN_ENABLED && adminDb) {
    const snap = await adminDb.doc(PROFILE_DOC).get();
    if (snap.exists) return { ...SEED_PROFILE, ...(snap.data() as TutorProfile) };
    return SEED_PROFILE;
  }
  return demoDB().profile;
}

export async function saveProfile(profile: TutorProfile): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    await adminDb.doc(PROFILE_DOC).set(profile, { merge: true });
    return;
  }
  demoDB().profile = profile;
}

// ---------- Reviews ----------
export async function getReviews(): Promise<Review[]> {
  if (ADMIN_ENABLED && adminDb) {
    const snap = await adminDb.collection("reviews").orderBy("createdAt", "desc").get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Review, "id">) }));
  }
  return [...demoDB().reviews].sort((a, b) => b.createdAt - a.createdAt);
}

export async function getPublicReviews(): Promise<Review[]> {
  const all = await getReviews();
  return all.filter((r) => r.status === "approved");
}

export async function addReview(review: Review): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    const { id, ...rest } = review;
    await adminDb.collection("reviews").doc(id).set(rest);
    return;
  }
  demoDB().reviews.unshift(review);
}

export async function updateReview(id: string, patch: Partial<Review>): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    await adminDb.collection("reviews").doc(id).set(patch, { merge: true });
    return;
  }
  const r = demoDB().reviews.find((x) => x.id === id);
  if (r) Object.assign(r, patch);
}

export async function deleteReview(id: string): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    await adminDb.collection("reviews").doc(id).delete();
    return;
  }
  demoDB().reviews = demoDB().reviews.filter((x) => x.id !== id);
}

// ---------- Students ----------
export async function getStudents(): Promise<Student[]> {
  if (ADMIN_ENABLED && adminDb) {
    const snap = await adminDb.collection("students").orderBy("updatedAt", "desc").get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Student, "id">) }));
  }
  return [...demoDB().students].sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getStudent(id: string): Promise<Student | null> {
  if (ADMIN_ENABLED && adminDb) {
    const snap = await adminDb.collection("students").doc(id).get();
    return snap.exists ? ({ id: snap.id, ...(snap.data() as Omit<Student, "id">) }) : null;
  }
  return demoDB().students.find((s) => s.id === id) ?? null;
}

export async function saveStudent(student: Student): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    const { id, ...rest } = student;
    await adminDb.collection("students").doc(id).set(rest, { merge: true });
    return;
  }
  const list = demoDB().students;
  const idx = list.findIndex((s) => s.id === student.id);
  if (idx >= 0) list[idx] = student;
  else list.unshift(student);
}

export async function deleteStudent(id: string): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    await adminDb.collection("students").doc(id).delete();
    return;
  }
  demoDB().students = demoDB().students.filter((s) => s.id !== id);
}

// ---------- Bookings ----------
export async function getBookings(): Promise<Booking[]> {
  if (ADMIN_ENABLED && adminDb) {
    const snap = await adminDb.collection("bookings").orderBy("createdAt", "desc").get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Booking, "id">) }));
  }
  return [...demoDB().bookings].sort((a, b) => b.createdAt - a.createdAt);
}

export async function addBooking(booking: Booking): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    const { id, ...rest } = booking;
    await adminDb.collection("bookings").doc(id).set(rest);
    return;
  }
  demoDB().bookings.unshift(booking);
}

export async function updateBooking(id: string, patch: Partial<Booking>): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    await adminDb.collection("bookings").doc(id).set(patch, { merge: true });
    return;
  }
  const b = demoDB().bookings.find((x) => x.id === id);
  if (b) Object.assign(b, patch);
}

export async function deleteBooking(id: string): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    await adminDb.collection("bookings").doc(id).delete();
    return;
  }
  demoDB().bookings = demoDB().bookings.filter((x) => x.id !== id);
}

// ---------- Notes (study materials shop) ----------
export async function getNotes(): Promise<Note[]> {
  if (ADMIN_ENABLED && adminDb) {
    const snap = await adminDb.collection("notes").orderBy("createdAt", "desc").get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Note, "id">) }));
  }
  return [...demoDB().notes].sort((a, b) => b.createdAt - a.createdAt);
}

export async function getPublishedNotes(): Promise<Note[]> {
  return (await getNotes()).filter((n) => n.published);
}

export async function getNote(id: string): Promise<Note | null> {
  if (ADMIN_ENABLED && adminDb) {
    const snap = await adminDb.collection("notes").doc(id).get();
    return snap.exists ? { id: snap.id, ...(snap.data() as Omit<Note, "id">) } : null;
  }
  return demoDB().notes.find((n) => n.id === id) ?? null;
}

export async function saveNote(note: Note): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    const { id, ...rest } = note;
    await adminDb.collection("notes").doc(id).set(rest, { merge: true });
    return;
  }
  const list = demoDB().notes;
  const i = list.findIndex((n) => n.id === note.id);
  if (i >= 0) list[i] = note;
  else list.unshift(note);
}

export async function deleteNote(id: string): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    await adminDb.collection("notes").doc(id).delete();
    return;
  }
  demoDB().notes = demoDB().notes.filter((n) => n.id !== id);
}

// ---------- Purchases ----------
export async function getPurchases(): Promise<Purchase[]> {
  if (ADMIN_ENABLED && adminDb) {
    const snap = await adminDb.collection("purchases").orderBy("createdAt", "desc").get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Purchase, "id">) }));
  }
  return [...demoDB().purchases].sort((a, b) => b.createdAt - a.createdAt);
}

export async function getPurchase(id: string): Promise<Purchase | null> {
  if (ADMIN_ENABLED && adminDb) {
    const snap = await adminDb.collection("purchases").doc(id).get();
    return snap.exists ? { id: snap.id, ...(snap.data() as Omit<Purchase, "id">) } : null;
  }
  return demoDB().purchases.find((p) => p.id === id) ?? null;
}

export async function addPurchase(purchase: Purchase): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    const { id, ...rest } = purchase;
    await adminDb.collection("purchases").doc(id).set(rest);
    return;
  }
  demoDB().purchases.unshift(purchase);
}

export async function updatePurchase(id: string, patch: Partial<Purchase>): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    await adminDb.collection("purchases").doc(id).set(patch, { merge: true });
    return;
  }
  const p = demoDB().purchases.find((x) => x.id === id);
  if (p) Object.assign(p, patch);
}

export async function deletePurchase(id: string): Promise<void> {
  if (ADMIN_ENABLED && adminDb) {
    await adminDb.collection("purchases").doc(id).delete();
    return;
  }
  demoDB().purchases = demoDB().purchases.filter((x) => x.id !== id);
}

// ---------- Parent access (by token) ----------
export async function getStudentByToken(token: string): Promise<Student | null> {
  if (ADMIN_ENABLED && adminDb) {
    const snap = await adminDb
      .collection("students")
      .where("access.token", "==", token)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...(d.data() as Omit<Student, "id">) };
  }
  return demoDB().students.find((s) => s.access.token === token) ?? null;
}

export async function recordParentView(id: string): Promise<void> {
  const student = await getStudent(id);
  if (!student) return;
  const patch = {
    access: {
      ...student.access,
      lastViewedAt: Date.now(),
      viewCount: student.access.viewCount + 1,
    },
  };
  if (ADMIN_ENABLED && adminDb) {
    await adminDb.collection("students").doc(id).set(patch, { merge: true });
    return;
  }
  const s = demoDB().students.find((x) => x.id === id);
  if (s) s.access = patch.access;
}
