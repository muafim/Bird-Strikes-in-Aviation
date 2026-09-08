import {
  comparison,
  metrics,
  errorRates,
  thresholds,
  split,
  confusion,
} from "@/lib/data";
import { number, percent, score } from "@/lib/formatters";
import { ChartCard } from "./ChartCard";
import { DataChart } from "./DataChart";
import { InsightCard } from "./InsightCard";
import { Notice } from "./Notice";
import { SourceFigure } from "./SourceFigure";
import { ConfusionMatrix } from "./ConfusionMatrix";
import { ThresholdComparison } from "./ThresholdComparison";
import { ModelDecisionFlow } from "./ModelDecisionFlow";
import { ModelCard } from "./ModelCard";
export function PredictiveModel() {
  return (
    <>
      <ModelDecisionFlow />
      <ModelCard />
      <div className="two-cols">
        {(["PR-AUC", "ROC-AUC"] as const).map((key) => (
          <ChartCard
            key={key}
            title={`Perbandingan ${key}`}
            subtitle="Validation set 2009 · model sebelum kalibrasi"
            source="Sumber: output notebook · sel 159"
          >
            <DataChart
              data={comparison.map((r) => ({ name: r.Model, value: r[key] }))}
              unit="score"
              axisLabel={`${key} (0–1)`}
              horizontal
              labelWidth={150}
              height={210}
              color={key === "PR-AUC" ? "#2563eb" : "#0f766e"}
            />
          </ChartCard>
        ))}
      </div>
      <ChartCard
        title="Empat model, satu evaluasi"
        subtitle="Validation set 2009 · threshold default 0,50 · PR-AUC = average precision"
        source="Sumber: output notebook · sel 139, 143, 147, 155, 159"
      >
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Model</th>
                {[
                  "ROC-AUC",
                  "PR-AUC",
                  "Precision",
                  "Recall",
                  "F1",
                  "Brier",
                ].map((x) => (
                  <th scope="col" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((r) => (
                <tr key={r.Model}>
                  <th scope="row">
                    {r.Model}{" "}
                    {r.Model === "CatBoost" && (
                      <span className="pill ml-2">Model final</span>
                    )}
                  </th>
                  {[
                    r["ROC-AUC"],
                    r["PR-AUC"],
                    r.Precision,
                    r.Recall,
                    r.F1,
                    r["Brier Score"],
                  ].map((v, i) => (
                    <td key={i}>{score(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
      <InsightCard
        tone="red"
        items={[
          `CatBoost memiliki PR-AUC validation tertinggi (${score(comparison[0]["PR-AUC"])}) dan Brier Score terendah (${score(comparison[0]["Brier Score"])}) di antara empat model pembanding.`,
          `Threshold safety-oriented meningkatkan recall validation menjadi ${percent(thresholds[2].Recall * 100)} dengan precision ${percent(thresholds[2].Precision * 100)}.`,
          `Pada holdout, ${number(confusion[3].Jumlah)} dari ${number(split[2].DamageEvents)} kerusakan terdeteksi; ${number(confusion[2].Jumlah)} kerusakan masih terlewat dan ${number(confusion[1].Jumlah)} kejadian tanpa kerusakan ditandai positif.`,
        ]}
      />
      <div className="content-section">
        <h2>Strategi threshold</h2>
        <p>
          Perbandingan pada validation set 2009, bukan evaluasi ulang holdout.
        </p>
      </div>
      <ThresholdComparison />
      <Notice>
        Safety-oriented operating threshold{" "}
        <strong>{score(thresholds[2].Threshold)}</strong> dipilih sebagai ambang
        tertinggi pada grid validation yang masih mencapai target recall ≥75%.
        Ini adalah titik operasi analitis, bukan threshold yang optimal secara
        universal. Ambang diterapkan pada probabilitas mentah CatBoost; hasil
        setelah Platt Scaling tidak digunakan untuk mengganti confusion matrix
        final.
      </Notice>
      <div className="two-cols">
        <ConfusionMatrix />
        <ChartCard
          title="Trade-off screening"
          subtitle="Temporal holdout · 2010–2011 · probabilitas mentah"
          source="Sumber: output notebook · sel 185, 186, 195"
        >
          <div className="small-stats">
            <div>
              <strong>{percent(metrics.Precision * 100)}</strong>
              <span>Precision</span>
            </div>
            <div>
              <strong>{percent(errorRates.falsePositiveRate * 100)}</strong>
              <span>False positive rate</span>
            </div>
          </div>
          <div className="body-pad">
            <table>
              <tbody>
                {[
                  ["F1", score(metrics["F1-score"])],
                  ["F2", score(metrics["F2-score"])],
                  ["Specificity", score(errorRates.specificity)],
                  ["Brier Score", score(metrics["Brier Score"])],
                  [
                    "Tanpa kerusakan",
                    number(split[2].Observations - split[2].DamageEvents),
                  ],
                  ["Kerusakan aktual", number(split[2].DamageEvents)],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row">{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4">
              Recall tinggi membantu menjaring kejadian kerusakan, tetapi
              precision yang lebih rendah berarti banyak hasil positif
              memerlukan peninjauan. Model ini tidak menggantikan keputusan
              keselamatan.
            </p>
          </div>
        </ChartCard>
      </div>
      <div className="two-cols">
        <ChartCard
          title="Kurva precision–recall"
          subtitle="Keluaran visual asli pada validation set"
          source="Sumber: output notebook · sel 165"
        >
          <SourceFigure
            name="precisionRecall"
            title="Lihat kurva precision–recall"
            description="Kurva precision–recall membandingkan CatBoost, Logistic Regression, dan Random Forest terhadap baseline prevalensi validation."
          />
        </ChartCard>
        <ChartCard
          title="Kurva ROC"
          subtitle="Keluaran visual asli pada validation set"
          source="Sumber: output notebook · sel 163"
        >
          <SourceFigure
            name="roc"
            title="Lihat kurva ROC"
            description="Kurva ROC validation membandingkan true positive rate dengan false positive rate untuk tiga model."
          />
        </ChartCard>
      </div>
    </>
  );
}
