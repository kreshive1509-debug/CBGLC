import 'dotenv/config';
import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { createServer as createViteServer } from "vite";
import { connectDB } from "./backend/config/db";
import { initFirebase } from "./backend/config/firebase";
import apiRoutes from "./backend/routes/apiRoutes";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  // Trust reverse proxy (needed for express-rate-limit behind Cloud Run / Nginx)
  app.set('trust proxy', 1);

  // Initialize DB and Firebase Admin (graceful, bypasses if unconfigured)
  await connectDB();
  initFirebase();

  // Security Middlewares
  app.use(
    helmet({
      contentSecurityPolicy: false, // Turn off CSP during development to allow Vite to serve assets/iframe normally
    })
  );
  app.use(cors());
  app.use(express.json());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Higher limit to prevent preview rate limits
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
  });
  
  // Apply rate limiter to API routes
  app.use('/api', limiter);

  // API Routes
  app.use('/api', apiRoutes);

  // Vite middleware for development or serving compiled files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message || 'An unknown error occurred.' });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
