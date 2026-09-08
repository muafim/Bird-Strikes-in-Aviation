import type { ReactNode } from "react";
import { Info, TriangleAlert } from "lucide-react";
export function Notice({
  children,
  warning = false,
}: {
  children: ReactNode;
  warning?: boolean;
}) {
  const Icon = warning ? TriangleAlert : Info;
  return (
    <div className={`notice ${warning ? "warning" : ""}`}>
      <Icon size={18} />
      <p>{children}</p>
    </div>
  );
}
