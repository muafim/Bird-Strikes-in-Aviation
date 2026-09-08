import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { navigation } from "@/lib/data";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { TemporalPatterns } from "@/components/dashboard/TemporalPatterns";
import { OperationalRisk } from "@/components/dashboard/OperationalRisk";
import { WildlifeHazard } from "@/components/dashboard/WildlifeHazard";
import { PredictiveModel } from "@/components/dashboard/PredictiveModel";
import { Explainability } from "@/components/dashboard/Explainability";
import { ModelValidation } from "@/components/dashboard/ModelValidation";
import { AboutProject } from "@/components/dashboard/AboutProject";
const pages: Record<string, React.ComponentType> = {
  "temporal-patterns": TemporalPatterns,
  "operational-risk": OperationalRisk,
  "wildlife-hazard": WildlifeHazard,
  "predictive-model": PredictiveModel,
  explainability: Explainability,
  "model-validation": ModelValidation,
  "about-project": AboutProject,
};
export function generateStaticParams() {
  return navigation.filter((n) => n.slug).map((n) => ({ section: n.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const item = navigation.find((n) => n.slug === section);
  return { title: item?.title, description: item?.description };
}
export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const item = navigation.find((n) => n.slug === section);
  const Content = pages[section];
  if (!item || !Content) notFound();
  return (
    <>
      <SectionHeader
        title={item.title}
        description={item.description}
        eyebrow={item.eyebrow}
      />
      <Content />
    </>
  );
}
