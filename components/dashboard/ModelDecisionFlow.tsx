import { ArrowRight, Bird, Gauge, ListChecks, SlidersHorizontal } from "lucide-react";

const steps = [
  { label: "Recorded Bird Strike", icon: Bird },
  { label: "CatBoost Risk Score", icon: Gauge },
  { label: "Safety-Oriented Threshold", icon: SlidersHorizontal },
  { label: "Review Priority", icon: ListChecks },
];

export function ModelDecisionFlow() {
  return (
    <section className="decision-flow-card" aria-labelledby="decision-flow-title">
      <div className="chart-heading">
        <div><h2 id="decision-flow-title">Predictive Model Decision Flow</h2><p>Bagaimana karakteristik kejadian diterjemahkan menjadi prioritas peninjauan.</p></div>
      </div>
      <div className="decision-flow">
        {steps.map(({ label, icon: Icon }, index) => (
          <div className="decision-flow-fragment" key={label}>
            <div className="decision-step"><Icon size={20} /><span>{label}</span></div>
            {index < steps.length - 1 && <ArrowRight className="decision-arrow" size={18} aria-hidden="true" />}
          </div>
        ))}
      </div>
      <p className="decision-flow-note">The model estimates damage risk conditional on a recorded bird strike.</p>
      <div className="chart-source">Sumber: workflow pemodelan notebook · sel 127–188</div>
    </section>
  );
}
