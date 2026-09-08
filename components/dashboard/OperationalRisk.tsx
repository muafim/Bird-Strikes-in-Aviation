import {
  phases,
  altitude,
  aircraft,
  pilot,
  sky,
  byRate,
  statistics,
  altitudeSummary,
} from "@/lib/data";
import { number } from "@/lib/formatters";
import { ChartCard } from "./ChartCard";
import { DataChart } from "./DataChart";
import { InsightCard } from "./InsightCard";
import { Notice } from "./Notice";
import { SourceFigure } from "./SourceFigure";
import { FrequencySeverityScatter } from "./FrequencySeverityScatter";
export function OperationalRisk() {
  return (
    <>
      <Notice>
        Frekuensi ≠ tingkat keparahan. Jumlah kejadian menunjukkan frekuensi
        tercatat; damage rate adalah proporsi kerusakan di antara kejadian
        tersebut.
      </Notice>
      <div className="two-cols">
        <ChartCard
          title="Frekuensi menurut fase penerbangan"
          subtitle="Jumlah kejadian tercatat"
          source="Sumber: output notebook · sel 39"
        >
          <DataChart data={phases} horizontal height={285} />
        </ChartCard>
        <ChartCard
          title="Kerusakan menurut fase penerbangan"
          subtitle="Proporsi kerusakan · diurutkan menurut damage rate"
          source="Sumber: output notebook · sel 39, 43"
        >
          <DataChart
            data={byRate(phases).sort((a, b) => b.value - a.value)}
            unit="percent"
            horizontal
            color="#d97706"
            height={285}
          />
        </ChartCard>
      </div>
      <FrequencySeverityScatter />
      <Notice warning>
        Parked memiliki 10 observasi dan 2 kejadian kerusakan. Proporsi 20% pada
        kategori ini memiliki dukungan sampel yang sangat terbatas.
      </Notice>
      <InsightCard
        items={[
          "Approach memiliki jumlah kejadian tertinggi; Descent memiliki damage rate 20,23% dari 776 kejadian.",
          "Median ketinggian pada kejadian kerusakan adalah 300 ft, dibandingkan 40 ft pada kejadian tanpa kerusakan.",
          "Perbedaan menurut peringatan pilot atau ukuran pesawat menunjukkan asosiasi, bukan bukti efek sebab-akibat.",
        ]}
      />
      <div className="two-cols">
        <ChartCard
          title="Distribusi ketinggian"
          subtitle="Rentang ketinggian asli · batas bawah terbuka, batas atas tertutup"
          source="Sumber: output notebook · sel 45, 47, 49, 52"
        >
          <DataChart data={altitude} horizontal height={400} labelWidth={130} />
          <SourceFigure
            name="altitude"
            title="Histogram ketinggian ≤5.000 ft"
            description="Histogram asli notebook dibatasi pada 5.000 ft untuk visualisasi; seluruh kejadian tetap dipertahankan dalam analisis."
          />
        </ChartCard>
        <ChartCard
          title="Kerusakan menurut ketinggian"
          subtitle="Tingkat kerusakan (%) per rentang ketinggian dalam ft"
          source="Sumber: output notebook · sel 52"
        >
          <DataChart
            data={byRate(altitude)}
            unit="percent"
            horizontal
            height={400}
            labelWidth={130}
            color="#d97706"
          />
          <SourceFigure
            name="altitude-outcome"
            title="Distribusi menurut status kerusakan"
            description="Boxplot asli ketinggian per status kerusakan, dibatasi hingga 5.000 ft."
          />
        </ChartCard>
      </div>
      <div className="three-cols">
        {[
          { title: "Pesawat berukuran besar?", rows: aircraft, cell: 80 },
          { title: "Pilot mendapat peringatan?", rows: pilot, cell: 84 },
          { title: "Kondisi langit", rows: sky, cell: 88 },
        ].map((x) => (
          <ChartCard
            key={x.cell}
            title={x.title}
            subtitle="Proporsi kerusakan di setiap kategori"
            source={`Sumber: output notebook · sel ${x.cell}`}
          >
            <DataChart
              data={byRate(x.rows)}
              unit="percent"
              horizontal
              labelWidth={x.cell === 88 ? 145 : 65}
              height={180}
              color="#d97706"
            />
          </ChartCard>
        ))}
      </div>
      <div className="content-section">
        <h2>Kekuatan asosiasi statistik</h2>
        <p>Uji kategorikal dan perbandingan distribusi numerik.</p>
      </div>
      <div className="two-cols">
        <ChartCard
          title="Cramér’s V"
          subtitle="Asosiasi dengan status kerusakan · koreksi bias"
          source="Sumber: output notebook · sel 113, 115"
        >
          <DataChart
            data={statistics}
            unit="score"
            axisLabel="Cramér’s V (0–1)"
            horizontal
            height={255}
            labelWidth={145}
          />
        </ChartCard>
        <ChartCard
          title="Uji Mann–Whitney U"
          subtitle="Perbedaan distribusi ketinggian antarstatus kerusakan"
          source="Sumber: output notebook · sel 49, 121"
        >
          <div className="small-stats">
            {altitudeSummary.map((r) => (
              <div key={r.Damage}>
                <strong>{number(r.MedianAltitude)} ft</strong>
                <span>
                  Median ·{" "}
                  {r.Damage === "Caused damage"
                    ? "Kerusakan"
                    : "Tanpa kerusakan"}
                </span>
                <span>n = {number(r.Events)}</span>
              </div>
            ))}
          </div>
          <div className="body-pad">
            <span className="pill">p-value &lt; 0,001</span>
            <p className="mt-4">
              Distribusi ketinggian berbeda secara statistik. Ketinggian
              berkaitan dengan fase penerbangan dan karakteristik lain; hasil
              ini tidak membuktikan bahwa ketinggian menyebabkan kerusakan.
            </p>
          </div>
        </ChartCard>
      </div>
    </>
  );
}
