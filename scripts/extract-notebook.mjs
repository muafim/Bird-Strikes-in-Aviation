import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const path = "air-aviation-bird-strike-improved.ipynb";
const raw = fs.readFileSync(path);
const notebook = JSON.parse(raw);
const str = (v) => (Array.isArray(v) ? v.join("") : v || "");
const decode = (v) =>
  v
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
const output = (i) =>
  notebook.cells[i].outputs
    .map((o) => str(o.text) + str(o.data?.["text/plain"]))
    .join("\n");
function table(i) {
  const html = notebook.cells[i].outputs
    .map((o) => str(o.data?.["text/html"]))
    .join("");
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((m) =>
    [...m[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((x) =>
      decode(x[1]),
    ),
  );
  assert(rows.length > 1, `No table in cell ${i}`);
  const keys = rows.shift().slice(1);
  return rows.map((row) =>
    Object.fromEntries(
      keys.map((key, j) => [
        key,
        /^-?\d+(\.\d+)?(e[+-]?\d+)?$/i.test(row[j + 1])
          ? Number(row[j + 1])
          : row[j + 1],
      ]),
    ),
  );
}
fs.mkdirSync("data", { recursive: true });
fs.mkdirSync("public/notebook", { recursive: true });
const provenance = {};
function save(name, cells, data) {
  fs.writeFileSync(`data/${name}.json`, JSON.stringify(data, null, 2) + "\n");
  provenance[name] = {
    cells,
    basis: "Saved code output; zero-based cell indices",
  };
}
const groups = {
  "data-quality": 13,
  yearly: 32,
  monthly: 34,
  "flight-phase": 39,
  "altitude-bin": 52,
  "wildlife-size": 58,
  "number-struck": 62,
  species: 68,
  "species-risk": 72,
  "aircraft-size": 80,
  "pilot-warning": 84,
  sky: 88,
  statistics: 115,
  "altitude-summary": 49,
  split: 132,
  "model-comparison": 159,
  thresholds: 177,
  "model-performance": 185,
  confusion: 188,
  "shap-global": 220,
  "shap-wildlife": 226,
  "shap-number": 229,
  "shap-flight-phase": 233,
  "shap-local": 241,
  backtesting: 245,
  "backtesting-summary": 246,
};
for (const [name, cell] of Object.entries(groups))
  save(name, [cell], table(cell));
save("overview", [27], table(27));
save(
  "calibration",
  [208, 212],
  [
    ...table(208),
    {
      Probability: "Baseline",
      "Brier Score": Number(
        output(212).match(/Baseline Brier\s+: ([\d.]+)/)[1],
      ),
    },
  ],
);
const caseText = output(239);
save("high-risk-case", [239], {
  rawProbability: Number(caseText.match(/Probabilitas raw\s+: ([\d.]+)/)[1]),
  calibratedProbability: Number(
    caseText.match(/Probabilitas calibrated\s+: ([\d.]+)/)[1],
  ),
  actualClass: Number(caseText.match(/Actual class\s+: (\d)/)[1]),
  features: table(241).map((r) => ({ feature: r.Feature, value: r.Value })),
});
const errors = output(195);
save("error-rates", [195], {
  specificity: Number(errors.match(/Specificity\s+: ([\d.]+)/)[1]),
  falsePositiveRate: Number(errors.match(/False Positive Rate:\s*([\d.]+)/)[1]),
  falseNegativeRate: Number(errors.match(/False Negative Rate:\s*([\d.]+)/)[1]),
});
const figures = {};
for (const [name, cell] of Object.entries({
  altitude: 47,
  "altitude-outcome": 50,
  roc: 163,
  precisionRecall: 165,
  calibration: 211,
})) {
  const data = notebook.cells[cell].outputs.find((o) => o.data?.["image/png"])
    ?.data["image/png"];
  assert(data, `No figure in ${cell}`);
  fs.writeFileSync(
    `public/notebook/${name}.png`,
    Buffer.from(str(data), "base64"),
  );
  figures[name] = {
    cell,
    path: `/notebook/${name}.png`,
    coordinatesAvailable: false,
  };
}
save("provenance", [], {
  notebook: path,
  sha256: crypto.createHash("sha256").update(raw).digest("hex"),
  cellsAudited: notebook.cells.length,
  datasets: provenance,
  figures,
  rowLevelAvailable: false,
  speciesMinimumObservations: 30,
  staleMarkdownCells: [166, 190, 191, 192, 193, 196, 199, 209],
});
for (const name of [
  "yearly",
  "monthly",
  "flight-phase",
  "altitude-bin",
  "wildlife-size",
  "number-struck",
  "aircraft-size",
  "pilot-warning",
  "sky",
]) {
  const rows = JSON.parse(fs.readFileSync(`data/${name}.json`));
  assert.equal(
    rows.reduce((s, r) => s + r.Incidents, 0),
    25429,
    name,
  );
  assert.equal(
    rows.reduce((s, r) => s + r.DamageEvents, 0),
    2454,
    name,
  );
  for (const r of rows)
    assert(
      Math.abs(r.DamageRate - (r.DamageEvents / r.Incidents) * 100) < 0.000001,
      `${name} rate`,
    );
}
assert.deepEqual(
  table(188).map((r) => r.Jumlah),
  [4178, 1428, 75, 392],
);
assert.equal(table(185).find((r) => r.Metric === "Recall").Score, 0.8394);
assert.equal(table(245).length, 4);
console.log(
  `Extracted and reconciled ${Object.keys(groups).length + 6} datasets from ${notebook.cells.length} cells; 5 original figures.`,
);
