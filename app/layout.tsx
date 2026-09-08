import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Bird Strike Risk Intelligence",
    template: "%s | Bird Strike Risk Intelligence",
  },
  description:
    "Portfolio analitik bird strike historis 2000–2011: pola kejadian, bahaya satwa, screening kerusakan CatBoost, SHAP, dan validasi temporal.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={GeistSans.variable}>
      <body>
        <a href="#main" className="skip-link">
          Lewati navigasi
        </a>
        <Sidebar />
        <div className="app-shell">
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <footer className="footer">
            <span>
              Bird Strike Risk Intelligence <span>·</span> Portfolio Data
              Science
            </span>
            <span>
              Prototipe analitis · Bukan sistem keselamatan operasional
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
