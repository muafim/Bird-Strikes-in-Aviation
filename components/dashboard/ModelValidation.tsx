import {
  Focus,
  ChartNoAxesCombined,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import {
  metrics,
  calibration,
  backtesting,
  backtestingSummary,
  split,
} from "@/lib/data";
import { number, score, percent } from "@/lib/formatters";
import { MetricCard } from "./MetricCard";
import { ChartCard } from "./ChartCard";
import { DataChart } from "./DataChart";
import { InsightCard } from "./InsightCard";
import { Notice } from "./Notice";
import { SourceFigure } from "./SourceFigure";
import { RollingRecallSummary } from "./RollingRecallSummary";
export function ModelValidation() {
  return (
    <>
      <div className="content-section !mt-0">
        <h2>Temporal holdout · 2010–2011</h2>
        <p>
          {number(split[2].Observations)} kejadian ·{" "}
          {number(split[2].DamageEvents)} kerusakan · model dan threshold
          dipilih pada periode sebelumnya.
        </p>
      </div>
      <div className="metric-grid four">
        <MetricCard
          label="ROC-AUC"
          value={score(metrics["ROC-AUC"])}
          note="Holdout final"
          icon={Focus}
        />
        <MetricCard
          label="PR-AUC"
          value={score(metrics["PR-AUC"])}
          note="Average precision"
          icon={ChartNoAxesCombined}
        />
        <MetricCard
          label="Recall"
          value={percent(metrics.Recall * 100)}
          note="Safety-oriented threshold"
          icon={ScanLine}
          tone="teal"
        />
        <MetricCard
          label="Brier Score"
          value={score(metrics["Brier Score"])}
          note="Probabilitas mentah"
          icon={ShieldCheck}
        />
      </div>
      <div className="two-cols">
        <ChartCard
          title="Kalibrasi probabilitas"
          subtitle="Brier Score · lebih rendah lebih baik"
          source="Sumber: output notebook · sel 201, 208, 212"
        >
          <DataChart
            data={calibration.map((r) => ({
              name: r.Probability,
              value: r["Brier Score"],
            }))}
            horizontal
            unit="score"
            axisLabel="Brier Score (0–1)"
            maxValue={0.08}
            labelWidth={148}
            height={190}
          />
          <div className="body-pad">
            <p>
              CatBoost mentah sudah relatif terkalibrasi pada data evaluasi.
              Platt Scaling menurunkan Brier Score dari{" "}
              {score(calibration[0]["Brier Score"])} ke{" "}
              {score(calibration[1]["Brier Score"])}; peningkatannya kecil.
            </p>
          </div>
        </ChartCard>
        <ChartCard
          title="Reliability curve"
          subtitle="Perbandingan probabilitas dengan proporsi kerusakan aktual"
          source="Sumber: output notebook · sel 203, 205, 211"
        >
          <div className="body-pad">
            <p>
              Platt Scaling dilatih pada raw model score (logit) validation
              2009. Grafik menggunakan 10 bin kuantil dari holdout; baseline
              Brier memakai prevalensi validation, bukan prevalensi test.
            </p>
          </div>
          <SourceFigure
            name="calibration"
            title="Lihat kurva kalibrasi asli"
            description="Kurva raw dan calibrated CatBoost pada test set dibandingkan dengan garis kalibrasi ideal; kalibrasi hanya memberi perbaikan kecil pada Brier Score."
          />
        </ChartCard>
      </div>
      <InsightCard
        tone="amber"
        items={[
          "Brier Score membaik sedikit setelah kalibrasi: 0,0526 menjadi 0,0524, dibandingkan baseline 0,0710.",
          "Recall rolling terendah terjadi pada 2009: 66,80%. Target recall validation tidak menjamin recall yang sama pada tahun berikutnya.",
          "Performa berubah antarperiode, sehingga validasi berkala, pemantauan, dan evaluasi kebutuhan kalibrasi ulang tetap diperlukan.",
        ]}
      />
      <div className="content-section">
        <h2>Rolling temporal backtest</h2>
        <p>
          Setiap fold dilatih ulang pada tahun-tahun sebelumnya; threshold
          dipilih ulang pada satu tahun validation sebelum tahun uji.
        </p>
      </div>
      <RollingRecallSummary />
      <div className="three-cols">
        {(
          [
            { key: "PR-AUC", title: "PR-AUC per tahun", color: "#2563eb" },
            { key: "Recall", title: "Recall per tahun", color: "#0f766e" },
            {
              key: "FalseNegativeRate",
              title: "False negative rate",
              color: "#dc2626",
            },
          ] as const
        ).map((x) => (
          <ChartCard
            key={x.key}
            title={x.title}
            subtitle="Tahun pengujian 2008–2011"
            source="Sumber: output notebook · sel 245"
          >
            <DataChart
              data={backtesting.map((r) => ({
                name: String(r.TestYear),
                value: r[x.key] * (x.key === "PR-AUC" ? 1 : 100),
              }))}
              unit={x.key === "PR-AUC" ? "score" : "percent"}
              kind="line"
              color={x.color}
              height={210}
              axisLabel={
                x.key === "PR-AUC"
                  ? "Average precision (0–1)"
                  : `${x.title} (%)`
              }
            />
          </ChartCard>
        ))}
      </div>
      <Notice warning>
        Recall terendah pada rolling 2009 adalah 66,8%. Kinerja tidak konstan
        sepanjang waktu. Rolling 2011 menggunakan model dan threshold berbeda
        dari holdout gabungan 2010–2011; angka keduanya tidak boleh diperlakukan
        sebagai evaluasi model identik.
      </Notice>
      <ChartCard
        title="Detail setiap fold"
        subtitle="Training mulai 2000 · validation satu tahun sebelum test · angka mengikuti pembulatan notebook"
        source="Sumber: output notebook · sel 245"
      >
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {[
                  "Test",
                  "Train akhir",
                  "Validation",
                  "Best iteration",
                  "Threshold",
                  "PR-AUC",
                  "ROC-AUC",
                  "Brier",
                  "Precision",
                  "Recall",
                  "F2",
                  "Specificity",
                  "FNR",
                ].map((k) => (
                  <th scope="col" key={k}>
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {backtesting.map((r) => (
                <tr key={r.TestYear}>
                  <th scope="row">{r.TestYear}</th>
                  <td>{r.TestYear - 2}</td>
                  <td>{r.TestYear - 1}</td>
                  <td>{r.BestIteration}</td>
                  {[
                    r.Threshold,
                    r["PR-AUC"],
                    r["ROC-AUC"],
                    r.BrierScore,
                    r.Precision,
                    r.Recall,
                    r.F2,
                    r.Specificity,
                    r.FalseNegativeRate,
                  ].map((v, i) => (
                    <td key={i}>{score(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
      <div className="mt-[18px]">
        <ChartCard
          title="Rata-rata performa rolling"
          subtitle="Mean ± standar deviasi sampel dari empat fold · dihitung notebook sebelum pembulatan"
          source="Sumber: output notebook · sel 246"
        >
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Metrik</th>
                  <th scope="col">Mean</th>
                  <th scope="col">Standar deviasi</th>
                </tr>
              </thead>
              <tbody>
                {backtestingSummary.map((r) => (
                  <tr key={r.Metric}>
                    <th scope="row">{r.Metric}</th>
                    <td>{score(r.Mean)}</td>
                    <td>± {score(r.Std)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </>
  );
}
