import {
  Activity,
  ShieldAlert,
  Percent,
  ScanLine,
  ChartNoAxesCombined,
  Focus,
  ShieldCheck,
  Info,
} from "lucide-react";
import { MetricCard } from "./MetricCard";
import { ChartCard } from "./ChartCard";
import { InsightCard } from "./InsightCard";
import { DataChart } from "./DataChart";
import {
  total,
  damageTotal,
  damagePercent,
  noDamageTotal,
  metrics,
  yearly,
  monthly,
  phases,
  wildlife,
  confusion,
} from "@/lib/data";
import { number, percent } from "@/lib/formatters";
import { SafetyScreeningSummary } from "./SafetyScreeningSummary";

export function Overview() {
  return (
    <>
      <div className="overview-title">
        <div>
          <div className="eyebrow">
            <span className="tiny-dot" /> STUDI KASUS KESELAMATAN PENERBANGAN ·
            2000–2011
          </div>
          <h1>Bird Strike Risk Intelligence</h1>
          <p>Wildlife Hazard Analytics & Aircraft Damage Risk Screening</p>
        </div>
        <span className="analysis-badge">
          <ShieldCheck size={15} /> Analisis berbasis bukti
        </span>
      </div>
      <div className="metric-grid">
        <MetricCard
          label="Kejadian tercatat"
          value={number(total)}
          note="Dataset historis · 2000–2011"
          icon={Activity}
        />
        <MetricCard
          label="Kejadian kerusakan"
          value={number(damageTotal)}
          note="Status aktual: Caused Damage"
          icon={ShieldAlert}
          tone="red"
        />
        <MetricCard
          label="Tingkat kerusakan"
          value={percent(damagePercent)}
          note="Proporsi pada kejadian tercatat"
          icon={Percent}
          tone="amber"
        />
        <MetricCard
          label="Recall deteksi kerusakan"
          value={percent(metrics.Recall * 100)}
          note="Holdout · 2010–2011"
          icon={ScanLine}
          tone="teal"
        />
        <MetricCard
          label="PR-AUC final"
          value={number(metrics["PR-AUC"], 3)}
          note="Average precision · holdout"
          icon={ChartNoAxesCombined}
        />
        <MetricCard
          label="ROC-AUC final"
          value={number(metrics["ROC-AUC"], 3)}
          note="Diskriminasi kelas · holdout"
          icon={Focus}
          tone="teal"
        />
      </div>
      <SafetyScreeningSummary />
      <div className="overview-main">
        <ChartCard
          title="Tren kejadian tahunan"
          subtitle="Jumlah bird strike yang tercatat sepanjang periode studi"
          source="Sumber: output notebook · sel 32"
        >
          <DataChart data={yearly} kind="area" height={260} />
        </ChartCard>
        <section className="chart-card outcome-card">
          <div className="chart-heading">
            <div>
              <h2>Konsekuensi kejadian</h2>
              <p>Distribusi status kerusakan aktual</p>
            </div>
          </div>
          <div className="outcome-number">
            <strong>{percent(damagePercent)}</strong>
            <span>mengakibatkan kerusakan</span>
          </div>
          <div
            className="outcome-bar"
            role="img"
            aria-label={`${number(damageTotal)} kerusakan dan ${number(noDamageTotal)} tanpa kerusakan`}
          >
            <span style={{ width: `${damagePercent}%` }} />
          </div>
          <div className="outcome-row">
            <span>
              <i className="legend-dot red" />
              Kerusakan
            </span>
            <b>{number(damageTotal)}</b>
          </div>
          <div className="outcome-row">
            <span>
              <i className="legend-dot cyan" />
              Tanpa kerusakan
            </span>
            <b>{number(noDamageTotal)}</b>
          </div>
          <p className="mini-note">
            Kelas kerusakan lebih jarang. PR-AUC dan recall menjadi fokus
            evaluasi.
          </p>
          <div className="chart-source">Sumber: output notebook · sel 27</div>
        </section>
      </div>
      <div className="two-cols">
        <ChartCard
          title="Pola kejadian bulanan"
          subtitle="Agregat seluruh tahun · jumlah kejadian"
          source="Sumber: output notebook · sel 34"
        >
          <DataChart data={monthly} height={235} />
        </ChartCard>
        <ChartCard
          title="Fase penerbangan"
          subtitle="Frekuensi tercatat menurut fase penerbangan"
          source="Sumber: output notebook · sel 39"
        >
          <DataChart data={phases} horizontal height={235} color="#2563eb" />
        </ChartCard>
      </div>
      <InsightCard
        items={[
          `Satwa besar memiliki tingkat kerusakan ${percent(wildlife[0].rate!, 1)}, dibandingkan ${percent(wildlife[2].rate!, 1)} pada satwa kecil.`,
          `Approach mencatat kejadian terbanyak, sedangkan Descent memiliki proporsi kerusakan lebih tinggi.`,
          `Recall holdout ${percent(metrics.Recall * 100)} disertai ${number(confusion[1].Jumlah)} false positive; hasil screening tetap memerlukan peninjauan.`,
        ]}
      />
      <div className="notice">
        <Info size={18} />
        <p>
          Model memperkirakan kerusakan pesawat dengan syarat bird strike sudah
          tercatat. Model ini tidak memprediksi apakah bird strike akan terjadi.
        </p>
      </div>
    </>
  );
}
