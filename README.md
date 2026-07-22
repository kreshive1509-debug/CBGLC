# Chandra Bhanu Gupta Law College

This repository is now split into two independent applications:

- `frontend/` - React + Vite application deployed on Vercel
- `backend/` - Node.js + Express + TypeScript API deployed on Render

## Structure

```text
/
├── frontend/
├── backend/
├── README.md
└── .gitignore
```

## Frontend

The frontend contains the React UI, pages, components, contexts, and Vite build tooling.

Run locally:

```bash
cd frontend
npm install
npm run dev
```

Build for production:

```bash
cd frontend
npm run build
```

## Backend

The backend contains the Express API, MongoDB models, controllers, middleware, and utility services.

Run locally:

```bash
cd backend
npm install
npm run dev
```

Build for production:

```bash
cd backend
npm run build
```

Start production server:

```bash
cd backend
npm start
```

## Deployment

- Frontend: Vercel
- Backend: Render

Backend Render settings:

- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Health Check Path: `/health`

Frontend Vercel settings:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- SPA rewrite to `index.html`
