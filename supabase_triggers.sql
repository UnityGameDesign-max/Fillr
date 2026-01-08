-- 1. Create a function that runs when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  vehicle_data jsonb;
begin
  -- Insert into public.profiles
  -- We extract data from the 'raw_user_meta_data' column in auth.users
  insert into public.profiles (
    id,
    role,
    province,
    target_profit_amount,
    target_profit_period
  )
  values (
    new.id,
    COALESCE(new.raw_user_meta_data->>'role', 'SOLO'), -- Default to SOLO if missing
    new.raw_user_meta_data->>'province',
    (new.raw_user_meta_data->>'target_profit_amount')::numeric,
    new.raw_user_meta_data->>'target_profit_period'
  );

  -- Check if vehicle data exists in metadata and insert it
  vehicle_data := new.raw_user_meta_data->'vehicle';
  
  if vehicle_data is not null then
    insert into public.vehicles (
      user_id,
      make,
      model,
      year,
      engine,
      fuel_type,
      odometer
    )
    values (
      new.id,
      vehicle_data->>'make',
      vehicle_data->>'model',
      (vehicle_data->>'year')::int,
      vehicle_data->>'engine',
      vehicle_data->>'fuelType',
      (vehicle_data->>'odometer')::int
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- 2. Create the trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
