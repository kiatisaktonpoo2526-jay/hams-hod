import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key-for-build';

export const supabase = createClient(url, anon);

// Roles มาตรฐาน Phase 1
// owner = เมลส่วนตัวหัวหน้า (superadmin), director = ผอ.ดูอย่างเดียว,
// officer = เจ้าหน้าที่แต่ละงาน, viewer = ดูอย่างเดียว
export const ROLES = ['owner', 'director', 'officer', 'viewer'];

export const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL ?? '';
