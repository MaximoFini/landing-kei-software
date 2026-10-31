"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ArrowUpRight, Instagram, Mail, MessageCircle } from "lucide-react"
import { m, useReducedMotion, useScroll, useTransform } from "@/lib/motion"
import { Fade, Lines, Pill, useReveal } from "@/components/landing/primitives"
import { WHATSAPP_URL, bleedLogos, clients, steps, team, testimonials } from "@/components/landing/data"
import { identifyLead, track, visit } from "@/lib/analytics"

/* ---------------------------------------------------------------------------
   Process — a navy rounded panel (Osmo's dark slab). The four steps sit in
   columns; a blue line runs across them as the panel scrolls through.
   ------------------------------------------------------------------------ */
export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] })
  const fill = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1])
  const fillTransform = useTransform(fill, (v) => `scaleX(${v})`)

  return (
    <section id="proceso" className="k-wrap" aria-labelledby="proceso-title">
      {/* Aligned to the content width so the page margins stay clear for the blue thread. */}
      <div className="k-marks rounded-[var(--k-radius-panel)] bg-[#16205e] py-[clamp(3.5rem,10vw,9rem)] text-[#f9fafc]">
        <div className="px-[clamp(1.25rem,4vw,4rem)]">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <Lines as="h2" id="proceso-title" className="k-display k-h2 md:col-span-7" lines={["Cómo trabajamos"]} />
          </div>

          <div ref={ref} className="relative mt-[clamp(3.5rem,7vw,6rem)]">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 hidden h-px bg-[#dfe8fd]/20 md:block">
              <m.div
                className="h-full origin-left bg-[var(--k-blue)]"
                style={{ transform: fillTransform }}
              />
            </div>
            <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
              {steps.map((s, i) => (
                <Fade as="li" key={s.title} delay={i} className="relative md:pt-10">
                  <span
                    aria-hidden="true"
                    className="absolute -top-[5px] left-0 hidden size-[11px] rounded-full border-2 border-[#16205e] bg-[var(--k-blue)] md:block"
                  />
                  <span className="k-display block text-[clamp(3rem,5vw,4.5rem)] leading-none text-[#dfe8fd]/35">
                    {i + 1}
                  </span>
                  <h3 className="k-display mt-5 text-[1.75rem] leading-tight">{s.title}</h3>
                  <p className="k-body mt-3 text-[0.98rem] text-[var(--k-on-dark-soft)]">{s.description}</p>
                </Fade>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   Voices — client logos in a pill-labelled row, then a rail of quotes that
   can be dragged with the mouse (native swipe on touch).
   ------------------------------------------------------------------------ */
/** The rail renders the quotes this many times and always rests on the middle copy. */
const LOOP_COPIES = 3

/** Width of one full set of quotes, measured from card offsets so gaps are included. */
function loopWidth(el: HTMLElement) {
  const cards = el.querySelectorAll<HTMLElement>("li")
  const n = cards.length / LOOP_COPIES
  return cards[n] && cards[0] ? cards[n].offsetLeft - cards[0].offsetLeft : 0
}

/** Keeps scrollLeft inside the middle copy by jumping exactly one set. Returns the shift applied. */
function wrapLoop(el: HTMLElement) {
  const w = loopWidth(el)
  if (!w) return 0
  let shift = 0
  if (el.scrollLeft < w * 0.5) shift = w
  else if (el.scrollLeft > w * 1.5) shift = -w
  if (shift) el.scrollLeft += shift
  return shift
}

export function Voices() {
  const rail = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = rail.current
    if (!el) return
    // Start on the middle copy so there is room to go both ways.
    el.scrollTo({ left: loopWidth(el), behavior: "instant" })
    const onScroll = () => {
      const shift = wrapLoop(el)
      if (shift) startLeft += shift
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    // Mouse drag-to-scroll with a short momentum tail.
    let down = false
    let startX = 0
    let startLeft = 0
    let lastX = 0
    let lastT = 0
    let v = 0
    let raf = 0
    let moved = false
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return
      down = true
      moved = false
      startX = lastX = e.clientX
      startLeft = el.scrollLeft
      lastT = performance.now()
      v = 0
      cancelAnimationFrame(raf)
      el.style.scrollSnapType = "none"
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 4) moved = true
      const now = performance.now()
      v = (e.clientX - lastX) / Math.max(1, now - lastT)
      lastX = e.clientX
      lastT = now
      el.scrollLeft = startLeft - dx
    }
    const onUp = () => {
      if (!down) return
      down = false
      if (moved) track("testimonials_browsed", { method: "drag" })
      let vel = -v * 16
      const tick = () => {
        vel *= 0.92
        el.scrollLeft += vel
        if (Math.abs(vel) > 0.4) raf = requestAnimationFrame(tick)
        else el.style.scrollSnapType = ""
      }
      raf = requestAnimationFrame(tick)
    }
    const onClick = (e: MouseEvent) => {
      if (moved) e.preventDefault()
    }
    el.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    el.addEventListener("click", onClick, true)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      el.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      el.removeEventListener("click", onClick, true)
    }
  }, [])

  const nudge = (dir: 1 | -1) => {
    const el = rail.current
    if (!el) return
    track("testimonials_browsed", { method: "arrow", direction: dir === 1 ? "next" : "previous" })
    // Re-centre before moving so the smooth scroll is never cut short by a jump.
    wrapLoop(el)
    const card = el.querySelector("li")
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 400) + 16), behavior: "smooth" })
  }

  const arrowBtn =
    "grid size-12 place-items-center rounded-full bg-[var(--k-card)] text-[var(--k-ink)] shadow-[0_8px_24px_-14px_rgba(2,7,20,0.35)] transition-[opacity,transform] duration-200 active:scale-95 disabled:opacity-35"

  return (
    <section className="k-section overflow-hidden" aria-labelledby="voces-title">
      <div className="k-wrap">
        <Fade className="flex flex-col items-center gap-6">
          <span className="k-tag rounded-full border border-[var(--k-line)] px-4 py-1.5 text-[var(--k-ink-soft)]">
            Confían en nosotros
          </span>
          <ul className="flex flex-wrap items-center justify-center gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-5">
            {clients.map((c) => (
              <li key={c.name} className="flex items-center gap-3">
                <span className="relative size-11 overflow-hidden rounded-full bg-[#f9fafc] ring-1 ring-[var(--k-line)]">
                  <Image src={c.logo} alt="" fill sizes="44px" className={bleedLogos.has(c.logo) ? "object-cover" : "object-contain p-1.5"} />
                </span>
                <span className="text-[0.95rem] font-semibold">{c.name}</span>
              </li>
            ))}
          </ul>
        </Fade>

        <div className="mt-[clamp(4.5rem,9vw,8rem)] flex items-end justify-between gap-6">
          <Lines
            as="h2"
            id="voces-title"
            className="k-display k-h2 max-w-[12ch]"
            lines={["Lo que dicen", "nuestros clientes"]}
          />
          <div className="hidden shrink-0 gap-2 md:flex">
            <button type="button" className={arrowBtn} onClick={() => nudge(-1)} aria-label="Testimonio anterior">
              <ArrowLeft className="size-4" />
            </button>
            <button type="button" className={arrowBtn} onClick={() => nudge(1)} aria-label="Testimonio siguiente">
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Kept inside the content width so the page margins stay clear for the blue thread. */}
      <div className="k-wrap">
      <ul
        ref={rail}
        className="k-rail mt-[clamp(2.5rem,5vw,4rem)] flex items-start cursor-grab md:items-stretch snap-x snap-mandatory gap-4 overflow-x-auto pb-4 active:cursor-grabbing"
        aria-label="Testimonios de clientes"
      >
        {Array.from({ length: LOOP_COPIES }, (_, copy) => testimonials.map((t) => ({ t, copy }))).flat().map(({ t, copy }) => (
          <li
            key={`${copy}-${t.name}`}
            aria-hidden={copy === 1 ? undefined : true}
            className="relative flex w-[min(84vw,27rem)] shrink-0 snap-start flex-col justify-between gap-10 rounded-[var(--k-radius-card)] bg-[var(--k-ice)] p-[clamp(1.5rem,2.5vw,2.25rem)] select-none"
          >
            <blockquote className="text-[1.0625rem] leading-[1.7] text-[var(--k-ink)]">“{t.quote}”</blockquote>
            <div className="flex items-center gap-3">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#f9fafc]">
                <Image src={t.logo} alt="" fill sizes="48px" className={bleedLogos.has(t.logo) ? "object-cover" : "object-contain p-1.5"} draggable={false} />
              </span>
              <span>
                <span className="block font-semibold">{t.name}</span>
                <span className="block text-[0.875rem] text-[var(--k-ink-soft)]">
                  {t.role}, {t.company}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   Team — Osmo's author card, three times: a colored rounded card, the name
   set big, the portrait in a circle.
   ------------------------------------------------------------------------ */
const cardTones = [
  { bg: "bg-[var(--k-blue)]", fg: "text-[#020714]", soft: "text-[#020714]/70", pill: "light" as const },
  { bg: "bg-[#16205e]", fg: "text-[#f9fafc]", soft: "text-[#dfe8fd]/75", pill: "on-dark" as const },
  // Fixed light palette: --k-ice / --k-ink flip in dark mode, this card should not.
  { bg: "bg-[#dfe8fd]", fg: "text-[#020714]", soft: "text-[rgba(2,7,20,0.64)]", pill: "ink" as const },
]

export function Team() {
  return (
    <section id="equipo" className="k-section pt-0" aria-labelledby="equipo-title">
      <div className="k-wrap">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Lines as="h2" id="equipo-title" className="k-display k-h2 md:col-span-7" lines={["Quiénes somos"]} />
          <Fade className="md:col-span-4 md:col-start-9">
            <p className="k-body">Tres co-fundadores. Hablás directo con las personas que construyen tu sistema.</p>
          </Fade>
        </div>

        <ul className="mt-[clamp(2.5rem,5vw,4.5rem)] grid gap-[clamp(0.75rem,1.4vw,1.25rem)] md:grid-cols-3">
          {team.map((p, i) => {
            const tone = cardTones[i]
            const [first, ...rest] = p.name.split(" ")
            return (
              <Fade as="li" key={p.name} delay={i}>
                <article
                  className={`group relative mx-2 flex flex-col md:mx-0 md:aspect-[4/5] overflow-hidden rounded-[var(--k-radius-panel)] p-[clamp(1.5rem,2.4vw,2.25rem)] ${tone.bg} ${tone.fg}`}
                >
                  <h3 className="k-display text-[clamp(2.25rem,3.4vw,3.25rem)] leading-[0.95]">
                    {first}
                    <br />
                    {rest.join(" ")}
                  </h3>
                  <p className={`mt-3 text-[0.9375rem] font-medium ${tone.soft}`}>{p.role}</p>

                  <div className="relative mx-auto mt-8 aspect-square w-[min(56%,15rem)] md:mt-auto md:w-[68%]">
                    <div className="absolute inset-0 overflow-hidden rounded-full ring-1 ring-black/5">
                      <Image
                        src={p.image}
                        alt={`Retrato de ${p.name}`}
                        fill
                        sizes="(max-width: 768px) 60vw, 22vw"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Pill href={p.linkedin} variant={tone.pill} size="sm" aria-label={`LinkedIn de ${p.name}`}>
                      LinkedIn
                    </Pill>
                  </div>
                </article>
              </Fade>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   Closing — Lusion's last word before the footer: one big question, one action.
   ------------------------------------------------------------------------ */
export function Closing() {
  return (
    <section className="k-section text-center" aria-labelledby="cierre-title">
      <div className="k-wrap flex flex-col items-center">
        <Lines
          as="h2"
          id="cierre-title"
          className="k-display k-h1"
          lines={["¿Tenés una idea?", <span key="b" className="text-[var(--k-blue)]">Hagámosla realidad.</span>]}
        />
        <Fade delay={2}>
          <p className="k-body mx-auto mt-7 max-w-[34rem]">
            Primera consulta sin cargo, siempre. Contanos qué necesitás y te respondemos en menos de 24 horas.
          </p>
        </Fade>
        <Fade delay={3} className="mt-9 flex flex-wrap justify-center gap-3">
          <Pill href="#contacto">Hablemos</Pill>
          <Pill href={WHATSAPP_URL} variant="light" dot={false}>
            WhatsApp
          </Pill>
        </Fade>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   Contact — Osmo's form: soft pill fields on the ground, a dark pill to send.
   ------------------------------------------------------------------------ */
const methods = [
  { icon: Mail, label: "Email", value: "contacto@keisoftware.dev", href: "mailto:contacto@keisoftware.dev" },
  { icon: MessageCircle, label: "Teléfono / WhatsApp", value: "+54 351 361-4462", href: "tel:+543513614462" },
  { icon: Instagram, label: "Instagram", value: "@keisoftware", href: "https://www.instagram.com/keisoftware/" },
]

export function Contact() {
  const [data, setData] = useState({ name: "", phone: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const formRef = useReveal<HTMLFormElement>()
  const startedAt = useRef<number | null>(null)
  const latest = useRef({ data, status })
  latest.current = { data, status }

  // Leaving the page with a half-written form is the "didn't do it" signal.
  useEffect(() => {
    const onLeave = () => {
      const { data: d, status: st } = latest.current
      if (startedAt.current === null || st === "sent") return
      track(
        "contact_form_abandoned",
        {
          last_status: st,
          seconds_in_form: Math.round((performance.now() - startedAt.current) / 1000),
          filled_name: !!d.name.trim(),
          filled_phone: !!d.phone.trim(),
          filled_message: !!d.message.trim(),
          message_length: d.message.trim().length,
        },
        true
      )
      startedAt.current = null
    }
    window.addEventListener("pagehide", onLeave)
    return () => {
      window.removeEventListener("pagehide", onLeave)
      onLeave()
    }
  }, [])

  const onFieldFocus = (field: string) => {
    if (startedAt.current !== null) return
    startedAt.current = performance.now()
    visit.formStarted = true
    track("contact_form_started", { first_field: field })
  }
  const onFieldBlur = (field: keyof typeof data) => {
    const value = data[field].trim()
    track("contact_field_completed", { field, filled: !!value, length: value.length })
  }

  const phoneOk = /^\+?[\d\s().-]+$/.test(data.phone.trim()) && data.phone.replace(/\D/g, "").length >= 8
  const invalid = {
    name: touched && !data.name.trim(),
    phone: touched && !phoneOk,
    message: touched && !data.message.trim(),
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!data.name.trim() || !phoneOk || !data.message.trim()) {
      setError("Completá tu nombre, un teléfono válido y qué necesitás.")
      track("contact_form_validation_failed", {
        missing_name: !data.name.trim(),
        invalid_phone: !phoneOk,
        missing_message: !data.message.trim(),
      })
      return
    }
    setStatus("sending")
    setError(null)
    visit.formSubmitted = true
    const seconds_in_form = startedAt.current === null ? null : Math.round((performance.now() - startedAt.current) / 1000)
    track("contact_form_submitted", { seconds_in_form, message_length: data.message.trim().length })
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "No pudimos enviar el mensaje.")
      }
      setStatus("sent")
      identifyLead(data)
      track("contact_form_succeeded", {
        seconds_in_form,
        name: data.name.trim(),
        phone: data.phone.trim(),
        message: data.message.trim(),
      })
    } catch (err) {
      setStatus("error")
      track("contact_form_failed", { error: err instanceof Error ? err.message : String(err) })
      setError(
        `${err instanceof Error ? err.message : "No pudimos enviar el mensaje."} Probá de nuevo o escribinos por WhatsApp.`
      )
    }
  }

  const label = "k-tag mb-2.5 block pl-1.5 text-[var(--k-ink-soft)]"

  return (
    <section id="contacto" className="k-section pt-0" aria-labelledby="contacto-title">
      <div className="k-wrap grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Lines as="h2" id="contacto-title" className="k-display k-h2" lines={["Contanos", "qué necesitás"]} />
          <Fade>
            <p className="k-body mt-6 max-w-[26rem]">Te respondemos en menos de 24 horas.</p>
          </Fade>
          <Fade delay={1} as="ul" className="mt-10 flex flex-col gap-2">
            {methods.map(({ icon: Icon, label: l, value, href }) => (
              <li key={l}>
                <a
                  href={href}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="k-roll-host group flex items-center gap-4 rounded-full py-2 pr-4"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--k-ice)] text-[var(--k-ink)] transition-colors duration-200 [@media(hover:hover)]:group-hover:bg-[var(--k-blue)] [@media(hover:hover)]:group-hover:text-white">
                    <Icon className="size-[1.05rem]" />
                  </span>
                  <span>
                    <span className="k-tag block text-[var(--k-ink-faint)]">{l}</span>
                    <span className="block break-all font-medium">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </Fade>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          {status === "sent" ? (
            <div
              role="status"
              className="flex min-h-[26rem] flex-col items-start justify-end rounded-[var(--k-radius-panel)] bg-[#16205e] p-[clamp(1.75rem,3vw,2.75rem)] text-[#f9fafc]"
            >
              <span className="mb-auto grid size-12 place-items-center rounded-full bg-[var(--k-blue)]">
                <ArrowUpRight className="size-5" />
              </span>
              <p className="k-display text-[clamp(2.25rem,3.6vw,3.25rem)] leading-none">
                Gracias, {data.name.split(" ")[0]}.
              </p>
              <p className="k-body mt-4 text-[var(--k-on-dark-soft)]">
                Recibimos tu mensaje. Te contactamos al {data.phone} en menos de 24 horas.
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={submit} noValidate className="k-fade flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className={label}>
                    Nombre
                  </label>
                  <input
                    id="c-name"
                    className="k-field"
                    autoComplete="name"
                    placeholder="Cómo te llamás"
                    value={data.name}
                    aria-invalid={invalid.name || undefined}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    onFocus={() => onFieldFocus("name")}
                    onBlur={() => onFieldBlur("name")}
                  />
                </div>
                <div>
                  <label htmlFor="c-phone" className={label}>
                    Teléfono
                  </label>
                  <input
                    id="c-phone"
                    type="tel"
                    inputMode="tel"
                    className="k-field"
                    autoComplete="tel"
                    placeholder="+54 351 123-4567"
                    value={data.phone}
                    aria-invalid={invalid.phone || undefined}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    onFocus={() => onFieldFocus("phone")}
                    onBlur={() => onFieldBlur("phone")}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="c-message" className={label}>
                  Qué necesitás
                </label>
                {/* !important: .k-field's 999px pill radius must never win here, or the text runs into the curve. */}
                <textarea
                  id="c-message"
                  rows={6}
                  className="k-field !rounded-[1.75rem] !px-[1.4rem] !py-[1.1rem]"
                  placeholder="Contanos sobre tu negocio y qué te gustaría resolver."
                  value={data.message}
                  aria-invalid={invalid.message || undefined}
                  onChange={(e) => setData({ ...data, message: e.target.value })}
                    onFocus={() => onFieldFocus("message")}
                    onBlur={() => onFieldBlur("message")}
                />
              </div>

              {error && (
                <p role="alert" className="pl-1.5 text-[0.9rem] font-medium text-[#c62828] dark:text-[#ff8a80]">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <p className="text-[0.875rem] text-[var(--k-ink-soft)]">Primera consulta sin cargo.</p>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="k-pill disabled:cursor-wait disabled:opacity-60"
                >
                  <span className="k-pill__dot" aria-hidden="true" />
                  <span className="k-roll">
                    <span className="k-roll__a">{status === "sending" ? "Enviando…" : "Enviar mensaje"}</span>
                    <span className="k-roll__b" aria-hidden="true">
                      {status === "sending" ? "Enviando…" : "Enviar mensaje"}
                    </span>
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
