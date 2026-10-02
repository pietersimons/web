"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, CheckCircle2, Compass } from "lucide-react";

export interface DepartureSelection {
  startDate?: string;
  endDate?: string;
  price?: number;
  currency?: string;
  tripTitle?: string;
}

interface BookingModalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departure?: DepartureSelection | null;
}

export function BookingModalDialog({
  open,
  onOpenChange,
  departure,
}: BookingModalDialogProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate inquiry submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setSubmitted(false), 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-6 sm:p-8">
        <DialogHeader className="text-left">
          <div className="inline-flex items-center gap-2 mb-2">
            <Compass className="h-4 w-4 text-accent" />
            <Badge variant="accent" className="text-[11px] font-bold">
              Reserve Your Spot
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-extrabold text-foreground">
            {departure?.tripTitle || "Expedition Booking Request"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            No immediate payment required. Our team will verify spot availability and reach out within 24 hours.
          </DialogDescription>
        </DialogHeader>

        {/* Selected Departure Summary */}
        {departure?.startDate && (
          <div className="bg-muted/50 p-4 rounded-xl border border-border/60 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Calendar className="h-4 w-4 text-accent" />
              <span>
                {departure.startDate} → {departure.endDate || "TBD"}
              </span>
            </div>
            {departure.price && (
              <span className="font-extrabold text-foreground">
                {departure.currency === "USD" ? "$" : "€"}
                {departure.price.toLocaleString()} / person
              </span>
            )}
          </div>
        )}

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
            <h4 className="text-xl font-bold text-foreground">Inquiry Received!</h4>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Thank you for choosing Travelwild. An expedition specialist has received your request and will contact you shortly.
            </p>
            <Button onClick={handleClose} variant="default" className="mt-4">
              Back to Trip
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Full Name *</label>
                <Input required placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Email Address *</label>
                <Input type="email" required placeholder="you@email.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Phone / WhatsApp *</label>
                <Input type="tel" required placeholder="+1 234 567 890" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Travelers Count *</label>
                <Input type="number" min="1" max="12" defaultValue="2" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Special Requests / Questions</label>
              <Textarea
                rows={3}
                placeholder="Dietary requirements, single room preferences, flight questions..."
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              disabled={loading}
              className="w-full h-12 font-bold text-base mt-2"
            >
              {loading ? "Sending Request..." : "Submit Booking Inquiry"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
