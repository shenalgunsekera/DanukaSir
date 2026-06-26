# Adeesha — Premium Tutor Platform

A production-grade, full-stack **tutor portfolio + student progress management
platform** built with **Next.js 14**, **Node.js (server actions / route
handlers)**, and **Firebase** (Auth, Firestore, Storage).

It gives a professional tutor a luxury public brand website, a secure admin
dashboard to manage students and reviews, and a **live, code-protected progress
report** that parents can open anytime — no account required.

> **Runs instantly in demo mode.** Without Firebase credentials the app uses
> rich seeded data so you can explore every screen. Add credentials to go live.

---

## ✨ Features

### Public website (personal brand)
- Cinematic luxury **black + gold** theme, glassmorphism, smooth motion
- Hero with tutor photo, headline & floating stats
- About: biography, teaching philosophy, approach, methods
- Animated **statistics** band (students taught, years, success rate…)
- **Student success showcase** with from→to grade transformations
- **Credentials**: qualifications, certifications, awards, achievements
- **Career milestone** timeline
- **Reviews & testimonials** carousel (5-star, students & parents)
- Public **review submission** (goes to a moderation queue)
- Contact / booking call-to-action
- SEO metadata, responsive & accessible, reduced-motion aware

### Tutor dashboard (secure admin)
- Email/password login (Firebase Auth; demo gate in demo mode)
- **Analytics overview**: students, active, avg rating, report views,
  average improvement, pending reviews, achievements
- **Profile & site editor** with live homepage customization:
  identity, story, credentials, showcase, and **section show/hide toggles**
- **Reviews moderation**: approve / reject / delete / feature on homepage
- **Student management** (full CRUD) with tabbed editor:
  - Profile & parent info
  - Learning profile (goals, level, strengths, weaknesses, focus areas)
  - Performance (per-subject level vs. baseline, attendance)
  - Records (exam results, homework/assignments)
  - Teacher feedback (monthly, observations, behaviour, recommendations…)
  - Achievements & growth timeline
  - **Parent access controls**

### Live parent progress report
- Every student gets a **permanent private link** + **access code**
- Flow: tutor creates student → system generates secure link & code →
  tutor shares them → parent opens link → enters code → sees live report
- Parents **do not need an account**
- Report includes: overview, KPIs, subject progress chart, exam trend chart,
  strengths/focus, teacher updates, exam table, assignments, achievements,
  growth timeline, and **print/PDF export**
- **Updates automatically** whenever the tutor edits the student
- Tutor can **regenerate code**, **regenerate link**, **disable/enable** access,
  and see **view count + last viewed**

---

## 🚀 Quick start

```bash
npm install
cp .env.example .env.local   # optional — skip to run in demo mode
npm run dev
```

Open <http://localhost:3000>.

- **Public site:** `/`
- **Tutor login:** `/login` — in demo mode, sign in with the email in
  `NEXT_PUBLIC_OWNER_EMAIL` (default `adeesha@example.com`) and **any** password
- **Dashboard:** `/dashboard`
- **Parent report (demo):** open a student in the dashboard → *Parent Access* →
  copy the link & code, or try token `demo-token-nethmi-progress` with code
  `K7M-4QPZ` at `/report/demo-token-nethmi-progress`

### Add Adeesha's photo
Save the portrait to `public/images/adeesha.jpg`. Until then an elegant gold
monogram is shown. See [`public/images/README.md`](public/images/README.md).

---

## 🔥 Going live with Firebase

See **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** for the full walkthrough. In short:

1. Create a Firebase project; enable **Authentication (Email/Password)**,
   **Firestore**, and **Storage**.
2. Create the tutor login user in Authentication.
3. Copy the web config into `.env.local` (`NEXT_PUBLIC_FIREBASE_*`).
4. Generate a service-account key → set `FIREBASE_ADMIN_*`.
5. Set `NEXT_PUBLIC_OWNER_EMAIL` to the tutor's login email, and update the
   same email inside `firestore.rules` and `storage.rules`.
6. Deploy rules: `firebase deploy --only firestore:rules,storage`.
7. Seed starter data: `POST /api/seed?secret=$SEED_SECRET`.

The app automatically switches from demo mode to Firebase once the
`NEXT_PUBLIC_FIREBASE_*` keys are present.

---

## 🏗️ Architecture

```
src/
  app/
    page.tsx                 # public homepage (server component)
    login/                   # tutor auth
    dashboard/               # protected admin (overview, students, reviews, profile)
    report/[token]/          # parent report gate → live report
    api/seed/                # one-time Firestore seeding
  components/
    site/                    # public homepage sections
    dashboard/               # admin UI (editors, lists, shell)
    report/                  # parent report + access gate
    ui/                      # design-system primitives
  lib/
    firebase.ts              # client SDK (lazy, demo-aware)
    firebase-admin.ts        # admin SDK (server)
    data.ts                  # unified data access (Firestore ↔ demo store)
    actions.ts               # server actions (owner mutations)
    report-actions.ts        # parent code validation (server)
    auth-context.tsx         # auth provider (Firebase + demo gate)
    types.ts / seed-data.ts  # domain model + seed content
firestore.rules / storage.rules
```

**Security model**
- The tutor is the only authenticated user. Owner-only writes are enforced by
  Firestore/Storage rules keyed to the owner email.
- Students are fully locked in rules. **Parents never authenticate** — the
  server validates `token + code` via the Admin SDK and only then returns the
  child's data. Private links carry `noindex`.
- Public visitors can read the profile + approved reviews and submit a *pending*
  review; they can never read others' pending reviews or any student data.

## 🧰 Tech
Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS ·
Framer Motion · Recharts · Firebase (Auth/Firestore/Storage) · firebase-admin.

## 📜 Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint
# DanukaSir
