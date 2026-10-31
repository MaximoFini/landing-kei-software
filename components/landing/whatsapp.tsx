"use client"

import { useEffect, useState } from "react"
import { WHATSAPP_URL } from "@/components/landing/data"

/** Discreet WhatsApp pill; it shows up once the hero is behind you. */
export function WhatsApp() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      data-section="whatsapp-flotante"
      tabIndex={shown ? 0 : -1}
      className="k-roll-host fixed bottom-4 right-4 z-50 flex h-12 items-center gap-2.5 rounded-full bg-[#020714] pl-3 pr-4 text-[#f9fafc] shadow-[0_18px_40px_-16px_rgba(2,7,20,0.6)] ring-1 ring-white/10 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] sm:bottom-6 sm:right-6"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(16px)",
        pointerEvents: shown ? "auto" : "none",
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-[#3f7dff]" aria-hidden="true">
        <path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.874.508 3.628 1.393 5.135L2 22l5.03-1.35A9.955 9.955 0 0012 22c5.523 0 10-4.478 10-10S17.523 2 12.001 2zm0 18.062a8.02 8.02 0 01-4.087-1.117l-.293-.174-3.032.813.814-2.976-.19-.306A8.017 8.017 0 014 12c0-4.411 3.589-8 8.001-8 4.411 0 7.999 3.589 7.999 8s-3.588 8.062-7.999 8.062z" />
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      </svg>
      <span className="k-roll text-[0.6875rem] font-semibold uppercase tracking-[0.12em]">
        <span className="k-roll__a">WhatsApp</span>
        <span className="k-roll__b" aria-hidden="true">
          WhatsApp
        </span>
      </span>
    </a>
  )
}
