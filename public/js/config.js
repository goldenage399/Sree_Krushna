/**
 * config.js — Firebase & Cloud Storage configuration for Sree Krushna Marriage OS.
 * Loaded before auth.js.
 */
window.firebaseConfig = {
  apiKey: "AIzaSyDVqhARy-S_oDclhFJHxbhblW_vPpb2bLg",
  authDomain: "sree-krushna-forever.firebaseapp.com",
  projectId: "sree-krushna-forever",
  storageBucket: "sree-krushna-forever.firebasestorage.app",
  messagingSenderId: "1029282813382",
  appId: "1:1029282813382:web:d7a8a15155219b31bb8ec7",
  // Google Drive Media Relay Webhook (SK-011 / AC-DEC-2026-052)
  driveUploadWebhookUrl: "",
  storageProvider: "drive_webhook" // 'drive_webhook' | 'firebase_storage'
};
