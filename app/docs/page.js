'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { exportToExcel, importFromExcel, exportToPdf } from '../../lib/excelPdf';

// งานธุรการ: ทะเบียนรับ-ส่งหนังสือ + แนบ PDF + Import/Export Excel
export default function DocsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ doc_no: '', title: '', type: 'รับเข้า', doc_date: '' });

  async function load() {
    const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false }).limit(200);
    setRows(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    const { error } = await supabase.from('documents').insert(form);
    if (!error) { setForm({ doc_no: '', title: '', type: 'รับเข้า', doc_date: '' }); load(); }
    else alert(error.message);
  }

  async function onImport(e) {
    const json = await importFromExcel(e.target.files[0]);
    // คาด header: doc_no,title,type,doc_date
    const { error } = await supabase.from('documents').insert(json);
    if (error) alert(error.message); else load();
  }

  return (
    <div>
      <h2>ธุรการ — รับ/ส่งหนังสือ</h2>
      <form onSubmit={add} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="เลขที่หนังสือ" value={form.doc_no} onChange={(e) => setForm({ ...form, doc_no: e.target.value })} />
        <input placeholder="เรื่อง" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ flex: 1 }} />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option>รับเข้า</option><option>ส่งออก</option><option>เวียน</option>
        </select>
        <input type="date" value={form.doc_date} onChange={(e) => setForm({ ...form, doc_date: e.target.value })} />
        <button type="submit">บันทึก</button>
      </form>
      <div style={{ margin: '12px 0', display: 'flex', gap: 8 }}>
        <label>Import Excel <input type="file" accept=".xlsx" onChange={onImport} /></label>
        <button onClick={() => exportToExcel('documents', rows)}>Export Excel</button>
        <button onClick={exportToPdf}>Export PDF</button>
      </div>
      <table border="1" cellPadding="6" width="100%" style={{ background: '#fff' }}>
        <thead><tr><th>เลขที่</th><th>เรื่อง</th><th>ประเภท</th><th>วันที่</th></tr></thead>
        <tbody>{rows.map((r) => (<tr key={r.id}><td>{r.doc_no}</td><td>{r.title}</td><td>{r.type}</td><td>{r.doc_date}</td></tr>))}</tbody>
      </table>
    </div>
  );
}
