import admin from 'firebase-admin';

let isFirebaseInitialized = false;
let adminApp: admin.App | null = null;

export const initFirebase = () => {
  if (isFirebaseInitialized) return true;

  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!projectId) {
    console.warn('⚠️ FIREBASE_PROJECT_ID is not set. Firebase Admin cannot be fully initialized. API token verification will run in development simulation mode.');
    return false;
  }

  try {
    // Prefer the already-initialized Firebase Admin app if present
    const existingApps = admin.getApps();
    if (existingApps.length > 0) {
      adminApp = existingApps[0];
    } else {
      // Try to initialize with just project ID (requires GOOGLE_APPLICATION_CREDENTIALS env var or default credentials)
      try {
        adminApp = admin.initializeApp({ projectId });
      } catch (initError) {
        // If initialization fails (e.g., no service account), run in simulation mode
        console.warn('⚠️ Firebase Admin could not be fully initialized. Token verification will run in simulation mode.');
        return false;
      }
    }
    isFirebaseInitialized = true;
    console.log('✅ Firebase Admin initialized successfully.');
    return true;
  } catch (error) {
    console.warn('Firebase Admin initialization failed');
    return false;
  }
};

export const getFirebaseAdmin = () => {
  if (!isFirebaseInitialized) {
    initFirebase();
  }
  return isFirebaseInitialized ? adminApp : null;
};
