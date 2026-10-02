import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SanityImage } from "@/components/shared/SanityImage";
import { ChevronRight, MapPin } from "lucide-react";

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
}

export function TripHeroSection({
  title,
  subtitle,
  destination,
  featuredImage,
  travelStyle,
  pricing,
}: TripHeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground pt-12 pb-20 lg:pt-16 lg:pb-28">
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

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-primary-foreground/70 mb-6 font-medium">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/destinations" className="hover:text-accent transition-colors">
            Destinations
          </Link>
          {destination?.title && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link
                href={`/destinations/${destination.slug}`}
                className="hover:text-accent transition-colors"
              >
                {destination.title}
              </Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white truncate max-w-[200px] sm:max-w-none">{title}</span>
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
                Group Expedition
              </Badge>
            )}
            {travelStyle === "on-demand" && (
              <Badge variant="sand" className="bg-white/90 text-primary font-semibold">
                Tailor-Made
              </Badge>
            )}
            {travelStyle === "both" && (
              <Badge variant="secondary" className="font-semibold">
                Group & Tailor-Made Available
              </Badge>
            )}
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
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
              <span className="text-xs uppercase tracking-wider text-white/70">From</span>
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
