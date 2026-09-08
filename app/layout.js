export const metadata = { title: 'HAMS - รพ.ฮอด', description: 'Hospital Administration Management System Phase 1' };

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ fontFamily: 'sans-serif', margin: 0, background: '#f6f7f9' }}>
        <header style={{ background: '#0b6e4f', color: '#fff', padding: '12px 20px' }}>
          <b>HAMS รพ.ฮอด</b> <span style={{ opacity: 0.85 }}> | บริหารทั่วไป Phase 1: Dashboard + ธุรการ + ซ่อม + รถ</span>
        </header>
        <main style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>{children}</main>
        <style>{`@media print { header { display:none } }`}</style>
      </body>
    </html>
  );
}
