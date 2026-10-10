"use client";

import { useFormStatus } from "react-dom";

// Submit button for <form action={serverAction}>: disabled with a spinner while the action runs,
// so a slow Supabase round-trip doesn't look like a dead click.
export default function SubmitButton({ children, pendingText = "Đang lưu…", className }: { children: React.ReactNode; pendingText?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`${className} inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait`}>
      {pending && <span className="size-[1em] animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />}
      {pending ? pendingText : children}
    </button>
  );
}
