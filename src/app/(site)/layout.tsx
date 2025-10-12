import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="sr-only sr-only-focusable">
        Skip to content
      </a>
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[calc(100vh-16rem)] max-w-6xl px-4 pb-24 pt-12 md:px-6"
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
