"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingModalDialog, type DepartureSelection } from "@/components/forms/BookingModalDialog";
import { Calendar, User, CheckCircle2, AlertCircle } from "lucide-react";
import { Locale, defaultLocale } from "@/lib/i18n/config";

export interface DepartureItem {
  _key?: string;
  startDate: string;
  endDate: string;
  price?: number;
  status?: "available" | "guaranteed" | "almost-full" | "sold-out";
  spotsLeft?: number;
  guideName?: string;
}

interface DeparturesTableProps {
  departures?: DepartureItem[];
  tripTitle: string;
  currency?: string;
  locale?: Locale;
}

export function DeparturesTable({
  departures = [],
  tripTitle,
  currency = "EUR",
  locale = defaultLocale,
}: DeparturesTableProps) {
  const [selectedDeparture, setSelectedDeparture] =
    useState<DepartureSelection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isNl = locale === "nl";

  if (!departures || departures.length === 0) {
    return null;
  }

  const handleBookClick = (dep: DepartureItem) => {
    setSelectedDeparture({
      startDate: dep.startDate,
      endDate: dep.endDate,
      price: dep.price,
      currency,
      tripTitle,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-hero text-3xl sm:text-4xl font-bold uppercase tracking-wide text-foreground">
          {isNl ? "Vertrekdata & Beschikbaarheid" : "Upcoming Departures"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isNl
            ? "Gegarandeerde kleinschalige groepsreizen. Reserveer direct online."
            : "Guaranteed small groups. Reserve your expedition spot online."}
        </p>
      </div>

      <div className="space-y-3">
        {departures.map((dep, idx) => {
          const isSoldOut = dep.status === "sold-out";
          const isGuaranteed = dep.status === "guaranteed";
          const isAlmostFull = dep.status === "almost-full";

          const statusBadge = isGuaranteed ? (
            <Badge variant="success" className="gap-1 text-[10px]">
              <CheckCircle2 className="h-3 w-3" />
              {isNl ? "Gegarandeerd Vertrek" : "Guaranteed Departure"}
            </Badge>
          ) : isAlmostFull ? (
            <Badge variant="warning" className="gap-1 text-[10px]">
              <AlertCircle className="h-3 w-3" />
              {isNl ? "Laatste Plekken" : "Few Spots Left"}
            </Badge>
          ) : isSoldOut ? (
            <Badge variant="outline" className="text-muted-foreground text-[10px]">
              {isNl ? "Volgeboekt" : "Sold Out"}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px]">
              {isNl ? "Beschikbaar" : "Available"}
            </Badge>
          );

          return (
            <div
              key={dep._key || idx}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSoldOut
                  ? "opacity-60 bg-muted/20 border-border/40"
                  : "bg-card border-border/80 hover:border-primary/40 hover:shadow-sm"
              }`}
            >
              {/* Date & Leader Info */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 text-foreground font-heading font-extrabold text-base sm:text-lg">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>
                      {dep.startDate} → {dep.endDate}
                    </span>
                  </div>
                  {statusBadge}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 text-xs text-muted-foreground">
                  {dep.guideName && (
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3 w-3 text-secondary" />
                      {isNl ? "Reisleider" : "Leader"}: {dep.guideName}
                    </span>
                  )}
                  {dep.spotsLeft && !isSoldOut && (
                    <span className="font-semibold text-accent">
                      {isNl
                        ? `Nog ${dep.spotsLeft} plekken beschikbaar`
                        : `Only ${dep.spotsLeft} spot${dep.spotsLeft === 1 ? "" : "s"} remaining`}
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40">
                {dep.price && (
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block leading-none">
                      {isNl ? "Prijs per persoon" : "Price / Person"}
                    </span>
                    <span className="font-heading text-lg sm:text-xl font-extrabold text-foreground">
                      {currency === "USD" ? "$" : "€"}
                      {dep.price.toLocaleString()}
                    </span>
                  </div>
                )}

                <Button
                  variant={isGuaranteed || isAlmostFull ? "accent" : "default"}
                  size="sm"
                  disabled={isSoldOut}
                  onClick={() => handleBookClick(dep)}
                  className="font-bold shrink-0"
                >
                  {isSoldOut
                    ? (isNl ? "Volgeboekt" : "Sold Out")
                    : (isNl ? "Boek Vertrek" : "Book Departure")}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <BookingModalDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        departure={selectedDeparture}
      />
    </div>
  );
}
