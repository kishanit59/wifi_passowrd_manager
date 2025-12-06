-- Create the wifi_networks table
create table public.wifi_networks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  network_name text not null,
  encrypted_password text not null,
  location text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.wifi_networks enable row level security;

-- Create policies
create policy "Users can create their own networks"
  on public.wifi_networks for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own networks"
  on public.wifi_networks for select
  using (auth.uid() = user_id);

create policy "Users can update their own networks"
  on public.wifi_networks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own networks"
  on public.wifi_networks for delete
  using (auth.uid() = user_id);
