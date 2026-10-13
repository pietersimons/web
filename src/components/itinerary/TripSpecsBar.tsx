import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Mountain,
  Users,
  MapPin,
} from "lucide-react";
import { Locale, defaultLocale } from "@/lib/i18n/config";

interface TripSpecsBarProps {
  durationDays?: number;
  durationNights?: number;
  difficulty?: string;
  groupSize?: string;
  startLocation?: string;
  endLocation?: string;
  minimumAge?: number;
  locale?: Locale;
}

export function TripSpecsBar({
  durationDays,
  durationNights,
  difficulty,
  groupSize,
  startLocation,
  endLocation,
  locale = defaultLocale,
}: TripSpecsBarProps) {
  const isNl = locale === "nl";

  const difficultyVariant =
    difficulty === "easy"
      ? "difficultyEasy"
      : difficulty === "challenging" || difficulty === "expert"
        ? "difficultyChallenging"
        : "difficultyModerate";

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
    <div className="relative -mt-8 z-20 container mx-auto px-4 max-w-7xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-card rounded-2xl p-5 sm:p-7 border border-border/80 shadow-xl">
        {/* 1. Duration */}
        {durationDays && (
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <div>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-0.5">
                {isNl ? "Duur" : "Duration"}
              </span>
              <span className="font-semibold text-base sm:text-lg text-foreground leading-tight block">
                {durationDays} {isNl ? "Dagen" : "Days"} {durationNights ? `(${durationNights} ${isNl ? "nachten" : "N"})` : ""}
              </span>
            </div>
          </div>
        )}

        {/* 2. Physical Level */}
        {difficulty && (
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Mountain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-0.5">
                {isNl ? "Niveau" : "Physical Level"}
              </span>
              <Badge variant={difficultyVariant} className="text-xs sm:text-sm font-semibold px-2.5 py-0.5">
                {difficultyText}
              </Badge>
            </div>
          </div>
        )}

        {/* 3. Group Size */}
        {groupSize && (
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-0.5">
                {isNl ? "Groepsgrootte" : "Group Size"}
              </span>
              <span className="font-semibold text-sm sm:text-base text-foreground leading-tight block">
                {groupSize}
              </span>
            </div>
          </div>
        )}

        {/* 4. Route Start/End */}
        {(startLocation || endLocation) && (
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-0.5">
                Route
              </span>
              <span className="font-semibold text-xs sm:text-sm text-foreground leading-tight block">
                {startLocation || "Start"} → {endLocation || "Finish"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
