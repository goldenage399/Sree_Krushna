/**
 * allowed_users.js — Authorization allow-list for Sree Krushna Marriage OS.
 *
 * Tier 1 SuperAdmins: Sree & Krushna have full access to everything.
 */
export const ALLOWED_USERS = [
  "goldenage399@gmail.com",
  "sreesubha18@gmail.com",
  "krushna.s.panda@gmail.com",
];

export const USER_ROLES = {
  "goldenage399@gmail.com": { role: "SuperAdmin (Groom)", tier: "Tier 1" },
  "krushna.s.panda@gmail.com": { role: "SuperAdmin (Groom)", tier: "Tier 1" },
  "sreesubha18@gmail.com": { role: "SuperAdmin (Bride)", tier: "Tier 1" },
};
