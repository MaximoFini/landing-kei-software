"use client"

import { Fragment } from "react"
import Image from "next/image"
import { Pill } from "@/components/landing/primitives"

function Chip({ children, i = 0 }: { children: string; i?: number }) {
  return (
    <span className="k-mark" style={{ "--i": i } as React.CSSProperties}>
      {children}
    </span>
  )
}

/** Types `text` one character at a time (CSS only). `from` is the first slot index. */
function Typed({ text, from, last = false }: { text: string; from: number; last?: boolean }) {
  const words = text.split(" ")
  let n = from
  const total = text.replace(/ /g, "").length
  return (
    <>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {[...w].map((ch, ci) => {
              const idx = n++
              const isLast = last && idx === from + total - 1
              return (
                <span key={ci} className="k-ch" data-last={isLast ? "" : undefined} style={{ "--c": idx } as React.CSSProperties}>
                  {ch}
                </span>
              )
            })}
          </span>
          {wi < words.length - 1 && " "}
        </Fragment>
      ))}
    </>
  )
}

/**
 * Backdrop: KEI's isotipo, huge and cropped by the right edge, at very low
 * opacity, so the first screen isn't an empty white sheet. Same six facets as
 * the logo; each has a light-mode and a dark-mode opacity (see .k-hero__f).
 */
function Backdrop() {
  // [points, light fill, light opacity, dark fill, dark opacity]
  const facets = [
    ["400,55 222,174 400,290", "#3f7dff", 0.1, "#3f7dff", 0.14], // top-left
    ["400,55 578,174 400,290", "#3f7dff", 0.06, "#3f7dff", 0.1], // top-right
    ["222,174 400,290 222,412", "#3f7dff", 0.12, "#3f7dff", 0.16], // left
    ["578,174 400,290 578,412", "#3f7dff", 0.09, "#3f7dff", 0.12], // right
    ["222,412 400,290 400,579", "#3f7dff", 0.22, "#16205e", 0.55], // bottom-left
    ["578,412 400,290 400,579", "#3f7dff", 0.16, "#16205e", 0.4], // bottom-right
  ] as const
  return (
    <div className="k-hero__bg" aria-hidden="true">
      <svg viewBox="212 45 376 544" className="k-hero__gem" fill="none">
        {facets.map(([pts, fl, l, fd, d]) => (
          <polygon
            key={pts}
            points={pts}
            className="k-hero__f"
            style={{ "--fl": fl, "--l": l, "--fd": fd, "--d": d } as React.CSSProperties}
          />
        ))}
      </svg>
    </div>
  )
}

/** Intro splash (variant B): "KEI Software" types itself, the isotipo lands, then it lifts away. */
export function Splash() {
  return (
    <div className="k-splash" aria-hidden="true">
      <div className="k-splash__mark k-display">
        <Image
          src="/brand/kei-isotipo.png"
          alt=""
          width={256}
          height={313}
          priority
          className="k-splash__logo"
        />
        <span>
          <Typed text="KEI Software" from={0} last />
        </span>
      </div>
    </div>
  )
}

/** The hero is type and two actions, centred with room to breathe. */
export function Hero() {
  return (
    <section
      className="k-hero relative flex min-h-[92svh] flex-col justify-center overflow-hidden md:min-h-[100svh]"
      aria-labelledby="hero-title"
    >
      <Backdrop />
      <div className="k-wrap relative z-10 flex flex-col items-center pb-[clamp(4rem,10vh,8rem)] pt-[clamp(7.5rem,15vh,10rem)] text-center">
        <h1 id="hero-title" className="k-display k-h1 k-hero__title">
          <span className="block">Software a medida.</span>
          <span className="block">
            <Image
              src="/brand/kei-isotipo.png"
              alt=""
              width={256}
              height={313}
              priority
              className="mx-[0.12em] inline-block align-[-0.04em]"
              style={{ display: "inline-block", height: "0.74em", width: "auto" }}
            />
            <span className="text-[var(--k-blue)]">Resultados reales.</span>
          </span>
        </h1>

        <p className="k-hero__sub mt-9 max-w-[40rem] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.7] text-[var(--k-ink-soft)]">
          Creamos <span className="whitespace-nowrap"><Chip>sistemas</Chip>,</span>{" "}
          <span className="whitespace-nowrap"><Chip i={1}>inteligencia artificial</Chip></span> y{" "}
          <span className="whitespace-nowrap"><Chip i={2}>sitios web</Chip> a&nbsp;medida</span> para que tu negocio trabaje mejor.
        </p>

        <div className="k-hero__cta mt-11 flex flex-wrap items-center justify-center gap-3">
          <Pill href="#contacto">Hablemos</Pill>
          <Pill href="#proyectos" variant="light" dot={false}>
            Ver proyectos
          </Pill>
        </div>
      </div>
    </section>
  )
}
