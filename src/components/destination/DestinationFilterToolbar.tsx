"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, Grid3X3, LayoutGrid } from "lucide-react";

interface DestinationFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  regions: string[];
  totalResults: number;
}

export function DestinationFilterToolbar({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  regions = [],
  totalResults,
}: DestinationFilterToolbarProps) {
  return (
    <div className="space-y-6 mb-12">
      {/* Search and Quick Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search countries, regions (e.g. Costa Rica, Norway)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 bg-card rounded-xl border-border/80 shadow-xs"
          />
        </div>

        <div className="text-xs text-muted-foreground font-semibold self-start md:self-auto">
          Showing <span className="text-foreground font-extrabold">{totalResults}</span> destinations
        </div>
      </div>

      {/* Region Filter Pills */}
      {regions.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Button
            variant={selectedRegion === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onRegionChange("all")}
            className="rounded-full text-xs font-semibold shrink-0"
          >
            <Globe className="h-3.5 w-3.5 mr-1" />
            All Regions
          </Button>

          {regions.map((region) => (
            <Button
              key={region}
              variant={selectedRegion === region ? "default" : "outline"}
              size="sm"
              onClick={() => onRegionChange(region)}
              className="rounded-full text-xs font-semibold capitalize shrink-0"
            >
              {region.replace("-", " ")}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
