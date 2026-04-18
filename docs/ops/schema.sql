-- =====================================================================
-- Token-SaaS · Supabase schema
--
-- 执行方式：Supabase Dashboard → SQL Editor → 粘贴整段 → Run
--
-- 幂等：所有语句用 IF NOT EXISTS / DO $$ 块包裹，可以重复执行。
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. leads （前台留资，已在用）
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  name         text,
  email        text not null,
  telegram     text,
  company      text,
  message      text,
  source       text,
  plan         text,          -- Batch 3 扩展：客户意向套餐，nullable
  intent       text,          -- Batch 3 扩展：reseller / whitelabel / team
  status       text not null default 'new',   -- new | contacted | won | lost
  created_at   timestamptz not null default now()
);

-- 兼容：如果表是早期版本创建的，补齐新字段
alter table public.leads add column if not exists plan text;
alter table public.leads add column if not exists intent text;
alter table public.leads add column if not exists status text not null default 'new';

alter table public.leads enable row level security;

-- 匿名提交走 /api/leads（service role），客户端不需要 SELECT/INSERT 权限
-- （没有 policy = 完全不可访问，正是我们想要的）

-- ---------------------------------------------------------------------
-- 2. profiles （每个登录用户一行，Dashboard 状态源）
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  plan         text not null default 'none',           -- none | starter | pro | channel
  status       text not null default 'pending_activation', -- pending_activation | active | suspended
  credits      bigint not null default 0,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 用户只能读自己的 profile；写操作走 service role（后台审核时）
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_read_own'
  ) then
    create policy profiles_read_own on public.profiles
      for select using (auth.uid() = id);
  end if;
end $$;

-- 新用户登录时自动建 profile 行（status=pending_activation）
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 3. orders （Stripe webhook 写入；当前先建表预留）
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete set null,
  email           text,                            -- 非登录用户也可能留下邮箱
  stripe_session_id text unique,
  stripe_payment_intent text,
  plan            text,                            -- starter | pro | channel
  amount_cents    integer,
  currency        text default 'usd',
  status          text not null default 'pending', -- pending | paid | refunded | failed
  raw             jsonb,                           -- Stripe webhook 原始 payload，方便排错
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.orders enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'orders' and policyname = 'orders_read_own'
  ) then
    create policy orders_read_own on public.orders
      for select using (auth.uid() = user_id);
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 4. api_keys （后续对接 new-api 时改为从网关同步；当前先留结构）
-- ---------------------------------------------------------------------
create table if not exists public.api_keys (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  label           text,
  masked          text not null,                   -- 仅存展示用掩码；真 key 存在 new-api
  upstream_id     text,                            -- new-api 里的 id
  status          text not null default 'active',  -- active | paused | revoked
  last_used_at    timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.api_keys enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'api_keys' and policyname = 'api_keys_read_own'
  ) then
    create policy api_keys_read_own on public.api_keys
      for select using (auth.uid() = user_id);
  end if;
end $$;
