import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Mountain,
  Users,
  MapPin,
  Sparkles,
} from "lucide-react";

interface TripSpecsBarProps {
  durationDays?: number;
  durationNights?: number;
  difficulty?: string;
  groupSize?: string;
  startLocation?: string;
  endLocation?: string;
  minimumAge?: number;
}

export function TripSpecsBar({
  durationDays,
  durationNights,
  difficulty,
  groupSize,
  startLocation,
  endLocation,
  minimumAge,
}: TripSpecsBarProps) {
  const difficultyVariant =
    difficulty === "easy"
      ? "difficultyEasy"
      : difficulty === "challenging" || difficulty === "expert"
        ? "difficultyChallenging"
        : "difficultyModerate";

  return (
    <div className="relative -mt-8 z-20 container mx-auto px-4 max-w-7xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-card rounded-2xl p-6 sm:p-7 border border-border/80 shadow-xl">
        {/* 1. Duration */}
        {durationDays && (
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground block">
                Duration
              </span>
              <span className="font-heading font-extrabold text-base sm:text-lg text-foreground">
                {durationDays} Days {durationNights ? `(${durationNights} N)` : ""}
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
              <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground block mb-0.5">
                Physical Level
              </span>
              <Badge variant={difficultyVariant} className="text-xs">
                {difficulty}
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
              <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground block">
                Group Size
              </span>
              <span className="font-heading font-bold text-sm sm:text-base text-foreground">
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
              <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground block">
                Route
              </span>
              <span className="font-heading font-bold text-xs sm:text-sm text-foreground line-clamp-1">
                {startLocation || "Start"} → {endLocation || "Finish"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
