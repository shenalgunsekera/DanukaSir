import { NextResponse } from "next/server";
import { ADMIN_ENABLED } from "@/lib/firebase-admin";
import { saveProfile, addReview, saveStudent } from "@/lib/data";
import { SEED_PROFILE, SEED_REVIEWS, SEED_STUDENTS } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

// One-time seeding of Firestore with Danuka's starter content.
// Protect with SEED_SECRET in your env, then call:
//   POST /api/seed?secret=YOUR_SECRET
export async function POST(req: Request) {
  if (!ADMIN_ENABLED) {
    return NextResponse.json(
      { ok: false, error: "Firebase Admin not configured. App is in demo mode." },
      { status: 400 }
    );
  }

  const secret = new URL(req.url).searchParams.get("secret");
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  await saveProfile(SEED_PROFILE);
  for (const r of SEED_REVIEWS) await addReview(r);
  for (const s of SEED_STUDENTS) await saveStudent(s);

  return NextResponse.json({
    ok: true,
    seeded: { profile: 1, reviews: SEED_REVIEWS.length, students: SEED_STUDENTS.length },
  });
}
