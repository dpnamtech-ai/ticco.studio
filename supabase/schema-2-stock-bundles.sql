-- Run this once in the Supabase project's SQL editor, after schema.sql.
-- Adds stock tracking and combo (bundle) products.
--
-- stock: admin-entered count, shown in /admin only for now. Not yet wired to
-- the storefront's "Hết hàng" badge (that still comes from sold_out, set by
-- hand) — auto-deducting stock from shipping confirmations, and flipping
-- sold_out when stock hits 0, is a follow-up once that integration exists.
--
-- bundle_items: null for a normal product. For a combo (e.g. "BST Sổ Căn Bản"
-- made of 4 separate notebooks each also sold on its own), set to
-- '[{"id":"so-trong","qty":1},{"id":"so-nhat-ky","qty":1}]' — ids reference
-- other rows in this same table, which stay independently buyable at their
-- own price/stock/page.

alter table products add column if not exists stock integer not null default 0;
alter table products add column if not exists bundle_items jsonb;
