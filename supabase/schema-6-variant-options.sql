-- Per-option settings edited in /admin "Biến thể" (tên | giá | ảnh số | link), e.g.
--   {"Lao động": {"price": 30000, "image": 5}, "Sổ nhật ký": {"link": "so-nhat-ky"}}
-- null = every option uses the product's base price and main photo.
alter table products add column if not exists variant_options jsonb;
