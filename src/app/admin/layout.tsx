import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Quản trị — Tíc Cơ",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon-48.png" },
};

// Own root layout: the public site (header, cart, footer) lives under app/[lang] with its own root layout.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
