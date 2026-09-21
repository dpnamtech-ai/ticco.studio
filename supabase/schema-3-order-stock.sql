-- Run once in the Supabase SQL editor, after schema-2-stock-bundles.sql.
-- Marks whether an order's items have already been taken out of stock, so flipping
-- an order's status back and forth never deducts (or restores) twice.
alter table orders add column if not exists stock_deducted boolean not null default false;
