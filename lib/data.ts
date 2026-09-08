import overview from "@/data/overview.json";
import yearlySource from "@/data/yearly.json";
import monthlySource from "@/data/monthly.json";
import phaseSource from "@/data/flight-phase.json";
import wildlifeSource from "@/data/wildlife-size.json";
import numberSource from "@/data/number-struck.json";
import altitudeSource from "@/data/altitude-bin.json";
import aircraftSource from "@/data/aircraft-size.json";
import pilotSource from "@/data/pilot-warning.json";
import skySource from "@/data/sky.json";
import speciesSource from "@/data/species.json";
import speciesRiskSource from "@/data/species-risk.json";
import globalSource from "@/data/shap-global.json";
import wildlifeShapSource from "@/data/shap-wildlife.json";
import numberShapSource from "@/data/shap-number.json";
import phaseShapSource from "@/data/shap-flight-phase.json";
import localSource from "@/data/shap-local.json";
import finalSource from "@/data/model-performance.json";
import statsSource from "@/data/statistics.json";
import dataQualitySource from "@/data/data-quality.json";
export { default as comparison } from "@/data/model-comparison.json";
export { default as thresholds } from "@/data/thresholds.json";
export { default as confusion } from "@/data/confusion.json";
export { default as errorRates } from "@/data/error-rates.json";
export { default as calibration } from "@/data/calibration.json";
export { default as backtesting } from "@/data/backtesting.json";
export { default as backtestingSummary } from "@/data/backtesting-summary.json";
export { default as highRiskCase } from "@/data/high-risk-case.json";
export { default as altitudeSummary } from "@/data/altitude-summary.json";
export { default as split } from "@/data/split.json";
export { default as provenance } from "@/data/provenance.json";

export interface ChartDatum {
  name: string;
  value: number;
  incidents?: number;
  damage?: number;
  rate?: number;
  observations?: number;
  raw?: string;
}
type SourceRow = Record<string, string | number>;
export const labels: Record<string, string> = {
  Large: "Besar",
  Medium: "Sedang",
  Small: "Kecil",
  "2 to 10": "2–10",
  "11 to 100": "11–100",
  "Over 100": ">100",
  No: "Tidak",
  Yes: "Ya",
  N: "Tidak",
  Y: "Ya",
  "No Cloud": "Cerah",
  "Some Cloud": "Berawan sebagian",
  Overcast: "Mendung",
  WildlifeSize: "Ukuran satwa",
  WildlifeSpecies: "Spesies satwa",
  MakeModel: "Model pesawat",
  FlightPhase: "Fase penerbangan",
  NumberStruck: "Jumlah satwa",
  Altitude: "Ketinggian",
  Month: "Bulan",
  AltitudeBin: "Rentang ketinggian",
  Engines: "Jumlah mesin",
  "IsAircraftLarge?": "Ukuran pesawat",
  ConditionsSky: "Kondisi langit",
  PilotWarned: "Peringatan pilot",
};
export const label = (name: string) => labels[name] || name;
function descriptive(rows: SourceRow[], key: string): ChartDatum[] {
  return rows.map((r) => ({
    name: label(String(r[key])),
    raw: String(r[key]),
    value: Number(r.Incidents),
    incidents: Number(r.Incidents),
    damage: Number(r.DamageEvents),
    rate: Number(r.DamageRate),
  }));
}
export const yearly = descriptive(yearlySource, "Year");
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
export const monthly = descriptive(monthlySource, "MonthName").map((r, i) => ({
  ...r,
  name: months[i],
}));
export const phases = descriptive(phaseSource, "FlightPhase");
export const wildlife = descriptive(wildlifeSource, "WildlifeSize");
export const struck = descriptive(numberSource, "NumberStruck");
export const altitude = descriptive(altitudeSource, "AltitudeBin").sort(
  (a, b) =>
    Number(a.name.match(/-?\d+/)?.[0]) - Number(b.name.match(/-?\d+/)?.[0]),
);
export const aircraft = descriptive(aircraftSource, "IsAircraftLarge?");
export const pilot = descriptive(pilotSource, "PilotWarned");
export const sky = descriptive(skySource, "ConditionsSky");
export const species: ChartDatum[] = speciesSource.map((r) => ({
  name: r.WildlifeSpecies,
  value: r.Incidents,
  incidents: r.Incidents,
}));
export const speciesRisk = descriptive(speciesRiskSource, "WildlifeSpecies");
export const byRate = (rows: ChartDatum[]) =>
  rows.map((r) => ({ ...r, value: r.rate! }));
export const globalShap: ChartDatum[] = globalSource.map((r) => ({
  name: label(r.Feature),
  raw: r.Feature,
  value: r.MeanAbsSHAP,
}));
export const wildlifeShap: ChartDatum[] = wildlifeShapSource.map((r) => ({
  name: label(r.WildlifeSize),
  value: r.MeanSHAP,
  observations: r.Observations,
}));
export const numberShap: ChartDatum[] = numberShapSource.map((r) => ({
  name: label(String(r.NumberStruck)),
  value: r.MeanSHAP,
  observations: r.Observations,
}));
export const phaseShap: ChartDatum[] = phaseShapSource.map((r) => ({
  name: r.FlightPhase,
  value: r.MeanSHAP,
  observations: r.Observations,
}));
export const localShap: ChartDatum[] = localSource.map((r) => ({
  name: label(r.Feature),
  raw: String(r.Value),
  value: r.SHAP,
}));
export const statistics: ChartDatum[] = statsSource.map((r) => ({
  name: label(r.Feature),
  value: r.CramersV,
}));
export const dataQuality = dataQualitySource
  .filter((r) => r.MissingPercent > 0)
  .map((r) => ({
    feature: label(r.Feature),
    raw: r.Feature,
    missingPercent: r.MissingPercent,
  }));
export const metrics = Object.fromEntries(
  finalSource.map((r) => [r.Metric, r.Score]),
) as Record<string, number>;
export const total = overview.reduce((s, r) => s + r.Count, 0);
export const damageTotal = overview.find(
  (r) => r.Damage === "Caused damage",
)!.Count;
export const damagePercent = overview.find(
  (r) => r.Damage === "Caused damage",
)!.Percentage;
export const noDamageTotal = total - damageTotal;
export const navigation = [
  {
    slug: "",
    title: "Ringkasan",
    eyebrow: "GAMBARAN UMUM",
    description:
      "Pola historis, karakteristik bahaya, dan kinerja screening dalam satu pandangan.",
  },
  {
    slug: "temporal-patterns",
    title: "Pola Temporal",
    eyebrow: "ANALISIS HISTORIS",
    description:
      "Telusuri pola kejadian menurut tahun dan bulan, serta perbedaan tingkat kerusakannya.",
  },
  {
    slug: "operational-risk",
    title: "Risiko Operasional",
    eyebrow: "ANALISIS HISTORIS",
    description:
      "Frekuensi kejadian dan proporsi kerusakan pada berbagai kondisi penerbangan.",
  },
  {
    slug: "wildlife-hazard",
    title: "Bahaya Satwa",
    eyebrow: "ANALISIS HISTORIS",
    description:
      "Identifikasi karakteristik satwa yang berkaitan dengan konsekuensi kerusakan.",
  },
  {
    slug: "predictive-model",
    title: "Model Prediktif",
    eyebrow: "SCREENING KERUSAKAN",
    description:
      "Safety-Oriented Damage Risk Screening · CatBoost dan strategi ambang keputusan.",
  },
  {
    slug: "explainability",
    title: "Interpretasi Model",
    eyebrow: "EXPLAINABILITY",
    description:
      "Memahami kontribusi fitur terhadap keluaran model melalui SHAP.",
  },
  {
    slug: "model-validation",
    title: "Validasi Model",
    eyebrow: "EVALUASI TEMPORAL",
    description:
      "Evaluasi holdout, kualitas probabilitas, dan konsistensi performa lintas waktu.",
  },
  {
    slug: "about-project",
    title: "Tentang Proyek",
    eyebrow: "METODOLOGI & CAKUPAN",
    description:
      "Dari data historis ke insight yang dapat ditelusuri kembali ke notebook.",
  },
] as const;
