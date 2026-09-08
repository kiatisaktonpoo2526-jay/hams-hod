'use client';
import Link from 'next/link';
import { useState } from 'react';
import { supabase, OWNER_EMAIL } from '../lib/supabaseClient';

export default function Home() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function login(e) {
    e.preventDefault();
    setMsg('กำลังตรวจสอบ...');
    // Phase 1: ใช้ magic link + ตรวจ owner จาก env
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMsg('Login ผิดพลาด: ' + error.message);
    else {
      if (email.trim().toLowerCase() === (OWNER_EMAIL || '').toLowerCase()) {
        setMsg('ส่งลิงก์เข้าใช้ให้ Owner แล้ว เปิดเมลของคุณเพื่อเข้า (สิทธิ์สูงสุด)');
      } else {
        setMsg('ส่งลิงก์เข้าใช้แล้ว (สิทธิ์ตามที่ Owner กำหนดในตาราง profiles)');
      }
    }
  }

  return (
    <div>
      <h2>เข้าสู่ระบบ (ใช้ได้จาก รพ. / บ้าน / มือถือ)</h2>
      <p>Owner ปัจจุบัน: <b>{OWNER_EMAIL || '(ยังไม่ตั้งค่าใน .env.local)'}</b> — ตามมอบหมาย ผอ.</p>
      <form onSubmit={login} style={{ display: 'flex', gap: 8 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="อีเมลของคุณ" style={{ padding: 8, flex: 1 }} />
        <button type="submit" style={{ padding: '8px 16px' }}>ส่งลิงก์เข้าใช้</button>
      </form>
      <p>{msg}</p>
      <nav style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/docs">ธุรการรับ-ส่งหนังสือ</Link>
        <Link href="/maintenance">แจ้งซ่อม</Link>
        <Link href="/vehicle">ขอใช้รถ</Link>
      </nav>
      <p style={{ color: '#555', fontSize: 13, marginTop: 16 }}>
        หมายเหตุความปลอดภัย: เมลส่วนตัวใช้เป็น Owner ได้ แต่ฐานข้อมูลจริงอยู่ใน Supabase ไม่ใช่ Drive ส่วนตัว
        เมื่อมีเมลกลาง รพ. ค่อยเปลี่ยน OWNER_EMAIL ได้ทันทีโดยข้อมูลไม่หาย
      </p>
    </div>
  );
}
