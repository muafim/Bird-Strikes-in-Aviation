import { Lightbulb, ArrowUpRight } from "lucide-react";
export function InsightCard({
  items,
  tone = "blue",
}: {
  items: string[];
  tone?: "blue" | "amber" | "red";
}) {
  return (
    <aside className={`insight-card ${tone}`}>
      <div className="insight-heading">
        <Lightbulb size={18} />
        <span>INSIGHT EKSEKUTIF</span>
        <ArrowUpRight size={17} />
      </div>
      <div className="insight-items">
        {items.map((item, i) => (
          <div key={item} className="insight-item">
            <span className="insight-index">0{i + 1}</span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
