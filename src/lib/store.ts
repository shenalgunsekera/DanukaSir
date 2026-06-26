import "server-only";
import type { Booking, Note, Purchase, Review, Student, TutorProfile } from "./types";
import { SEED_NOTES, SEED_PROFILE, SEED_REVIEWS, SEED_STUDENTS } from "./seed-data";

// ─────────────────────────────────────────────────────────────
//  In-memory demo store (used when Firebase Admin is not configured).
//  Persists for the lifetime of the dev server process so the full
//  product — including mutations — is testable without credentials.
// ─────────────────────────────────────────────────────────────

interface DemoDB {
  profile: TutorProfile;
  reviews: Review[];
  students: Student[];
  bookings: Booking[];
  notes: Note[];
  purchases: Purchase[];
}

declare global {
  // eslint-disable-next-line no-var
  var __TUTOR_DEMO_DB__: DemoDB | undefined;
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

export function demoDB(): DemoDB {
  if (!global.__TUTOR_DEMO_DB__) {
    global.__TUTOR_DEMO_DB__ = {
      profile: clone(SEED_PROFILE),
      reviews: clone(SEED_REVIEWS),
      students: clone(SEED_STUDENTS),
      bookings: [],
      notes: clone(SEED_NOTES),
      purchases: [],
    };
  }
  // Backfill collections/fields added after a store was first created
  // (the store lives in a global and survives hot reloads).
  const db = global.__TUTOR_DEMO_DB__;
  if (!Array.isArray(db.reviews)) db.reviews = clone(SEED_REVIEWS);
  if (!Array.isArray(db.students)) db.students = clone(SEED_STUDENTS);
  if (!Array.isArray(db.bookings)) db.bookings = [];
  if (!Array.isArray(db.notes)) db.notes = clone(SEED_NOTES);
  if (!Array.isArray(db.purchases)) db.purchases = [];
  if (!db.profile) db.profile = clone(SEED_PROFILE);
  if (!db.profile.theme) db.profile.theme = clone(SEED_PROFILE.theme);
  if (!db.profile.availability) db.profile.availability = clone(SEED_PROFILE.availability);
  if (!db.profile.bankDetails) db.profile.bankDetails = clone(SEED_PROFILE.bankDetails);
  return db;
}
