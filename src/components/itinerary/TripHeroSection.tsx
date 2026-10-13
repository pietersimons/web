import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SanityImage } from "@/components/shared/SanityImage";
import { ChevronRight, MapPin } from "lucide-react";
import { Locale, defaultLocale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/navigation";
import { dictionaries } from "@/lib/i18n/dictionaries";

interface TripHeroSectionProps {
  title: string;
  subtitle?: string;
  destination?: {
    title?: string;
    slug?: string;
    region?: string;
  };
  featuredImage?: any;
  travelStyle?: string;
  pricing?: {
    priceFrom?: number;
    currency?: string;
    priceNote?: string;
  };
  locale?: Locale;
}

export function TripHeroSection({
  title,
  subtitle,
  destination,
  featuredImage,
  travelStyle,
  pricing,
  locale = defaultLocale,
}: TripHeroSectionProps) {
  const isNl = locale === "nl";
  const homeLabel = dictionaries[locale]?.nav?.home || (isNl ? "Home" : "Home");
  const destinationsLabel = dictionaries[locale]?.nav?.destinations || (isNl ? "Bestemmingen" : "Destinations");

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground pt-32 sm:pt-36 lg:pt-40 pb-16 lg:pb-24">
      {/* Background Media with Dark Overlay */}
      {featuredImage?.asset && (
        <div className="absolute inset-0 z-0 opacity-40">
          <SanityImage
            image={featuredImage}
            alt={title}
            width={1920}
            height={900}
            priority
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/80" />
        </div>
      )}

      {/* Top subtle scrim for header contrast and breadcrumb legibility */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-0 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-primary-foreground/75 mb-6 sm:mb-8 font-medium"
        >
          <Link
            href={localizePath("/", locale)}
            className="hover:text-accent transition-colors shrink-0"
          >
            {homeLabel}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-primary-foreground/50 shrink-0" aria-hidden="true" />
          <Link
            href={localizePath("/destinations", locale)}
            className="hover:text-accent transition-colors shrink-0"
          >
            {destinationsLabel}
          </Link>
          {destination?.title && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-primary-foreground/50 shrink-0" aria-hidden="true" />
              <Link
                href={localizePath(`/destinations/${destination.slug}`, locale)}
                className="hover:text-accent transition-colors shrink-0"
              >
                {destination.title}
              </Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5 text-primary-foreground/50 shrink-0" aria-hidden="true" />
          <span className="text-white font-medium truncate max-w-[200px] sm:max-w-md lg:max-w-none" aria-current="page">
            {title}
          </span>
        </nav>

        {/* Header Content */}
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {destination?.title && (
              <Badge variant="accent" className="font-semibold shadow-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {destination.title}
              </Badge>
            )}
            {travelStyle === "group" && (
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-semibold">
                {isNl ? "Groepsreis" : "Group Expedition"}
              </Badge>
            )}
            {travelStyle === "on-demand" && (
              <Badge variant="sand" className="bg-white/90 text-primary font-semibold">
                {isNl ? "Maatwerkreis" : "Tailor-Made"}
              </Badge>
            )}
            {travelStyle === "both" && (
              <Badge variant="secondary" className="font-semibold">
                {isNl ? "Groepsreis & Maatwerk" : "Group & Tailor-Made Available"}
              </Badge>
            )}
          </div>

          <h1 className="font-hero text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-wide leading-[1.0] text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-4 text-base sm:text-xl text-primary-foreground/85 leading-relaxed font-light max-w-3xl">
              {subtitle}
            </p>
          )}

          {/* Pricing Highlight */}
          {pricing?.priceFrom && (
            <div className="mt-6 inline-flex items-baseline gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15">
              <span className="text-xs uppercase tracking-wider text-white/70">
                {isNl ? "Vanaf" : "From"}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-accent">
                {pricing.currency === "USD" ? "$" : "€"}
                {pricing.priceFrom.toLocaleString()}
              </span>
              {pricing.priceNote && (
                <span className="text-xs text-white/70">{pricing.priceNote}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
