import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SanityImage } from "@/components/shared/SanityImage";
import {
  Users,
  Mountain,
  Compass,
  Leaf,
  Shield,
  ShieldCheck,
  MapPin,
  Calendar,
  Plane,
  Camera,
  HeartHandshake,
  Award,
  Sparkles,
  Binoculars,
  Tent,
  Footprints,
  Globe,
  Clock,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  users: Users,
  mountain: Mountain,
  compass: Compass,
  leaf: Leaf,
  shield: Shield,
  shieldCheck: ShieldCheck,
  mapPin: MapPin,
  "map-pin": MapPin,
  calendar: Calendar,
  plane: Plane,
  camera: Camera,
  heartHandshake: HeartHandshake,
  award: Award,
  sparkles: Sparkles,
  binoculars: Binoculars,
  tent: Tent,
  footprints: Footprints,
  globe: Globe,
  clock: Clock,
};

export interface FeatureItemData {
  _key?: string;
  title: string;
  description?: string;
  iconType?: "icon" | "image";
  icon?: string;
  image?: any;
  link?: string;
}

export interface FeaturesBlockProps {
  _key?: string;
  badge?: string;
  heading?: string;
  subheading?: string;
  layoutStyle?: "bar" | "grid";
  backgroundColor?: "subtle" | "card" | "transparent" | "dark";
  items?: FeatureItemData[];
}

export function FeaturesBlock({
  badge,
  heading,
  subheading,
  layoutStyle = "bar",
  backgroundColor = "subtle",
  items = [],
}: FeaturesBlockProps) {
  if (!items || items.length === 0) {
    return null;
  }

  // Determine container styling based on backgroundColor
  const bgClasses = {
    subtle: "bg-muted/30 border-y border-border/60",
    card: "bg-card border-y border-border/80 shadow-xs",
    transparent: "bg-transparent border-y border-border/40",
    dark: "bg-primary text-primary-foreground border-y border-primary/20",
  }[backgroundColor] || "bg-muted/30 border-y border-border/60";

  const isDark = backgroundColor === "dark";

  // Dynamic grid column setup based on item count
  const count = items.length;
  const gridColClass =
    count === 1
      ? "grid-cols-1 max-w-sm"
      : count === 2
      ? "grid-cols-1 sm:grid-cols-2 max-w-2xl"
      : count === 3
      ? "grid-cols-1 sm:grid-cols-3 max-w-4xl"
      : count === 4
      ? "grid-cols-2 lg:grid-cols-4 max-w-6xl"
      : count === 5
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 max-w-7xl"
      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 max-w-7xl";

  const hasHeader = Boolean(heading || badge || subheading);

  return (
    <section
      className={`relative w-full ${bgClasses} transition-colors duration-200 ${
        hasHeader ? "py-12 sm:py-16" : "py-8 sm:py-10"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Optional Header when used as a full section */}
        {hasHeader && (
          <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
            {badge && (
              <Badge
                variant={isDark ? "secondary" : "accent"}
                className="mb-3 uppercase tracking-wider text-xs"
              >
                {badge}
              </Badge>
            )}
            {heading && (
              <h2
                className={`font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
                  isDark ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p
                className={`mt-2 text-sm sm:text-base leading-relaxed ${
                  isDark ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Feature Items */}
        <div
          className={`grid ${gridColClass} mx-auto gap-6 sm:gap-8 lg:gap-6 justify-center items-start text-center`}
        >
          {items.map((item, index) => {
            const IconComponent =
              (item.icon && ICON_MAP[item.icon]) || Compass;
            const hasCustomImage =
              Boolean(item.image?.asset) &&
              (item.iconType === "image" || !item.icon);

            const content = (
              <div
                className={`group flex flex-col items-center justify-start h-full px-2 py-1 transition-all duration-300 ${
                  layoutStyle === "grid"
                    ? `p-5 rounded-xl border ${
                        isDark
                          ? "bg-primary/40 border-primary-foreground/15 hover:border-accent"
                          : "bg-card border-border/80 hover:border-primary/40 hover:shadow-md"
                      }`
                    : "hover:-translate-y-0.5"
                }`}
              >
                {/* Icon or Custom Image */}
                <div className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-3.5 flex items-center justify-center shrink-0">
                  {hasCustomImage ? (
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                      <SanityImage
                        image={item.image}
                        alt={item.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <IconComponent
                      strokeWidth={1.5}
                      className={`h-7 w-7 sm:h-8 sm:w-8 transition-transform duration-300 group-hover:scale-110 ${
                        isDark
                          ? "text-primary-foreground"
                          : "text-foreground/90 group-hover:text-primary"
                      }`}
                    />
                  )}
                </div>

                {/* Primary Title (Uppercase, bold, tracking) */}
                <h3
                  className={`font-heading text-xs sm:text-[13px] lg:text-sm font-bold tracking-wider uppercase leading-tight ${
                    isDark
                      ? "text-primary-foreground"
                      : "text-foreground group-hover:text-primary transition-colors"
                  }`}
                >
                  {item.title}
                </h3>

                {/* Secondary Copy / Subtitle */}
                {item.description && (
                  <p
                    className={`mt-1 text-xs sm:text-[13px] leading-snug ${
                      isDark
                        ? "text-primary-foreground/75"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            );

            if (item.link) {
              return (
                <Link
                  key={item._key || index}
                  href={item.link}
                  className="block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                >
                  {content}
                </Link>
              );
            }

            return <div key={item._key || index}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
