// ============================================================
//  firebase-config.js  — Shared by index.html & dashboard.html
//
//  SETUP STEPS:
//  1. Go to https://console.firebase.google.com
//  2. Click "Add project" → name it (e.g. "mritunjay-portfolio")
//  3. Disable Google Analytics (optional) → Create project
//  4. Click the </> Web icon → Register app → Copy config below
//  5. In Firebase Console → Build → Firestore Database
//     → Create database → Start in TEST mode → Choose region
//  6. In Firebase Console → Build → Storage
//     → Get started → Start in TEST mode
//  7. Replace the placeholder values below with your actual config
//  8. Deploy both index.html and dashboard.html to the SAME domain
//     (e.g. Vercel, Netlify, or GitHub Pages)
//
//  FIRESTORE SECURITY RULES (paste in Firebase Console → Firestore → Rules):
//  -----------------------------------------------------------------------
//  rules_version = '2';
//  service cloud.firestore {
//    match /databases/{database}/documents {
//      match /posts/{postId} {
//        allow read: if true;
//        allow write: if request.auth != null;
//      }
//    }
//  }
//  -----------------------------------------------------------------------
//
//  STORAGE RULES (Firebase Console → Storage → Rules):
//  -----------------------------------------------------------------------
//  rules_version = '2';
//  service firebase.storage {
//    match /b/{bucket}/o {
//      match /covers/{allPaths=**} {
//        allow read: if true;
//        allow write: if request.auth != null;
//      }
//    }
//  }
//  -----------------------------------------------------------------------
// ============================================================

const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// Admin password for dashboard access (change this!)
const ADMIN_PASSWORD = "mritunjay2025";
