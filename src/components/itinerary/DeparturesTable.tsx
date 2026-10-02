"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingModalDialog, type DepartureSelection } from "@/components/forms/BookingModalDialog";
import { Calendar, User, CheckCircle2, AlertCircle } from "lucide-react";

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
}

export function DeparturesTable({
  departures = [],
  tripTitle,
  currency = "EUR",
}: DeparturesTableProps) {
  const [selectedDeparture, setSelectedDeparture] =
    useState<DepartureSelection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
          Upcoming Group Departures
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Guaranteed small groups (Max 12 travelers). Reserve your spot online.
        </p>
      </div>

      <div className="space-y-3">
        {departures.map((dep, idx) => {
          const isSoldOut = dep.status === "sold-out";
          const isGuaranteed = dep.status === "guaranteed";
          const isAlmostFull = dep.status === "almost-full";

          const statusBadge = isGuaranteed ? (
            <Badge variant="success" className="gap-1 text-[10px]">
              <CheckCircle2 className="h-3 w-3" /> Guaranteed Departure
            </Badge>
          ) : isAlmostFull ? (
            <Badge variant="warning" className="gap-1 text-[10px]">
              <AlertCircle className="h-3 w-3" /> Few Spots Left
            </Badge>
          ) : isSoldOut ? (
            <Badge variant="outline" className="text-muted-foreground text-[10px]">
              Sold Out
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px]">
              Available
            </Badge>
          );

          return (
            <Card
              key={dep._key || idx}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSoldOut
                  ? "opacity-60 bg-muted/20 border-border/40"
                  : "bg-card hover:border-primary/40 hover:shadow-md"
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
                      Leader: {dep.guideName}
                    </span>
                  )}
                  {dep.spotsLeft && !isSoldOut && (
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      Only {dep.spotsLeft} spot{dep.spotsLeft === 1 ? "" : "s"} remaining
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40">
                {dep.price && (
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block leading-none">
                      Price / Person
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
                  {isSoldOut ? "Sold Out" : "Book Departure"}
                </Button>
              </div>
            </Card>
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
