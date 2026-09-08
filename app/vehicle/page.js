'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { exportToExcel, exportToPdf } from '../../lib/excelPdf';

// งานยานพาหนะ: ขอใช้รถ + สถานะรถ
export default function VehiclePage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ requester: '', destination: '', date_use: '', status: 'pending' });

  async function load() {
    const { data } = await supabase.from('vehicle_requests').select('*').order('created_at', { ascending: false }).limit(200);
    setRows(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    const { error } = await supabase.from('vehicle_requests').insert(form);
    if (!error) { setForm({ requester: '', destination: '', date_use: '', status: 'pending' }); load(); }
    else alert(error.message);
  }

  return (
    <div>
      <h2>ยานพาหนะ — ขอใช้รถ</h2>
      <form onSubmit={add} style={{ display: 'flex', gap: 8 }}>
        <input placeholder="ผู้ขอ" value={form.requester} onChange={(e) => setForm({ ...form, requester: e.target.value })} />
        <input placeholder="ปลายทาง" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} style={{ flex: 1 }} />
        <input type="date" value={form.date_use} onChange={(e) => setForm({ ...form, date_use: e.target.value })} />
        <button>ขอใช้รถ</button>
      </form>
      <div style={{ margin: '12px 0', display: 'flex', gap: 8 }}>
        <button onClick={() => exportToExcel('vehicles', rows)}>Export Excel</button>
        <button onClick={exportToPdf}>Export PDF</button>
      </div>
      <table border="1" cellPadding="6" width="100%" style={{ background: '#fff' }}>
        <thead><tr><th>ผู้ขอ</th><th>ปลายทาง</th><th>วันที่ใช้</th><th>สถานะ</th></tr></thead>
        <tbody>{rows.map((r) => (<tr key={r.id}><td>{r.requester}</td><td>{r.destination}</td><td>{r.date_use}</td><td>{r.status}</td></tr>))}</tbody>
      </table>
    </div>
  );
}
