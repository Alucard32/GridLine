import type { Metadata } from "next";
import { Sora, Source_Sans_3, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
// Ko-fi widget temporarily disabled
// import { KofiWidget } from "@/components/third-party/KofiWidget";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CookieConsent } from "@/components/CookieConsent";

// Sora - Display/Headlines font (outdoorsy, modern geometric)
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Source Sans 3 - Body text (highly readable, professional)
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// JetBrains Mono - Stats/Data display
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "GridLine | Turn Your Adventures Into Art",
  description: "Create stunning adventure prints and journey sculptures from your hiking trails, runs, and travels",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "GridLine | Turn Your Adventures Into Art",
    description: "Create stunning adventure prints and journey sculptures from your hiking trails, runs, and travels",
    images: ["/hero.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GridLine | Turn Your Adventures Into Art",
    description: "Create stunning adventure prints and journey sculptures from your hiking trails, runs, and travels",
    images: ["/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Poppins:wght@400;700&family=Bebas+Neue&family=Oswald:wght@400;700&family=Inter:wght@400;700&family=Outfit:wght@400;700&family=DM+Sans:wght@400;700&family=JetBrains+Mono:wght@400;700&family=IBM+Plex+Mono:wght@400;700&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Crimson+Text:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${sora.variable} ${sourceSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <ThemeProvider>
          <ToastProvider>
            {children}
            <CookieConsent />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
