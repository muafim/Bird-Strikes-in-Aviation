import type { ReactNode } from "react";
export function ChartCard({
  title,
  subtitle,
  source,
  children,
  className = "",
}: {
  title: string;
  subtitle: string;
  source: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`chart-card ${className}`}>
      <div className="chart-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <span className="chart-mark" aria-hidden="true">
          ···
        </span>
      </div>
      {children}
      <div className="chart-source">{source}</div>
    </section>
  );
}
