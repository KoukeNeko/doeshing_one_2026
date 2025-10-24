import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { WipRibbon } from "@/components/ui/WipRibbon";

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
      <WipRibbon />
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[calc(100vh-16rem)] max-w-6xl overflow-x-hidden px-4 pb-24 pt-12 md:px-6"
      >
        {children}
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
