import { thresholds } from "@/lib/data";
import { number, percent } from "@/lib/formatters";
const names = ["DEFAULT", "F2-ORIENTED", "SAFETY-ORIENTED"];
export function ThresholdComparison() {
  return (
    <div className="thresholds">
      {thresholds.map((row, i) => (
        <article
          className={`threshold-card ${i === 2 ? "selected" : ""}`}
          key={row.Mode}
        >
          <h3>{names[i]}</h3>
          <span className="threshold-kicker">Threshold</span>
          <strong>{number(row.Threshold, 4)}</strong>
          {(["Precision", "Recall", "F1", "F2"] as const).map((key) => (
            <div className="threshold-metric" key={key}>
              <span>{key}</span>
              <b>
                {key === "Precision" || key === "Recall"
                  ? percent(row[key] * 100, 1)
                  : number(row[key], 4)}
              </b>
            </div>
          ))}
          <p className="threshold-label">
            {i === 2
              ? "Selected to prioritize sensitivity to damaging events."
              : "Pembanding pada validation set"}
          </p>
        </article>
      ))}
    </div>
  );
}
