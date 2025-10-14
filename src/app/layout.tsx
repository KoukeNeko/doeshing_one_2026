import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Providers } from "@/components/providers/SessionProvider";
import { fontVariables } from "./fonts";
import "@/styles/globals.css";

const siteName = "Doeshing — Editorial Portfolio";
const siteDescription =
  "Personal magazine-inspired portfolio for Doeshing featuring articles, projects, resume, and contact.";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "Next.js",
    "Tailwind CSS",
    "Doeshing",
    "Editorial",
    "Portfolio",
    "Blog",
    "Resume",
  ],
  authors: [{ name: "Doeshing" }],
  creator: "Doeshing",
  publisher: "Doeshing",
  metadataBase:
    process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http") &&
    typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
  openGraph: {
    title: siteName,
    description: siteDescription,
    locale: "zh-TW",
    type: "website",
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen bg-newspaper-paper text-newspaper-ink antialiased dark:bg-zinc-900 dark:text-zinc-100">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
