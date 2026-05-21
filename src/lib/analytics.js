// Tiny wrapper around Umami's custom-event tracking, plus a loader that
// injects the Umami script AFTER the app has rendered.
//
// Why load it from JS instead of a <script> tag in index.html?
//   • If an ad/tracker blocker (uBlock Origin, etc.) blocks the analytics
//     request, the app is already on screen — the block cannot affect the
//     page. Analytics is strictly optional and fully decoupled from the UI.
//   • Every call is guarded so nothing ever throws if Umami is absent.
//
// SETUP: paste your real Umami website ID into UMAMI_WEBSITE_ID below.
// Leave it as the placeholder to disable analytics entirely (harmless).

const UMAMI_WEBSITE_ID = "6eef6fa2-4731-44d6-a8ca-bc16ff89df3a"; // Umami website UUID for shove-lab.vercel.app
const UMAMI_SRC = "https://cloud.umami.is/script.js";      // ← change only if self-hosting

// Inject the Umami script once, after the app has mounted. Safe to call
// multiple times (it guards against double-injection). Any failure —
// including the request being blocked — is silently ignored.
export function loadAnalytics() {
  try {
    if (typeof document === "undefined") return;
    if (!UMAMI_WEBSITE_ID || UMAMI_WEBSITE_ID === "YOUR_UMAMI_WEBSITE_ID") return; // not configured
    if (document.querySelector("script[data-website-id]")) return; // already added

    const s = document.createElement("script");
    s.defer = true;
    s.src = UMAMI_SRC;
    s.setAttribute("data-website-id", UMAMI_WEBSITE_ID);
    s.onerror = () => {}; // blocked or failed — ignore, app is unaffected
    document.head.appendChild(s);
  } catch {
    // Never let analytics setup break the app.
  }
}

// Track a custom event. No-ops safely if Umami isn't loaded (e.g. blocked,
// or not configured), so the rest of the app never has to care.
//
// Usage:  import { track } from "../lib/analytics.js";
//         track("drill-start", { drill: "pot-odds" });
export function track(eventName, data) {
  try {
    if (typeof window !== "undefined" && window.umami && typeof window.umami.track === "function") {
      if (data) window.umami.track(eventName, data);
      else window.umami.track(eventName);
    }
  } catch {
    // Never let analytics break the app.
  }
}
