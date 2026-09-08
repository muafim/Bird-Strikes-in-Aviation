import fs from "node:fs";
import assert from "node:assert/strict";
import crypto from "node:crypto";

const read = (name) => JSON.parse(fs.readFileSync(`data/${name}.json`));
const manifest = read("provenance");
const source = fs.readFileSync(manifest.notebook);
assert.equal(
  crypto.createHash("sha256").update(source).digest("hex"),
  manifest.sha256,
  "Notebook changed; review audit and regenerate data.",
);
const notebook = JSON.parse(source);
const text = (v) => (Array.isArray(v) ? v.join("") : v || "");
const clean = (v) =>
  v
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
let tables = 0;
for (const [name, meta] of Object.entries(manifest.datasets)) {
  if (
    meta.cells.length !== 1 ||
    ["high-risk-case", "error-rates"].includes(name)
  )
    continue;
  const html = notebook.cells[meta.cells[0]].outputs
    .map((o) => text(o.data?.["text/html"]))
    .join("");
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((m) =>
    [...m[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((x) =>
      clean(x[1]),
    ),
  );
  const keys = rows.shift().slice(1);
  const expected = rows.map((row) =>
    Object.fromEntries(
      keys.map((key, i) => [
        key,
        /^-?\d+(\.\d+)?(e[+-]?\d+)?$/i.test(row[i + 1])
          ? Number(row[i + 1])
          : row[i + 1],
      ]),
    ),
  );
  assert.deepEqual(read(name), expected, `Source mismatch: ${name}`);
  tables++;
}
const totals = read("overview");
const n = totals.reduce((s, r) => s + r.Count, 0);
const positive = totals.find((r) => r.Damage === "Caused damage").Count;
for (const name of [
  "yearly",
  "monthly",
  "flight-phase",
  "wildlife-size",
  "number-struck",
  "altitude-bin",
  "aircraft-size",
  "pilot-warning",
  "sky",
]) {
  const rows = read(name);
  assert.equal(
    rows.reduce((s, r) => s + r.Incidents, 0),
    n,
    `${name}: total`,
  );
  assert.equal(
    rows.reduce((s, r) => s + r.DamageEvents, 0),
    positive,
    `${name}: damage`,
  );
  rows.forEach((r) =>
    assert(
      Math.abs(r.DamageRate - (r.DamageEvents / r.Incidents) * 100) < 1e-6,
      `${name}: rate`,
    ),
  );
}
const [tn, fp, fn, tp] = read("confusion").map((r) => r.Jumlah);
const metrics = Object.fromEntries(
  read("model-performance").map((r) => [r.Metric, r.Score]),
);
const approximately = (a, b) =>
  assert(Math.abs(a - b) <= 0.000051, `${a} differs from ${b}`);
assert.equal(tn + fp + fn + tp, read("split")[2].Observations);
assert.equal(fn + tp, read("split")[2].DamageEvents);
approximately(metrics.Precision, tp / (tp + fp));
approximately(metrics.Recall, tp / (tp + fn));
approximately(metrics["F1-score"], (2 * tp) / (2 * tp + fp + fn));
approximately(metrics["F2-score"], (5 * tp) / (5 * tp + 4 * fn + fp));
const rates = read("error-rates");
approximately(rates.specificity, tn / (tn + fp));
approximately(rates.falsePositiveRate, fp / (tn + fp));
approximately(rates.falseNegativeRate, fn / (fn + tp));
const safety = read("thresholds")[2];
assert(safety.Recall >= 0.75);
approximately(safety.Threshold, 0.001 + ((0.5 - 0.001) * 135) / 999);
assert.equal(manifest.speciesMinimumObservations, 30);
assert(read("species-risk").every((r) => r.Incidents >= 30));
for (const key of ["shap-wildlife", "shap-number", "shap-flight-phase"])
  assert.equal(
    read(key).reduce((s, r) => s + r.Observations, 0),
    tn + fp + fn + tp,
  );
const local = read("shap-local");
const example = read("high-risk-case");
assert.deepEqual(
  example.features,
  local.map((r) => ({ feature: r.Feature, value: r.Value })),
);
const caseOutput = notebook.cells[239].outputs
  .map((o) => text(o.text) + text(o.data?.["text/plain"]))
  .join("\n");
assert(caseOutput.includes(`: ${example.rawProbability.toFixed(3)}`));
assert(caseOutput.includes(`: ${example.calibratedProbability.toFixed(3)}`));
assert.equal(example.actualClass, 1);
for (const r of read("calibration")) {
  const out = notebook.cells[212].outputs.map((o) => text(o.text)).join("");
  assert(out.includes(r["Brier Score"].toFixed(4)));
}
for (const [name, figure] of Object.entries(manifest.figures)) {
  const original = notebook.cells[figure.cell].outputs.find(
    (o) => o.data?.["image/png"],
  ).data["image/png"];
  assert.deepEqual(
    fs.readFileSync(`public${figure.path}`),
    Buffer.from(text(original), "base64"),
    `${name}: original image`,
  );
}
const backtest = read("backtesting");
assert.deepEqual(
  backtest.map((r) => r.TestYear),
  [2008, 2009, 2010, 2011],
);
assert.equal(
  backtest.reduce((a, b) => (a.Recall < b.Recall ? a : b)).TestYear,
  2009,
);
for (const r of read("backtesting-summary")) {
  const values = backtest.map((b) => b[r.Metric]);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sd = Math.sqrt(
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / (values.length - 1),
  );
  // Inputs and summary were rounded separately in notebook output.
  assert(Math.abs(r.Mean - mean) < 0.00011);
  assert(Math.abs(r.Std - sd) < 0.00011);
}
console.log(
  `PASS: ${tables} source tables; nine descriptive totals; confusion-derived metrics; SHAP sample sizes; thresholds; backtests; five original figures.`,
);
