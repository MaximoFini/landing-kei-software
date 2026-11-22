import { setAnalytics } from "@/lib/analytics"

/**
 * PostHog — analytics, session replay, heatmaps and error tracking.
 *
 * posthog-js is the heaviest script on the landing, so it is NOT part of the
 * first load: it is fetched once the page has loaded and the main thread is
 * idle (≈1–2 s after arrival), so the intro and hero never wait on it. The
 * first pageview is still captured on init. Events go through the same-origin
 * `/ingest` rewrite (see next.config.mjs) so ad blockers don't drop them.
 *
 * Without NEXT_PUBLIC_POSTHOG_KEY nothing is initialised (local dev, previews).
 */
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

function start() {
  if (!key) return
  import("posthog-js").then(({ default: posthog }) => {
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
      // No surveys are used; skip downloading their bundle.
      disable_surveys: true,
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug()
        setAnalytics(posthog)
      },
    })
  })
}

if (key && typeof window !== "undefined") {
  const idle = () =>
    "requestIdleCallback" in window ? requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 1200)
  if (document.readyState === "complete") idle()
  else window.addEventListener("load", idle, { once: true })
}
