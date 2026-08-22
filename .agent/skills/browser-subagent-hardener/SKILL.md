---
name: browser-subagent-hardener
description: >
  Generates hardened browser subagent prompts with built-in verification phases,
  explicit success/failure conditions, viewport normalization, and structured reporting.
  Use this skill when composing a browser_subagent task for ANY login flow, route-gate
  verification, or UI feature testing. Prevents silent failures caused by unauthorized
  redirects, mobile viewport mismatches, and missing console log captures.
---

# Browser Subagent Hardener Skill

## Problem This Skill Solves

Vanilla browser subagent prompts fail silently in these common scenarios:

| Failure Mode               | Symptom                                              | Root Cause                                             |
| -------------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| Unauthorized redirect      | Agent lands on `/unauthorized` but doesn't report it | No URL assertion in prompt                             |
| Mobile sidebar hidden      | Agent can't find nav items                           | Default 710px viewport → hamburger menu                |
| Missing error logs         | Auth errors exist but go unreported                  | No explicit `capture_browser_console_logs` instruction |
| Cancelled run wasted       | No diagnostic data on cancel                         | Subagent writes nothing until final report             |
| Pixel-coordinate fragility | Clicks hit wrong elements on different viewports     | Hardcoded `X,Y` instead of semantic targets            |

---

## The Three-Phase Prompt Structure

All browser subagent prompts MUST follow the **SETUP → ACT → VERIFY** loop:

```
[PHASE 1: SETUP]
- Resize browser window to 1440x900 immediately.
- Navigate to {target_url}.
- Capture browser console logs (initial baseline).

[PHASE 2: ACT]
- Perform only the actions needed for this specific test.
- Use semantic element descriptions, NOT pixel coordinates.

[PHASE 3: VERIFY]
- BEFORE reporting, explicitly check: What is the current URL?
- STOP with FAIL if URL contains "unauthorized", "login", or "error".
- Capture browser console logs again (post-action).
- List all visible sidebar/nav items.
- Report any text matching: "Access denied", "Unauthorized", "Something went wrong".
```

---

## Standard Prompt Template

Use this template verbatim when dispatching a subagent for any login + route test:

```
SETUP:
1. Resize the browser window to 1440x900.
2. Navigate to http://localhost:5173.
3. Call capture_browser_console_logs immediately and save any errors found.

Login (Email/Password Flow — bypass Google OAuth):
4. READ the `.env.local` to determine if the VITE_FIREBASE_PROJECT_ID is `pi-ops` or `pi-tasks-dev`. If you cannot see it, assume `pi-tasks-dev` for safety.
5. If `pi-ops`, use credentials `testadmin@taskdashboard.test` / `TestPassword123!`.
6. Look for an "Email Address" input field on the page. Click it.
7. Type the selected email.
8. Click or tab to the "Password" input field. Type the selected password.
7. Click the "Sign In" button. Do NOT click "Continue with Google".
8. Wait 3 seconds for the page to render.

CRITICAL VERIFICATION GATE (do this BEFORE anything else):
9. Read the current URL.
   - If it contains "unauthorized" → STOP. Report: TEST FAILED — Role routing blocked access.
   - If it contains "login" → STOP. Report: TEST FAILED — Credentials invalid, still on login page.
   - If it contains "my-tasks" or "admin" → PASS gate, continue.
10. Call capture_browser_console_logs. Report any line containing: "Access denied", "permission", "error", "failed".

Post-Login Checks:
11. List every navigation link visible in the sidebar (desktop view, 1440px wide).
12. Attempt to navigate to http://localhost:5173/admin. Report if redirected away.
13. Attempt to navigate to http://localhost:5173/my-tasks. Report if it loads or redirects.

FINAL REPORT must include:
- PASS or FAIL for the login gate
- Current URL at end of test
- Complete list of visible sidebar links
- Any console errors found
- Any routing redirects encountered (where it went vs. where it should have gone)
```

---

## Hardening Checklist

Before dispatching any browser subagent, verify:

```yaml
□ Is the prompt starting with window resize to 1440x900?
□ Does the prompt have an explicit FAIL condition for /unauthorized?
□ Does the prompt include capture_browser_console_logs in both SETUP and VERIFY?
□ Does the prompt describe elements by text/role, NOT by pixel coordinates?
□ Does the final report specification include current URL?
□ Is the subagent told NOT to click "Continue with Google"?
```

---

## Antigravity IDE–Specific Rules

These constraints apply specifically to the Antigravity IDE browser subagent environment:

1. **Never instruct the subagent to write to a file.** File editing tools fail inside subagent context (empty file error). Report everything in the final text response.
2. **Do not cancel a running subagent.** Cancellation destroys all browser state and captured screenshots — those tabs stay open as orphaned `/unauthorized` pages.
3. **The default viewport is 710x665 (mobile).** This hides the desktop sidebar. Always resize first.
4. **`capture_browser_console_logs` is not automatic.** It must be explicitly invoked in the prompt.
5. **Recording is always saved** to the artifacts directory as a `.webp` file — reference it in your walkthrough for visual proof.

---

## Integration with LOCAL-TESTING-PROCESS-GUIDE.md

This skill feeds directly into Section 3 (Automated Browser Testing) of `LOCAL-TESTING-PROCESS-GUIDE.md`. Any updates to the template prompt here should be synced there.
