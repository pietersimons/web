import { LocalizedLink } from "@/components/shared/LocalizedLink";
import { SanityImage } from "@/components/shared/SanityImage";
import { Mountain } from "lucide-react";

export interface DestinationCardProps {
  _id?: string;
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
  featuredImage,
  className,
}: DestinationCardProps) {
  return (
    <LocalizedLink
      href={`/destinations/${slug}`}
      className={`group relative overflow-hidden rounded-md sm:rounded-lg block shadow-sm transition-all duration-300 hover:shadow-2xl border border-black/5 dark:border-white/10 ${className || ""}`}
    >
      <div className="relative h-full w-full aspect-[3/4] overflow-hidden bg-primary">
        {featuredImage?.asset ? (
          <SanityImage
            image={featuredImage}
            alt={title}
            width={600}
            height={800}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : featuredImage?.url ? (
          <img
            src={featuredImage.url}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-[#1C382E] to-[#122B22] flex flex-col items-center justify-center p-6 text-center">
            <Mountain className="h-12 w-12 text-white/20 mb-2 transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}

        {/* Smooth Dark Gradient Overlay at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 via-35% to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/90" />

        {/* Bottom Details - Clean Centered Destination Name */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-center flex flex-col items-center justify-end z-10">
          <h3 className="font-hero text-2xl sm:text-3xl lg:text-[28px] uppercase tracking-wider text-white drop-shadow-md group-hover:text-amber-300 transition-colors duration-300 line-clamp-1">
            {title}
          </h3>
        </div>
      </div>
    </LocalizedLink>
  );
}

