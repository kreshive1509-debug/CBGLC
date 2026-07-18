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
  const isProduction = process.env.NODE_ENV === "production";
  const allowedOrigins = new Set([process.env.APP_URL].filter(Boolean));

  app.set('trust proxy', 1);
  await connectDB();
  initFirebase();

  app.use(helmet({
    contentSecurityPolicy: isProduction ? {
      directives: {
        defaultSrc: ["'self'"], baseUri: ["'self'"], objectSrc: ["'none'"], frameAncestors: ["'none'"],
        scriptSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'], imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://identitytoolkit.googleapis.com', 'https://securetoken.googleapis.com', 'https://*.googleapis.com'],
        frameSrc: ["'self'", 'https://www.google.com'], upgradeInsecureRequests: [],
      },
    } : false,
  }));
  app.use(cors({ origin(origin, callback) {
    if (!isProduction || !origin || allowedOrigins.has(origin)) return callback(null, true);
    callback(new Error('Origin is not allowed by CORS policy'));
  }}));
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests, please try again later.' } }));
  app.use('/api', apiRoutes);

  if (!isProduction) {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.use((_err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled server error');
    res.status(500).json({ error: 'Internal Server Error' });
  });
  app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on port ${PORT}`));
}

startServer().catch(() => { console.error('Failed to start server'); process.exit(1); });