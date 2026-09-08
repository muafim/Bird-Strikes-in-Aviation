"use client";

import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { navigation } from "@/lib/data";

export function Header() {
  const path = usePathname();
  const slug = path.replace(/^\//, "");
  const current = navigation.find((item) => item.slug === slug) ?? navigation[0];

  return (
    <header className="topbar">
      <div className="header-context">
        <strong>{current.title}</strong>
        <span>{current.description}</span>
      </div>
      <div className="historical-badge">
        <ShieldCheck size={15} /> Historical Aviation Safety Analytics
      </div>
    </header>
  );
}
