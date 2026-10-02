import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItineraryCard } from "@/components/itinerary/ItineraryCard";
import { ArrowRight } from "lucide-react";

interface ItineraryGridBlockProps {
  badge?: string;
  heading: string;
  subheading?: string;
  displayMode?: string;
  layout?: "grid-3" | "grid-4" | "carousel";
  viewAllLink?: { label?: string; url?: string };
  selectedItineraries?: any[];
  itineraries?: any[];
}

export function ItineraryGridBlock({
  badge,
  heading,
  subheading,
  layout = "grid-3",
  viewAllLink,
  selectedItineraries,
  itineraries,
}: ItineraryGridBlockProps) {
  const tripList = selectedItineraries || itineraries || [];

  const gridColsClass =
    layout === "grid-4"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
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

          {viewAllLink?.label && viewAllLink?.url && (
            <Button asChild variant="outline" className="self-start md:self-auto shrink-0">
              <Link href={viewAllLink.url} className="flex items-center gap-1.5">
                {viewAllLink.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Trips Grid */}
        {tripList.length > 0 ? (
          <div className={`grid ${gridColsClass} gap-6 sm:gap-8`}>
            {tripList.map((trip: any) => (
              <ItineraryCard key={trip._id} {...trip} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No itineraries found for this selection.
          </div>
        )}
      </div>
    </section>
  );
}
