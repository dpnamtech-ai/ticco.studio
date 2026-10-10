-- Run once, after schema-7-settings.sql.
-- /admin "Ẩn/Hiện": a hidden product disappears from the storefront (shop, detail page, search, sitemap) and can't be
-- ordered, without deleting it. src/lib/products.ts getProducts() filters it out; /admin still lists it.
alter table products add column if not exists hidden boolean not null default false;

notify pgrst, 'reload schema';
