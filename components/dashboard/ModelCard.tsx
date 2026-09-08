import { BadgeCheck, CalendarRange, ChartNoAxesCombined, Gauge, ScanLine, Sparkles } from "lucide-react";

const fields = [
  ["Final Model", "CatBoost"],
  ["Prediction Target", "Caused Damage"],
  ["Training Period", "2000–2008"],
  ["Validation", "2009"],
  ["Temporal Holdout", "2010–2011"],
  ["Primary Ranking Metric", "PR-AUC"],
  ["Safety Metric", "Recall / False Negative Rate"],
  ["Probability Metric", "Brier Score"],
  ["Features", "12"],
];

export function ModelCard() {
  return (
    <section className="model-card" aria-labelledby="model-card-title">
      <div className="model-card-heading">
        <div><span className="model-card-icon"><Sparkles size={20} /></span><div><span className="eyebrow">MODEL GOVERNANCE SNAPSHOT</span><h2 id="model-card-title">Model Card</h2></div></div>
        <div className="model-statuses"><span><CalendarRange size={15} />Temporal validation</span><span><Gauge size={15} />Calibration evaluated</span><span><BadgeCheck size={15} />SHAP explained</span></div>
      </div>
      <dl className="model-card-grid">
        {fields.map(([label, value], index) => (
          <div key={label} className={index === 0 ? "featured" : ""}>
            <dt>{label}</dt><dd>{value}</dd>
            {index === 5 && <ChartNoAxesCombined size={15} aria-hidden="true" />}
            {index === 6 && <ScanLine size={15} aria-hidden="true" />}
          </div>
        ))}
      </dl>
      <div className="chart-source">Sumber: konfigurasi dan evaluasi notebook · sel 127–212</div>
    </section>
  );
}
