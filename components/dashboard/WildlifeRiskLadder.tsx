import { struck, wildlife } from "@/lib/data";
import { number, percent } from "@/lib/formatters";

const sizeOrder = ["Kecil", "Sedang", "Besar"];
const struckOrder = ["1", "2–10", "11–100", ">100"];

export function WildlifeRiskLadder() {
  const sizes = sizeOrder.map((name) => wildlife.find((row) => row.name === name)!);
  const counts = struckOrder.map((name) => struck.find((row) => row.name === name)!);

  return (
    <section className="risk-ladder-card" aria-labelledby="risk-ladder-title">
      <div className="chart-heading">
        <div><h2 id="risk-ladder-title">Wildlife Risk Ladder</h2><p>Observed damage rate meningkat bersama ukuran dan jumlah satwa yang terlibat.</p></div>
      </div>
      <div className="risk-ladder-grid">
        <div>
          <h3>Wildlife Size</h3>
          <div className="risk-ladder">
            {sizes.map((row, index) => (
              <div className={`risk-step size-${index}`} key={row.name}>
                <span>{row.name}</span>
                <div className="risk-track"><i style={{ width: `${(row.rate! / 50) * 100}%` }} /></div>
                <strong>{percent(row.rate!)}</strong>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3>Number Struck</h3>
          <div className="risk-ladder">
            {counts.map((row, index) => (
              <div className={`risk-step struck-${index}`} key={row.name}>
                <span>{row.name}</span>
                <div className="risk-track"><i style={{ width: `${(row.rate! / 50) * 100}%` }} /></div>
                <strong>{percent(row.rate!)}</strong>
                {row.name === ">100" && <em>n = {number(row.incidents!)} only</em>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="chart-source">Sumber: output notebook · sel 58, 62</div>
    </section>
  );
}
