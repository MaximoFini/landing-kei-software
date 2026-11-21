import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { Projects, Reel, Services, Statement } from "@/components/landing/story"
import { Closing, Contact, Process, Team, Voices } from "@/components/landing/people"
import { SmoothScroll } from "@/components/landing/smooth-scroll"
import { Thread } from "@/components/landing/thread"
import { WhatsApp } from "@/components/landing/whatsapp"

export const metadata: Metadata = {
  title: "Desarrollo de Software a Medida, IA y Automatización | KEI Software",
}

export default function Page() {
  return (
    <main className="kei relative min-h-screen">
      <SmoothScroll />
      <Nav />
      <Hero />
      <Thread>
        <Statement />
        <Services />
        <Reel />
        <Projects />
        <Process />
        <Voices />
        <Team />
        <Closing />
      </Thread>
      <Contact />
      <Footer />
      <WhatsApp />
    </main>
  )
}
