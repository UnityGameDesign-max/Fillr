-- 1. Create Profiles Table (Only if it doesn't exist)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('EHAILING', 'SOLO', 'FLEET', 'REGULAR')), 
  province text,
  target_profit_amount numeric,
  target_profit_period text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Create Vehicles Table (Only if it doesn't exist)
create table if not exists public.vehicles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  make text,
  model text,
  year int,
  engine text,
  fuel_type text,
  odometer int,
  created_at timestamptz default now()
);

-- 3. Enable RLS (Safe to run multiple times)
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;

-- 4. Drop existing policies to avoid conflicts
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

drop policy if exists "Users can insert their own vehicles" on public.vehicles;
drop policy if exists "Users can view their own vehicles" on public.vehicles;
drop policy if exists "Users can update their own vehicles" on public.vehicles;
drop policy if exists "Users can delete their own vehicles" on public.vehicles;

-- 5. Re-create Policies
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own vehicles"
  on public.vehicles for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own vehicles"
  on public.vehicles for select
  using (auth.uid() = user_id);

create policy "Users can update their own vehicles"
  on public.vehicles for update
  using (auth.uid() = user_id);

create policy "Users can delete their own vehicles"
  on public.vehicles for delete
  using (auth.uid() = user_id);
