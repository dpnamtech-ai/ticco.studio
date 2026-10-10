// Shown inside the site layout (navbar/footer stay) while a page that reads Supabase is rendering,
// so a click on a link responds at once instead of sitting still.
export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center" role="status" aria-label="Loading">
      <span className="size-10 animate-spin rounded-full border-4 border-[var(--color-purple)] border-t-transparent" aria-hidden />
    </div>
  );
}
