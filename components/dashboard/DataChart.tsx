"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";
import type { ChartDatum } from "@/lib/data";
import { number, percent } from "@/lib/formatters";
type Unit = "count" | "percent" | "score" | "shap" | "feet";
const format = (n: number, unit: Unit) =>
  unit === "percent"
    ? percent(n, 2)
    : unit === "count"
      ? number(n)
      : unit === "feet"
        ? `${number(n)} ft`
        : number(n, unit === "shap" ? 3 : 4);
function DetailTooltip({
  active,
  payload,
  unit,
}: {
  active?: boolean;
  payload?: readonly { payload?: ChartDatum }[];
  unit: Unit;
}) {
  const d = payload?.[0]?.payload;
  if (!active || !d) return null;
  return (
    <div className="chart-tooltip">
      <strong>{d.name}</strong>
      <div>{format(d.value, unit)}</div>
      {d.incidents !== undefined && (
        <>
          <span>
            Kejadian: <b>{number(d.incidents)}</b>
          </span>
          {d.damage !== undefined && (
            <span>
              Kerusakan: <b>{number(d.damage)}</b>
            </span>
          )}
          {d.rate !== undefined && (
            <span>
              Tingkat kerusakan: <b>{percent(d.rate)}</b>
            </span>
          )}
        </>
      )}
      {d.observations !== undefined && (
        <span>
          Observasi: <b>{number(d.observations)}</b>
        </span>
      )}
    </div>
  );
}
export function DataChart({
  data,
  unit = "count",
  kind = "bar",
  horizontal = false,
  color = "#2563eb",
  height = 260,
  labelWidth = 130,
  axisLabel,
  maxValue,
}: {
  data: ChartDatum[];
  unit?: Unit;
  kind?: "bar" | "line" | "area";
  horizontal?: boolean;
  color?: string;
  height?: number;
  labelWidth?: number;
  axisLabel?: string;
  maxValue?: number;
}) {
  const unitText =
    axisLabel ||
    {
      count: "Jumlah kejadian",
      percent: "Tingkat kerusakan (%)",
      score: "Nilai metrik",
      shap: "SHAP · skor mentah (log-odds)",
      feet: "Ketinggian (ft)",
    }[unit];
  const tick = (v: number) =>
    unit === "percent"
      ? `${number(v, 0)}%`
      : unit === "count"
        ? number(v)
        : number(v, unit === "shap" ? 1 : 2);
  const negative = data.some((d) => d.value < 0);
  const grid = (
    <CartesianGrid
      stroke="#e2e8f0"
      strokeDasharray="3 5"
      horizontal={!horizontal}
      vertical={horizontal}
    />
  );
  const axes = (
    <>
      <XAxis
        type={horizontal ? "number" : "category"}
        dataKey={horizontal ? undefined : "name"}
        tick={{ fill: "#64748b", fontSize: 12 }}
        tickLine={false}
        axisLine={false}
        tickFormatter={horizontal ? tick : undefined}
        minTickGap={12}
        domain={
          horizontal && unit === "percent"
            ? [0, 100]
            : horizontal && unit === "score"
              ? [0, maxValue ?? 1]
              : undefined
        }
      />
      <YAxis
        type={horizontal ? "category" : "number"}
        dataKey={horizontal ? "name" : undefined}
        tick={{ fill: "#64748b", fontSize: 12 }}
        tickLine={false}
        axisLine={false}
        width={horizontal ? labelWidth : 49}
        tickFormatter={horizontal ? undefined : tick}
        interval={horizontal ? 0 : undefined}
        domain={!horizontal && unit === "percent" ? [0, "auto"] : undefined}
      />
    </>
  );
  const tooltip = (
    <Tooltip
      content={<DetailTooltip unit={unit} />}
      cursor={kind === "bar" ? { fill: "#f1f5f9" } : { stroke: "#94a3b8" }}
    />
  );
  return (
    <>
      <p className="axis-unit">{unitText}</p>
      <div
        className="chart-canvas"
        style={{ height }}
        role="img"
        aria-label={`${unitText}. Data lengkap tersedia di tabel di bawah grafik.`}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          initialDimension={{ width: 550, height }}
        >
          {kind === "bar" ? (
            <BarChart
              data={data}
              layout={horizontal ? "vertical" : "horizontal"}
              margin={{ top: 8, right: 12, bottom: 6, left: 0 }}
              accessibilityLayer
            >
              {grid}
              {axes}
              {tooltip}
              {negative && <ReferenceLine x={0} stroke="#94a3b8" />}
              <Bar
                dataKey="value"
                radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                maxBarSize={horizontal ? 20 : 32}
                isAnimationActive={false}
              >
                {data.map((d) => (
                  <Cell
                    key={d.name}
                    fill={
                      unit === "shap"
                        ? d.value < 0
                          ? "#0f766e"
                          : "#d97706"
                        : color
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          ) : kind === "line" ? (
            <LineChart
              data={data}
              margin={{ top: 8, right: 15, bottom: 6, left: 0 }}
              accessibilityLayer
            >
              {grid}
              {axes}
              {tooltip}
              <Line
                type="linear"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                dot={{ r: 4, fill: color, stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          ) : (
            <AreaChart
              data={data}
              margin={{ top: 8, right: 15, bottom: 6, left: 0 }}
              accessibilityLayer
            >
              {grid}
              {axes}
              {tooltip}
              <Area
                type="linear"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                fill={color}
                fillOpacity={0.09}
                dot={{ r: 3, fill: color }}
                isAnimationActive={false}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      <details className="data-details">
        <summary>
          Lihat data grafik <span>{data.length} kategori</span>
        </summary>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">Data {unitText}</caption>
            <thead>
              <tr>
                <th scope="col">Kategori</th>
                <th scope="col">{unitText}</th>
                {data[0]?.incidents !== undefined && (
                  <th scope="col">Kejadian</th>
                )}
                {data[0]?.damage !== undefined && (
                  <th scope="col">Kerusakan</th>
                )}
                {data[0]?.rate !== undefined && (
                  <th scope="col">Kerusakan (%)</th>
                )}
                {data[0]?.observations !== undefined && (
                  <th scope="col">Observasi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.name}>
                  <th scope="row">{d.name}</th>
                  <td>{format(d.value, unit)}</td>
                  {d.incidents !== undefined && <td>{number(d.incidents)}</td>}
                  {d.damage !== undefined && <td>{number(d.damage)}</td>}
                  {d.rate !== undefined && <td>{percent(d.rate)}</td>}
                  {d.observations !== undefined && (
                    <td>{number(d.observations)}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}
