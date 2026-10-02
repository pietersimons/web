import { LocalizedLink } from "@/components/shared/LocalizedLink";
import { Badge } from "@/components/ui/badge";
import { SanityImage } from "@/components/shared/SanityImage";
import { MapPin, Compass } from "lucide-react";

export interface DestinationCardProps {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  region?: string;
  featuredImage?: any;
  tripCount?: number;
  summary?: string;
  className?: string;
}

export function DestinationCard({
  title,
  slug,
  tagline,
  region,
  featuredImage,
  tripCount = 0,
  className,
}: DestinationCardProps) {
  return (
    <LocalizedLink
      href={`/destinations/${slug}`}
      className={`group relative overflow-hidden rounded-2xl block border border-border/60 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/50 ${className || ""}`}
    >
      <div className="relative h-full min-h-[300px] w-full overflow-hidden bg-primary">
        {featuredImage?.asset ? (
          <SanityImage
            image={featuredImage}
            alt={title}
            width={800}
            height={600}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-300 group-hover:via-black/40" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {region && (
            <Badge variant="outline" className="bg-black/40 backdrop-blur-md border-white/20 text-white font-medium text-[11px]">
              <MapPin className="h-3 w-3 mr-1 text-accent" />
              {region}
            </Badge>
          )}
          {tripCount > 0 && (
            <Badge variant="accent" className="font-semibold shadow-xs">
              {tripCount} {tripCount === 1 ? "Trip" : "Trips"}
            </Badge>
          )}
        </div>

        {/* Bottom Details */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="font-heading text-2xl font-bold tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
            {title}
          </h3>
          {tagline && (
            <p className="mt-1.5 text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed">
              {tagline}
            </p>
          )}
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent tracking-wide uppercase">
            <span>Explore Guide & Trips</span>
            <Compass className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
          </div>
        </div>
      </div>
    </LocalizedLink>
  );
}
