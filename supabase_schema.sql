-- 1. Create Profiles Table
-- This table stores user role and other profile information linked to their auth account.
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('EHAILING', 'SOLO', 'FLEET', 'REGULAR')), -- 'SOLO' matches 'Regular Driver' in select-role.tsx
  province text,
  target_profit_amount numeric,
  target_profit_period text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Create Vehicles Table
-- This table stores vehicle details for each user.
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

-- 3. Enable Row Level Security (RLS)
-- This is crucial for security. It ensures users can only access their own data.
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;

-- 4. Create Policies for Profiles
-- Allow users to insert their own profile during registration
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Allow users to view their own profile
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 5. Create Policies for Vehicles
-- Allow users to insert their own vehicles
create policy "Users can insert their own vehicles"
  on public.vehicles for insert
  with check (auth.uid() = user_id);

-- Allow users to view their own vehicles
create policy "Users can view their own vehicles"
  on public.vehicles for select
  using (auth.uid() = user_id);

-- Allow users to update their own vehicles
create policy "Users can update their own vehicles"
  on public.vehicles for update
  using (auth.uid() = user_id);

-- Allow users to delete their own vehicles
create policy "Users can delete their own vehicles"
  on public.vehicles for delete
  using (auth.uid() = user_id);
