import { Clock, Mountain, Users } from "lucide-react";
import { Locale, defaultLocale } from "@/lib/i18n/config";

interface TripSpecsBarProps {
  durationDays?: number;
  durationNights?: number;
  difficulty?: string;
  groupSize?: string;
  minimumAge?: number;
  locale?: Locale;
}

export function TripSpecsBar({
  durationDays,
  durationNights,
  difficulty,
  groupSize,
  locale = defaultLocale,
}: TripSpecsBarProps) {
  const isNl = locale === "nl";

  const difficultyLabels: Record<string, { nl: string; en: string }> = {
    easy: { nl: "Eenvoudig", en: "Easy" },
    moderate: { nl: "Gemiddeld", en: "Moderate" },
    challenging: { nl: "Uitdagend", en: "Challenging" },
    expert: { nl: "Zwaar", en: "Expert" },
    strenuous: { nl: "Zwaar", en: "Strenuous" },
  };

  const difficultyText = difficulty
    ? difficultyLabels[difficulty.toLowerCase()]?.[isNl ? "nl" : "en"] || difficulty
    : "";

  return (
    <div className="relative -mt-7 z-20 container mx-auto px-4 max-w-7xl">
      <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border/80 shadow-md p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 sm:divide-x sm:divide-border/60">
        {/* 1. Duration */}
        {durationDays && (
          <div className="flex items-center gap-3 sm:px-6">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block leading-none mb-1">
                {isNl ? "Duur" : "Duration"}
              </span>
              <span className="font-heading font-semibold text-sm sm:text-base text-foreground leading-tight block">
                {durationDays} {isNl ? "Dagen" : "Days"} {durationNights ? `(${durationNights} ${isNl ? "nachten" : "N"})` : ""}
              </span>
            </div>
          </div>
        )}

        {/* 2. Physical Level */}
        {difficulty && (
          <div className="flex items-center gap-3 sm:px-6">
            <Mountain className="h-4 w-4 text-primary shrink-0" />
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block leading-none mb-1">
                {isNl ? "Niveau" : "Physical Level"}
              </span>
              <span className="font-heading font-semibold text-sm sm:text-base text-foreground leading-tight block">
                {difficultyText}
              </span>
            </div>
          </div>
        )}

        {/* 3. Group Size */}
        {groupSize && (
          <div className="flex items-center gap-3 sm:px-6">
            <Users className="h-4 w-4 text-primary/80 shrink-0" />
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block leading-none mb-1">
                {isNl ? "Groepsgrootte" : "Group Size"}
              </span>
              <span className="font-heading font-semibold text-sm sm:text-base text-foreground leading-tight block">
                {groupSize}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
