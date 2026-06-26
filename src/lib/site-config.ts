export const SITE = {
  tutorName: "Danuka",
  tagline: "Premium Private Tutoring & Mentorship",
  description:
    "Danuka is a results-driven private tutor helping students transform their academic performance through personalised mentorship, structured progress tracking, and exam mastery.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ownerEmail: process.env.NEXT_PUBLIC_OWNER_EMAIL || "danuka@example.com",
};

/** Whether real Firebase credentials are configured. When false the app
 *  runs in DEMO MODE using locally seeded data so the UI is fully previewable. */
export const FIREBASE_ENABLED =
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
