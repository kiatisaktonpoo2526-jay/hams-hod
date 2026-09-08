'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { exportToExcel, exportToPdf } from '../../lib/excelPdf';

// งานซ่อมบำรุง: แจ้งซ่อม -> รับงาน -> ปิดงาน
export default function MaintenancePage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ location: '', detail: '', requester: '', status: 'new' });

  async function load() {
    const { data } = await supabase.from('repairs').select('*').order('created_at', { ascending: false }).limit(200);
    setRows(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    const { error } = await supabase.from('repairs').insert(form);
    if (!error) { setForm({ location: '', detail: '', requester: '', status: 'new' }); load(); }
    else alert(error.message);
  }

  async function setStatus(id, status) {
    const { error } = await supabase.from('repairs').update({ status }).eq('id', id);
    if (!error) load(); else alert(error.message);
  }

  return (
    <div>
      <h2>ซ่อมบำรุง — แจ้งซ่อม</h2>
      <form onSubmit={add} style={{ display: 'flex', gap: 8 }}>
        <input placeholder="สถานที่/ตึก" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input placeholder="อาการเสีย" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} style={{ flex: 1 }} />
        <input placeholder="ผู้แจ้ง" value={form.requester} onChange={(e) => setForm({ ...form, requester: e.target.value })} />
        <button>แจ้งซ่อม</button>
      </form>
      <div style={{ margin: '12px 0', display: 'flex', gap: 8 }}>
        <button onClick={() => exportToExcel('repairs', rows)}>Export Excel</button>
        <button onClick={exportToPdf}>Export PDF</button>
      </div>
      <table border="1" cellPadding="6" width="100%" style={{ background: '#fff' }}>
        <thead><tr><th>สถานที่</th><th>อาการ</th><th>ผู้แจ้ง</th><th>สถานะ</th><th>จัดการ</th></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.id}><td>{r.location}</td><td>{r.detail}</td><td>{r.requester}</td><td>{r.status}</td>
            <td>
              <button onClick={() => setStatus(r.id, 'doing')}>รับงาน</button>{' '}
              <button onClick={() => setStatus(r.id, 'done')}>ปิดงาน</button>
            </td></tr>))}</tbody>
      </table>
    </div>
  );
}
