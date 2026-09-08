import {
  wildlife,
  struck,
  species,
  speciesRisk,
  byRate,
  provenance,
} from "@/lib/data";
import { number, percent } from "@/lib/formatters";
import { ChartCard } from "./ChartCard";
import { DataChart } from "./DataChart";
import { InsightCard } from "./InsightCard";
import { Notice } from "./Notice";
import { WildlifeRiskLadder } from "./WildlifeRiskLadder";
export function WildlifeHazard() {
  return (
    <>
      <div className="overview-main">
        <ChartCard
          title="Ukuran satwa & tingkat kerusakan"
          subtitle="Perbedaan proporsi kerusakan menurut ukuran satwa"
          source="Sumber: output notebook · sel 58"
        >
          <DataChart
            data={byRate(wildlife)}
            unit="percent"
            horizontal
            height={240}
            labelWidth={80}
            color="#d97706"
          />
        </ChartCard>
        <section className="chart-card">
          <div className="chart-heading">
            <div>
              <h2>Profil ukuran satwa</h2>
              <p>Frekuensi dan dampak dibaca bersama</p>
            </div>
          </div>
          <div className="body-pad">
            {wildlife.map((r) => (
              <div className="outcome-row !mx-0 !my-5" key={r.name}>
                <div>
                  <strong className="block text-slate-200">{r.name}</strong>
                  <span className="text-xs">
                    {number(r.incidents!)} kejadian · {number(r.damage!)}{" "}
                    kerusakan
                  </span>
                </div>
                <b>{percent(r.rate!, 1)}</b>
              </div>
            ))}
          </div>
          <div className="chart-source">Sumber: output notebook · sel 58</div>
        </section>
      </div>
      <WildlifeRiskLadder />
      <InsightCard
        tone="amber"
        items={[
          `Satwa besar memiliki tingkat kerusakan ${percent(wildlife[0].rate!)}, sedangkan satwa kecil ${percent(wildlife[2].rate!)}.`,
          "White-tailed deer memiliki damage rate tertinggi pada ranking dengan minimal 30 observasi; kategori ini memang terdapat dalam dataset wildlife.",
          "Kelompok Unknown bird mendominasi frekuensi tercatat. Identifikasi spesies yang tidak lengkap membatasi detail analisis bahaya.",
        ]}
      />
      <ChartCard
        title="Jumlah satwa yang tertabrak"
        subtitle="Proporsi kerusakan per kategori jumlah satwa"
        source="Sumber: output notebook · sel 62"
      >
        <DataChart
          data={byRate(struck)}
          unit="percent"
          horizontal
          height={220}
          labelWidth={80}
          color="#2563eb"
        />
      </ChartCard>
      <Notice warning>
        Kategori Over 100 memiliki hanya 8 observasi, dengan 4 kerusakan (50%).
        Nilai ini tidak dapat dianggap sebagai pola yang stabil.
      </Notice>
      <div className="two-cols">
        <ChartCard
          title="Spesies paling sering tercatat"
          subtitle="15 kategori dengan jumlah kejadian tertinggi"
          source="Sumber: output notebook · sel 68"
        >
          <DataChart data={species} horizontal height={510} labelWidth={172} />
        </ChartCard>
        <ChartCard
          title="Spesies dengan tingkat kerusakan tertinggi"
          subtitle={`15 kategori · minimal ${provenance.speciesMinimumObservations} observasi per spesies`}
          source="Sumber: output notebook · sel 72"
        >
          <DataChart
            data={byRate(speciesRisk)}
            unit="percent"
            horizontal
            height={510}
            labelWidth={166}
            color="#d97706"
          />
        </ChartCard>
      </div>
      <Notice>
        Ukuran sampel dan jumlah kerusakan tersedia pada tooltip dan tabel
        grafik damage rate. Ambang minimum 30 observasi mengurangi dominasi
        kategori yang sangat kecil, tetapi tidak menghilangkan ketidakpastian.
        Total kerusakan per spesies pada ranking frekuensi tidak tersimpan dalam
        tabel tersebut dan tidak direka ulang.
      </Notice>
    </>
  );
}
