create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (char_length(phone) between 5 and 40),
  email text not null check (char_length(email) between 3 and 254),
  project_type text not null check (project_type in ('Fall Ceiling', 'Living Room', 'Bedroom', 'Wall Panel', 'Full Home Interior', 'Other')),
  preferred_location text not null check (preferred_location in ('Delhi', 'Noida', 'Kanpur')),
  message text not null check (char_length(message) between 1 and 5000),
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;
drop policy if exists "Anyone can submit an enquiry" on public.enquiries;
create policy "Anyone can submit an enquiry"
  on public.enquiries for insert to anon, authenticated
  with check (true);
grant insert on table public.enquiries to anon, authenticated;