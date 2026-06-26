import "server-only";
import {
  initializeApp,
  getApps,
  getApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let app: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const ADMIN_ENABLED = !!(projectId && clientEmail && privateKey);

if (ADMIN_ENABLED) {
  app = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
  adminDb = getFirestore(app);
  adminAuth = getAuth(app);
}

export { app, adminDb, adminAuth };
