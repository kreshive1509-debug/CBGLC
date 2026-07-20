import React, { createContext, useContext, useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

interface AdminAuthContextType {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isFirebaseConfigured: boolean;
  isProduction: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  simulateLogin: () => void;
  isSimulated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Try to read Firebase config from Vite env only
const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || '',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: metaEnv.VITE_FIREBASE_APP_ID || '',
};

const hasConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY'
);

// Enforce production mode check
const isProduction = Boolean(metaEnv.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost'));

let auth: any = null;

if (hasConfig) {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    auth = firebase.auth();
  } catch (err) {
    console.error('Failed to initialize client-side Firebase Auth:', err);
  }
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there is an active simulated session in localStorage
    const simUser = localStorage.getItem('simulated_admin_user');
    const simToken = localStorage.getItem('simulated_admin_token');
    
    if (simUser && simToken) {
      setUser(JSON.parse(simUser));
      setToken(simToken);
      setIsSimulated(true);
      setIsLoading(false);
      return;
    }

    if (auth) {
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: any) => {
        if (firebaseUser) {
          try {
            const userToken = await firebaseUser.getIdToken();
            setUser(firebaseUser);
            setToken(userToken);
            setIsSimulated(false);
          } catch (err: any) {
            console.error('Error fetching Firebase token:', err);
            setError(err.message);
          }
        } else {
          setUser(null);
          setToken(null);
          setIsSimulated(false);
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    if (!hasConfig || !auth) {
      throw new Error('Firebase is not configured yet. Please configure the environment variables or use the Bypass / Simulation login for preview purposes.');
    }

    try {
      const credential = await auth.signInWithEmailAndPassword(email, password);
      const userToken = await credential.user.getIdToken();
      setUser(credential.user);
      setToken(userToken);
      setIsSimulated(false);
      return credential.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    if (isSimulated) {
      localStorage.removeItem('simulated_admin_user');
      localStorage.removeItem('simulated_admin_token');
      setUser(null);
      setToken(null);
      setIsSimulated(false);
    } else if (auth) {
      await auth.signOut();
      setUser(null);
      setToken(null);
    }
  };

  const simulateLogin = () => {
    if (isProduction) {
      setError('Simulated login is not allowed in production mode.');
      return;
    }
    setError(null);
    const mockUser = {
      uid: 'simulated_admin_uid',
      email: 'admin@cbglawcollege.edu.in',
      displayName: 'Chandra Bhanu Admin',
      photoURL: null,
      emailVerified: true
    };
    const mockToken = 'mock_admin_token';

    localStorage.setItem('simulated_admin_user', JSON.stringify(mockUser));
    localStorage.setItem('simulated_admin_token', mockToken);
    
    setUser(mockUser);
    setToken(mockToken);
    setIsSimulated(true);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isFirebaseConfigured: hasConfig,
        isProduction,
        isLoading,
        error,
        login,
        logout,
        simulateLogin,
        isSimulated
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
