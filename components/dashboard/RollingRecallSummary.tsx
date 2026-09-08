import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { backtesting, backtestingSummary } from "@/lib/data";
import { percent } from "@/lib/formatters";

export function RollingRecallSummary() {
  const lowest = backtesting.reduce((a, b) => (a.Recall < b.Recall ? a : b));
  const highest = backtesting.reduce((a, b) => (a.Recall > b.Recall ? a : b));
  const mean = backtestingSummary.find((row) => row.Metric === "Recall")!.Mean;

  return (
    <section className="rolling-recall-summary" aria-labelledby="rolling-recall-title">
      <div><span className="eyebrow">RECALL STABILITY</span><h2 id="rolling-recall-title">Performance varies across time.</h2><p>Target pada satu validation period tidak menjamin sensitivitas yang sama pada tahun berikutnya.</p></div>
      <div className="rolling-recall-metrics">
        <div className="low"><ArrowDownRight size={18} /><span><small>Lowest rolling recall</small><strong>{percent(lowest.Recall * 100, 1)}</strong><em>in {lowest.TestYear}</em></span></div>
        <div className="high"><ArrowUpRight size={18} /><span><small>Highest rolling recall</small><strong>{percent(highest.Recall * 100, 2)}</strong><em>in {highest.TestYear}</em></span></div>
        <div className="mean"><Minus size={18} /><span><small>Mean</small><strong>{percent(mean * 100, 2)}</strong><em>4 rolling folds</em></span></div>
      </div>
    </section>
  );
}
