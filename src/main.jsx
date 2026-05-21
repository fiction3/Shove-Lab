import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { loadAnalytics } from "./lib/analytics.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Load privacy-friendly analytics AFTER the app has rendered, and only when
// the browser is idle, so it can never delay or affect the page. If a tracker
// blocker blocks the request, the app is already on screen and unaffected.
if (typeof window !== "undefined") {
  const start = () => loadAnalytics();
  if ("requestIdleCallback" in window) window.requestIdleCallback(start);
  else window.setTimeout(start, 1200);
}
