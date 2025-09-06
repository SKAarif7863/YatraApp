import admin from 'firebase-admin';

let initialized = false;

export function initFirebaseAdmin() {
  if (initialized) return admin;
  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!svc) throw new Error('FIREBASE_SERVICE_ACCOUNT is required');
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(svc);
  } catch (e) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT must be a valid JSON string');
  }
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  initialized = true;
  return admin;
}

export async function verifyFirebaseIdToken(idToken) {
  const adm = initFirebaseAdmin();
  return adm.auth().verifyIdToken(idToken);
}
