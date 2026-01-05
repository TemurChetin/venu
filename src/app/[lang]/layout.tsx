import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components/layout/footer";
import { AppProvider } from "@/providers";
import NextTopLoader from "nextjs-toploader";
import { getMessages } from "next-intl/server";
import { generateHomeMetadata } from "@/lib/seo";
import { LANGUAGES } from "@/lib/constants";
import {
  StructuredData,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/components/seo/structured-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const metadata = generateHomeMetadata(lang);

  // Add alternate language links
  const alternateLocales = LANGUAGES.map((l) => ({
    locale: l.code,
    url: `/${l.code}`,
  }));

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: alternateLocales.reduce((acc, alt) => {
        acc[alt.locale] = alt.url;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { lang } = await params;
  const messages = await getMessages();

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Structured Data for SEO */}
        <StructuredData data={generateOrganizationSchema()} />
        <StructuredData data={generateWebsiteSchema()} />
        <AppProvider locale={lang} messages={messages}>
          <main>
            <NextTopLoader
              color="#ff0042"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl
              showSpinner
              easing="ease"
              speed={600}
              shadow="0 0 10px #ff0042, 0 0 5px #ff0042"
            />
            <Header />
            <div className="container pb-20 md:pb-0">{children}</div>
            <Toaster position="top-center" reverseOrder={false} />
            <Footer />
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
