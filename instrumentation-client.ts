import posthog from "posthog-js"

/**
 * PostHog — analytics, session replay, heatmaps and error tracking.
 *
 * Next.js runs this file in the browser before the app hydrates, so the very
 * first pageview and every click after it are captured. Events go through the
 * same-origin `/ingest` rewrite (see next.config.mjs) so ad blockers don't
 * drop them.
 *
 * Without NEXT_PUBLIC_POSTHOG_KEY nothing is initialised (local dev, previews).
 */
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

if (key && typeof window !== "undefined") {
  posthog.init(key, {
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || "https://us.posthog.com",
    // Pageviews on client-side navigation, pageleave, modern defaults.
    defaults: "2026-08-30",
    // Anonymous visitors get a person profile too: this is a landing page,
    // almost nobody will ever be "identified".
    person_profiles: "always",
    autocapture: true,
    capture_pageview: "history_change",
    capture_pageleave: true,
    rageclick: true,
    capture_dead_clicks: true,
    capture_heatmaps: true,
    capture_exceptions: true,
    capture_performance: { web_vitals: true, network_timing: true },
    session_recording: {
      // Field values stay masked in replays; the contact form reports what
      // was submitted through its own events instead.
      maskAllInputs: true,
      recordCrossOriginIframes: false,
    },
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") ph.debug()
    },
  })
}
