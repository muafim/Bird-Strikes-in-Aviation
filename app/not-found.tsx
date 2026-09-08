import Link from "next/link";
export default function NotFound() {
  return (
    <div className="section-header">
      <span className="eyebrow">404 · HALAMAN TIDAK DITEMUKAN</span>
      <h1>Halaman analisis tidak tersedia</h1>
      <p>Pilih salah satu halaman pada navigasi atau kembali ke ringkasan.</p>
      <Link className="pill mt-5" href="/">
        Kembali ke ringkasan →
      </Link>
    </div>
  );
}
