import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore,
  Firestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  doc,
  getDocFromServer
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  Auth, 
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

function getOrInitApp(): FirebaseApp {
  if (!app) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
  }
  return app;
}

function getOrInitDb(): Firestore {
  if (!db) {
    const a = getOrInitApp();
    try {
      db = initializeFirestore(
        a,
        {
          experimentalAutoDetectLongPolling: true,
        },
        firebaseConfig.firestoreDatabaseId
      );
    } catch {
      db = getFirestore(a, firebaseConfig.firestoreDatabaseId);
    }
  }
  return db;
}

function getOrInitAuth(): Auth {
  if (!auth) {
    const a = getOrInitApp();
    auth = getAuth(a);
  }
  return auth;
}

export { app, db, auth };

export async function loginWithGoogle(): Promise<User> {
  const a = getOrInitAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(a, provider);
  return result.user;
}

export async function loginWithEmail(e: string, p: string): Promise<User> {
  const a = getOrInitAuth();
  const result = await signInWithEmailAndPassword(a, e, p);
  return result.user;
}

export async function signupWithEmail(e: string, p: string): Promise<User> {
  const a = getOrInitAuth();
  const result = await createUserWithEmailAndPassword(a, e, p);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  const a = getOrInitAuth();
  await signOut(a);
}

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  const a = getOrInitAuth();
  return onAuthStateChanged(a, callback);
}

export function getCurrentUser(): User | null {
  const a = getOrInitAuth();
  return a.currentUser;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentAuth = getOrInitAuth();
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth.currentUser?.uid,
      email: currentAuth.currentUser?.email,
      emailVerified: currentAuth.currentUser?.emailVerified,
      isAnonymous: currentAuth.currentUser?.isAnonymous,
      tenantId: currentAuth.currentUser?.tenantId,
      providerInfo: currentAuth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  return errInfo;
}

export async function testConnection() {
  try {
    const firestore = getOrInitDb();
    await getDocFromServer(doc(firestore, 'test', 'connection'));
  } catch (error) {
    // Quietly log notice if initial probe is unreachable so app startup isn't blocked
    console.warn("Firestore connection probe notice:", error instanceof Error ? error.message : error);
  }
}

// Initial connection test
testConnection();

export async function ensureAnonymousAuth(): Promise<User | null> {
  try {
    const a = getOrInitAuth();
    if (a.currentUser) return a.currentUser;
    const userCred = await signInAnonymously(a);
    return userCred.user;
  } catch (err) {
    console.warn("Anonymous auth fallback:", err);
    return null;
  }
}

export async function saveSessionLogToFirestore(sessionData: any): Promise<string | null> {
  const pathName = "handshake_logs";
  try {
    const firestore = getOrInitDb();
    await ensureAnonymousAuth();
    const docRef = await addDoc(collection(firestore, pathName), {
      ...sessionData,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, pathName);
    return null;
  }
}

export async function fetchRecentSessionLogs(count = 10): Promise<any[]> {
  const pathName = "handshake_logs";
  try {
    const firestore = getOrInitDb();
    await ensureAnonymousAuth();
    const q = query(collection(firestore, pathName), orderBy("createdAt", "desc"), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, pathName);
    return [];
  }
}

export async function savePaymentTransactionToFirestore(txData: any): Promise<string | null> {
  const pathName = "payment_transactions";
  try {
    const firestore = getOrInitDb();
    await ensureAnonymousAuth();
    const docRef = await addDoc(collection(firestore, pathName), {
      ...txData,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, pathName);
    return null;
  }
}

export async function fetchPaymentTransactionsFromFirestore(count = 20): Promise<any[]> {
  const pathName = "payment_transactions";
  try {
    const firestore = getOrInitDb();
    await ensureAnonymousAuth();
    const q = query(collection(firestore, pathName), orderBy("createdAt", "desc"), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, pathName);
    return [];
  }
}
