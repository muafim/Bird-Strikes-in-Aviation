# Audit notebook — Bird Strike Risk Intelligence

Sumber tunggal: `air-aviation-bird-strike-improved.ipynb`, 247 sel. Nama file aktual berbeda dari nama berakhiran `(1)(1)` dalam brief. Seluruh kode, markdown, output teks/tabel, dan metode pembuatan grafik ditelaah. Nomor sel adalah indeks **mulai dari 0**, bukan execution count.

Notebook tidak dijalankan ulang karena CSV sumber tidak tersedia. Audit memverifikasi **hasil tersimpan**, bukan reproduksi training. Hash sumber dan pemetaan dataset terdapat pada `data/provenance.json`.

## Data dan preprocessing

25.429 baris, 26 kolom, tanpa duplikasi baris atau RecordID (sel 5–10). Periode 2 Januari 2000–31 Desember 2011 (sel 24). Sebanyak 2.454 kerusakan dan 22.975 tanpa kerusakan; 9,65% / 90,35% setelah pembulatan (sel 27).

ConditionsPrecipitation kosong 92,08%, Effect 91,83%, Remarks 18,72%. Baris tidak dibuang hanya karena field tersebut kosong (13–21). Tanggal diparsing, Year/Month/Quarter diturunkan, Cost dinumerikkan, EnginesNumeric dibuat, DamageTarget dipetakan. CatBoost memakai Engines sebagai kategori, bukan EnginesNumeric (18–22, 150–151).

Excel `birdstrike-accessible-excel-sheet-2025.xlsx` berisi agregat UK 2018–2025 dan bukan row-level data notebook. Tidak digabungkan.

## Pemetaan hasil

| Kelompok                   | Sel                          | Penyajian                                               |
| -------------------------- | ---------------------------- | ------------------------------------------------------- |
| Tahunan/bulanan            | 32, 34                       | 12 tahun, 12 agregat bulan                              |
| Fase penerbangan           | 39, 43                       | Semua 7 fase, termasuk Parked n=10                      |
| Ketinggian                 | 45, 47, 49, 50, 52           | 13 bin; histogram/boxplot asli; batas bin dipertahankan |
| Satwa dan jumlah tertabrak | 58, 62                       | Semua kategori; Over 100 n=8 ditandai                   |
| Spesies                    | 68, 72                       | Top 15 frekuensi/rate; minimum 30 observasi             |
| Pesawat/pilot/langit       | 80, 84, 88                   | Count, damage count, rate                               |
| Statistik                  | 113, 115, 121                | Cramér’s V koreksi bias; Mann–Whitney p<0,001           |
| Split                      | 130, 132                     | Train 16.109; validation 3.247; test 6.073              |
| Model                      | 139, 143, 147, 155, 159      | Validation 2009, threshold 0,50                         |
| Threshold                  | 170–177                      | Safety 0,0684; F2 optimal 0,1948; default 0,50          |
| Evaluasi final             | 185, 186, 188, 195           | Test 2010–2011, probabilitas mentah                     |
| Kalibrasi                  | 198, 201, 205, 208, 211, 212 | Platt pada logit validation                             |
| SHAP                       | 217–241                      | Global, kategori, kasus aktual                          |
| Rolling                    | 245, 246                     | Empat fold; mean ± sample SD                            |

## Konflik narasi lama

Output kode tersimpan menjadi acuan jika markdown bertentangan. Notebook asli tidak diubah.

| Sel markdown | Narasi tidak dipakai                         | Acuan terkini                                            |
| ------------ | -------------------------------------------- | -------------------------------------------------------- |
| 166          | CatBoost PR-AUC 0,3863 dan pembanding lama   | 159: CatBoost 0,4693; LR 0,4565; RF 0,4213               |
| 190          | Threshold 0,52                               | 172, 177: safety 0,0684; validation recall 0,7520        |
| 191          | Validation TP 168, FN 82                     | 180, 182: TN 2245, FP 752, FN 62, TP 188                 |
| 192–193      | Holdout PR-AUC 0,4038, recall 69,81%, TP 326 | 185, 188: PR-AUC 0,4789; recall 0,8394; TP 392           |
| 196          | Specificity 84,27%; FNR 30,19%               | 195: specificity 0,7453; FPR 0,2547; FNR 0,1606          |
| 199, 209     | Balanced; Brier 0,1314 → 0,0575              | 153, 198: tanpa auto_class_weights; 208: 0,0526 → 0,0524 |

## Evaluasi dan threshold

ROC-AUC 0,8738; PR-AUC 0,4789; precision 0,2154; recall 0,8394; F1 0,3428; F2 0,5315; Brier 0,0526. TN 4178, FP 1428, FN 75, TP 392. Total 6073, positif 467, negatif 5606.

PR-AUC menggunakan `average_precision_score`. Log training `eval_metric="PRAUC"` memiliki bestTest 0,4681213171 dan tidak menggantikan average precision validation 0,4693.

Grid threshold 0,001–0,50 memiliki 1000 titik. Safety dipilih pada indeks 135: sekitar 0,068432432; dashboard menampilkan 0,0684 sesuai output. Tidak ada inferensi yang menerapkan nilai yang dibulatkan. Target ≥75% berlaku pada validation, bukan jaminan tahun berikutnya. F2 optimum hanya pembanding matematis.

Platt Scaling dilatih pada raw score/logit validation 2009. Confusion matrix final tetap menggunakan probabilitas **mentah**, bukan probabilitas terkalibrasi. Model final menyimpan 257 iterasi (best iteration 256).

## SHAP

SHAP menggunakan seluruh 6073 observasi holdout. Ringkasan ukuran, jumlah tertabrak, dan fase masing-masing berjumlah 6073. Parked mean SHAP +0,191997 dengan n=2 tidak tercantum dalam brief tetapi ada di notebook; ditampilkan dengan catatan. Over 100 tidak ada dalam ringkasan SHAP holdout; tidak diisi nol palsu.

Kasus tertinggi: indeks dataframe 3710 (**bukan RecordID**), American white pelican, BE-100 KING, Descent, 4000 ft, Oktober, Large, 2–10. Raw 0,955; calibrated 0,934; class 1. SHAP asli disimpan enam desimal, ditampilkan tiga desimal bila diperlukan. Unit log-odds, bukan poin persentase dan bukan kausalitas.

## Batasan visual dan data

- Tabel output mendasari seluruh grafik interaktif; tersedia tooltip dan tabel aksesibel.
- Tidak ada CSV per kejadian. Global filters tidak dibuat karena agregat independen tidak mendukung filter silang.
- Koordinat ROC, PR, histogram, boxplot, dan calibration tidak dicetak. Lima PNG asli diekstrak byte-for-byte ke `public/notebook/`, tanpa digitization.
- Ranking frekuensi spesies hanya menyimpan count. Damage count untuk seluruh 15 spesies tidak direka ulang.
- Sel 245 melatih model dan memilih threshold ulang setiap fold. Rolling bukan evaluasi per tahun dari satu model holdout yang sama.
- Mean/SD mengikuti sel 246; penghitungan ulang dari fold yang telah dibulatkan dapat sedikit berbeda.

## Verifikasi

`npm run data:extract` mengekstrak tabel dan PNG tanpa Python. `npm run data:verify` memeriksa hash, kesamaan tabel, sembilan agregat, rate, metrik confusion matrix, sampel SHAP, threshold, kasus, kalibrasi, rolling, dan integritas gambar. Ini alat development, bukan bagian build atau runtime production.
