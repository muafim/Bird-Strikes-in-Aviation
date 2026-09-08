import { confusion, metrics, errorRates, split } from "@/lib/data";
import { number, percent } from "@/lib/formatters";
import { ChartCard } from "./ChartCard";
export function ConfusionMatrix() {
  const [tn, fp, fn, tp] = confusion.map((r) => r.Jumlah);
  return (
    <ChartCard
      title="Confusion matrix final"
      subtitle={`Holdout 2010–2011 · ${number(split[2].Observations)} kejadian`}
      source="Sumber: output notebook · sel 185, 188, 195"
    >
      <p className="cm-caption">
        Kolom: prediksi model · Baris: kondisi aktual
      </p>
      <div className="cm-grid" aria-label="Confusion matrix holdout">
        <span />
        <span className="cm-axis">
          Prediksi
          <br />
          Tanpa kerusakan
        </span>
        <span className="cm-axis">
          Prediksi
          <br />
          Kerusakan
        </span>
        <span className="cm-axis">
          Aktual
          <br />
          Tanpa kerusakan
        </span>
        <div className="cm-cell">
          <span>TRUE NEGATIVE</span>
          <strong>{number(tn)}</strong>
          <span>Klasifikasi benar</span>
        </div>
        <div className="cm-cell fp">
          <span>FALSE POSITIVE</span>
          <strong>{number(fp)}</strong>
          <span>Peringatan keliru</span>
        </div>
        <span className="cm-axis">
          Aktual
          <br />
          Kerusakan
        </span>
        <div className="cm-cell fn">
          <span>FALSE NEGATIVE</span>
          <strong>{number(fn)}</strong>
          <span>Kerusakan terlewat</span>
        </div>
        <div className="cm-cell tp">
          <span>TRUE POSITIVE</span>
          <strong>{number(tp)}</strong>
          <span>Kerusakan terdeteksi</span>
        </div>
      </div>
      <div className="small-stats">
        <div>
          <strong className="green-text">
            {percent(metrics.Recall * 100)}
          </strong>
          <span>
            Recall · {number(tp)} / {number(tp + fn)}
          </span>
        </div>
        <div>
          <strong>{percent(errorRates.falseNegativeRate * 100)}</strong>
          <span>False negative rate</span>
        </div>
      </div>
      <p className="cm-alert">
        {number(fn)} of {number(tp + fn)} damaging events were missed.
      </p>
    </ChartCard>
  );
}
