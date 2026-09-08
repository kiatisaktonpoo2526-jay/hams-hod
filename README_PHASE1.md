# HAMS Phase 1 — รพ.ฮอด (บริหารทั่วไป)

## Owner
เมลส่วนตัวหัวหน้า (ได้รับมอบหมายจาก ผอ.) ตั้งใน `.env.local` -> `NEXT_PUBLIC_OWNER_EMAIL`
ฐานข้อมูลจริงอยู่ Supabase ไม่ใช่ Drive ส่วนตัว ย้าย owner ทีหลังได้โดยข้อมูลไม่หาย

## ติดตั้ง
1. Copy `.env.example` เป็น `.env.local` แล้วใส่ Supabase URL + Anon Key + Owner email
2. รัน SQL `supabase/schema_phase1.sql` ใน Supabase
3. สร้าง Storage bucket `hams-files` (private) สำหรับแนบ PDF
4. ติดตั้ง: `npm.cmd install` แล้ว `npm.cmd run dev` (เปิดจาก รพ./บ้าน/มือถือได้)
5. Build ขึ้น Cloudflare Pages: `npm.cmd run build` -> โฟลเดอร์ `out/` -> อัพโหลด Pages

## โมดูล Phase 1
- /dashboard : ตัวเลขรวม หนังสือ/ซ่อมค้าง/รถออก
- /docs : ทะเบียนรับ-ส่งหนังสือ + Import/Export Excel + Print PDF
- /maintenance : แจ้งซ่อม รับงาน ปิดงาน
- /vehicle : ขอใช้รถ

## ความปลอดภัยเมื่อเปิดนอก รพ.
- บังคับ login ด้วย Supabase magic link + เปิด MFA ใน Supabase Auth
- อย่าแชร์ไฟล์ผ่านลิงก์ Drive ส่วนตัว ให้แนบผ่าน Supabase Storage
- สำรอง Sheet ผ่าน Apps Script เป็นแค่สำรอง ไม่ใช่ฐานจริง
