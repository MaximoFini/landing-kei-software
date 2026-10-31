"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { m, useReducedMotion, useScroll, useTransform } from "@/lib/motion"
import { Fade, Lines, Pill, Tags, useReveal } from "@/components/landing/primitives"
import { scrollToHash } from "@/components/landing/smooth-scroll"
import { projects, services } from "@/components/landing/data"

/* ---------------------------------------------------------------------------
   Statement — Lusion's "Bold Ideas, Brought to Life", where the thick blue
   thread starts its fall down the page.
   ------------------------------------------------------------------------ */
export function Statement() {
  // The blue arc that opens here is drawn by <Thread>, which carries it down the page.
  return (
    <section className="k-section relative" aria-labelledby="statement-title">
      <div className="k-wrap relative">
        <Lines
          id="statement-title"
          className="k-display k-h2 max-w-[17ch]"
          lines={[<span key="a" className="inline-block md:pl-[1.4em]">Ideas claras,</span>, "software que funciona."]}
        />

        <div className="mt-[clamp(3rem,7vw,6rem)] grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5 md:col-start-8">
            <Fade>
              <p className="k-body max-w-[34rem] text-[var(--k-ink)]">
                Somos tres co-fundadores que trabajamos directo con vos. Entendemos cómo funciona tu negocio y
                construimos el sistema exacto que necesita: con precio fijo, demos semanales y soporte el primer mes.
              </p>
            </Fade>
            <Fade delay={1} className="mt-8">
              <Pill href="#proceso" variant="light">
                Cómo trabajamos
              </Pill>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   Services — Osmo's ruled rows: name on the left, explanation on the right.
   ------------------------------------------------------------------------ */
export function Services() {
  return (
    <section id="servicios" className="k-section" aria-labelledby="servicios-title">
      <div className="k-wrap">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Lines as="h2" id="servicios-title" className="k-display k-h2 md:col-span-7" lines={["Qué hacemos"]} />
        </div>

        <ul className="mt-[clamp(3rem,6vw,5.5rem)]">
          {services.map((s, i) => (
            <ServiceRow key={s.title} service={s} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function ServiceRow({ service, index }: { service: (typeof services)[number]; index: number }) {
  const ref = useReveal<HTMLLIElement>()
  return (
    <li ref={ref} className="k-lines relative grid gap-4 py-[clamp(1.75rem,3vw,2.75rem)] md:grid-cols-12 md:gap-8">
      <span
        aria-hidden="true"
        className="k-rule absolute inset-x-0 top-0 h-px bg-[var(--k-line)]"
        style={{ "--i": index } as React.CSSProperties}
      />
      <h3 className="k-line md:col-span-6">
        <span className="k-display k-h3" style={{ "--i": index } as React.CSSProperties}>
          {service.title}
        </span>
      </h3>
      <div className="k-fade md:col-span-5 md:col-start-8" style={{ "--i": index + 1 } as React.CSSProperties}>
        <p className="k-body max-w-[32rem]">{service.description}</p>
        <Tags items={service.tags} className="mt-4 text-[var(--k-ink-faint)]" />
      </div>
    </li>
  )
}

/* ---------------------------------------------------------------------------
   Reel — Lusion's "PLAY REEL" panel: a wide rounded window onto the real work
   that opens up as it scrolls into view.
   ------------------------------------------------------------------------ */
export function Reel() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const inset = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [7, 0])
  const clip = useTransform(inset, (v) => `inset(0 ${v}% 0 ${v}% round var(--k-radius-panel))`)
  const [active, setActive] = useState(0)
  // Plain photographs only: shots with a big logo or headline baked in fight the title.
  const reel = projects.filter((p) => p.title === "Stability" || p.title === "Centro Automotores")

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setActive((a) => (a + 1) % reel.length), 3200)
    return () => clearInterval(id)
  }, [reduce, reel.length])

  return (
    <div className="k-wrap" data-section="reel">
      <div ref={ref} className="k-marks">
        <a
          href="#proyectos"
          onClick={(e) => {
            e.preventDefault()
            scrollToHash("#proyectos")
          }}
          aria-label="Ver nuestro trabajo"
          className="k-roll-host group relative block aspect-[4/5] sm:aspect-[16/8]"
        >
          <m.div className="absolute inset-0 overflow-hidden bg-[#16205e]" style={{ clipPath: clip }}>
            {reel.map((p, i) => (
              <Image
                key={p.title}
                src={p.image}
                alt=""
                fill
                sizes="100vw"
                className="object-cover transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{
                  // Keep Stability's logo plate out of the wide crop, away from the title.
                  objectPosition: p.title === "Stability" ? "12% 50%" : p.position,
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "scale(1)" : "scale(1.06)",
                }}
              />
            ))}
            <div className="absolute inset-0 bg-[#020714]/60 sm:bg-[#020714]/50" />
          </m.div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-[#f9fafc] sm:flex-row sm:gap-[2.5vw]">
            <span className="k-display text-[clamp(2.75rem,5.6vw,6rem)] leading-none">NUESTRO</span>
            <span className="k-pill k-pill--on-dark shrink-0 !h-[clamp(2.75rem,4.4vw,4rem)] !px-[clamp(1.1rem,2vw,1.75rem)]">
              <span className="k-pill__dot" aria-hidden="true" />
              <span className="k-roll">
                <span className="k-roll__a">Ver</span>
                <span className="k-roll__b" aria-hidden="true">
                  Ver
                </span>
              </span>
            </span>
            <span className="k-display text-[clamp(2.75rem,5.6vw,6rem)] leading-none">TRABAJO</span>
          </div>
          <p className="k-tag absolute left-[calc(7%+1.25rem)] top-6 text-[#f9fafc]/85">
            {reel[active].title}
          </p>
        </a>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Projects — Lusion's "Featured Work": a two-column grid of big rounded
   images, bullet tags above each title.
   ------------------------------------------------------------------------ */
export function Projects() {
  return (
    <section id="proyectos" className="k-section" aria-labelledby="proyectos-title">
      <div className="k-wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Lines as="h2" id="proyectos-title" className="k-display k-h2" lines={["Proyectos"]} />
          <Fade>
            <p className="k-body max-w-[22rem] md:text-right">
              Sistemas, plataformas y sitios reales, hechos para negocios que querían crecer.
            </p>
          </Fade>
        </div>

        <ul className="mt-[clamp(2.5rem,5vw,4.5rem)] grid gap-x-[clamp(1rem,2vw,2rem)] gap-y-[clamp(3rem,5vw,4.5rem)] md:grid-cols-6">
          {projects.map((p, i) => {
            // Five projects: a pair on top, a trio below, so no row is left with a lone card.
            const wide = i < 2
            const body = (
              <>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--k-radius-panel)] bg-[var(--k-ice)]">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes={wide ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
                    className="object-cover"
                    style={{ objectPosition: p.position }}
                  />
                  {/* Hairline edge: light screenshots otherwise melt into the page. */}
                  <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-[var(--k-line)]" />
                  {p.link && (
                    <span className="k-pill k-pill--light k-pill--sm absolute bottom-4 left-4 translate-y-3 opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
                      Ver proyecto
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  )}
                </div>
                <h3
                  className={`k-display mt-5 ${wide ? "text-[clamp(1.75rem,2.6vw,2.4rem)]" : "text-[clamp(1.6rem,2vw,2rem)]"}`}
                >
                  {p.title}
                  <span className="ml-3 align-middle text-[0.875rem] font-medium tracking-normal text-[var(--k-ink-faint)] [font-family:var(--font-montserrat)]">
                    {p.category}
                  </span>
                </h3>
                <p className="k-body mt-2 max-w-[34rem] text-[0.95rem]">{p.description}</p>
                <Tags items={p.tags} className="mt-4 text-[var(--k-ink-faint)]" />
              </>
            )
            return (
              <Fade as="li" key={p.title} delay={wide ? i : i - 2} className={wide ? "md:col-span-3" : "md:col-span-2"}>
                {p.link ? (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mx-2 block md:mx-0"
                    aria-label={`${p.title}: ${p.description} (se abre en una pestaña nueva)`}
                  >
                    {body}
                  </a>
                ) : (
                  <div className="mx-2 md:mx-0">{body}</div>
                )}
              </Fade>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
