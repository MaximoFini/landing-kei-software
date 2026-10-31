// Real KEI content. Nothing here is invented: projects, quotes, people and
// links are the same ones the site has always published.

export const WHATSAPP_URL = "https://wa.me/5493513614462"

export type Project = {
  title: string
  category: string
  tags: string[]
  description: string
  image: string
  position?: string
  link?: string
}

export const projects: Project[] = [
  {
    title: "Centro Automotores",
    category: "Automotriz",
    tags: ["Sitio web", "Catálogo digital"],
    description:
      "Sitio web y catálogo digital para concesionaria líder, optimizando la exhibición de vehículos y captación de clientes.",
    image: "/proyectos/proyecto-centro-automotores.webp",
    position: "center center",
    link: "https://www.instagram.com/centro_automotores/",
  },
  {
    title: "Stability",
    category: "Salud & Fitness",
    tags: ["Plataforma web", "Sistema a medida"],
    description:
      "Plataforma web y sistema a medida para gestión de clientes, turnos y seguimiento personalizado en centros de entrenamiento.",
    image: "/proyectos/proyecto-stability.webp",
    position: "left center",
    link: "https://stabilityar.com/",
  },
  {
    title: "OG Circle",
    category: "Experiencia digital",
    tags: ["Plataforma web", "Diseño"],
    description:
      "Plataforma interactiva con diseño de alto impacto visual, arquitectura escalable y rendimiento optimizado.",
    image: "/proyectos/proyecto-og-circle-1.webp",
    position: "center center",
    link: "https://ogcircle.vercel.app/#top",
  },
  {
    title: "Alfa Club",
    category: "Gestión deportiva",
    tags: ["Sistema web", "Socios", "Finanzas"],
    description:
      "Sistema a medida para la administración integral, control de socios, turnos y finanzas de centro deportivo y gimnasio.",
    image: "/proyectos/proyecto-alfa-club-1.webp",
    position: "center 30%",
    link: "https://www.instagram.com/alfa.mma.team/",
  },
  {
    title: "AgroSync",
    category: "Agro",
    tags: ["Landing page", "App mobile"],
    description:
      "Landing page para la app que coordina productores y contratistas: pedidos de servicios, presupuestos, clima y seguimiento de cada trabajo desde el celular.",
    image: "/proyectos/proyecto-agrosync.webp",
    position: "center top",
    link: "https://agrosyncrural.com/",
  },
]

export const services = [
  {
    title: "Sistemas a tu medida",
    description:
      "Diseñamos el sistema exacto que tu negocio necesita, dejando atrás las soluciones genéricas que te hacen perder tiempo.",
    tags: ["Clientes", "Turnos", "Finanzas"],
  },
  {
    title: "IA que entiende tu negocio",
    description:
      "Consultá tu sistema como a tu mejor colaborador: te responde al instante con datos e ideas claras para decidir mejor.",
    tags: ["Consultas", "Reportes", "Automatización"],
  },
  {
    title: "Plataformas que fidelizan",
    description:
      "El espacio digital donde tus clientes viven la experiencia con tu marca y eligen quedarse, sin que dependa de vos.",
    tags: ["Portal de clientes", "Seguimiento"],
  },
  {
    title: "Sitios que convierten",
    description: "Una presencia web ágil y clara, diseñada para un solo objetivo: que te contacten.",
    tags: ["Sitio web", "Catálogo", "SEO"],
  },
]

export const steps = [
  {
    title: "Consulta gratuita",
    description:
      "Hablamos 30 minutos sin compromiso. Entendemos tu problema, tus objetivos y si podemos ayudarte.",
  },
  {
    title: "Propuesta clara",
    description:
      "Recibís un documento detallado con alcance, cronograma, tecnologías y precio fijo. Sin sorpresas.",
  },
  {
    title: "Desarrollo ágil",
    description:
      "Construimos en sprints cortos con demos semanales. Siempre sabés en qué estamos trabajando.",
  },
  {
    title: "Entrega y soporte",
    description:
      "Lanzamos tu producto, te capacitamos y damos soporte técnico incluido durante el primer mes.",
  },
]

export const testimonials = [
  {
    name: "Juan Borreda",
    role: "Co-fundador",
    company: "Stability",
    logo: "/testimonials/stability.webp",
    quote:
      "Si lo tuviera que describir con una palabra a KEI, sería con “soluciones” ya que nos dio respuestas a muchas de las problemáticas que teníamos que solucionar con nuestro proyecto pero no sabíamos cómo.",
  },
  {
    name: "Gabriel Alvarez",
    role: "Dueño",
    company: "Centro Automotores",
    logo: "/testimonials/centro-autos.webp",
    quote:
      "Excelente experiencia con KEI SOFTWARE. Me desarrollaron una aplicación a medida para la concesionaria que me permite organizar clientes, vehículos, movimientos de dinero y tener toda la información del negocio mucho más ordenada y accesible. Muy buena atención, predisposición y, sobre todo, entendieron perfectamente lo que necesitaba. ¡Totalmente recomendados!",
  },
  {
    name: "Agustín Ramis",
    role: "Co-fundador",
    company: "Stability",
    logo: "/testimonials/stability.webp",
    quote:
      "Trabajar con KEI fue clave para llevar Stability al siguiente nivel. Desarrollaron una plataforma ágil, moderna y totalmente a medida que nos facilitó la gestión integral de nuestros clientes y entrenamientos.",
  },
  {
    name: "Ruben Fini",
    role: "Dueño",
    company: "Alfa Club",
    logo: "/testimonials/alfa-club.webp",
    quote:
      "Estamos contentos con el trabajo de los chicos de KEI, hace un tiempo usábamos Mis Actividades para la administración del gimnasio, pero estábamos necesitando una solución más a medida. Los chicos entendieron nuestra necesidad y solucionaron nuestros problemas.",
  },
  {
    name: "Joaquin Vera",
    role: "Co-fundador",
    company: "VeGroup",
    logo: "/testimonials/vegroup.webp",
    quote:
      "La verdad que tremendo trabajo y sobre todo el entendimiento sobre nuestro proyecto para seguir sumando y mejorando funciones del sistema. Una atención espectacular y muy cercana con las necesidades que hemos tenido. Muchas gracias por toda la gestión y compromiso.",
  },
]

export const clients = [
  { name: "Stability", logo: "/testimonials/stability.webp" },
  { name: "VeGroup", logo: "/testimonials/vegroup.webp" },
  { name: "Alfa Club", logo: "/testimonials/alfa-club.webp" },
  { name: "OG Circle", logo: "/testimonials/ogcircle.webp" },
  { name: "Centro Automotores", logo: "/testimonials/centro-autos.webp" },
  { name: "AgroSync", logo: "/testimonials/agrosync.webp" },
  { name: "Riegos del Sur", logo: "/testimonials/riegos-del-sur.webp" },
  { name: "Deutsch", logo: "/testimonials/deutsch.webp" },
]

export const team = [
  {
    name: "Jerónimo Zallocco",
    role: "Co-fundador · Full Stack Developer",
    image: "/team/jeronimo-zallocco.webp",
    linkedin: "https://www.linkedin.com/in/jer%C3%B3nimo-zallocco-036090417/",
  },
  {
    name: "Máximo Fini",
    role: "Co-fundador · Project Manager",
    image: "/team/maximo-fini.webp",
    linkedin: "https://www.linkedin.com/in/maximo-fini-560742201/",
  },
  {
    name: "Ramiro Celada",
    role: "Co-fundador · Product Manager",
    image: "/team/ramiro-celada.webp",
    linkedin: "https://www.linkedin.com/in/ramiro-celada/",
  },
]

/** Logos shipped as full-bleed squares with a solid background: fill the circle so it crops the corners. */
export const bleedLogos = new Set(["/testimonials/ogcircle.webp", "/testimonials/centro-autos.webp", "/testimonials/riegos-del-sur.webp", "/testimonials/deutsch.webp"])
