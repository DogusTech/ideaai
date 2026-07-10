# Deployment Guide

This project is configured for deployment using Firebase Hosting (Frontend) and Google Cloud Run (Go Backend).

## Prerequisites

1. Create a [Firebase Project](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password & Google provider).
3. Enable **Firestore Database** in native mode.
4. Enable the **Places API (New)** in Google Cloud Console.

## Environment Variables

### Frontend (`.env.local` / Production Env)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# For Vercel deployment:
# NEXT_PUBLIC_API_BASE_URL=https://your-cloud-run-url.a.run.app
```

### Backend (`backend/.env` / Cloud Run Env)

```env
# Only for local dev. Do not use in Cloud Run (use Service Account attached to the run instance)
# GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.local.json 

# Important for Session Cookies
SESSION_COOKIE_SECURE=true 
APP_ORIGIN=https://your-production-domain.com

PORT=8081
```

## Local Development

1. Setup `GOOGLE_APPLICATION_CREDENTIALS` pointing to your service account key in the `backend/` directory.
2. Start the backend: `cd backend && go run ./cmd/api` (runs on 8081).
3. Start the frontend: `pnpm dev` (runs on 3000). The frontend proxies `/api/*` to `http://localhost:8081/api`.

## Production Deployment

### 1. Deploy Firestore Security Rules & Indexes

```bash
firebase deploy --only firestore
```

### 2. Deploy the Go Backend to Cloud Run

```bash
cd backend
gcloud run deploy togetlink-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="SESSION_COOKIE_SECURE=true,APP_ORIGIN=https://your-production-domain.com"
```
*Note: Make sure the Cloud Run service account has Firestore / Firebase Admin IAM roles.*

### 3. Deploy the Next.js Frontend

**Option A: Firebase Hosting (Recommended)**

```bash
pnpm build
firebase deploy --only hosting
```
The `firebase.json` file is configured to rewrite `/api/**` requests to your Cloud Run service.

**Option B: Vercel**

1. Set all `NEXT_PUBLIC_FIREBASE_*` variables in Vercel.
2. Set `NEXT_PUBLIC_API_BASE_URL` to your Cloud Run URL.
3. Deploy to Vercel. 
*Note: CORS cross-site cookies require both domains to share a parent domain or `SameSite=None` which may be blocked by some browsers. A proxy rewrite is always preferred.*
