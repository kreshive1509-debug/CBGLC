# Security Audit Report

Date: 2026-07-19

## Scope

Frontend (`src/`), backend (`backend/`, `server.ts`), runtime configuration, and reachable Git history were reviewed. Dependency source directories and generated output were excluded from secret scanning.

## Secrets found

- **Critical — MongoDB database URI with a username and password** was committed in `.env.example` and in the initial Git commit (`50ab8dd0e3fc025b72721e20e7b0ae992513a6c9`).
- **Critical — JWT signing secret** was committed in `.env.example` and in the same initial commit.
- **High — Firebase web configuration and an OAuth client ID** were committed in `firebase-applet-config.json`.
- **Medium — Google Apps Script deployment URL** was committed in `.env.example`.
- The local `.env` file is present but correctly ignored. Its contents were not printed, changed, or added to Git.

Firebase web configuration values are public client identifiers rather than authentication secrets, but they are now placeholders in committed templates as requested. Firebase security rules and API-key restrictions remain essential.

## Fixes applied

- Replaced all committed credential/configuration values in `.env.example` with placeholders.
- Replaced the tracked Firebase applet config values with placeholders.
- Ensured `.env` is explicitly ignored by Git; `.env` already exists locally and was left intact.
- Confirmed MongoDB, SMTP, Firebase Admin, and client Firebase code read from environment variables.
- Removed the backend fallback to `VITE_FIREBASE_PROJECT_ID`; Firebase Admin now reads only server-side `FIREBASE_PROJECT_ID`.
- Removed project/config and error-detail logging that could disclose sensitive runtime information.
- Removed Firebase token verification details from HTTP responses.
- Added production CORS origin restriction using `APP_URL`, Helmet CSP, a JSON body limit, and generic production error responses.
- Added a server-only Firebase Admin credential path (`GOOGLE_APPLICATION_CREDENTIALS`) to `.env.example`.

## Files affected

- `.env.example`
- `.gitignore`
- `firebase-applet-config.json`
- `server.ts`
- `backend/config/db.ts`
- `backend/config/firebase.ts`
- `backend/controllers/admission.controller.ts`
- `backend/middlewares/authMiddleware.ts`
- `backend/utils/googleSheets.ts`
- `src/context/AdminAuthContext.tsx`

## History remediation and rotation

The MongoDB password and JWT secret were committed in the initial commit, so removing current-file values does **not** make them safe. Rotate them immediately:

1. Create a new MongoDB database user/password, revoke the exposed user, and set the new URI only in the deployment secret store and local `.env`.
2. Replace `JWT_SECRET` with a newly generated 64+ byte random value. Existing JWTs must be invalidated.
3. Restrict or rotate the Firebase web API key in Google Cloud Console; restrict it by HTTP referrer and permitted APIs. Review the OAuth client’s redirect URIs.
4. Redeploy with the new secrets.
5. Rewrite Git history with `git filter-repo` or BFG only after rotation, then force-push and have every clone rebase/re-clone. History rewrite is not performed automatically because it changes shared repository history.

## Remaining risks and recommendations

- Production requires `APP_URL` to be set to the exact public origin or browser API calls will be blocked by CORS.
- Store runtime secrets in your host’s secret manager, not in `.env` on a production server.
- Keep Firebase Admin service-account files outside the repository and grant the minimum IAM roles.
- Ensure Firebase Auth authorized domains and Firestore/Storage security rules are restrictive.
- The development simulation login is blocked in production; retain `NODE_ENV=production` in deployment.
- The project’s local JSON database fallback is suitable only for development. Do not deploy it with writable persistent data or production credentials absent.
- Add automated secret scanning (for example, GitHub secret scanning, Gitleaks, or TruffleHog) to CI and enable dependency updates.

## Verification

- A post-remediation tracked-file scan found no MongoDB credentials, Firebase API-key patterns, Apps Script deployment URLs, populated JWT secrets, SMTP passwords, client secrets, or private keys.
- `.env` is confirmed ignored by `.gitignore`.
- The TypeScript check was started but the local process did not complete before the tool timeout; manually run `npm run lint` before deployment.