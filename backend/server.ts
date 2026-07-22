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

const secretEnvPatterns = [/secret/i, /token/i, /key/i, /pass/i, /pwd/i, /private/i, /uri/i, /cert/i];
const getSafeEnvSummary = () => {
  const summary: Record<string, string> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (!value) {
      summary[key] = '(empty)';
      continue;
    }

    if (secretEnvPatterns.some((pattern) => pattern.test(key))) {
      summary[key] = '[redacted]';
      continue;
    }

    summary[key] = value;
  }

  return summary;
};

const logRequestDetails = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
  console.log(`[request] Origin=${req.headers.origin || 'none'} Method=${req.method} Path=${req.originalUrl}`);
  next();
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  const isProduction = process.env.NODE_ENV === 'production';

  console.log('[startup] Loaded FRONTEND_URL:', process.env.FRONTEND_URL || '(not set)');
  console.log('[startup] Loaded APP_URL:', process.env.APP_URL || '(not set)');
  console.log('[startup] Loaded CORS_ORIGIN:', process.env.CORS_ORIGIN || '(not set)');
  console.log('[startup] Loaded safe environment variables:', JSON.stringify(getSafeEnvSummary(), null, 2));

  const defaultOrigins = [
    'https://cbglc.vercel.app',
    'https://cbglc-0twr.onrender.com',
  ];
  const allowedOrigins = new Set(
    [...defaultOrigins, process.env.FRONTEND_URL, process.env.APP_URL, process.env.CORS_ORIGIN]
      .flatMap((value) => (value ? value.split(',') : []))
      .map((value) => value.trim())
      .filter(Boolean)
  );

  const corsOptions: cors.CorsOptions = {
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (!isProduction || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS policy`));
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Visitor-Id'],
    exposedHeaders: ['Content-Length'],
    credentials: true,
    optionsSuccessStatus: 204,
  };

  app.set('trust proxy', 1);
  await connectDB();
  initFirebase();

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(logRequestDetails);
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
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => {
    res.status(200).json({ service: 'cbgl-api', status: 'ok' });
  });

  app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
    message: { error: 'Too many requests, please try again later.' },
  }));
  app.use('/api', apiRoutes);
  app.use('/api', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.originalUrl} not found`
    });
  });

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[server] Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
}

startServer().catch(() => { console.error('Failed to start server'); process.exit(1); });
