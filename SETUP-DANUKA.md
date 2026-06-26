# Danuka Tutor Platform — Setup

A duplicate of the tutor platform, configured for:

- **Firestore** as the database (free Spark tier) — all students, reviews,
  bookings, notes, purchases and the profile persist in the cloud.
- **A free local folder file store** for images & documents — uploads are
  written to `public/uploads/` and served at `/uploads/...`. **No Firebase
  Storage and no billing required.**

Until Firebase credentials are added it runs in **demo mode** (in-memory seeded
data), so you can preview everything immediately.

---

## 1. Install & run (demo mode)

```bash
npm install
npm run dev      # http://localhost:3000
```

Dashboard login (demo): `danuka@example.com` + any password.

---

## 2. Connect Firestore (makes data permanent)

1. Go to <https://console.firebase.google.com> → **Add project** (free).
2. In the project, open **Build → Firestore Database → Create database**
   (Start in production mode; pick a region). This is on the free plan.
3. Open **Project settings (gear) → Service accounts → Generate new private
   key**. A JSON file downloads.
4. Open that JSON and copy three values into **`.env.local`**:
   - `project_id`   → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key`  → `FIREBASE_ADMIN_PRIVATE_KEY` (keep the quotes and the
     `\n` sequences exactly as in the JSON)
5. Restart the app (`npm run dev`). It now reads/writes Firestore.

### Seed the starter content (once)
With the app running and `SEED_SECRET` set in `.env.local`:

```bash
curl -X POST "http://localhost:3000/api/seed?secret=YOUR_SEED_SECRET"
```

This writes Danuka's sample profile, reviews and students into Firestore.

> Storage is **not** used. You do **not** need to enable Firebase Storage or a
> billing account. Uploaded files live in `public/uploads/`.

---

## 3. Files & uploads (the free folder store)

- Upload endpoint: `POST /api/upload` (multipart `file` + `folder`).
- Saved under `public/uploads/<folder>/` with a random, unguessable filename.
- Allowed folders: `notes`, `previews`, `slips`, `images`.
- Paid note files use a random token in the path and are only revealed after
  you approve the payment slip — same privacy model as before.

**Note on hosting:** because files are written to the local disk, deploy on a
host with a persistent filesystem (a normal Node server / VPS, Render, Railway,
a VM). Fully serverless hosts (e.g. Vercel) have an ephemeral/read-only disk and
would lose uploads — use a VPS-style host for this folder-store build.

---

## 4. Build for production

```bash
npm run build
npm start        # serves on port 3000 (set PORT to change)
```
