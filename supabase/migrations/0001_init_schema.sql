-- Adea initial schema
-- Locked decision: Money uses ONE shared `transactions` table (type: income/expense/bill/debt).
-- Locked decision: all 12 Life Areas ship at launch, via a generic `life_area_items` pattern
-- (Goals & Planning and Journal & Reflection get dedicated tables since they need distinct fields).

create extension if not exists "pgcrypto";

-- 1. Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  onboarding_completed boolean not null default false,
  preferences jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Life Areas (static reference table, seeded below)
create table life_areas (
  id smallint primary key,
  slug text not null unique,
  name text not null,
  icon text not null,
  sort_order smallint not null
);

insert into life_areas (id, slug, name, icon, sort_order) values
  (1, 'dreams-vision', 'Dreams & Vision', '✨', 1),
  (2, 'goals-planning', 'Goals & Planning', '🎯', 2),
  (3, 'money', 'Money', '💰', 3),
  (4, 'health-wellness', 'Health & Wellness', '💪', 4),
  (5, 'family-relationships', 'Family & Relationships', '👨‍👩‍👧', 5),
  (6, 'career', 'Career', '💼', 6),
  (7, 'business', 'Business', '🚀', 7),
  (8, 'learning-growth', 'Learning & Personal Growth', '📚', 8),
  (9, 'home-lifestyle', 'Home & Lifestyle', '🏡', 9),
  (10, 'travel-experiences', 'Travel & Experiences', '✈️', 10),
  (11, 'daily-productivity', 'Daily Life & Productivity', '✅', 11),
  (12, 'journal-reflection', 'Journal & Reflection', '📓', 12);

-- 3. Transactions (Money life area — single shared table, filtered by `type` for every view)
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('income', 'expense', 'bill', 'debt')),
  amount numeric(12, 2) not null,
  category text,
  merchant text,
  description text,
  date date not null default current_date,
  due_date date,
  is_recurring boolean not null default false,
  recurrence_interval text check (recurrence_interval in ('weekly', 'monthly', 'yearly')),
  status text not null default 'active' check (status in ('active', 'paid', 'unpaid', 'overdue')),
  receipt_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index transactions_user_id_idx on transactions (user_id);
create index transactions_user_type_date_idx on transactions (user_id, type, date desc);

-- 4. Goals (Goals & Planning — single source of truth for any multi-area plan)
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  deadline date,
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  progress smallint not null default 0 check (progress between 0 and 100),
  linked_life_area_ids smallint[] not null default '{}',
  milestones jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index goals_user_id_idx on goals (user_id);

-- 5. Life Area Items (generic pattern covering the remaining 9 life areas:
--    Dreams & Vision, Health & Wellness, Family & Relationships, Career, Business,
--    Learning & Growth, Home & Lifestyle, Travel & Experiences, Daily Life & Productivity)
create table life_area_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  life_area_id smallint not null references life_areas (id),
  title text not null,
  notes text,
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  due_date date,
  data jsonb not null default '{}',
  linked_goal_id uuid references goals (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index life_area_items_user_id_idx on life_area_items (user_id);
create index life_area_items_user_area_idx on life_area_items (user_id, life_area_id);

-- 6. Brain Dumps (natural-language capture -> AI sorts -> user accepts/edits/rejects)
create table brain_dumps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  raw_text text not null,
  ai_suggested_life_area_id smallint references life_areas (id),
  ai_suggested_summary text,
  confirmed_life_area_id smallint references life_areas (id),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'edited', 'rejected')),
  resulting_item_table text,
  resulting_item_id uuid,
  created_at timestamptz not null default now()
);

create index brain_dumps_user_id_idx on brain_dumps (user_id);

-- 7. Journal & Reflection (dedicated table for mood/gratitude; also stores Brain Dump history)
create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_text text not null,
  mood text,
  gratitude text,
  source text not null default 'manual' check (source in ('manual', 'brain_dump')),
  brain_dump_id uuid references brain_dumps (id) on delete set null,
  created_at timestamptz not null default now()
);

create index journal_entries_user_id_idx on journal_entries (user_id);

-- 8. AI Chat (conversations + messages)
create table ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references ai_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index ai_conversations_user_id_idx on ai_conversations (user_id);
create index ai_messages_conversation_id_idx on ai_messages (conversation_id);

-- 9. AI Memory (remembers goals/dreams/preferences across sessions)
create table ai_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  key text not null,
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

create index ai_memory_user_id_idx on ai_memory (user_id);

-- Row Level Security: every user can only ever see/change their own rows.
alter table profiles enable row level security;
alter table life_areas enable row level security;
alter table transactions enable row level security;
alter table goals enable row level security;
alter table life_area_items enable row level security;
alter table brain_dumps enable row level security;
alter table journal_entries enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;
alter table ai_memory enable row level security;

create policy "Users manage their own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Any authenticated user can read life areas" on life_areas
  for select using (auth.role() = 'authenticated');

create policy "Users manage their own transactions" on transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own goals" on goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own life area items" on life_area_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own brain dumps" on brain_dumps
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own journal entries" on journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own ai conversations" on ai_conversations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage messages in their own conversations" on ai_messages
  for all using (
    exists (
      select 1 from ai_conversations
      where ai_conversations.id = ai_messages.conversation_id
      and ai_conversations.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from ai_conversations
      where ai_conversations.id = ai_messages.conversation_id
      and ai_conversations.user_id = auth.uid()
    )
  );

create policy "Users manage their own ai memory" on ai_memory
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
