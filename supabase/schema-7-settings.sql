-- Run once in the Supabase SQL editor, after schema-6-variant-options.sql.
-- Site-wide settings the client edits in /admin. Row "shipping" = the shipping rule (/admin/phi-ship):
--   {"tiers": [{"maxItems": 5, "fee": 23000}, {"maxItems": 10, "fee": 30000}, {"maxItems": null, "fee": 45000}], "freeFrom": 500000}
-- RLS on with no policies: only the service-role key (server code) reads or writes it.
create table if not exists settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table settings enable row level security;

insert into settings (key, value) values
  ('shipping', '{"tiers": [{"maxItems": 5, "fee": 23000}, {"maxItems": 10, "fee": 30000}, {"maxItems": null, "fee": 45000}], "freeFrom": 500000}')
on conflict (key) do nothing;

notify pgrst, 'reload schema';
