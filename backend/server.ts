import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { connectDB } from "./config/db";
import { initFirebase } from "./config/firebase";
import apiRoutes from "./routes/apiRoutes";

const envFiles = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '..', '.env'),
];

for (const envFile of envFiles) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  const isProduction = process.env.NODE_ENV === "production";
  const allowedOrigins = new Set(
    [process.env.FRONTEND_URL, process.env.APP_URL, process.env.CORS_ORIGIN]
      .flatMap((value) => (value ? value.split(',') : []))
      .map((value) => value.trim())
      .filter(Boolean)
  );
  const corsOptions: cors.CorsOptions = {
    origin(origin, callback) {
      if (!isProduction || !origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS policy`));
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length'],
    optionsSuccessStatus: 204,
  };

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
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => {
    res.status(200).json({ service: 'cbgl-api', status: 'ok' });
  });

  app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests, please try again later.' } }));
  app.use('/api', apiRoutes);

  app.use((_err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled server error');
    res.status(500).json({ error: 'Internal Server Error' });
  });
  app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on port ${PORT}`));
}

startServer().catch(() => { console.error('Failed to start server'); process.exit(1); });
