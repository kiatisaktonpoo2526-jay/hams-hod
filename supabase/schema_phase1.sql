-- HAMS Phase 1 schema: รันใน Supabase SQL Editor
-- Owner = เมลส่วนตัวหัวหน้า (superadmin ตามมอบหมาย ผอ.)

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'officer' check (role in ('owner','director','officer','viewer')),
  display_name text,
  created_at timestamptz default now()
);

create table if not exists documents (
  id bigint generated always as identity primary key,
  doc_no text,
  title text not null,
  type text default 'รับเข้า',
  doc_date date,
  file_url text,
  created_by text,
  created_at timestamptz default now()
);

create table if not exists repairs (
  id bigint generated always as identity primary key,
  location text,
  detail text not null,
  requester text,
  status text default 'new' check (status in ('new','doing','done')),
  created_at timestamptz default now()
);

create table if not exists vehicle_requests (
  id bigint generated always as identity primary key,
  requester text,
  destination text,
  date_use date,
  status text default 'pending' check (status in ('pending','approved','out','done')),
  created_at timestamptz default now()
);

-- เปิด RLS
alter table profiles enable row level security;
alter table documents enable row level security;
alter table repairs enable row level security;
alter table vehicle_requests enable row level security;

-- Policy Phase 1 แบบใช้งานได้จริง: login แล้วอ่าน/เขียนได้ (เหมาะกับทีมเล็ก)
-- ขั้นต่อไปค่อยล็อกตาม role + ผอ.ดูอย่างเดียว
drop policy if exists "authenticated all" on documents;
create policy "authenticated all" on documents for all to authenticated using (true) with check (true);

drop policy if exists "authenticated all" on repairs;
create policy "authenticated all" on repairs for all to authenticated using (true) with check (true);

drop policy if exists "authenticated all" on vehicle_requests;
create policy "authenticated all" on vehicle_requests for all to authenticated using (true) with check (true);

drop policy if exists "own profile" on profiles;
create policy "own profile" on profiles for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Storage: สร้าง bucket ชื่อ hams-files (public=false) สำหรับแนบ PDF/Excel แล้วผูก policy ให้ authenticated อ่าน/เขียน
-- insert into storage.buckets (id, name, public) values ('hams-files','hams-files', false);
