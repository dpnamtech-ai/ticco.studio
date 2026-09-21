-- TEST DATA ONLY. Run in the Supabase SQL editor to try stock / combo / sold-out flows.
-- Every id starts with "test-", so it is easy to find and remove afterwards.
insert into products (id, name, category, price_from, unit, image, description, stock, sold_out, bundle_items, sort_order) values
  ('test-so-a',    'Test Sổ A',        'Văn phòng phẩm', 50000,  'quyển', '/images/dan-cheer.png',  'Sổ test, tồn kho 5.',           5, false, null, 900),
  ('test-so-b',    'Test Sổ B',        'Văn phòng phẩm', 60000,  'quyển', '/images/dan-laptop.png', 'Sổ test, tồn kho 2.',           2, false, null, 901),
  ('test-sticker', 'Test Sticker',     'In ấn',          20000,  'tờ',    '/images/dan-cheer.png',  'Chưa theo dõi kho (tồn = 0).',  0, false, null, 902),
  ('test-hethang', 'Test Hết hàng',    'Phụ kiện đời sống', 30000, 'cái', '/images/dan-laptop.png', 'Đã bật Hết hàng bằng tay.',   0, true,  null, 903),
  ('test-combo',   'Test Combo Sổ',    'Văn phòng phẩm', 100000, 'bộ',    '/images/dan-cheer.png',  'Combo = 1 Sổ A + 2 Sổ B.',      0, false,
     '[{"id":"test-so-a","qty":1},{"id":"test-so-b","qty":2}]'::jsonb, 904)
on conflict (id) do nothing;
-- To remove later: filter the products table by id starting with "test-" in the Table Editor.
