import { CalendarDays, Database, FileWarning, ListChecks } from "lucide-react";
import { dataQuality, total } from "@/lib/data";
import { number, percent } from "@/lib/formatters";

export function DataScopeQuality() {
  const selected = ["ConditionsPrecipitation", "Effect", "Remarks"].map((key) => dataQuality.find((row) => row.raw === key)!);
  return (
    <section className="data-scope-card" aria-labelledby="data-scope-title">
      <div className="chart-heading"><div><h2 id="data-scope-title">Data Scope & Quality</h2><p>Cakupan yang dapat didukung oleh arsip historis dan batas kelengkapan pelaporan.</p></div></div>
      <div className="scope-kpis">
        <div><span><Database size={18} /></span><strong>{number(total)}</strong><small>recorded events</small></div>
        <div><span><CalendarDays size={18} /></span><strong>2000–2011</strong><small>historical period</small></div>
        <div><span><ListChecks size={18} /></span><strong>Recorded only</strong><small>bird strikes, not all flights</small></div>
      </div>
      <div className="missingness-section">
        <div><FileWarning size={20} /><div><h3>Important missingness</h3><p>Nilai kosong membatasi ruang interpretasi, khususnya konsekuensi dan kondisi cuaca.</p></div></div>
        <div className="missingness-grid">
          {selected.map((row) => <div key={row.raw}><span>{row.feature}</span><strong>~{percent(row.missingPercent, 0)}</strong><div className="missing-track"><i style={{ width: `${row.missingPercent}%` }} /></div></div>)}
        </div>
      </div>
      <div className="chart-source">Sumber: output notebook · sel 7, 13, 24, 27</div>
    </section>
  );
}
