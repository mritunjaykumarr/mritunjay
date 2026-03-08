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
  apiKey:            "AIzaSyBECM26idkr26XWDj6IY0e5u0TikYHYQKg",
  authDomain:        "mritunjay-portfolio-25a6b.firebaseapp.com",
  projectId:         "mritunjay-portfolio-25a6b",
  storageBucket:     "mritunjay-portfolio-25a6b.firebasestorage.app",
  messagingSenderId: "643363777685",
  appId:             "1:643363777685:web:28ca07ddf4017820f13f9c"
};

// Admin password for dashboard access (change this!)
const ADMIN_PASSWORD = "mritunjay2025";
