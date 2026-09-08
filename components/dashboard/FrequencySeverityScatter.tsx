"use client";

import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { phases } from "@/lib/data";
import { number, percent } from "@/lib/formatters";
import { ChartCard } from "./ChartCard";

type PhasePoint = {
  name: string;
  incidents: number;
  damage: number;
  rate: number;
};

const points: PhasePoint[] = phases.map((row) => ({
  name: row.name,
  incidents: row.incidents ?? 0,
  damage: row.damage ?? 0,
  rate: row.rate ?? 0,
}));

function ScatterTooltip({ active, payload }: { active?: boolean; payload?: readonly { payload?: PhasePoint }[] }) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return (
    <div className="chart-tooltip">
      <strong>{row.name}</strong>
      <span>Kejadian <b>{number(row.incidents)}</b></span>
      <span>Kerusakan <b>{number(row.damage)}</b></span>
      <span>Damage rate <b>{percent(row.rate)}</b></span>
    </div>
  );
}

export function FrequencySeverityScatter() {
  return (
    <ChartCard
      title="Frequency vs Severity by Flight Phase"
      subtitle="Setiap bubble mewakili fase penerbangan; ukuran bubble mengikuti jumlah kejadian kerusakan"
      source="Sumber: output notebook · sel 39"
    >
      <div className="scatter-helper">High frequency ≠ high severity</div>
      <div className="chart-canvas scatter-canvas" role="img" aria-label="Scatter plot frekuensi kejadian dan tingkat kerusakan menurut fase penerbangan">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 820, height: 340 }}>
          <ScatterChart margin={{ top: 22, right: 25, bottom: 14, left: 6 }} accessibilityLayer>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 5" />
            <XAxis type="number" dataKey="incidents" name="Incident Count" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#cbd5e1" }} label={{ value: "Incident Count", position: "insideBottom", offset: -8, fill: "#64748b", fontSize: 12 }} />
            <YAxis type="number" dataKey="rate" name="Damage Rate" unit="%" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#cbd5e1" }} width={54} domain={[0, "auto"]} />
            <ZAxis type="number" dataKey="damage" range={[90, 520]} />
            <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "3 3", stroke: "#94a3b8" }} />
            <Scatter data={points} fill="#2563eb" fillOpacity={0.72} stroke="#1d4ed8" strokeWidth={1.5} isAnimationActive={false} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <details className="data-details">
        <summary>Lihat data scatter <span>{points.length} fase</span></summary>
        <div className="table-scroll">
          <table>
            <thead><tr><th scope="col">Flight Phase</th><th scope="col">Incidents</th><th scope="col">Damage Events</th><th scope="col">Damage Rate</th></tr></thead>
            <tbody>{points.map((row) => <tr key={row.name}><th scope="row">{row.name}</th><td>{number(row.incidents)}</td><td>{number(row.damage)}</td><td>{percent(row.rate)}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </ChartCard>
  );
}
