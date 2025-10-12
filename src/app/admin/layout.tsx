import type { Metadata } from "next";
import { Providers } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { fontVariables } from "@/app/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Admin - Doeshing Gazette",
    template: "%s | Admin - Doeshing Gazette",
  },
  description: "Admin dashboard for Doeshing Gazette",
  robots: "noindex, nofollow", // 防止搜尋引擎索引後台
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
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
