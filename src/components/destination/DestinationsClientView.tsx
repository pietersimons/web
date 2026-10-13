"use client";

import { useState, useMemo } from "react";
import { DestinationFilterToolbar } from "@/components/destination/DestinationFilterToolbar";
import { DestinationCard } from "@/components/destination/DestinationCard";

interface DestinationsClientViewProps {
  destinations: any[];
}

export function DestinationsClientView({
  destinations = [],
}: DestinationsClientViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Extract distinct regions
  const regions = useMemo(() => {
    const list = new Set<string>();
    destinations.forEach((d) => {
      if (d.region) list.add(d.region);
    });
    return Array.from(list);
  }, [destinations]);

  // Filtered results
  const filtered = useMemo(() => {
    return destinations.filter((dest) => {
      const matchesSearch =
        dest.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.region?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion =
        selectedRegion === "all" || dest.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [destinations, searchQuery, selectedRegion]);

  return (
    <div className="container mx-auto px-4 max-w-7xl pb-24">
      <DestinationFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        regions={regions}
        totalResults={filtered.length}
      />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {filtered.map((dest) => (
            <DestinationCard key={dest._id} {...dest} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl border border-dashed border-border bg-card">
          <h3 className="font-heading text-xl font-bold text-foreground">
            No destinations found
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search keyword or clearing region filters.
          </p>
        </div>
      )}
    </div>
  );
}
