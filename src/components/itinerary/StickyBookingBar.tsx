"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookingModalDialog } from "@/components/forms/BookingModalDialog";
import { ArrowRight, Calendar } from "lucide-react";

interface StickyBookingBarProps {
  title: string;
  priceFrom?: number;
  currency?: string;
}

export function StickyBookingBar({
  title,
  priceFrom,
  currency = "EUR",
}: StickyBookingBarProps) {
  const [visible, setVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom py-3 px-4">
        <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <h4 className="font-heading font-bold text-sm text-foreground line-clamp-1">
              {title}
            </h4>
            <span className="text-xs text-muted-foreground">
              Small group departures & custom dates
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {priceFrom && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block leading-none">
                  From
                </span>
                <span className="font-heading font-extrabold text-base sm:text-lg text-foreground">
                  {currency === "USD" ? "$" : "€"}
                  {priceFrom.toLocaleString()}
                </span>
              </div>
            )}

            <Button
              variant="accent"
              size="default"
              onClick={() => setIsModalOpen(true)}
              className="font-bold flex items-center gap-1.5 shadow-md"
            >
              <span>Book / Inquire</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <BookingModalDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        departure={{
          tripTitle: title,
          price: priceFrom,
          currency,
        }}
      />
    </>
  );
}
