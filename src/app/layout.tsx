import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
  Noto_Sans,
} from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";

import { Providers }
  from "./providers";

import { Toaster }
  from "@/components/ui/sonner";

const notoSans =
  Noto_Sans({
    variable:
      "--font-sans",
    subsets: ["latin"],
  });

const geistSans =
  Geist({
    variable:
      "--font-geist-sans",

    subsets: ["latin"],
  });

const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",

    subsets: ["latin"],
  });

export const metadata: Metadata = {
  title: {
    default: "CollabDocs",
    template: "%s | CollabDocs",
  },

  description:
    "Realtime collaborative document editing platform with live collaboration and seamless teamwork.",

  keywords: [
    "collaboration",
    "realtime editor",
    "documents",
    "socket.io",
    "nextjs",
    "nestjs",
    "typescript",
  ],

  authors: [
    {
      name: "Prasangeet Dongre",
    },
  ],

  creator: "Prasangeet Dongre",

  metadataBase: new URL(
    "https://collab-frontend-sigma.vercel.app",
  ),

  alternates: {
    canonical:
      "https://collab-frontend-sigma.vercel.app",
  },

  icons: {
    icon: "/zap.svg",
    shortcut: "/zap.svg",
    apple: "/zap.svg",
  },

  openGraph: {
    title: "CollabDocs",

    description:
      "Realtime collaborative document editing platform.",

    url:
      "https://collab-frontend-sigma.vercel.app",

    siteName: "CollabDocs",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "CollabDocs",

    description:
      "Realtime collaborative document editing platform.",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          notoSans.variable,
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <Providers>
          {children}
        </Providers>

        <Toaster position="top-center" />
      </body>
    </html>
  );
}
