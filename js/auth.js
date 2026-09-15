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

export function isAllowed(email) {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return ALLOWED_USERS.some((allowed) => allowed.toLowerCase().trim() === clean);
}

export function getUserRole(email) {
  if (!email) return { role: "Member", tier: "Tier 3" };
  const clean = email.toLowerCase().trim();
  return USER_ROLES[clean] || { role: "Planning Committee", tier: "Tier 2" };
}

export function dismissSkeleton() {
  const skeleton = document.getElementById("authLoadingSkeleton");
  if (skeleton) {
    skeleton.classList.add("skeleton-fade-out");
    setTimeout(() => {
      skeleton.style.display = "none";
    }, 280);
  }
}

/**
 * Reusable Auth Gate Initialization Function
 * Can be called with custom overlay/root elements (e.g. for standalone sub-apps like the Decorator Cockpit)
 * or defaults to index.html's standard auth elements.
 */
export function initAuthGate(options = {}) {
  const overlayEl = options.overlayEl !== undefined ? options.overlayEl : document.getElementById("authOverlay");
  const rootEl = options.rootEl !== undefined ? options.rootEl : document.getElementById("appRoot");
  const loginBtn = options.loginBtn !== undefined ? options.loginBtn : document.getElementById("loginBtn");
  const logoutBtn = options.logoutBtn !== undefined ? options.logoutBtn : document.getElementById("logoutBtn");
  const userEmailEl = options.userEmailEl !== undefined ? options.userEmailEl : document.getElementById("userEmail");
  const authErrorEl = options.authErrorEl !== undefined ? options.authErrorEl : document.getElementById("authError");
  const onSignedIn = options.onSignedIn || null;
  const onSignedOut = options.onSignedOut || null;

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

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    dismissSkeleton();
    if (user && isAllowed(user.email)) {
      // Authenticated AND on the allow-list: show the application.
      if (overlayEl) overlayEl.style.display = "none";
      if (rootEl) {
        rootEl.style.display = "";
        if (getComputedStyle(rootEl).display === "none") {
          rootEl.style.display = "block";
        }
      }
      const userRoleInfo = getUserRole(user.email);
      window.currentUser = user;
      window.currentUserRole = userRoleInfo;
      
      // Update legacy element if present
      if (userEmailEl) {
        userEmailEl.textContent = user.email;
      }

      // Update Popover Elements
      const roleBadgeEl = document.getElementById("userRoleBadge");
      if (roleBadgeEl) {
        roleBadgeEl.textContent = userRoleInfo.role.split(" ")[0] || "Admin";
      }

      const popoverRoleEl = document.getElementById("popoverRole");
      if (popoverRoleEl) {
        popoverRoleEl.textContent = userRoleInfo.role;
      }

      const initialsEl = document.getElementById("userAvatarInitials");
      if (initialsEl) {
        const name = user.displayName || user.email || "SK";
        const parts = name.split(/[\s@._-]+/).filter(Boolean);
        let initials = "SK";
        if (parts.length >= 2) {
          initials = (parts[0][0] + parts[1][0]).toUpperCase();
        } else if (parts.length === 1) {
          initials = parts[0].substring(0, 2).toUpperCase();
        }
        initialsEl.textContent = initials;
      }

      clearError();
      if (typeof onSignedIn === "function") {
        onSignedIn(user, userRoleInfo);
      }
    } else if (user && !isAllowed(user.email)) {
      window.currentUser = null;
      window.currentUserRole = null;
      // Authenticated but NOT on the allow-list: deny access, sign out.
      if (rootEl) rootEl.style.display = "none";
      if (overlayEl) overlayEl.style.display = "flex";
      showError(
        `Access Denied: ${user.email} is not on the authorized planning committee list. Please sign in with an approved Gmail address.`
      );
      signOut(auth).catch(() => {});
      if (typeof onSignedOut === "function") {
        onSignedOut(user);
      }
    } else {
      window.currentUser = null;
      window.currentUserRole = null;
      // Signed out: show the login screen.
      if (rootEl) rootEl.style.display = "none";
      if (overlayEl) overlayEl.style.display = "flex";
      if (typeof onSignedOut === "function") {
        onSignedOut(null);
      }
    }
  });

  return { auth, unsubscribe };
}

// Auto-wire if default authOverlay element is present in the DOM (e.g. index.html host shell)
if (document.getElementById("authOverlay")) {
  initAuthGate();
}

// ── Profile Popover Interactive Handling ──
function toggleProfileMenu(e) {
  if (e) e.stopPropagation();
  const popover = document.getElementById("profilePopover");
  const trigger = document.getElementById("profileTriggerBtn");
  const dropdown = document.getElementById("userProfileDropdown");
  if (!popover) return;

  const isHidden = popover.style.display === "none" || !popover.classList.contains("active");
  if (isHidden) {
    popover.style.display = "block";
    popover.classList.add("active");
    if (dropdown) dropdown.classList.add("active");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
  } else {
    popover.style.display = "none";
    popover.classList.remove("active");
    if (dropdown) dropdown.classList.remove("active");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  }
}
window.toggleProfileMenu = toggleProfileMenu;

// Global Click Dismiss
document.addEventListener("click", (e) => {
  const popover = document.getElementById("profilePopover");
  const dropdown = document.getElementById("userProfileDropdown");
  if (popover && popover.classList.contains("active")) {
    if (!dropdown || !dropdown.contains(e.target)) {
      popover.style.display = "none";
      popover.classList.remove("active");
      if (dropdown) dropdown.classList.remove("active");
      const trigger = document.getElementById("profileTriggerBtn");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    }
  }
});

// ESC key dismiss
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const popover = document.getElementById("profilePopover");
    const dropdown = document.getElementById("userProfileDropdown");
    if (popover && popover.classList.contains("active")) {
      popover.style.display = "none";
      popover.classList.remove("active");
      if (dropdown) dropdown.classList.remove("active");
      const trigger = document.getElementById("profileTriggerBtn");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    }
  }
});
