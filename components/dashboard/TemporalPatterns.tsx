import { yearly, monthly, byRate } from "@/lib/data";
import { number, percent } from "@/lib/formatters";
import { ChartCard } from "./ChartCard";
import { DataChart } from "./DataChart";
import { InsightCard } from "./InsightCard";
import { Notice } from "./Notice";
export function TemporalPatterns() {
  const peakYear = yearly.reduce((a, b) => (a.value > b.value ? a : b));
  const peakMonth = monthly.reduce((a, b) => (a.value > b.value ? a : b));
  const peakRate = monthly.reduce((a, b) => (a.rate! > b.rate! ? a : b));
  return (
    <>
      <div className="two-cols">
        <ChartCard
          title="Kejadian tahunan"
          subtitle="Jumlah bird strike tercatat · 2000–2011"
          source="Sumber: output notebook · sel 32"
        >
          <DataChart data={yearly} kind="area" height={290} />
        </ChartCard>
        <ChartCard
          title="Tingkat kerusakan tahunan"
          subtitle="Persentase kejadian yang menyebabkan kerusakan"
          source="Sumber: output notebook · sel 32"
        >
          <DataChart
            data={byRate(yearly)}
            unit="percent"
            kind="line"
            color="#d97706"
            height={290}
          />
        </ChartCard>
      </div>
      <InsightCard
        items={[
          `${peakYear.name} memiliki jumlah kejadian tercatat tertinggi: ${number(peakYear.value)} kejadian.`,
          `Agustus mencatat ${number(peakMonth.value)} kejadian, sementara tingkat kerusakan bulanan tertinggi terjadi pada Maret (${percent(peakRate.rate!, 1)}).`,
          `Jumlah kejadian tidak dapat diterjemahkan menjadi probabilitas bird strike karena jumlah penerbangan sebagai pembagi tidak tersedia.`,
        ]}
      />
      <div className="two-cols">
        <ChartCard
          title="Pola kejadian bulanan"
          subtitle="Agregat bulan dari seluruh tahun, bukan deret waktu satu tahun"
          source="Sumber: output notebook · sel 34"
        >
          <DataChart data={monthly} height={280} />
        </ChartCard>
        <ChartCard
          title="Tingkat kerusakan bulanan"
          subtitle="Kerusakan / kejadian tercatat pada bulan yang sama"
          source="Sumber: output notebook · sel 34"
        >
          <DataChart
            data={byRate(monthly)}
            unit="percent"
            kind="line"
            color="#d97706"
            height={280}
          />
        </ChartCard>
      </div>
      <Notice>
        Perubahan frekuensi dapat mencerminkan banyak faktor, termasuk pelaporan
        dan volume penerbangan. Agregat notebook tidak menyediakan pemisahan
        bulan per tahun; tidak ada filter lintas dimensi yang dihitung dari data
        yang tidak tersedia.
      </Notice>
    </>
  );
}
