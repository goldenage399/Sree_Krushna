/**
 * auth.js — Google Sign-In + email allow-list gate for Sree Krushna Marriage OS.
 * Sourced directly from the BMS Executive Dashboard pattern.
 */
import {
  initializeApp,
  getApps,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { ALLOWED_USERS, USER_ROLES } from "./allowed_users.js";

if (!getApps().length) {
  if (window.firebaseConfig) {
    initializeApp(window.firebaseConfig);
  } else {
    console.error(
      "Firebase config not found. Ensure js/config.js sets window.firebaseConfig and is loaded before js/auth.js."
    );
  }
}

const auth = getAuth();

const authOverlay = document.getElementById("authOverlay");
const appRoot = document.getElementById("appRoot");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userEmailEl = document.getElementById("userEmail");
const authErrorEl = document.getElementById("authError");

function isAllowed(email) {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return ALLOWED_USERS.some((allowed) => allowed.toLowerCase().trim() === clean);
}

function getUserRole(email) {
  if (!email) return { role: "Member", tier: "Tier 3" };
  const clean = email.toLowerCase().trim();
  return USER_ROLES[clean] || { role: "Planning Committee", tier: "Tier 2" };
}

function showError(message) {
  if (!authErrorEl) return;
  authErrorEl.textContent = message;
  authErrorEl.style.display = "block";
}

function clearError() {
  if (!authErrorEl) return;
  authErrorEl.textContent = "";
  authErrorEl.style.display = "none";
}

function dismissSkeleton() {
  const skeleton = document.getElementById("authLoadingSkeleton");
  if (skeleton) {
    skeleton.classList.add("skeleton-fade-out");
    setTimeout(() => {
      skeleton.style.display = "none";
    }, 280);
  }
}

onAuthStateChanged(auth, (user) => {
  dismissSkeleton();
  if (user && isAllowed(user.email)) {
    // Authenticated AND on the allow-list: show the application.
    if (authOverlay) authOverlay.style.display = "none";
    if (appRoot) appRoot.style.display = "block";
    const userRoleInfo = getUserRole(user.email);
    if (userEmailEl) {
      userEmailEl.innerHTML = `<strong>${userRoleInfo.role}</strong> &bull; ${user.email}`;
    }
    clearError();
  } else if (user && !isAllowed(user.email)) {
    // Authenticated but NOT on the allow-list: deny access, sign out.
    if (appRoot) appRoot.style.display = "none";
    if (authOverlay) authOverlay.style.display = "flex";
    showError(
      `Access Denied: ${user.email} is not on the authorized planning committee list. Please sign in with an approved Gmail address.`
    );
    signOut(auth).catch(() => {});
  } else {
    // Signed out: show the login screen.
    if (appRoot) appRoot.style.display = "none";
    if (authOverlay) authOverlay.style.display = "flex";
  }
});

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    clearError();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed:", err);
      showError("Sign-in failed: " + (err.message || "Please try again."));
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  });
}
