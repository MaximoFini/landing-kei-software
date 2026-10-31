"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { SECTION_SELECTOR, analyticsReady, linkChannel, sectionName, sectionOf, track, visit } from "@/lib/analytics"

/** A section counts as seen once it fills this share of the viewport (or is this share visible itself). */
const SEEN_RATIO = 0.4
const SCROLL_MILESTONES = [25, 50, 75, 90, 100]
/** Without input for this long, the visitor no longer counts as engaged. */
const IDLE_MS = 30_000

/**
 * Behaviour PostHog's autocapture doesn't cover on its own: which sections
 * were seen (and for how long), scroll depth, CTA / contact-channel clicks,
 * copied text, engaged time, and an end-of-visit summary that lists what the
 * visitor never saw or did. One instance lives in the root layout and
 * restarts on every route change.
 */
export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!analyticsReady()) return

    visit.reset()
    const startedAt = performance.now()
    const seen = new Set<string>()
    const dwell = new Map<string, number>()
    const visibleSince = new Map<string, number>()
    const milestones = new Set<number>()
    let maxScroll = 0
    let engagedMs = 0
    let lastInput = performance.now()
    let lastTick = performance.now()
    let summaries = 0
    let lastSummaryAt = -Infinity

    // ---- Sections: first view + time on screen -----------------------------
    const sections = Array.from(document.querySelectorAll(SECTION_SELECTOR)).filter(
      (el, _, all) =>
        // Only outermost sections (nested ones would double count), and not
        // fixed overlays like the floating WhatsApp pill, which never scroll.
        !all.some((other) => other !== el && other.contains(el)) && getComputedStyle(el).position !== "fixed"
    )
    const names = sections.map(sectionName)

    const stopDwell = (name: string) => {
      const since = visibleSince.get(name)
      if (since === undefined) return
      dwell.set(name, (dwell.get(name) ?? 0) + performance.now() - since)
      visibleSince.delete(name)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const name = sectionName(entry.target)
          const viewport = entry.rootBounds?.height || window.innerHeight
          const ofViewport = entry.intersectionRect.height / viewport
          const isSeen = entry.isIntersecting && (ofViewport >= SEEN_RATIO || entry.intersectionRatio >= SEEN_RATIO)
          if (isSeen) {
            if (!visibleSince.has(name)) visibleSince.set(name, performance.now())
            if (!seen.has(name)) {
              seen.add(name)
              track("section_viewed", {
                section: name,
                section_index: names.indexOf(name),
                seconds_since_load: Math.round((performance.now() - startedAt) / 1000),
              })
            }
          } else {
            stopDwell(name)
          }
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1] }
    )
    sections.forEach((s) => io.observe(s))

    // ---- Scroll depth ------------------------------------------------------
    const onScroll = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      const pct = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 100
      maxScroll = Math.max(maxScroll, pct)
      for (const m of SCROLL_MILESTONES) {
        if (pct >= m && !milestones.has(m)) {
          milestones.add(m)
          track("scroll_depth_reached", { depth: m })
        }
      }
    }

    // ---- Engaged time (tab visible + some input in the last 30s) -----------
    const markInput = () => {
      lastInput = performance.now()
    }
    const tick = () => {
      const now = performance.now()
      if (document.visibilityState === "visible" && now - lastInput < IDLE_MS) engagedMs += now - lastTick
      lastTick = now
    }
    const ticker = window.setInterval(tick, 1000)

    // ---- Clicks on links: CTAs, contact channels, outbound -----------------
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null
      if (!link) return
      const href = link.getAttribute("href") || ""
      const props = {
        href,
        text: (link.getAttribute("aria-label") || link.innerText || link.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
        section: sectionOf(link),
      }
      const channel = linkChannel(href)
      if (channel) {
        visit.contactClicks.push(channel)
        track("contact_channel_clicked", { ...props, channel })
      } else if (href.startsWith("#") || href.startsWith("/#")) {
        if (href.endsWith("#contacto")) visit.ctaClicks++
        track("cta_clicked", { ...props, target: href.split("#")[1] || "top" })
      } else if (link.host && link.host !== window.location.host) {
        track("outbound_link_clicked", { ...props, domain: link.host })
      }
    }

    // ---- Copied text (a phone number, an email, a phrase) ------------------
    const onCopy = () => {
      const sel = window.getSelection()
      const text = sel?.toString().trim() ?? ""
      if (!text) return
      track("text_copied", {
        text: text.slice(0, 200),
        length: text.length,
        section: sectionOf(sel?.anchorNode?.parentElement ?? null),
      })
    }

    // ---- End of visit: what they saw, what they skipped, what they did -----
    const summary = () => {
      // Closing a tab fires both visibilitychange and pagehide: send one.
      if (performance.now() - lastSummaryAt < 1500) return
      lastSummaryAt = performance.now()
      tick()
      visibleSince.forEach((_, name) => stopDwell(name))
      summaries++
      track(
        "page_visit_summary",
        {
          // A visitor who switches tabs and comes back sends several; the
          // highest index per pageview is the complete one.
          summary_index: summaries,
          total_seconds: Math.round((performance.now() - startedAt) / 1000),
          engaged_seconds: Math.round(engagedMs / 1000),
          max_scroll_depth: maxScroll,
          sections_seen: names.filter((n) => seen.has(n)),
          sections_not_seen: names.filter((n) => !seen.has(n)),
          sections_seen_count: seen.size,
          sections_total: names.length,
          seconds_per_section: Object.fromEntries(
            Array.from(dwell, ([name, ms]) => [name, Math.round(ms / 100) / 10])
          ),
          clicked_contact_cta: visit.ctaClicks > 0,
          contact_channels_clicked: visit.contactClicks,
          contact_form_started: visit.formStarted,
          contact_form_submitted: visit.formSubmitted,
          converted: visit.formSubmitted || visit.contactClicks.length > 0,
        },
        true
      )
    }
    const onVisibility = () => {
      if (document.visibilityState === "hidden") summary()
      else {
        // Coming back: dwell timers restart for whatever is on screen.
        lastTick = performance.now()
        markInput()
        // Re-observing makes the observer report what is on screen right now.
        io.disconnect()
        sections.forEach((s) => io.observe(s))
      }
    }
    const onPageHide = () => summary()

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    for (const ev of ["pointerdown", "keydown", "wheel", "touchstart", "mousemove"] as const) {
      window.addEventListener(ev, markInput, { passive: true })
    }
    document.addEventListener("click", onClick, true)
    document.addEventListener("copy", onCopy)
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("pagehide", onPageHide)

    return () => {
      // Route change inside the app: close out this page.
      summary()
      io.disconnect()
      window.clearInterval(ticker)
      window.removeEventListener("scroll", onScroll)
      for (const ev of ["pointerdown", "keydown", "wheel", "touchstart", "mousemove"] as const) {
        window.removeEventListener(ev, markInput)
      }
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("copy", onCopy)
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pagehide", onPageHide)
    }
  }, [pathname])

  return null
}
