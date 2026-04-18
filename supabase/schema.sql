-- ============================================================
-- YourBrand Supabase schema (V1)
-- 在 Supabase Dashboard → SQL Editor 里粘贴执行即可。
-- ============================================================

-- ---------- profiles：和 auth.users 1:1 的业务侧用户表 ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: self read" on public.profiles;
create policy "profiles: self read"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles: self update" on public.profiles;
create policy "profiles: self update"
  on public.profiles for update
  using (auth.uid() = id);

-- Google 登录后自动建 profile（触发器）
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ---------- leads：首页 / Contact 留资 ----------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  telegram text,
  company text,
  message text,
  source text default 'website',
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;
-- 不给任何 policy —— 只有 service-role（后端 /api/leads）能写。
