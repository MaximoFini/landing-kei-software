import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Google_Sans_Flex, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { StructuredData } from "@/components/structured-data";
import { PageTransition } from "@/components/page-transition";
import { TitleAttention } from "@/components/title-attention";
import { ThemeProvider } from "@/components/theme-provider";
import { LazyMotionProvider } from "@/components/lazy-motion-provider";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import "./globals.css";
import "./kei.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  preload: true,
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: true,
});
const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  variable: "--font-google-sans-flex",
  display: "swap",
});

// Brand manual typography: Montserrat for body/UI, Glacial Indifference
// (SIL OFL, self-hosted from app/fonts) for display.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});
const glacial = localFont({
  src: [
    { path: "./fonts/GlacialIndifference-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GlacialIndifference-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-glacial",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://keisoftware.dev"),
  alternates: {
    canonical: "https://keisoftware.dev",
  },
  title: {
    default: "KEI Software",
    template: "%s | KEI Software",
  },
  description:
    "Desarrollamos software a medida, soluciones IA y automatización con transparencia y calidad garantizada. Córdoba, Argentina.",
  keywords: [
    "desarrollo software",
    "software a medida",
    "inteligencia artificial",
    "automatización",
    "desarrollo web",
    "Córdoba",
    "desarrollo software Córdoba",
    "programación Argentina",
    "soluciones IA",
    "chatbot IA",
    "automatización empresarial",
    "desarrollo aplicaciones web",
    "Next.js",
    "React",
    "software empresarial",
    "CRM a medida",
    "ERP personalizado",
    "desarrollo remoto",
  ],
  authors: [{ name: "KEI Software" }],
  creator: "KEI Software",
  publisher: "KEI Software",
  category: "Technology",
  classification: "Software Development Services",
  applicationName: "KEI Software",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  verification: {
    google: "google9f062801bafc9c55",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://keisoftware.dev",
    title: "KEI Software — Software a Medida | Desarrollo Web & IA",
    description:
      "Desarrollamos software a medida, soluciones IA y automatización con transparencia total. Córdoba, Argentina.",
    siteName: "KEI Software",
  },
  twitter: {
    card: "summary_large_image",
    title: "KEI Software — Software a Medida | Desarrollo Web & IA",
    description:
      "Desarrollamos software a medida, soluciones IA y automatización con transparencia total. Córdoba, Argentina.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KEI Software",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020714" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="bg-background" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Mobile Safari optimizations */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        {/* JSON-LD: rendered here in <head> (Next.js App Router allows
            arbitrary static elements returned from the root layout's <head>
            to be merged into the document head without hydration issues,
            since this content is server-rendered and non-interactive). */}
        <StructuredData />
        {/* Marks the document before first paint: enables reveal animations
            (content stays visible without JS) and skips the intro loader
            after the first visit of the session. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;d.classList.add("kei-js");try{if(sessionStorage.getItem("kei-intro"))d.classList.add("kei-seen");else sessionStorage.setItem("kei-intro","1")}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} ${googleSansFlex.variable} ${montserrat.variable} ${glacial.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LazyMotionProvider>
            <TitleAttention />
            <AnalyticsTracker />
            <PageTransition>{children}</PageTransition>
          </LazyMotionProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
