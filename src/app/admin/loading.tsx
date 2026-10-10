export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center gap-3 text-[var(--color-purple)] font-semibold" role="status">
      <span className="size-6 animate-spin rounded-full border-[3px] border-current border-t-transparent" aria-hidden />
      Đang tải…
    </div>
  );
}
