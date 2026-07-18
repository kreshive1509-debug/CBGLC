import { Request, Response, NextFunction } from 'express';
import { getFirebaseAdmin } from '../config/firebase';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const verifyFirebaseToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];

    // Check for local simulation token when firebase is not configured
    const admin = getFirebaseAdmin();
    const isProduction = process.env.NODE_ENV === 'production';
    const hasFirebaseConfig = !!process.env.FIREBASE_PROJECT_ID;

    if (!admin || token === 'mock_admin_token') {
      // Only allow simulation if NOT in production AND no real firebase config is detected
      if (!isProduction && !hasFirebaseConfig && token === 'mock_admin_token') {
        // Allow simulated admin
        req.user = {
          uid: 'simulated_admin_uid',
          email: 'admin@cbglawcollege.edu.in',
          email_verified: true,
          name: 'Simulated Admin'
        };
        next();
        return;
      }
      
      if (token === 'mock_admin_token') {
        res.status(401).json({ error: 'Unauthorized: Simulation token not allowed in production mode' });
        return;
      }
    }

    if (!admin) {
      res.status(503).json({ error: 'Authentication service is unavailable' });
      return;
    }

    try {
      const { getAuth } = await import('firebase-admin/auth');
      const decodedToken = await getAuth(admin).verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (authError: any) {
      console.error('Firebase token verification failed');
      res.status(401).json({ error: 'Unauthorized: Invalid Firebase ID Token' });
    }
  } catch (error: any) {
    console.error('Auth middleware error');
    res.status(500).json({ error: 'Internal Server Error in Auth Middleware' });
  }
};
