import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
} from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://www.xonplace.com",
  ),

  title: {
    default:
      "XONPLACE | AI Automation as a Service",
    template:
      "%s | XONPLACE",
  },

  description:
    "XONPLACE ayuda a las organizaciones a identificar qué automatizar, priorizar oportunidades y transformar procesos mediante integración, automatización e Inteligencia Artificial.",

  applicationName:
    "XONPLACE",

  keywords: [
    "automatización empresarial",
    "inteligencia artificial",
    "AI automation",
    "automation assessment",
    "automation blueprint",
    "automatización de procesos",
    "AI agents",
    "intelligent automation",
    "workflow automation",
    "integración de sistemas",
  ],

  authors: [
    {
      name: "XONPLACE",
    },
  ],

  creator:
    "XONPLACE",

  publisher:
    "XONPLACE",

  category:
    "technology",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      {
        url: "/brand/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/brand/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/brand/favicon.ico",
      },
    ],

    apple: [
      {
        url: "/brand/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],

    shortcut:
      "/brand/favicon.ico",
  },

  openGraph: {
    type: "website",

    locale:
      "es_CL",

    url:
      "https://www.xonplace.com",

    siteName:
      "XONPLACE",

    title:
      "XONPLACE | AI Automation as a Service",

    description:
      "Descubre qué procesos automatizar, dónde existe mayor impacto y cómo avanzar con una hoja de ruta priorizada.",

    images: [
      {
        url: "/brand/xonplace-symbol-512.png",
        width: 512,
        height: 512,
        alt: "XONPLACE",
      },
    ],
  },

  twitter: {
    card:
      "summary",

    title:
      "XONPLACE | AI Automation as a Service",

    description:
      "Automatización empresarial basada en diagnóstico, evidencia y priorización.",

    images: [
      "/brand/xonplace-symbol-512.png",
    ],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview":
        "large",
      "max-snippet":
        -1,
      "max-video-preview":
        -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}