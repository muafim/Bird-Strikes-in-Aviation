# Bird Strike Risk Intelligence

**Wildlife Hazard Analytics & Aircraft Damage Risk Screening**

Dashboard portfolio Data Science berbahasa Indonesia untuk menelaah pola kejadian bird strike historis, bahaya satwa, screening kerusakan CatBoost, SHAP, dan validasi temporal. Delapan halaman berada dalam satu workspace analytics penerbangan bertema terang dengan sidebar desktop dan drawer mobile.

> Prototipe pendukung analisis, bukan sistem keselamatan penerbangan bersertifikasi atau aplikasi operasional bandara.

## Problem statement

Proyek memisahkan frekuensi kejadian, proporsi kerusakan, dan hasil prediksi: kapan bird strike paling banyak tercatat, faktor apa yang berasosiasi dengan kerusakan, dan seberapa baik model mendeteksi kerusakan pada periode berikutnya.

Model mengestimasi **kerusakan bersyarat pada bird strike yang telah tercatat**, bukan probabilitas terjadinya bird strike.

## Dataset dan sumber kebenaran

- Notebook: [`air-aviation-bird-strike-improved.ipynb`](air-aviation-bird-strike-improved.ipynb), 247 sel.
- 25.429 kejadian, 2 Januari 2000–31 Desember 2011.
- 2.454 kerusakan (9,65%); 22.975 tanpa kerusakan (90,35%).
- CSV Kaggle `bird-strike-by-aircafts-data/Bird_strikes.csv` dirujuk notebook tetapi tidak tersedia di repository.
- Excel UK 2025 adalah sumber berbeda dan tidak digunakan.
- Beberapa markdown masih berisi hasil eksperimen lama. Dashboard mengikuti **output kode terkini**; lihat [`audit/NOTEBOOK_AUDIT.md`](audit/NOTEBOOK_AUDIT.md).
- [`data/provenance.json`](data/provenance.json) menyimpan hash SHA-256 dan indeks sel sumber (mulai dari 0).

## Halaman

| Route                | Isi                                                   |
| -------------------- | ----------------------------------------------------- |
| `/`                  | Enam KPI, Safety Screening Summary, tren, konsekuensi |
| `/temporal-patterns` | Frekuensi dan damage rate tahunan/bulanan             |
| `/operational-risk`  | Fase, frequency–severity scatter, altitude, pesawat   |
| `/wildlife-hazard`   | Ukuran, Wildlife Risk Ladder, jumlah, top 15 spesies  |
| `/predictive-model`  | Decision flow, Model Card, threshold, confusion matrix |
| `/explainability`    | SHAP global, kategori, dan kasus individual           |
| `/model-validation`  | Holdout, kalibrasi, rolling recall, dan mean ± SD     |
| `/about-project`     | Data scope/quality, workflow, metodologi, dan batasan |

Tiap halaman memiliki insight berbasis hasil notebook. Grafik interaktif menyediakan tooltip dan tabel aksesibel. Tidak ada filter global karena row-level data tidak tersedia. Kurva yang hanya tersimpan sebagai PNG ditampilkan sebagai gambar asli dalam panel yang dapat dibuka, tanpa rekonstruksi koordinat.

## Visual system

Antarmuka memakai latar `#f8fafc`, kartu putih, border `#e2e8f0`, teks utama `#0f172a`, dan teks sekunder `#64748b`. Biru menandai analisis umum, teal menandai performa model dan hasil positif, amber menandai risiko atau perhatian, serta merah menandai kejadian terlewat dan status kritis. Bayangan, radius, motion, tooltip, tabel, dan state navigasi menggunakan aturan yang sama di seluruh halaman.

Audit browser mencakup semua delapan route pada lebar 1440, 1024, 768, dan 390 px. Hasil lengkap tersedia di [`audit/VALIDATION.md`](audit/VALIDATION.md).

## Analytical workflow

Data historis → cleaning → hazard analysis → statistical analysis → temporal split → model comparison → CatBoost → safety threshold → calibration → SHAP → rolling temporal backtesting → dashboard.

Tanggal diparsing, fitur waktu diturunkan, target dipetakan ke biner. Kategori CatBoost yang kosong diisi `Unknown`, lalu diubah menjadi string. Altitude adalah fitur numerik. Pipeline pembanding memakai imputasi median, scaling numerik, serta imputasi modus dan one-hot encoding kategori. Cost, Effect, PeopleInjured, Remarks, dan RecordID tidak masuk prediktor.

## Model architecture

Train 2000–2008: **16.109** kejadian. Validation 2009: **3.247**. Test 2010–2011: **6.073**, termasuk **467** kerusakan.

Model pembanding: DummyClassifier, Logistic Regression, Random Forest, CatBoost. CatBoost: maksimum 1.200 iterasi, depth 6, learning rate 0,05, loss Logloss, eval_metric PRAUC, seed 42, early stopping 100. Best iteration 256 (257 iterasi tersimpan). Model final **tanpa auto_class_weights**.

12 fitur: FlightPhase, Altitude, AltitudeBin, WildlifeSize, WildlifeSpecies, NumberStruck, ConditionsSky, PilotWarned, IsAircraftLarge?, Engines, MakeModel, Month.

## Model results

Validation PR-AUC: CatBoost **0,4693**, Logistic Regression **0,4565**, Random Forest **0,4213**, dummy **0,0770**. CatBoost memiliki PR-AUC tertinggi dan Brier terendah pada perbandingan tersebut.

| Holdout 2010–2011          |  Nilai |
| -------------------------- | -----: |
| ROC-AUC                    | 0,8738 |
| PR-AUC (average precision) | 0,4789 |
| Precision                  | 0,2154 |
| Recall                     | 0,8394 |
| F1                         | 0,3428 |
| F2                         | 0,5315 |
| Brier Score                | 0,0526 |
| Specificity                | 0,7453 |
| False positive rate        | 0,2547 |
| False negative rate        | 0,1606 |

Confusion matrix: TN **4.178**, FP **1.428**, FN **75**, TP **392**. Model mendeteksi 392 dari 467 kerusakan.

## Safety threshold strategy

**Safety-oriented operating threshold 0,0684** adalah threshold tertinggi pada grid yang masih mencapai recall validation ≥75%. Nilai sebelum pembulatan sekitar 0,068432432. Ini bukan threshold yang optimal secara universal.

| Validation 2009 | Threshold | Precision | Recall |     F1 |     F2 |
| --------------- | --------: | --------: | -----: | -----: | -----: |
| Default         |    0,5000 |    0,6789 | 0,2960 | 0,4123 | 0,3336 |
| F2 Optimal      |    0,1948 |    0,3932 | 0,6040 | 0,4763 | 0,5455 |
| Safety-oriented |    0,0684 |    0,2000 | 0,7520 | 0,3160 | 0,4845 |

Threshold diterapkan pada probabilitas mentah. Kalibrasi tidak mengganti hasil klasifikasi final. Trade-off recall–precision dan false positive tetap ditampilkan.

## Calibration dan explainability

Brier raw **0,0526**, calibrated **0,0524**, baseline **0,0710**. Platt Scaling dilatih pada raw score/logit validation 2009. Peningkatan kecil menunjukkan probabilitas mentah relatif baik pada evaluasi ini, bukan jaminan probabilitas operasional bandara.

WildlifeSize merupakan fitur SHAP global terkuat, mean |SHAP| **0,498847**. SHAP positif mendorong skor ke Caused Damage; negatif ke No Damage. Unitnya log-odds, bukan poin persentase dan bukan kausalitas.

Kasus aktual: American white pelican, Descent 4.000 ft, BE-100 KING, raw **95,5%**, calibrated **93,4%**, actual Caused Damage. Panel ini bukan prediction form.

Rolling 2008–2011: rata-rata PR-AUC **0,4970 ± 0,0490**, recall **0,7636 ± 0,0768**. Recall terendah 2009 **66,8%**. Model dan threshold dipilih ulang setiap fold; berbeda dari evaluasi per tahun atas satu model holdout.

## Why PR-AUC instead of Accuracy?

Tanpa kerusakan mencakup 90,35% data. Accuracy bisa tinggi meskipun model gagal mendeteksi kerusakan. PR-AUC berfokus pada precision–recall kelas positif. Notebook memakai `average_precision_score`, bukan integral trapezoidal. Recall, precision, F2, dan Brier melengkapi analisis.

## Why a temporal split?

Urutan waktu menguji generalisasi terhadap periode berikutnya. Pembagian acak dapat menyembunyikan perubahan pola antarperiode. Validation dipakai untuk pemilihan model, early stopping, threshold, dan kalibrasi; test terpisah untuk evaluasi akhir. Rolling menguji variasi performa sepanjang waktu.

## Limitations

- Hanya recorded bird strike events; seluruh jumlah penerbangan sebagai exposure tidak tersedia.
- Tidak dapat menghitung probabilitas bird strike atau risiko per penerbangan.
- Data historis 2000–2011, bukan data Bandara Juanda.
- Sampel dan pelaporan tidak merata. Ranking rate spesies memakai ≥30 observasi; Over 100 hanya 8.
- Statistik dan SHAP tidak membuktikan causality.
- CSV, model binary, dan probabilitas per baris tidak tersedia; training tidak direproduksi. Hasil tersimpan diaudit.
- Threshold dan probabilitas tidak otomatis berlaku pada bandara atau periode lain.
- Bukan certified aviation safety system; perlu validasi terkini spesifik bandara sebelum operasional.

## Technology stack

Next.js **16.3.4** (stable npm dist-tag saat implementasi), React, App Router, TypeScript, Tailwind CSS 4, shadcn/ui (Button/Sheet berbasis Radix), Recharts, Lucide React, dan Geist lokal. Versi dikunci dalam package.json dan package-lock.json.

Tidak memakai database, backend Python, API prediksi, atau eksekusi notebook pada production. Framer Motion tidak diperlukan; transisi CSS ringan menghormati `prefers-reduced-motion`.

## Menjalankan lokal

Gunakan Node.js 22 LTS dan npm.

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

```bash
npm run lint
npm run typecheck
npm run data:verify
npm run build
npm start
```

Gunakan `npm ci` untuk instalasi deterministik. Jika PowerShell memilih shim npm yang rusak di `%APPDATA%`, jalankan `npm.cmd` dari instalasi Node valid atau perbaiki PATH; ini masalah instalasi mesin.

## Ekstraksi data development

```bash
npm run data:extract
npm run data:verify
```

Extractor Node membaca JSON notebook, mengambil tabel HTML saved outputs dan PNG asli, menghasilkan `data/*.json` tanpa Python. Jalankan setelah audit jika notebook berubah. Verifier menolak hash atau angka yang berbeda. Build tidak menjalankan extractor; notebook tidak dibutuhkan runtime hosting.

## Deploy ke Vercel

1. Simpan project, `data/`, `public/`, dan `package-lock.json` ke repository Git.
2. Import repository pada Vercel; pilih framework **Next.js**, root direktori repository ini.
3. Gunakan Node.js **22.x**, install `npm ci`, build `npm run build`.
4. Biarkan output directory default. Tidak membutuhkan environment variables, database, atau Python.
5. Deploy. Delapan halaman diprerender melalui App Router dan `generateStaticParams`.

Tidak memerlukan konfigurasi Vercel khusus. Repository disiapkan untuk deployment; deployment Vercel belum dilakukan.

## Struktur

```text
app/                    Layout, styling, home, dan route analisis
components/dashboard/   KPI, grafik, insight, halaman, confusion matrix
components/ui/          Button dan Sheet shadcn/ui
lib/                    Data bertipe, label, format angka Indonesia
data/                   Output notebook statis dan provenance
public/notebook/        Lima gambar asli notebook
scripts/                Ekstraksi dan verifikasi tanpa Python
audit/                  Audit sumber dan konflik narasi
```
