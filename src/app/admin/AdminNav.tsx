"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "./actions";
import SubmitButton from "./SubmitButton";

const LINKS = [
  { href: "/admin", label: "Sản phẩm", match: (p: string) => p === "/admin" || p.startsWith("/admin/products") },
  { href: "/admin/orders", label: "Đơn hàng", match: (p: string) => p.startsWith("/admin/orders") },
  { href: "/admin/phi-ship", label: "Phí ship", match: (p: string) => p.startsWith("/admin/phi-ship") },
];

// Left menu on every admin page (a top bar on phones); none on the login page.
export default function AdminNav() {
  const path = usePathname();
  if (path === "/admin/login") return null;
  return (
    <nav className="md:sticky md:top-0 md:h-screen md:w-56 shrink-0 bg-white border-b md:border-b-0 md:border-r border-black/10 flex md:flex-col gap-1 p-3 md:p-4 overflow-x-auto">
      <Link href="/" className="hidden md:block font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--color-purple)] px-3 py-2 mb-4">
        Tíc Cơ
      </Link>
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`whitespace-nowrap rounded-lg px-3 py-2 font-semibold ${l.match(path) ? "bg-[var(--color-purple)] text-white" : "hover:bg-black/5"}`}
        >
          {l.label}
        </Link>
      ))}
      <form action={signOut} className="md:mt-auto ml-auto md:ml-0">
        <SubmitButton pendingText="Đang thoát…" className="w-full whitespace-nowrap rounded-lg px-3 py-2 font-semibold text-black/60 hover:bg-black/5 md:justify-start">
          Đăng xuất
        </SubmitButton>
      </form>
    </nav>
  );
}
