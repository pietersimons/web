import { LocalizedLink } from "@/components/shared/LocalizedLink";
import { Card, CardContent } from "@/components/ui/card";
import { SanityImage } from "@/components/shared/SanityImage";
import { Clock, ArrowUpRight } from "lucide-react";
import { Locale, defaultLocale } from "@/lib/i18n/config";

export interface ItineraryCardProps {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  travelStyle?: string;
  tripSpecs?: {
    durationDays?: number;
    durationNights?: number;
    difficulty?: string;
    groupSize?: string;
  };
  pricing?: {
    priceFrom?: number;
    currency?: string;
    priceNote?: string;
  };
  featuredImage?: any;
  destination?: {
    title?: string;
    slug?: string;
    region?: string;
  };
  locale?: Locale;
}

const difficultyLabels: Record<string, { nl: string; en: string }> = {
  easy: { nl: "Eenvoudig", en: "Easy" },
  moderate: { nl: "Gemiddeld", en: "Moderate" },
  challenging: { nl: "Uitdagend", en: "Challenging" },
  expert: { nl: "Zwaar", en: "Expert" },
  strenuous: { nl: "Zwaar", en: "Strenuous" },
};

const travelStyleLabels: Record<string, { nl: string; en: string }> = {
  group: { nl: "Groepsreis", en: "Group Expedition" },
  "on-demand": { nl: "Maatwerkreis", en: "Tailor-Made" },
  both: { nl: "Groep & Maatwerk", en: "Group & Bespoke" },
};

export function ItineraryCard({
  title,
  slug,
  subtitle,
  travelStyle,
  tripSpecs,
  pricing,
  featuredImage,
  destination,
  locale = defaultLocale,
}: ItineraryCardProps) {
  const isNl = locale === "nl";

  const difficultyText = tripSpecs?.difficulty
    ? difficultyLabels[tripSpecs.difficulty.toLowerCase()]?.[isNl ? "nl" : "en"] || tripSpecs.difficulty
    : "";

  const tagLabel =
    destination?.title ||
    (travelStyle ? travelStyleLabels[travelStyle]?.[isNl ? "nl" : "en"] : "");

  return (
    <LocalizedLink
      href={`/itineraries/${slug}`}
      className="group block h-full focus:outline-none"
    >
      <Card className="h-full flex flex-col overflow-hidden border border-border/80 bg-card rounded-2xl transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1">
        {/* 1. Cinematic Media Header */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {featuredImage?.asset ? (
            <SanityImage
              image={featuredImage}
              alt={title}
              width={600}
              height={375}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              No image
            </div>
          )}

          {/* Understated Category / Destination Tag */}
          {tagLabel && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-black/60 text-white backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-lg border border-white/10 shadow-xs">
                {tagLabel}
              </span>
            </div>
          )}
        </div>

        {/* 2. Card Content */}
        <CardContent className="flex-1 flex flex-col p-5">
          {/* Refined Meta Line */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
            {tripSpecs?.durationDays && (
              <span className="inline-flex items-center gap-1 font-medium text-foreground/85">
                <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
                {tripSpecs.durationDays} {isNl ? "Dagen" : "Days"}
                {tripSpecs.durationNights ? ` (${tripSpecs.durationNights} ${isNl ? "nachten" : "N"})` : ""}
              </span>
            )}
            {difficultyText && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span>{difficultyText}</span>
              </>
            )}
            {tripSpecs?.groupSize && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="truncate max-w-[140px]">{tripSpecs.groupSize}</span>
              </>
            )}
          </div>

          <h3 className="font-heading text-lg font-bold text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* 3. Refined Footer with Price Anchor and CTA */}
          <div className="mt-auto pt-4 border-t border-border/50 flex items-end justify-between gap-3">
            <div>
              {pricing?.priceFrom ? (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block leading-none mb-1">
                    {isNl ? "Vanaf" : "From"}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading text-lg sm:text-xl font-extrabold text-foreground leading-none">
                      {pricing.currency === "USD" ? "$" : "€"}
                      {pricing.priceFrom.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      {pricing.priceNote || "p.p."}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground font-medium">
                  {isNl ? "Prijs op aanvraag" : "Price on request"}
                </span>
              )}
            </div>

            <span className="text-xs font-bold text-primary group-hover:text-accent transition-colors flex items-center gap-1 shrink-0 pb-0.5">
              <span>{isNl ? "Bekijk reis" : "View trip"}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </LocalizedLink>
  );
}
