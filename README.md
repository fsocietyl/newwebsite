# Sign Foreign Trade – Luxury Furniture Group

Sign Foreign Trade (Sign Dış Ticaret) is a multilingual, Firebase-enabled luxury living platform that showcases high-end furniture brands, curated collections, case-study projects, global stores, and editorial news while providing an authenticated admin workspace for managing all content.

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS 4 + shadcn/ui components
- Framer Motion, React Hook Form + Zod
- Firebase Authentication, Firestore, Storage

## Getting Started

```bash
npm install          # install dependencies
npm run dev          # start the dev server on http://localhost:3000
npm run build        # create a production build
npm start            # run the production build
```

### Environment Variables

Create `.env.local` at the project root and populate:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

These values come from your Firebase project settings (Project Settings → General → Your apps).

### Firebase Configuration

1. [Create a Firebase project](https://console.firebase.google.com/) or reuse an existing one.
2. Enable **Authentication → Email/Password**.
3. Create at least one admin user (email/password) under Authentication → Users.
4. Enable **Firestore** in Production mode and create the collections referenced below (`brands`, `products`, `projects`, `stores`, `news`, `appointments`, `messages`).
5. Enable **Storage** and keep the default rules for now (see Security Rules snippet).
6. Copy the web app credentials into `.env.local`.
7. (Optional) Use the **Sync Seed Content** button inside `/admin` to pre-populate Firestore with the local JSON seed data.

### Suggested Firestore Security Rules

Use this baseline and refine for production:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read;
    }
    match /admin/{docId} {
      allow read, write: if request.auth != null;
    }
    match /brands/{id},
          /products/{id},
          /projects/{id},
          /stores/{id},
          /news/{id} {
      allow read;
      allow write: if request.auth != null;
    }
    match /appointments/{id},
          /messages/{id} {
      allow create;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

Update Storage rules similarly so only authenticated admins can write/upload.

### Firebase Hosting Deployment

1. Install the CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize hosting inside the project folder:
   ```bash
   firebase init hosting
   # select existing project, set "dist" as `out`? (Next.js) – use custom build
   ```
4. Build the app: `npm run build`
5. Deploy: `firebase deploy --only hosting`

> Tip: For SSR with Firebase Hosting + Cloud Functions, use `npx next-firebase-functions` or Vercel. The instructions above deploy a static export when `output: 'standalone'` isn't configured—adjust to your hosting strategy.

## Admin Panel

- `/admin/login`: Firebase Email/Password login (local demo fallback available when Firebase isn't configured).
- `/admin`: Dashboard overview with seed sync action.
- `/admin/brands`, `/admin/products`, `/admin/projects`, `/admin/stores`, `/admin/news`: CRUD forms (React Hook Form + Zod) and data tables. Each action attempts to persist to Firestore and gracefully falls back to local seed data when offline.
- Upload inputs accept storage URLs generated via Firebase Storage uploads; the Storage helper is ready for drop-in integration.

## Data Model

Collections are defined in `src/lib/firestore.ts` with TypeScript types in `src/types/content.ts`. Seed JSON lives under `src/data/*` so the UI renders without Firestore.

## Multilingual & RTL

Translation JSON lives inside `src/i18n`. The `LocaleProvider` handles direction switching (EN/TR/AR) plus persistence via `localStorage`. Use the header language switcher to change locales and observe RTL alignment for Arabic.

## Project Structure

```
src/app/(public)       Public-facing routes
src/app/(admin)        Authenticated admin routes
src/components         UI, cards, layout, providers, forms
src/lib                Firebase config, Firestore helpers, validation, i18n
src/data               Seed JSON for brands/products/projects/stores/news
src/i18n               Translation dictionaries
```

## Testing & Quality

- ESLint + TypeScript keep the codebase consistent.
- React Hook Form + Zod guarantee validated inputs for every admin form and public inquiry modal.
- Framer Motion powers the hero slider transitions for a subtle luxury feel.

Configure Firebase credentials, run `npm run dev`, and you’re ready to showcase new luxury collections with a production-minded workflow. Enjoy!***
# newsign
