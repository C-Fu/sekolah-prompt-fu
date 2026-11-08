import type { Metadata } from "next";
import { Schoolbell } from "next/font/google";
import { getMessages, getLocale } from "next-intl/server";
import { Providers } from "@/components/providers";
import { isRtlLocale } from "@/lib/i18n/config";
import { getBaseUrl, withBasePath } from "@/lib/seo";
import { KidsHeader } from "@/components/kids/layout/kids-header";
import { MusicProvider } from "@/components/kids/layout/background-music";
import { LocaleDirection } from "@/components/kids/layout/locale-direction";
import { LevelProvider } from "@/components/kids/providers/level-context";
import { PlanetBackground } from "@/components/kids/layout/planet-background";
import "./globals.css";

const kidsFont = Schoolbell({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kids",
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
      { url: withBasePath("/favicon/favicon.svg"), type: "image/svg+xml" },
      { url: withBasePath("/favicon/favicon-96x96.png"), sizes: "96x96", type: "image/png" },
      { url: withBasePath("/favicon/favicon.ico"), sizes: "48x48" },
    ],
    apple: withBasePath("/favicon/apple-touch-icon.png"),
    shortcut: withBasePath("/favicon/favicon.svg"),
  },
  manifest: withBasePath("/manifest.webmanifest"),
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
        url: withBasePath("/og.png"),
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
    images: [withBasePath("/og.png")],
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

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${kidsFont.className} antialiased`}>
        <Providers locale={locale} messages={messages}>
          <LevelProvider>
            <MusicProvider>
              <LocaleDirection
                className={`fixed inset-0 flex flex-col text-xl light ${kidsFont.className}`}
                style={{ colorScheme: "light" }}
              >
                {/* Dynamic Planet Themed Celestial Background */}
                <PlanetBackground />

                <KidsHeader />
                <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
              </LocaleDirection>
            </MusicProvider>
          </LevelProvider>
        </Providers>
      </body>
    </html>
  );
}