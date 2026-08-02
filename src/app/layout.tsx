import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://pathwayet.com"),
  title: {
    default: "Pathway Agency Ethiopia — Embassy, NGO, Aviation & International Jobs",
    template: "%s | Pathway Agency Ethiopia",
  },
  description:
    "Ethiopia's #1 career placement agency. Connect with Embassy, NGO, Airport, and International jobs in Addis Ababa. 10,000+ job opportunities for fresh graduates and professionals.",
  keywords: [
    "jobs in Ethiopia",
    "embassy jobs Ethiopia",
    "NGO jobs Addis Ababa",
    "aviation jobs Ethiopia",
    "international jobs Ethiopia",
    "Pathway Agency Ethiopia",
    "employment agency Ethiopia",
    "career Ethiopia",
    "pathwayet.com",
    "fresh graduate jobs Ethiopia",
  ],
  authors: [{ name: "Pathway Agency Ethiopia", url: "https://pathwayet.com" }],
  creator: "Pathway Agency Ethiopia",
  publisher: "Pathway Agency Ethiopia",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pathway",
  },
  openGraph: {
    type: "website",
    locale: "en_ET",
    url: "https://pathwayet.com",
    siteName: "Pathway Agency Ethiopia",
    title: "Pathway Agency Ethiopia — Find Your Dream Job",
    description:
      "Ethiopia's leading career placement agency. Embassy, NGO, Aviation & International jobs for graduates and professionals in Addis Ababa.",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Pathway Agency Ethiopia Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Pathway Agency Ethiopia — Embassy, NGO & International Jobs",
    description: "Ethiopia's #1 job placement agency. 10,000+ career opportunities.",
    images: ["/icons/icon-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icons/icon-192x192.png",
  },
  alternates: {
    canonical: "https://pathwayet.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1d4ed8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pathway" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900 min-h-screen flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
