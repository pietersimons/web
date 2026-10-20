"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BookingModalDialog,
  type InquiryModalMode,
} from "@/components/forms/BookingModalDialog";
import {
  Check,
  ShieldCheck,
  Users,
  Compass,
  PhoneCall,
  MessageCircle,
} from "lucide-react";
import { Locale, defaultLocale } from "@/lib/i18n/config";

interface TripBookingSidebarProps {
  tripTitle: string;
  pricing?: {
    priceFrom?: number;
    currency?: string;
    priceNote?: string;
  };
  highlights?: string[];
  departures?: Array<{
    startDate: string;
    endDate: string;
    price?: number;
    spotsLeft?: number;
    status?: string;
  }>;
  locale?: Locale;
}

export function TripBookingSidebar({
  tripTitle,
  pricing,
  highlights = [],
  departures = [],
  locale = defaultLocale,
}: TripBookingSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<InquiryModalMode>("booking");
  const isNl = locale === "nl";

  // Identify next upcoming departure
  const nextDeparture = departures && departures.length > 0 ? departures[0] : null;

  return (
    <>
      <aside className="sticky top-28 space-y-5">
        {/* Main Booking & Pricing Card */}
        <div className="bg-card rounded-2xl p-6 sm:p-7 border border-border/80 shadow-md space-y-6">
          {/* Price Header */}
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">
              {isNl ? "Expeditieprijs" : "Expedition Price"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-foreground font-heading">
                {pricing?.currency === "USD" ? "$" : "€"}
                {pricing?.priceFrom ? pricing.priceFrom.toLocaleString() : "—"}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {pricing?.priceNote || (isNl ? "per persoon" : "per person")}
              </span>
            </div>
          </div>

          {/* Next Departure Status */}
          {nextDeparture && (
            <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-foreground">
                <span className="text-muted-foreground">
                  {isNl ? "Eerstvolgende vertrek:" : "Next Departure:"}
                </span>
                <span>{nextDeparture.startDate}</span>
              </div>
              {nextDeparture.spotsLeft && nextDeparture.status !== "sold-out" && (
                <p className="text-accent font-semibold">
                  {isNl
                    ? `Nog ${nextDeparture.spotsLeft} plekken beschikbaar`
                    : `Only ${nextDeparture.spotsLeft} spots remaining`}
                </p>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-1">
            <Button
              variant="accent"
              size="lg"
              onClick={() => {
                setModalMode("booking");
                setIsModalOpen(true);
              }}
              className="w-full font-bold text-sm sm:text-base h-12 shadow-sm"
            >
              {isNl ? "Boek deze Reis" : "Book This Expedition"}
            </Button>

            <Button
              variant="outline"
              size="default"
              onClick={() => {
                setModalMode("contact");
                setIsModalOpen(true);
              }}
              className="w-full text-xs font-semibold text-foreground/80 hover:text-foreground gap-2"
            >
              <MessageCircle className="h-3.5 w-3.5 text-accent" />
              {isNl ? "Contact voor meer informatie" : "Contact for More Information"}
            </Button>
          </div>

          {/* Guarantees & Trust Signals */}
          <div className="pt-4 border-t border-border/60 space-y-2.5 text-xs text-foreground/85">
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4 text-accent shrink-0" />
              <span>{isNl ? "Kleine groepen (maximaal 8 deelnemers)" : "Small group (maximum 8 travelers)"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Compass className="h-4 w-4 text-primary shrink-0" />
              <span>{isNl ? "Ervaren Nederlandstalige reisbegeleiding" : "Expert expedition guide"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{isNl ? "Gegarandeerd vertrek & aangesloten bij GGTO" : "Guaranteed departures & fully insured"}</span>
            </div>
          </div>
        </div>

        {/* Highlights Card */}
        {highlights && highlights.length > 0 && (
          <div className="bg-card rounded-2xl p-6 sm:p-7 border border-border/80 shadow-xs space-y-4">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground pb-2 border-b border-border/60">
              {isNl ? "Hoogtepunten van deze Reis" : "Expedition Highlights"}
            </h3>
            <ul className="space-y-3">
              {highlights.map((hl: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                  <div className="h-4 w-4 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span className="leading-snug">{hl}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Direct Specialist Assistance */}
        <div className="bg-muted/40 rounded-2xl p-5 border border-border/60 text-xs space-y-2">
          <div className="flex items-center gap-2 font-heading font-bold text-foreground">
            <PhoneCall className="h-3.5 w-3.5 text-accent" />
            <span>{isNl ? "Persoonlijk Advies" : "Direct Specialist Advice"}</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {isNl
              ? "Vragen over de zwaarte, uitrusting of reisroute? Onze expeditieleider helpt je graag verder."
              : "Questions regarding fitness, gear, or the route? Speak directly with our expedition team."}
          </p>
        </div>
      </aside>

      {/* Booking / Contact Dialog Modal */}
      <BookingModalDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        locale={locale}
        departure={{
          tripTitle,
          price: pricing?.priceFrom,
          currency: pricing?.currency || "EUR",
          startDate: nextDeparture?.startDate,
          endDate: nextDeparture?.endDate,
        }}
      />
    </>
  );
}
