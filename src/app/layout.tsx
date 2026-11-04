import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic, Geist_Mono, Playfair_Display } from "next/font/google";
import { getMessages, getLocale } from "next-intl/server";
import { Providers } from "@/components/providers";
import { isRtlLocale } from "@/lib/i18n/config";
import { getBaseUrl } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "prompts.chat - AI Prompts Community",
    template: "%s | prompts.chat",
  },
  description:
    "Discover, collect, and share the best AI prompts for ChatGPT, Claude, Gemini, and more. Join the largest community of AI prompt engineers and creators.",
  keywords: [
    "AI prompts",
    "ChatGPT prompts",
    "Claude prompts",
    "prompt engineering",
    "AI tools",
    "prompt library",
    "GPT prompts",
    "AI assistant",
    "prompt templates",
  ],
  authors: [{ name: "prompts.chat community" }],
  creator: "prompts.chat",
  publisher: "prompts.chat",
  icons: {
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "48x48" },
    ],
    apple: "/favicon/apple-touch-icon.png",
    shortcut: "/favicon/favicon.svg",
  },
  manifest: "/favicon/site.webmanifest",
  other: {
    "apple-mobile-web-app-title": "prompts.chat",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "prompts.chat",
    title: "prompts.chat - AI Prompts Community",
    description:
      "Discover, collect, and share the best AI prompts for ChatGPT, Claude, Gemini, and more. Join the largest community of AI prompt engineers.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "prompts.chat - AI Prompts Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "prompts.chat - AI Prompts Community",
    description:
      "Discover, collect, and share the best AI prompts for ChatGPT, Claude, Gemini, and more.",
    images: ["/og.png"],
    creator: "@promptschat",
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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const isRtl = isRtlLocale(locale);

  const fontClasses = isRtl
    ? `${inter.variable} ${notoSansArabic.variable} ${geistMono.variable} ${playfairDisplay.variable} font-arabic`
    : `${inter.variable} ${geistMono.variable} ${playfairDisplay.variable} font-sans`;

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${fontClasses} antialiased`}>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
