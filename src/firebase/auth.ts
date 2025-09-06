import { GoogleAuthProvider, signInWithPopup, getAuth, signOut } from 'firebase/auth';
import { auth } from './config';

const provider = new GoogleAuthProvider();

export async function signInWithGooglePopup() {
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  return { user: result.user, idToken };
}

export async function firebaseSignOut() {
  await signOut(auth);
}
