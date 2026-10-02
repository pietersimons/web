import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface InclusionsExclusionsBoxProps {
  included?: string[];
  excluded?: string[];
}

export function InclusionsExclusionsBox({
  included = [],
  excluded = [],
}: InclusionsExclusionsBoxProps) {
  if (included.length === 0 && excluded.length === 0) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
          What&apos;s Included & Excluded
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Complete transparency for your expedition planning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Included List */}
        <Card className="p-6 sm:p-7 rounded-2xl border-emerald-900/15 bg-emerald-50/30 dark:bg-emerald-950/10 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-emerald-900/10">
            <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Check className="h-4 w-4 stroke-[3]" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-emerald-900 dark:text-emerald-300">
              Included with Trip
            </h3>
          </div>

          <ul className="space-y-3">
            {included.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-foreground/90">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Excluded List */}
        <Card className="p-6 sm:p-7 rounded-2xl border-border/80 bg-card shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border/60">
            <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
              <X className="h-4 w-4 stroke-[2.5]" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-foreground">
              Not Included
            </h3>
          </div>

          <ul className="space-y-3">
            {excluded.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                <X className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
