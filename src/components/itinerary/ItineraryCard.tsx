import { LocalizedLink } from "@/components/shared/LocalizedLink";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SanityImage } from "@/components/shared/SanityImage";
import { Clock, Users, Mountain, ArrowUpRight } from "lucide-react";

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
    startLocation?: string;
    endLocation?: string;
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
}

export function ItineraryCard({
  title,
  slug,
  subtitle,
  travelStyle,
  tripSpecs,
  pricing,
  featuredImage,
  destination,
}: ItineraryCardProps) {
  const difficultyVariant =
    tripSpecs?.difficulty === "easy"
      ? "difficultyEasy"
      : tripSpecs?.difficulty === "challenging" || tripSpecs?.difficulty === "expert"
        ? "difficultyChallenging"
        : "difficultyModerate";

  return (
    <LocalizedLink
      href={`/itineraries/${slug}`}
      className="group block h-full focus:outline-none"
    >
      <Card className="h-full flex flex-col overflow-hidden border border-border/80 bg-card rounded-2xl transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1">
        {/* Card Media Header */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {featuredImage?.asset ? (
            <SanityImage
              image={featuredImage}
              alt={title}
              width={600}
              height={375}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              No image
            </div>
          )}

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {destination?.title && (
              <Badge variant="default" className="bg-primary/90 text-primary-foreground backdrop-blur-xs font-semibold">
                {destination.title}
              </Badge>
            )}
            {travelStyle === "group" && (
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-semibold">
                Group
              </Badge>
            )}
            {travelStyle === "on-demand" && (
              <Badge variant="sand" className="bg-white/90 text-primary font-semibold">
                Tailor-Made
              </Badge>
            )}
          </div>

          {/* Floating Price Tag */}
          {pricing?.priceFrom && (
            <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-border/60">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block leading-none">
                From
              </span>
              <span className="text-base font-extrabold text-foreground leading-tight">
                {pricing.currency === "USD" ? "$" : "€"}
                {pricing.priceFrom.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <CardContent className="flex-1 flex flex-col p-5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            {tripSpecs?.durationDays && (
              <span className="inline-flex items-center gap-1 font-medium">
                <Clock className="h-3.5 w-3.5 text-accent" />
                {tripSpecs.durationDays} Days
              </span>
            )}
            {tripSpecs?.difficulty && (
              <Badge variant={difficultyVariant} className="text-[10px] py-0 px-2 h-5">
                <Mountain className="h-3 w-3 mr-1" />
                {tripSpecs.difficulty}
              </Badge>
            )}
            {tripSpecs?.groupSize && (
              <span className="inline-flex items-center gap-1 font-medium ml-auto hidden sm:inline-flex">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                {tripSpecs.groupSize}
              </span>
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

          {/* Card Footer */}
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/40 text-xs font-semibold text-primary group-hover:text-accent transition-colors">
            <span>Explore Expedition</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </CardContent>
      </Card>
    </LocalizedLink>
  );
}
