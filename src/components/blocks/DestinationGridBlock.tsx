"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { DestinationCard } from "@/components/destination/DestinationCard";
import { LocalizedLink } from "@/components/shared/LocalizedLink";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface DestinationGridBlockProps {
  badge?: string;
  heading?: string;
  subheading?: string;
  destinations?: any[];
  layout?: "bento" | "grid-3" | "carousel";
  viewAllLink?: {
    label?: string;
    url?: string;
  };
}

export function DestinationGridBlock({
  badge,
  heading,
  subheading,
  destinations = [],
  layout = "carousel",
  viewAllLink,
}: DestinationGridBlockProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!scrollerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    updateScrollState();
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [destinations, updateScrollState]);

  const scrollPrev = () => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollNext = () => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const displayHeading = heading || "Bestemmingen";
  const allDestinationsLabel = viewAllLink?.label || "Alle Bestemmingen";
  const allDestinationsUrl = viewAllLink?.url || "/destinations";
  const isCarousel = layout !== "grid-3";

  return (
    <section className="py-14 sm:py-20 bg-background border-b border-border/30">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header: Left Title with Underline Bar, Right All Destinations Link */}
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            {badge && badge.trim().toLowerCase() !== displayHeading.trim().toLowerCase() && (
              <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">
                {badge}
              </span>
            )}
            <h2 className="font-hero text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-foreground leading-none">
              {displayHeading}
            </h2>
            {/* Signature Deep Forest Pine Underline Bar */}
            <div className="w-12 sm:w-14 h-1 bg-primary dark:bg-accent rounded-full mt-2.5" />
            {subheading && (
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                {subheading}
              </p>
            )}
          </div>

          <LocalizedLink
            href={allDestinationsUrl}
            className="group inline-flex items-center gap-1.5 font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground/80 hover:text-accent transition-colors shrink-0 pb-1"
          >
            <span>{allDestinationsLabel}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-accent" />
          </LocalizedLink>
        </div>

        {/* Content: Carousel or Grid */}
        {destinations.length > 0 ? (
          isCarousel ? (
            <div className="relative group/carousel">
              {/* Left Scroll Button */}
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Vorige bestemmingen"
                  className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white dark:bg-card text-foreground shadow-xl border border-border/40 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-muted hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </button>
              )}

              {/* Horizontal Scroll Track */}
              <div
                ref={scrollerRef}
                onScroll={updateScrollState}
                className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 -mx-1"
              >
                {destinations.map((dest: any, index: number) => (
                  <div
                    key={dest._id ? `${dest._id}-${index}` : index}
                    className="shrink-0 snap-start w-[210px] sm:w-[235px] md:w-[255px] lg:w-[270px]"
                  >
                    <DestinationCard {...dest} />
                  </div>
                ))}
              </div>

              {/* Right Scroll Button */}
              {canScrollRight && (
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Volgende bestemmingen"
                  className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white dark:bg-card text-foreground shadow-xl border border-border/40 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-muted hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5 text-foreground" />
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {destinations.map((dest: any, index: number) => (
                <DestinationCard
                  key={dest._id ? `${dest._id}-${index}` : index}
                  {...dest}
                />
              ))}
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Geen bestemmingen gevonden.
          </div>
        )}
      </div>
    </section>
  );
}

