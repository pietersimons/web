import { Badge } from "@/components/ui/badge";
import { DestinationCard } from "@/components/destination/DestinationCard";

interface DestinationGridBlockProps {
  badge?: string;
  heading: string;
  subheading?: string;
  destinations?: any[];
  layout?: "bento" | "grid-3" | "carousel";
}

export function DestinationGridBlock({
  badge,
  heading,
  subheading,
  destinations = [],
  layout = "bento",
}: DestinationGridBlockProps) {
  return (
    <section className="py-16 sm:py-24 bg-muted/30 border-y border-border/40">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 text-center mx-auto">
          {badge && (
            <Badge variant="accent" className="mb-3">
              {badge}
            </Badge>
          )}
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {/* Bento / Grid Showcase */}
        {destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest: any, index: number) => {
              const isBentoHero = layout === "bento" && index === 0;
              return (
                <DestinationCard
                  key={dest._id}
                  {...dest}
                  className={isBentoHero ? "md:col-span-2 lg:col-span-2 min-h-[380px]" : "min-h-[320px]"}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No destinations found.
          </div>
        )}
      </div>
    </section>
  );
}
