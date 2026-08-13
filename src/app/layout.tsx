import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

// Loaded via a runtime <link> tag rather than next/font/google: next/font
// fetches fonts at BUILD time, which fails in network-restricted build
// environments (and adds a hard dependency on Google's servers being
// reachable from wherever `next build` runs). A <link> tag loads them in
// the visitor's browser instead — same fonts, no build-time dependency.
export const metadata: Metadata = {
  title: "Wedyora — For Every Moment, Forever",
  description:
    "Wedyora is India's managed wedding-services platform: book verified photographers, decorators, caterers and more, all in one place.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- this
            rule targets the Pages Router's pages/_document.js; loading a
            font stylesheet from the App Router's root layout <head> is the
            documented pattern here and applies to every page. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-black">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
