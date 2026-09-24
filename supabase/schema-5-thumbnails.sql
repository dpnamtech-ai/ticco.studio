-- Run once in the Supabase SQL editor, after schema-4-product-images.sql.
-- The product page's Figma layout has exactly 2 secondary thumbnail slots next
-- to the main image (see ProductDetail.tsx) — this is a fixed-size array, not
-- an open-ended gallery.
alter table products add column if not exists thumbnails text[] not null default '{}';
