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
    default: "Sekolah Prompt-Fu",
    template: "%s | Sekolah Prompt-Fu",
  },
  description: "A playful way for kids to learn how to talk to AI.",
  keywords: [
    "kids AI games",
    "learn prompting",
    "prompting for kids",
    "talk to AI",
    "AI literacy",
    "kids education",
    "prompt playground",
  ],
  authors: [{ name: "Sekolah Prompt-Fu" }],
  creator: "Sekolah Prompt-Fu",
  publisher: "Sekolah Prompt-Fu",
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
    "apple-mobile-web-app-title": "Sekolah Prompt-Fu",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sekolah Prompt-Fu",
    title: "Sekolah Prompt-Fu",
    description: "A playful way for kids to learn how to talk to AI.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Sekolah Prompt-Fu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sekolah Prompt-Fu",
    description: "A playful way for kids to learn how to talk to AI.",
    images: ["/og.png"],
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
