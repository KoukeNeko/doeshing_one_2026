import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin - Doeshing Gazette",
    template: "%s | Admin - Doeshing Gazette",
  },
  description: "Admin dashboard for Doeshing Gazette",
  robots: "noindex, nofollow", // 防止搜尋引擎索引後台
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
