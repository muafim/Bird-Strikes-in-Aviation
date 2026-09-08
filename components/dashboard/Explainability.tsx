import {
  globalShap,
  wildlifeShap,
  numberShap,
  phaseShap,
  localShap,
  highRiskCase,
  label,
} from "@/lib/data";
import { number, percent } from "@/lib/formatters";
import { ChartCard } from "./ChartCard";
import { DataChart } from "./DataChart";
import { InsightCard } from "./InsightCard";
import { Notice } from "./Notice";
export function Explainability() {
  return (
    <>
      <Notice>
        SHAP positif mendorong skor model ke arah <strong>Caused Damage</strong>
        ; SHAP negatif mendorongnya ke arah <strong>No Damage</strong>. Nilai
        berada pada skala skor mentah (log-odds), bukan poin persentase. SHAP
        menjelaskan model, bukan sebab-akibat.
      </Notice>
      <div className="two-cols">
        <ChartCard
          title="Faktor utama model secara global"
          subtitle="Rata-rata nilai absolut SHAP · seluruh 6.073 kejadian holdout"
          source="Sumber: output notebook · sel 217–220"
        >
          <DataChart
            data={globalShap}
            unit="score"
            axisLabel="Rata-rata |SHAP| · log-odds"
            maxValue={0.55}
            color="#2563eb"
            horizontal
            labelWidth={145}
            height={425}
          />
        </ChartCard>
        <div>
          <ChartCard
            title="Kontribusi ukuran satwa"
            subtitle="Rata-rata SHAP per kategori"
            source="Sumber: output notebook · sel 226"
          >
            <DataChart
              data={wildlifeShap}
              unit="shap"
              horizontal
              height={180}
              labelWidth={70}
            />
          </ChartCard>
          <div className="mt-[18px]">
            <ChartCard
              title="Kontribusi jumlah satwa"
              subtitle="Rata-rata SHAP per kategori"
              source="Sumber: output notebook · sel 229"
            >
              <DataChart
                data={numberShap}
                unit="shap"
                horizontal
                height={160}
                labelWidth={70}
              />
            </ChartCard>
          </div>
        </div>
      </div>
      <InsightCard
        items={[
          "Ukuran satwa merupakan faktor global terkuat berdasarkan rata-rata |SHAP| sebesar 0,498847.",
          "Satwa besar memiliki rata-rata SHAP positif (+1,501540); satwa kecil negatif (−0,386793).",
          "Besarnya SHAP global tidak menunjukkan arah. Arah kontribusi dipelajari dari ringkasan kategori dan penjelasan kasus individual.",
        ]}
      />
      <ChartCard
        title="Kontribusi fase penerbangan"
        subtitle="Rata-rata SHAP pada temporal holdout"
        source="Sumber: output notebook · sel 233"
      >
        <DataChart
          data={phaseShap}
          unit="shap"
          horizontal
          height={280}
          labelWidth={125}
        />
      </ChartCard>
      <Notice warning>
        Parked disertakan sesuai output notebook, tetapi hanya memiliki 2
        observasi pada holdout. Kategori Over 100 tidak memiliki ringkasan SHAP
        pada holdout dan tidak diisi dengan angka buatan.
      </Notice>
      <div className="content-section">
        <h2>Mengapa kejadian ini berisiko tinggi?</h2>
        <p>
          Why is this event high risk? · Penjelasan satu kejadian aktual dari
          notebook.
        </p>
      </div>
      <section className="chart-card">
        <div className="case-header">
          <div>
            <span className="eyebrow">CONTOH KASUS HISTORIS</span>
            <h2>American white pelican · BE-100 KING</h2>
            <p className="mt-2 text-xs">
              Hasil aktual: <span className="danger-text">Caused Damage</span>
            </p>
          </div>
          <div className="case-risk">
            <strong>
              {percent(highRiskCase.calibratedProbability * 100, 1)}
            </strong>
            <span>Estimasi terkalibrasi</span>
          </div>
        </div>
        <dl className="case-features">
          {highRiskCase.features.map((r) => (
            <div key={r.feature}>
              <dt>{label(r.feature)}</dt>
              <dd>
                {r.feature === "Month"
                  ? "Oktober"
                  : r.feature === "Altitude"
                    ? `${number(Number(r.value))} ft`
                    : label(String(r.value))}
              </dd>
            </div>
          ))}
        </dl>
        <div className="chart-source">
          Sumber: output notebook · sel 239 · Probabilitas mentah{" "}
          {percent(highRiskCase.rawProbability * 100, 1)} · Indeks baris sumber
          3710 (bukan RecordID)
        </div>
      </section>
      <div className="two-cols mt-[18px]">
        <ChartCard
          title="Pendorong skor risiko"
          subtitle="Risk Drivers · kontribusi SHAP positif pada kasus ini"
          source="Sumber: output notebook · sel 241"
        >
          <DataChart
            data={localShap.filter((r) => r.value > 0)}
            unit="shap"
            horizontal
            height={385}
            labelWidth={145}
          />
        </ChartCard>
        <ChartCard
          title="Penurun skor risiko"
          subtitle="Risk Reducers · kontribusi SHAP negatif pada kasus ini"
          source="Sumber: output notebook · sel 241"
        >
          <div className="contribution-list">
            {localShap
              .filter((r) => r.value < 0)
              .map((r) => (
                <div className="contribution negative" key={r.name}>
                  <span>{r.name} · Oktober</span>
                  <b>{number(r.value, 3)}</b>
                </div>
              ))}
          </div>
          <div className="body-pad">
            <p>
              Dalam contoh ini, kontribusi bulan sedikit menurunkan skor model,
              sementara ukuran satwa, spesies, dan model pesawat memberikan
              kontribusi positif terbesar.
            </p>
            <p className="mt-4">
              SHAP menjelaskan CatBoost mentah. Probabilitas 93,4% ditampilkan
              setelah Platt Scaling; kontribusi SHAP tidak dijumlahkan langsung
              menjadi persentase tersebut.
            </p>
          </div>
        </ChartCard>
      </div>
      <Notice>
        Ini adalah panel penjelasan kasus tersimpan, bukan simulasi atau
        formulir prediksi. Estimasi probabilitas dari studi historis tidak
        berarti probabilitas operasional yang pasti untuk bandara tertentu.
      </Notice>
    </>
  );
}
