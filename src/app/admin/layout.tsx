import type { Metadata } from "next";
import "../globals.css";
import AdminNav from "./AdminNav";

export const metadata: Metadata = {
  title: "Quản trị — Tíc Cơ",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon-48.png" },
};

// Own root layout: the public site (header, cart, footer) lives under app/[lang] with its own root layout.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-[var(--color-cream)]">
        <div className="md:flex">
          <AdminNav />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
