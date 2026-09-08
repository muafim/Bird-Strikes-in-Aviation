import { globalShap, split, provenance } from "@/lib/data";
import { number, percent } from "@/lib/formatters";
import { ChartCard } from "./ChartCard";
import { InsightCard } from "./InsightCard";
import { Notice } from "./Notice";
import { DataScopeQuality } from "./DataScopeQuality";
const workflow = [
  "Data historis",
  "Pembersihan data",
  "Analisis bahaya",
  "Analisis statistik",
  "Temporal split",
  "Perbandingan model",
  "CatBoost",
  "Safety threshold",
  "Kalibrasi",
  "SHAP",
  "Temporal backtesting",
  "Dashboard",
];
export function AboutProject() {
  return (
    <>
      <ChartCard
        title="Dari kejadian historis ke screening kerusakan"
        subtitle="Analytical decision-support prototype · portfolio Data Science"
        source="Sumber utama: air-aviation-bird-strike-improved.ipynb"
      >
        <div className="body-pad">
          <p>
            Proyek ini menganalisis pola bird strike dan karakteristik satwa,
            mengevaluasi asosiasi dengan kerusakan pesawat, serta menjelaskan
            hasil model CatBoost. Tujuan prediksi adalah kerusakan pesawat
            setelah suatu bird strike tercatat, bukan peluang terjadinya bird
            strike.
          </p>
          <p className="mt-4">
            Cakupan data: 25.429 kejadian dari 2 Januari 2000 hingga 31 Desember
            2011. Terdapat 2.454 kejadian kerusakan (9,65%) dan 22.975 kejadian
            tanpa kerusakan. Sumber CSV yang dirujuk notebook adalah
            Bird_strikes.csv pada dataset Kaggle bird-strike-by-aircafts-data.
          </p>
        </div>
      </ChartCard>
      <DataScopeQuality />
      <div className="content-section">
        <h2>Alur analitis</h2>
        <p>Setiap hasil memiliki jejak sumber dari keluaran notebook.</p>
      </div>
      <ChartCard
        title="Workflow proyek"
        subtitle="Tahap berurutan dari data hingga penyajian hasil"
        source="Sumber: seluruh tahapan notebook"
      >
        <ol className="flow" aria-label="Alur analitis">
          {workflow.map((w, i) => (
            <li className="flow-step" key={w}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {w}
              {i < workflow.length - 1 && <span aria-hidden="true">→</span>}
            </li>
          ))}
        </ol>
      </ChartCard>
      <InsightCard
        items={[
          "Pemisahan berdasarkan waktu menguji kemampuan model pada kejadian yang lebih baru, tanpa mengacak informasi lintas periode.",
          "Variabel konsekuensi seperti Cost, Effect, dan PeopleInjured tidak digunakan sebagai prediktor untuk menghindari target leakage.",
          "Dashboard menampilkan hasil statis yang diekstrak. Tidak ada inferensi CatBoost realtime atau Python runtime pada production.",
        ]}
      />
      <div className="two-cols">
        <ChartCard
          title="Preprocessing & arsitektur model"
          subtitle="Pipeline pengolahan mengikuti kode notebook"
          source="Sumber: sel 18–22, 134–155, 172, 205"
        >
          <ul className="body-list">
            <li>
              Tanggal diubah ke datetime; tahun, bulan, dan kuartal diturunkan
              dari tanggal.
            </li>
            <li>
              Damage dipetakan ke target biner. Tidak ada duplikasi baris maupun
              RecordID pada audit sumber.
            </li>
            <li>
              Baseline, Logistic Regression, dan Random Forest memakai imputasi
              median serta scaling pada Altitude; imputasi modus dan one-hot
              encoding pada kategori.
            </li>
            <li>
              CatBoost memakai 11 fitur kategorikal sebagai string; nilai
              kategorikal kosong diisi Unknown. Altitude adalah fitur numerik.
            </li>
            <li>
              CatBoost: maksimum 1.200 iterasi, depth 6, learning rate 0,05,
              Logloss, eval_metric PRAUC, seed 42, early stopping 100. Best
              iteration 256, sehingga model final menyimpan 257 iterasi.
            </li>
            <li>
              CatBoost final tidak memakai auto_class_weights. Platt Scaling
              dilatih pada skor mentah validation.
            </li>
          </ul>
        </ChartCard>
        <ChartCard
          title="Pemisahan waktu"
          subtitle="Training → validation → test"
          source="Sumber: output notebook · sel 130, 132"
        >
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Set</th>
                  <th scope="col">Periode</th>
                  <th scope="col">n</th>
                  <th scope="col">Damage</th>
                </tr>
              </thead>
              <tbody>
                {split.map((r, i) => (
                  <tr key={r.Dataset}>
                    <th scope="row">{r.Dataset}</th>
                    <td>{["2000–2008", "2009", "2010–2011"][i]}</td>
                    <td>{number(r.Observations)}</td>
                    <td>{percent(r.DamageRate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="body-pad mt-4">
            <h3>Mengapa temporal split?</h3>
            <p className="mt-2">
              Model mempelajari masa lalu dan dievaluasi pada masa berikutnya.
              Validation digunakan untuk pemilihan model, early stopping,
              threshold, dan kalibrasi; holdout digunakan untuk evaluasi akhir.
              Pembagian acak dapat menyamarkan perubahan pola sepanjang waktu.
            </p>
            <h3 className="mt-5">Mengapa PR-AUC, bukan accuracy?</h3>
            <p className="mt-2">
              Sebagian besar kejadian tidak menyebabkan kerusakan. Accuracy
              tinggi dapat diperoleh dengan mengabaikan kelas kerusakan. PR-AUC
              menilai precision dan recall kelas minoritas; implementasi
              notebook memakai average_precision_score. Recall, precision, F2,
              dan Brier melengkapi interpretasinya.
            </p>
          </div>
        </ChartCard>
      </div>
      <div className="two-cols">
        <ChartCard
          title="Fitur model"
          subtitle="12 prediktor · nama sesuai notebook"
          source="Sumber: kode notebook · sel 127, 150"
        >
          <div className="feature-tags">
            {globalShap.map((r) => (
              <code key={r.raw}>{r.raw}</code>
            ))}
          </div>
        </ChartCard>
        <ChartCard
          title="Dikeluarkan dari prediksi"
          subtitle="Konsekuensi kejadian, teks bebas, dan identifier"
          source="Sumber: pemilihan fitur notebook · sel 125–127"
        >
          <div className="feature-tags">
            {["Cost", "Effect", "PeopleInjured", "Remarks", "RecordID"].map(
              (x) => (
                <code key={x}>{x}</code>
              ),
            )}
          </div>
          <div className="body-pad">
            <p>
              Cost, Effect, dan PeopleInjured dapat memuat informasi setelah
              kejadian. Remarks dapat mengungkap hasil kerusakan; RecordID
              adalah identifier. Pengecualian ini membantu membatasi target
              leakage.
            </p>
          </div>
        </ChartCard>
      </div>
      <ChartCard
        title="Batasan dan konteks penggunaan"
        subtitle="Hasil historis tidak sama dengan validasi operasional saat ini"
        source="Sumber: cakupan data dan metodologi notebook"
      >
        <ul className="body-list">
          <li>
            Dataset hanya berisi kejadian bird strike yang tercatat, tanpa
            seluruh jumlah penerbangan.
          </li>
          <li>
            Probabilitas terjadinya bird strike tidak dapat dihitung dari
            dataset ini.
          </li>
          <li>Data historis 2000–2011, bukan data Bandara Juanda.</li>
          <li>
            Asosiasi statistik dan SHAP bukan bukti hubungan sebab-akibat.
          </li>
          <li>
            Ukuran sampel kecil, spesies tidak teridentifikasi, dan kelengkapan
            pelaporan membatasi interpretasi.
          </li>
          <li>
            Threshold safety-oriented menyisakan false negative dan menghasilkan
            false positive.
          </li>
          <li>
            Prototipe ini bukan certified aviation safety system; penggunaan
            operasional memerlukan validasi terkini yang spesifik bandara.
          </li>
        </ul>
      </ChartCard>
      <div className="content-section">
        <h2>Transparansi sumber</h2>
        <p>
          Output kode tersimpan menjadi acuan angka; narasi lama tidak digunakan
          untuk mengganti hasil.
        </p>
      </div>
      <ChartCard
        title="Catatan audit notebook"
        subtitle={`${provenance.cellsAudited} sel ditelaah · nomor sel berbasis indeks mulai dari 0`}
        source="Jejak sumber lengkap: data/provenance.json dan audit/NOTEBOOK_AUDIT.md"
      >
        <div className="audit-note">
          <p>
            Beberapa paragraf markdown memuat hasil eksperimen lama: sel{" "}
            {provenance.staleMarkdownCells.join(", ")}. Dashboard mengikuti
            output tabel terkini, termasuk threshold 0,0684 dan recall holdout
            0,8394. CatBoost final tidak memakai class weighting, meskipun
            narasi kalibrasi lama menyatakan sebaliknya.
          </p>
          <p className="mt-3">
            CSV per kejadian tidak tersedia. File Excel UK 2025 adalah sumber
            berbeda dan tidak digabungkan. Grafik agregat menampilkan seluruh
            periode; tidak tersedia filter global lintas dimensi. Kurva yang
            hanya tersimpan sebagai gambar ditampilkan sebagai gambar asli.
          </p>
          <p className="mt-3">Hash SHA-256 notebook:</p>
          <code className="block break-all text-xs mt-2">
            {provenance.sha256}
          </code>
        </div>
      </ChartCard>
      <Notice>
        Seluruh data dashboard tersedia di repository. Build dan production
        tidak menjalankan notebook, model Python, atau database. Hasil model
        ditampilkan sebagai evaluasi penelitian yang tersimpan.
      </Notice>
    </>
  );
}
