"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Volume2, VolumeX } from "lucide-react"
import { m, AnimatePresence } from "@/lib/motion"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Pill, Roll } from "@/components/landing/primitives"
import { scrollToHash, setScrollLocked } from "@/components/landing/smooth-scroll"

const links = [
  { label: "Servicios", href: "#servicios" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Proceso", href: "#proceso" },
  { label: "Equipo", href: "#equipo" },
]

const strip = [
  "Primera consulta sin cargo",
  "Software a medida",
  "Inteligencia artificial",
  "Automatización",
  "Sitios web",
]

/** Floating dark pill, centered (Osmo), with a running strip tucked under it. */
export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setScrollLocked(open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const toggleSound = () => {
    const audio = audioRef.current
    if (!audio) return
    if (soundOn) {
      audio.pause()
      setSoundOn(false)
    } else {
      audio.volume = 0.35
      void audio.play().then(() => setSoundOn(true)).catch(() => setSoundOn(false))
    }
  }

  const go = (href: string) => {
    setOpen(false)
    // Let the menu release the scroll lock before Lenis moves.
    requestAnimationFrame(() => scrollToHash(href))
  }

  const iconBtn =
    "grid size-10 min-h-0 min-w-0 place-items-center rounded-full text-[#f9fafc]/75 transition-[color,background-color,transform] duration-200 hover:bg-white/10 hover:text-[#f9fafc] active:scale-95"

  return (
    <>
      <header className="k-nav-in pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-3 sm:pt-4">
        <div className="pointer-events-auto relative w-full max-w-[46rem]">
          {/* Strip — slides up behind the pill once the page moves */}
          <div
            aria-hidden="true"
            className="absolute inset-x-5 top-full -mt-5 overflow-hidden rounded-b-2xl bg-[#dfe8fd] pt-5 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{
              transform: scrolled || open ? "translateY(-100%)" : "translateY(0)",
              opacity: scrolled || open ? 0 : 1,
            }}
          >
            <div className="k-strip"><div className="k-marquee py-1.5">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0">
                  {strip.concat(strip).map((t, i) => (
                    <span key={i} className="k-tag flex items-center gap-3 px-3 text-[0.625rem] text-[#020714]">
                      {t}
                      <span className="size-1 rounded-full bg-[#3f7dff]" />
                    </span>
                  ))}
                </div>
              ))}
            </div></div>
          </div>

          <nav
            aria-label="Navegación principal"
            className="relative flex h-14 items-center justify-between gap-2 rounded-full bg-[#020714] py-2 pl-5 pr-2 shadow-[0_18px_40px_-18px_rgba(2,7,20,0.55)] ring-1 ring-white/10"
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                go("#")
              }}
              className="flex min-h-0 min-w-0 items-center"
              aria-label="KEI Software, ir al inicio"
            >
              <Image
                src="/brand/kei-horizontal-oscuro.png"
                alt="KEI Software"
                width={720}
                height={141}
                priority
                style={{ height: "1.375rem", width: "auto" }}
              />
            </a>

            <ul className="hidden items-center gap-1 md:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault()
                      go(l.href)
                    }}
                    className="k-roll-host flex min-h-0 items-center rounded-full px-3 py-2 text-[0.8125rem] font-medium text-[#f9fafc]/70 transition-colors duration-200 hover:text-[#f9fafc]"
                  >
                    <Roll>{l.label}</Roll>
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-0.5">
              <audio ref={audioRef} src="/audio/hero-theme.mp3" loop preload="none" />
              <AnimatedThemeToggler className={iconBtn} />
              <button
                type="button"
                onClick={toggleSound}
                className={iconBtn}
                aria-pressed={soundOn}
                aria-label={soundOn ? "Silenciar música" : "Reproducir música"}
              >
                {soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </button>
              <Pill href="#contacto" variant="ice" size="sm" className="ml-1 hidden !h-10 sm:inline-flex">
                Hablemos
              </Pill>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="ml-1 flex h-10 min-h-0 items-center gap-2 rounded-full bg-white/10 px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#f9fafc] md:hidden"
                aria-expanded={open}
                aria-controls="k-menu"
              >
                {open ? "Cerrar" : "Menú"}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="k-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            className="fixed inset-0 z-[55] flex flex-col bg-[var(--k-ground)] px-5 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] pt-28 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
          >
            <ul className="flex flex-1 flex-col justify-center gap-1">
              {links.concat({ label: "Contacto", href: "#contacto" }).map((l, i) => (
                <m.li
                  key={l.href}
                  initial={{ opacity: 0, transform: "translateY(24px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  transition={{ delay: 0.18 + i * 0.05, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault()
                      go(l.href)
                    }}
                    className="k-display block py-1 text-[3.25rem] text-[var(--k-ink)]"
                  >
                    {l.label}
                  </a>
                </m.li>
              ))}
            </ul>
            <Pill
              href="#contacto"
              onClick={(e) => {
                e.preventDefault()
                go("#contacto")
              }}
              className="w-full justify-center"
            >
              Primera consulta sin cargo
            </Pill>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
