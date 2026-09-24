-- Run once in the Supabase SQL editor, after schema-3-order-stock.sql.
-- Storage bucket for product images uploaded from the admin panel (/admin/products).
-- Public bucket: anyone can READ (needed to show images on the storefront). Only the
-- service-role key (used by the admin server actions) can write — same trust model as
-- the `products` table itself.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-images');
