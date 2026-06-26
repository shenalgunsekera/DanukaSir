# Firebase Setup Guide

This connects the platform to a real Firebase backend. Skip it entirely to keep
running in **demo mode** (seeded in-memory data).

## 1. Create a project
1. Go to <https://console.firebase.google.com> → **Add project**.
2. Once created, add a **Web app** (`</>`) to get your config.

## 2. Enable services
- **Authentication** → Sign-in method → enable **Email/Password**.
  Then **Users → Add user** and create the tutor account (e.g.
  `adeesha@yourdomain.com`). This is the only account that can sign in.
- **Firestore Database** → Create database (Production mode).
- **Storage** → Get started.

## 3. Client env vars
From **Project settings → General → Your apps → SDK setup**, copy values into
`.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_OWNER_EMAIL=adeesha@yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 4. Admin (server) credentials
**Project settings → Service accounts → Generate new private key**. From the
downloaded JSON:

```bash
FIREBASE_ADMIN_PROJECT_ID=your-project
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
SEED_SECRET=choose-a-long-random-string
```

> Keep the `\n` escape sequences in the private key and wrap it in quotes.

## 5. Lock rules to the owner email
In **`firestore.rules`** and **`storage.rules`**, replace
`adeesha@example.com` with the real owner email (twice — once per file).

Deploy with the Firebase CLI:

```bash
npm i -g firebase-tools
firebase login
firebase use your-project
firebase deploy --only firestore:rules,storage
```

## 6. Seed starter content (optional)
With the app running and admin env set:

```bash
curl -X POST "http://localhost:3000/api/seed?secret=YOUR_SEED_SECRET"
```

This writes Adeesha's profile, sample reviews, and demo students to Firestore.
Run it once, then remove/rotate `SEED_SECRET`.

## 7. Verify
- Visit `/login` and sign in with the tutor account.
- The login screen no longer shows the "Demo mode" banner.
- Create a student, open **Parent Access**, copy the link + code, and open it in
  an incognito window to confirm the parent flow.

## Data model (Firestore)
```
profile/main          → TutorProfile
reviews/{id}          → Review        (public reads approved only)
students/{id}         → Student        (owner-only; parents via Admin SDK)
```

## Storage layout
```
profile/...           → tutor images (public read, owner write)
students/...          → student images (public read, owner write)
```
