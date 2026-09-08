import { ArrowDown, CheckCircle2, Eye, ShieldAlert, XCircle } from "lucide-react";
import { confusion, errorRates, metrics, split } from "@/lib/data";
import { number, percent } from "@/lib/formatters";

export function SafetyScreeningSummary() {
  const [tn, fp, fn, tp] = confusion.map((row) => row.Jumlah);
  const testEvents = split[2].Observations;
  const damagingEvents = split[2].DamageEvents;
  const flagged = tp + fp;
  const flaggedRate = (flagged / testEvents) * 100;

  return (
    <section className="safety-summary" aria-labelledby="safety-summary-title">
      <div className="safety-summary-heading">
        <div>
          <span className="eyebrow">TEMPORAL HOLDOUT · 2010–2011</span>
          <h2 id="safety-summary-title">Safety Screening Summary</h2>
          <p>Hasil screening analitis pada {number(testEvents)} kejadian uji.</p>
        </div>
        <span className="summary-recall">
          <strong>{percent(metrics.Recall * 100)}</strong>
          <span>Recall</span>
        </span>
      </div>

      <div className="safety-summary-body">
        <div className="damage-path" role="img" aria-label={`${number(damagingEvents)} kerusakan aktual; ${number(tp)} terdeteksi dan ${number(fn)} terlewat`}>
          <div className="damage-root">
            <ShieldAlert size={20} />
            <span>
              <strong>{number(damagingEvents)}</strong>
              Actual Damage
            </span>
          </div>
          <ArrowDown className="path-arrow" size={18} aria-hidden="true" />
          <div className="damage-branches">
            <div className="branch detected">
              <CheckCircle2 size={20} />
              <span><strong>{number(tp)}</strong>Detected</span>
            </div>
            <div className="branch missed">
              <XCircle size={20} />
              <span><strong>{number(fn)}</strong>Missed</span>
            </div>
          </div>
        </div>

        <div className="review-summary">
          <Eye size={22} />
          <p>
            <strong>~{percent(flaggedRate, 0)} of test events were flagged for review</strong>
            while capturing {percent(metrics.Recall * 100)} of damaging events.
          </p>
          <dl>
            <div><dt>False alerts</dt><dd>{number(fp)}</dd></div>
            <div><dt>False Negative Rate</dt><dd>{percent(errorRates.falseNegativeRate * 100)}</dd></div>
            <div><dt>Correctly cleared</dt><dd>{number(tn)}</dd></div>
          </dl>
        </div>
      </div>
      <p className="safety-summary-footnote">
        Analytical screening prototype untuk memprioritaskan peninjauan; bukan keputusan keselamatan otomatis.
      </p>
    </section>
  );
}
