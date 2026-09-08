'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { exportToExcel, exportToPdf } from '../../lib/excelPdf';

export default function Dashboard() {
  const [stats, setStats] = useState({ docs: 0, repairOpen: 0, vehicleOut: 0 });

  useEffect(() => {
    (async () => {
      const d1 = await supabase.from('documents').select('id', { count: 'exact', head: true });
      const d2 = await supabase.from('repairs').select('id', { count: 'exact', head: true }).neq('status', 'done');
      const d3 = await supabase.from('vehicle_requests').select('id', { count: 'exact', head: true }).eq('status', 'out');
      setStats({ docs: d1.count ?? 0, repairOpen: d2.count ?? 0, vehicleOut: d3.count ?? 0 });
    })();
  }, []);

  return (
    <div>
      <h2>Dashboard ผู้บริหาร — ภาพรวมบริหารทั่วไป</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={card}>หนังสือทั้งหมด<br /><b>{stats.docs}</b></div>
        <div style={card}>งานซ่อมค้าง<br /><b>{stats.repairOpen}</b></div>
        <div style={card}>รถออกให้บริการ<br /><b>{stats.vehicleOut}</b></div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button onClick={() => exportToExcel('hams-dashboard', [stats])}>Export Excel</button>
        <button onClick={exportToPdf}>Export PDF / Print</button>
      </div>
    </div>
  );
}
const card = { background: '#fff', padding: 16, borderRadius: 8, flex: 1, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,.1)' };
