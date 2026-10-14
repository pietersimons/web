import { Check, Minus } from "lucide-react";
import { Locale, defaultLocale } from "@/lib/i18n/config";

interface InclusionsExclusionsBoxProps {
  included?: string[];
  excluded?: string[];
  locale?: Locale;
}

export function InclusionsExclusionsBox({
  included = [],
  excluded = [],
  locale = defaultLocale,
}: InclusionsExclusionsBoxProps) {
  if (included.length === 0 && excluded.length === 0) return null;
  const isNl = locale === "nl";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-hero text-3xl sm:text-4xl font-bold uppercase tracking-wide text-foreground">
          {isNl ? "Inbegrepen & Niet Inbegrepen" : "Included & Excluded"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isNl
            ? "Volledige transparantie over wat bij de expeditie is inbegrepen"
            : "Transparent overview of expedition inclusions and practical details"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Included List */}
        {included.length > 0 && (
          <div className="bg-card rounded-2xl p-6 sm:p-7 border border-border/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <span className="font-heading font-bold text-base text-foreground">
                {isNl ? "Inbegrepen bij deze Reis" : "Included with Expedition"}
              </span>
            </div>

            <ul className="space-y-3">
              {included.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Excluded List */}
        {excluded.length > 0 && (
          <div className="bg-card rounded-2xl p-6 sm:p-7 border border-border/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <span className="font-heading font-bold text-base text-muted-foreground">
                {isNl ? "Niet Inbegrepen" : "Not Included"}
              </span>
            </div>

            <ul className="space-y-3">
              {excluded.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                  <Minus className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
