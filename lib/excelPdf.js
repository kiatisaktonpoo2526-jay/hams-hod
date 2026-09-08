import * as XLSX from 'xlsx';

// Export JSON -> Excel (.xlsx) ใช้ได้ทุกโมดูล
export function exportToExcel(filename, rows) {
  const ws = XLSX.utils.json_to_sheet(rows ?? []);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'data');
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : filename + '.xlsx');
}

// Import Excel -> JSON (validate header ก่อน insert Supabase)
export function importFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Export HTML -> PDF ใช้ window.print() เพื่อไม่ต้องลง lib เพิ่ม
// หน้าทุกโมดูลมีปุ่ม Print/PDF ใช้ CSS @media print มีหัวครุฑ รพ.ฮอด
export function exportToPdf() {
  window.print();
}
