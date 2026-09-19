-- Run this once in the Supabase project's SQL editor (Project → SQL Editor → New query).
-- Table shape mirrors the current productLines entries in src/data/content.ts.

create table if not exists products (
  id text primary key,
  name text not null,
  category text not null,
  price_from integer not null default 0,
  unit text not null default 'sản phẩm',
  image text,
  description text not null default '',
  variants text[] not null default '{}',
  specs text[] not null default '{}',
  note text,
  sold_out boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Public (anon key) can only READ. All writes go through the service role
-- key from the /admin server actions, which bypasses RLS entirely.
alter table products enable row level security;

create policy "products are publicly readable"
  on products for select
  using (true);

-- Keep updated_at current on every edit.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_set_updated_at
  before update on products
  for each row
  execute function set_updated_at();


-- ---------------------------------------------------------------------------
-- Orders placed from /checkout (POST /api/orders). Written with the service role key only:
-- RLS is on with NO public policy, so the anon key can neither read nor write orders.
create table if not exists orders (
  code text primary key,                 -- also the bank-transfer note, e.g. TC0A1B2XYZ
  created_at timestamptz not null default now(),
  customer jsonb not null,               -- name, phone, email, province, district, ward, address, note
  items jsonb not null,                  -- [{ id, name, variant, qty, price }] priced server-side
  subtotal integer not null,
  shipping integer not null default 0,
  total integer not null,
  status text not null default 'pending_payment',  -- pending_payment | paid | shipped | done | cancelled
  ghn_order_code text                    -- filled once the Giao Hang Nhanh API is wired in
);

alter table orders enable row level security;
