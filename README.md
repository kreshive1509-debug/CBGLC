# Chandra Bhanu Gupta Law College (CBGLC) - Enterprise Portal

An enterprise-grade, full-stack, responsive, and secure institutional portal for **Chandra Bhanu Gupta Law College, Lucknow**, approved by the Bar Council of India (BCI) and affiliated with the University of Lucknow. This application handles content management for administrative notices, founder/manager visions, website settings, and admission enquiries using a secure, custom full-stack architecture.

---

## 🚀 Key Features

- **Dynamic Admissions & Notices**: Secure live notice board with pin/important highlights, category filtering, search, and publication states (Draft vs. Published).
- **Executive Administration Panels**: Custom, Firebase-authenticated Admin Dashboard to update notices, college settings, founder/manager content, and view admission queries.
- **Enterprise-grade Security**: Equipped with Helmet security headers, CORS protection, Express-rate-limiting, JWT authentication, and secure Firebase token verification.
- **Durable Persistence**: Built with a hybrid Mongo database model backed by local file-based DB fallbacks to guarantee 100% service uptime during cold-starts or unconfigured deployments.
- **Fully Responsive Design**: Optimized across mobile screens (320px) to ultra-wide desktop monitors (1920px+) using Tailwind CSS and micro-interactions by Framer Motion.
- **Production SEO & Accessibility**: Pre-configured with Structured Data (JSON-LD) for Educational Organizations, Canonical URLs, Semantic HTML, responsive navbar structures, and accessible design contrast.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite 6, React Router DOM 7, Framer Motion, Lucide Icons.
- **Backend**: Express.js 4, TypeScript (running on Node.js using `tsx` or bundled via `esbuild`).
- **Database / Storage**: MongoDB (Mongoose) with a fully functional JSON-file failover database.
- **Authentication**: Firebase Client Authentication paired with server-side Firebase Admin SDK token verification.
- **Security Middlewares**: `helmet`, `cors`, `express-rate-limit`, JSON Web Tokens.

---

## 📂 Project Directory Structure

```text
├── backend/
│   ├── config/              # Database & Firebase configuration
│   ├── controllers/         # API business controllers
│   ├── data/                # Local database fallback directory
│   ├── middlewares/         # JWT and Firebase Auth verification layers
│   ├── models/              # MongoDB/Mongoose models (Settings, Notice, Founder, Manager)
│   ├── routes/              # Express API Routes (/api/*)
│   └── utils/               # Storage helper engines & fallbacks
├── public/                  # Static assets compiled in build
│   ├── robots.txt           # Crawl configurations
│   └── sitemap.xml          # XML search engine indexing schema
├── src/                     # React Frontend
│   ├── components/          # Reusable layout UI components
│   ├── constants/           # Core constants
│   ├── context/             # React State Contexts (Data, Admission, AdminAuth)
│   ├── layouts/             # Page structural layouts
│   └── pages/               # App views (About, Home, Notices, Admin Portal, etc.)
├── .env.example             # Documented environment variables blueprint
├── index.html               # Main entry HTML (with JSON-LD, SEO, and OpenGraph tags)
├── package.json             # Build commands and system packages
├── server.ts                # Production-ready custom full-stack entry server
├── tsconfig.json            # Strict TypeScript compilation rules
└── vite.config.ts           # Vite configuration & asset compilation pipeline
```

---

## ⚙️ Configuration & Environment Variables

Create a `.env` file in the root directory based on the following `.env.example` file. All credentials should be provided by your infrastructure environment.

```env
# SERVER SETTINGS
PORT=3000
NODE_ENV=production
APP_URL="https://cbglawcollege.in"

# GEMINI AI SDK KEY
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# DATABASE CONFIGURATION (Optional - falls back to local file storage if empty)
MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/cbglc"

# SECURITY CONFIGURATION
JWT_SECRET="YOUR_SUPER_SECRET_JWT_SIGNING_PHRASE"

# FIREBASE CONFIGURATION (For Admin Client Auth)
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="cbglc-auth.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="cbglc-auth"
VITE_FIREBASE_STORAGE_BUCKET="cbglc-auth.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234:web:abcd"
```

---

## 💾 Database Setup Instructions

The portal is designed with a **failover-safe engine**. It requires no manual schema creation on setup.

### 1. MongoDB Connection
- Provide a valid `MONGODB_URI` string in your `.env`.
- If the MongoDB URI is undefined, missing, or fails to connect, the system **automatically and gracefully activates file-based JSON persistence** in `/backend/data/db.json` ensuring 100% operational status without crashing.

### 2. Firebase Authentication Integration
- Go to the [Firebase Console](https://console.firebase.google.com/) and create a project.
- In **Authentication**, enable the **Email/Password** sign-in method.
- Register an Administrator account directly in the Firebase Authentication user console.
- In project settings, create a **Web App** to retrieve the client variables and paste them into your `.env` prefixed with `VITE_`.
- (Optional) Download your Service Account JSON credentials for the Firebase Admin SDK and export them as environment variables if you require enhanced server-side verification.

---

## 🏃 Local Development Quickstart

Before building, install the dependencies and boot up the development compiler:

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Server (Development Mode)
```bash
npm run dev
```
The server will start running at `http://localhost:3000`. This launches the unified Vite development compiler side-by-side with the Express API.

### 3. Build & Run in Production
To build the static files and compile the Express server into a highly optimized CommonJS single bundle:
```bash
npm run build
npm start
```
The application compiles everything cleanly into the `/dist` folder. `npm start` runs the compiled production-ready server from `dist/server.cjs`.

---

## ☁️ Deployment Instructions

### 1. Cloud Run / Docker Container Ingress
The portal runs as a unified custom server. In containers, configure:
- **Port**: Bind to host `0.0.0.0` on Port `3000` (controlled natively in our `server.ts` setup).
- **Ingress**: Serve all web and api routes via port `3000`.

### 2. PaaS Deployments (Railway, Render, Heroku)
- Link your GitHub repository.
- Specify the **Build Command**: `npm run build`
- Specify the **Start Command**: `npm start`
- Populate the required variables listed in `.env.example` inside your platform's environment settings.

---

## 🔧 Troubleshooting

- **Admin Login Issues**: Verify your `VITE_FIREBASE_*` credentials match your Firebase console. Check if the user is successfully created in the Firebase Auth panel.
- **Port Conflicts**: If port 3000 is occupied, free it or modify the `PORT` in `server.ts` to another port (note: our AI Studio infrastructure is hardcoded to port 3000 for web reverse proxying).
- **Missing Images**: If any Google Drive URLs fail to load, ensure the sharing permission of that file in Google Drive is set to **"Anyone with the link"**.
