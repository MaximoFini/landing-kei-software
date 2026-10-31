import posthog from "posthog-js"

/** True once PostHog has been initialised (it isn't without a key). */
export function analyticsReady() {
  return typeof window !== "undefined" && posthog.__loaded
}

/** Captures an event; a no-op when analytics is off. */
export function track(event: string, properties?: Record<string, unknown>, beacon = false) {
  if (!analyticsReady()) return
  posthog.capture(event, properties, beacon ? { transport: "sendBeacon" } : undefined)
}

/** Elements that count as a "section" of a page for visibility tracking. */
export const SECTION_SELECTOR = "[data-section], section, article, footer"

const slug = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)

/** Stable name for a section: data-section, id, its heading's id, or its heading's text. */
export function sectionName(section: Element): string {
  return (
    section.getAttribute("data-section") ||
    section.id ||
    section.getAttribute("aria-labelledby")?.replace(/-title$/, "") ||
    slug(section.querySelector("h1, h2, h3")?.textContent ?? "") ||
    section.tagName.toLowerCase()
  )
}

/**
 * Ties this visitor (and their earlier anonymous visits and replays) to the
 * lead they just became, keyed by phone number.
 */
export function identifyLead(lead: { name: string; phone: string }) {
  if (!analyticsReady()) return
  const digits = lead.phone.replace(/\D/g, "")
  posthog.identify(`lead_${digits}`, {
    name: lead.name.trim(),
    phone: lead.phone.trim(),
    lead_source: "contact_form",
  })
}

/** Name of the section an element sits in, or "nav" for the floating header. */
export function sectionOf(el: Element | null): string | null {
  if (!el) return null
  if (el.closest("header")) return "nav"
  const section = el.closest(SECTION_SELECTOR)
  return section ? sectionName(section) : null
}

/** Classifies a link by where it takes the visitor. */
export function linkChannel(href: string): string | null {
  if (/wa\.me|whatsapp\.com/i.test(href)) return "whatsapp"
  if (href.startsWith("mailto:")) return "email"
  if (href.startsWith("tel:")) return "phone"
  if (/instagram\.com/i.test(href)) return "instagram"
  if (/linkedin\.com/i.test(href)) return "linkedin"
  return null
}

/**
 * What the visitor did on the current page, shared between the global tracker
 * and the contact form so the end-of-visit summary can say what they did NOT do.
 */
export const visit = {
  ctaClicks: 0,
  contactClicks: [] as string[],
  formStarted: false,
  formSubmitted: false,
  reset() {
    this.ctaClicks = 0
    this.contactClicks = []
    this.formStarted = false
    this.formSubmitted = false
  },
}
