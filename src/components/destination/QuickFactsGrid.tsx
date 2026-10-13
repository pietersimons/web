import { Card } from "@/components/ui/card";
import {
  Sun,
  CloudSun,
  Coins,
  FileCheck,
  Languages,
  Clock,
} from "lucide-react";

interface TravelGuideData {
  bestTimeToVisit?: string;
  climate?: string;
  currency?: string;
  visaInfo?: string;
  languages?: string;
  timeZone?: string;
}

interface QuickFactsGridProps {
  guide?: TravelGuideData;
}

export function QuickFactsGrid({ guide }: QuickFactsGridProps) {
  if (!guide) return null;

  const facts = [
    {
      label: "Best Time to Visit",
      value: guide.bestTimeToVisit,
      icon: Sun,
      color: "text-amber-500",
    },
    {
      label: "Climate & Seasons",
      value: guide.climate,
      icon: CloudSun,
      color: "text-emerald-600",
    },
    {
      label: "Currency & Cards",
      value: guide.currency,
      icon: Coins,
      color: "text-accent",
    },
    {
      label: "Visa & Entry",
      value: guide.visaInfo,
      icon: FileCheck,
      color: "text-blue-500",
    },
    {
      label: "Languages Spoken",
      value: guide.languages,
      icon: Languages,
      color: "text-purple-500",
    },
    {
      label: "Time Zone",
      value: guide.timeZone,
      icon: Clock,
      color: "text-secondary",
    },
  ].filter((f) => !!f.value);

  if (facts.length === 0) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-hero text-3xl sm:text-4xl font-bold uppercase tracking-wide text-foreground">
          Destination Travel Guide & Facts
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Essential practical notes before you pack
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {facts.map((fact, idx) => {
          const Icon = fact.icon;
          return (
            <Card
              key={idx}
              className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs flex items-start gap-4"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className={`h-5 w-5 ${fact.color}`} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-bold text-muted-foreground block leading-none">
                  {fact.label}
                </span>
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {fact.value}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
