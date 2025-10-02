/**
 * Firebase Admin bootstrap (shared by CLI scripts)
 * ------------------------------------------------
 * - Initializes Firebase Admin SDK exactly once.
 * - Authenticates with `scripts/serviceAccountKey.json` (gitignored).
 * - Exports Firestore helpers for convenient reuse.
 *
 * Usage:
 *   import { db, FieldValue, Timestamp } from "../admin";
 */

import admin, { ServiceAccount } from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

/** Absolute path to the local service account key */
const SERVICE_ACCOUNT_PATH = path.resolve(
  __dirname,
  "./serviceAccountKey.json",
);

/** Initialize Admin SDK only once (idempotent) */
function initAdmin(): void {
  if (admin.apps.length) return;

  // Load service account key from local file (recommended for local/one-off scripts)
  const credentialsJson = readFileSync(SERVICE_ACCOUNT_PATH, "utf-8");
  const serviceAccount = JSON.parse(credentialsJson) as ServiceAccount;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ---- Bootstrap & exports ----------------------------------------------------
initAdmin();

/** Firestore database instance */
export const db = admin.firestore();

/** Firestore server-side field helpers (e.g., serverTimestamp) */
export const FieldValue = admin.firestore.FieldValue;

/** Firestore Timestamp re-export for typing/values in scripts */
export { Timestamp } from "firebase-admin/firestore";
