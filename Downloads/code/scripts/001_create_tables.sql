-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  age integer,
  cycle_length integer default 28,
  period_length integer default 5,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create cycle_data table
create table if not exists public.cycle_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  period_start_date date not null,
  period_end_date date,
  flow_intensity text, -- light, normal, heavy
  symptoms text array, -- mood, cramps, headache, etc
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create bills table for receipt uploads
create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  extracted_data jsonb, -- OCR extracted data
  merchant_name text,
  bill_date date,
  amount decimal(10, 2),
  created_at timestamp with time zone default now()
);

-- Create predictions table
create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prediction_date date not null,
  next_period_date date,
  fertile_window_start date,
  fertile_window_end date,
  predicted_phase text, -- menstrual, follicular, ovulation, luteal
  confidence integer, -- 0-100
  health_insights text array,
  created_at timestamp with time zone default now()
);

-- Create chat_history table
create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  message_type text not null, -- 'user' or 'assistant'
  content text not null,
  context_data jsonb, -- relevant cycle/health data at time of message
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.cycle_data enable row level security;
alter table public.bills enable row level security;
alter table public.predictions enable row level security;
alter table public.chat_history enable row level security;

-- Create RLS policies for profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Create RLS policies for cycle_data
create policy "cycle_data_select_own" on public.cycle_data for select using (auth.uid() = user_id);
create policy "cycle_data_insert_own" on public.cycle_data for insert with check (auth.uid() = user_id);
create policy "cycle_data_update_own" on public.cycle_data for update using (auth.uid() = user_id);
create policy "cycle_data_delete_own" on public.cycle_data for delete using (auth.uid() = user_id);

-- Create RLS policies for bills
create policy "bills_select_own" on public.bills for select using (auth.uid() = user_id);
create policy "bills_insert_own" on public.bills for insert with check (auth.uid() = user_id);
create policy "bills_update_own" on public.bills for update using (auth.uid() = user_id);
create policy "bills_delete_own" on public.bills for delete using (auth.uid() = user_id);

-- Create RLS policies for predictions
create policy "predictions_select_own" on public.predictions for select using (auth.uid() = user_id);
create policy "predictions_insert_own" on public.predictions for insert with check (auth.uid() = user_id);
create policy "predictions_update_own" on public.predictions for update using (auth.uid() = user_id);
create policy "predictions_delete_own" on public.predictions for delete using (auth.uid() = user_id);

-- Create RLS policies for chat_history
create policy "chat_history_select_own" on public.chat_history for select using (auth.uid() = user_id);
create policy "chat_history_insert_own" on public.chat_history for insert with check (auth.uid() = user_id);
create policy "chat_history_delete_own" on public.chat_history for delete using (auth.uid() = user_id);
