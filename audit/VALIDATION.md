# Validasi implementasi

Lingkungan pemeriksaan: Windows, Node.js 22.18.0, Next.js 16.3.4. Hasil pada 8 September 2026.

| Pemeriksaan | Hasil |
| --- | --- |
| Instalasi dependensi npm | Berhasil; audit instalasi melaporkan 0 vulnerabilities |
| Versi package.json vs package-lock.json | Seluruh versi dependensi langsung cocok |
| `npm run lint` | Lulus, tanpa error atau warning |
| `npm run typecheck` | Lulus |
| `npm run data:verify` | Lulus: 27 tabel sumber, 9 agregat, metrik confusion matrix, sampel SHAP, threshold, rolling, 5 PNG asli |
| `npm run build` | Lulus; delapan halaman aplikasi diprerender, termasuk tujuh static params |
| Server development | Berjalan; halaman ringkasan dan validasi memberi HTTP 200 |
| Server production (`next start`) | Seluruh delapan halaman HTTP 200 |
| Lima aset notebook pada server production | Seluruhnya HTTP 200 |
| Route yang tidak dikenal | HTTP 404 |
| `git diff --check` | Tidak ada whitespace error |
| Browser console | Tidak ada error atau warning pada audit visual final |
| Responsive visual QA | Lulus pada 1440, 1024, 768, dan 390 px untuk delapan halaman |
| Interaksi mobile | Drawer terbuka, navigasi berhasil, dan drawer menutup setelah perpindahan route |
| Disclosure gambar notebook | Gambar precision–recall dimuat pada ukuran asli 790 × 590 px |

Route production yang diperiksa: `/`, `/temporal-patterns`, `/operational-risk`, `/wildlife-hazard`, `/predictive-model`, `/explainability`, `/model-validation`, `/about-project`.

Respons HTTP diperiksa setelah build final. Satu respons development sementara saat file sedang diformat adalah 500; pemeriksaan ulang dan seluruh pemeriksaan production telah lulus.

ESLint dikunci pada 9.39.5 karena plugin React dalam konfigurasi Next.js saat ini gagal dengan ESLint 10. Versi 9 menghasilkan lint bersih. Registry menandai versi 9 sebagai deprecated; ini adalah batasan kompatibilitas tooling development, bukan runtime aplikasi.

Layout menggunakan breakpoint desktop/tablet/mobile, drawer Radix dengan pengelolaan fokus, grafik responsif, tabel yang dapat digulir, focus-visible, skip link, dan preferensi reduced motion. Audit visual browser memeriksa seluruh route pada 1440, 1024, 768, dan 390 px. Tidak ditemukan overflow horizontal halaman; tabel lebar tetap berada di dalam container scroll. Sidebar tampil pada desktop, sedangkan tombol menu dan drawer dipakai pada tablet sempit dan ponsel. Komponen baru yang diperiksa mencakup Safety Screening Summary, frequency–severity scatter, Wildlife Risk Ladder, Predictive Model Decision Flow, Model Card, threshold cards, confusion matrix, rolling recall summary, dan Data Scope & Quality.

Browser audit juga membuka panel gambar notebook untuk memastikan aset lazy-loaded tersedia. Nilai `naturalWidth: 0` sebelum disclosure dibuka berasal dari perilaku `loading="lazy"`, bukan gambar rusak; setelah dibuka, gambar dimuat tanpa error konsol.

Training Python tidak dijalankan ulang karena CSV sumber tidak tersedia. Verifikasi data memeriksa saved outputs notebook. Deployment Vercel belum dilakukan; petunjuk deployment dan semua data runtime tersedia dalam repository.
