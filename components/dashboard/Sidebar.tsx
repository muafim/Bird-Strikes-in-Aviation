"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  PlaneTakeoff,
  Bird,
  BrainCircuit,
  ScanLine,
  ShieldCheck,
  BookOpen,
  Menu,
  ArrowUpRight,
  Database,
  Plane,
} from "lucide-react";
import { navigation } from "@/lib/data";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
const icons = [
  LayoutDashboard,
  ChartNoAxesCombined,
  PlaneTakeoff,
  Bird,
  BrainCircuit,
  ScanLine,
  ShieldCheck,
  BookOpen,
];
function Contents({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <>
      <Link href="/" className="brand" onClick={onNavigate}>
        <span className="brand-icon">
          <Plane size={24} />
        </span>
        <span>
          Bird Strike<span className="brand-sub">RISK INTELLIGENCE</span>
        </span>
      </Link>
      <div className="nav-label">RUANG ANALISIS</div>
      <nav aria-label="Navigasi utama">
        {navigation.map((item, i) => {
          const Icon = icons[i];
          const active = path === "/" + item.slug;
          return (
            <Link
              key={item.slug}
              href={"/" + item.slug}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`nav-link ${active ? "active" : ""}`}
            >
              <Icon size={19} />
              <span>{item.title}</span>
              {active && <span className="nav-dot" />}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="dataset-tag">
          <Database size={17} />
          <div>
            Historical case study<span>2000–2011</span>
          </div>
        </div>
        <div className="prototype-tag">
          <span /> RECORDED STRIKES ONLY
        </div>
        <p>Analytical decision-support prototype</p>
        <Link
          href="/about-project"
          onClick={onNavigate}
          className="method-link"
        >
          Metodologi & batasan <ArrowUpRight size={15} />
        </Link>
      </div>
    </>
  );
}
export function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside className="sidebar">
        <Contents />
      </aside>
      <div className="mobile-menu">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Buka navigasi">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only">Navigasi dashboard</SheetTitle>
            <SheetDescription className="sr-only">
              Delapan halaman analisis bird strike
            </SheetDescription>
            <Contents onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
