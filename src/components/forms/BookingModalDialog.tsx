"use client";

import { useState, useEffect } from "react";
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
import {
  Calendar,
  CheckCircle2,
  Compass,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { Locale, defaultLocale } from "@/lib/i18n/config";
import { BookingContactFormConfig } from "@/lib/forms.types";
import {
  DynamicFormFields,
  areRequiredCustomFieldsValid,
  formatAdditionalFieldsForSubmission,
} from "./DynamicFormFields";

export interface DepartureSelection {
  startDate?: string;
  endDate?: string;
  price?: number;
  currency?: string;
  tripTitle?: string;
}

export type InquiryModalMode = "booking" | "contact";

interface BookingModalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departure?: DepartureSelection | null;
  mode?: InquiryModalMode;
  locale?: Locale;
  formConfig?: BookingContactFormConfig | null;
}

export function BookingModalDialog({
  open,
  onOpenChange,
  departure,
  mode = "booking",
  locale = defaultLocale,
  formConfig: initialFormConfig,
}: BookingModalDialogProps) {
  const isNl = locale === "nl";
  const isContactMode = mode === "contact";

  const [fetchedConfig, setFetchedConfig] =
    useState<BookingContactFormConfig | null>(null);
  const formConfig = initialFormConfig || fetchedConfig;

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [message, setMessage] = useState("");
  const [gotcha, setGotcha] = useState("");
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  // Fetch central booking/contact modal config from CMS when opened (if not passed via props)
  useEffect(() => {
    if (!open || initialFormConfig || fetchedConfig) return;
    let cancelled = false;
    fetch(`/api/inquiries?locale=${locale}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.bookingContactForm) {
          setFetchedConfig(data.bookingContactForm);
        }
      })
      .catch(() => {
        // Ignore and use built-in defaults
      });
    return () => {
      cancelled = true;
    };
  }, [open, initialFormConfig, fetchedConfig, locale]);

  const customFields = formConfig?.customFields || [];

  const updateCustomField = (fieldKey: string, value: string) => {
    setCustomValues((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const canSubmit =
    Boolean(fullName.trim()) &&
    Boolean(email.trim()) &&
    areRequiredCustomFieldsValid(customFields, customValues);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const additionalFields = formatAdditionalFieldsForSubmission(
      customFields,
      customValues
    );

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryType: isContactMode ? "contact" : "booking",
          locale,
          fullName,
          email,
          phone,
          travelers: isContactMode ? undefined : Number(travelers) || 1,
          tripTitle: departure?.tripTitle,
          startDate: departure?.startDate,
          endDate: departure?.endDate,
          price: departure?.price,
          currency: departure?.currency,
          message,
          additionalFields,
          _gotcha: gotcha,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error ||
            (isNl
              ? "Er ging iets mis bij het versturen. Probeer het opnieuw."
              : "Something went wrong while sending your request. Please try again.")
        );
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : isNl
            ? "Versturen mislukt. Probeer het opnieuw."
            : "Submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSubmitted(false);
      setErrorMessage(null);
      setMessage("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <div className="inline-flex items-center gap-2 mb-2">
            {isContactMode ? (
              <MessageCircle className="h-4 w-4 text-accent" />
            ) : (
              <Compass className="h-4 w-4 text-accent" />
            )}
            <Badge variant="accent" className="text-[11px] font-bold">
              {isContactMode
                ? formConfig?.contactBadge ||
                  (isNl ? "Meer Informatie" : "More Information")
                : formConfig?.bookingBadge ||
                  (isNl ? "Reserveer je plek" : "Reserve Your Spot")}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-extrabold text-foreground">
            {isContactMode
              ? departure?.tripTitle
                ? isNl
                  ? `Vraag over ${departure.tripTitle}`
                  : `Question about ${departure.tripTitle}`
                : formConfig?.contactHeading ||
                  (isNl ? "Neem contact met ons op" : "Contact Our Specialists")
              : departure?.tripTitle ||
                formConfig?.bookingHeading ||
                (isNl ? "Expeditie Boekingsaanvraag" : "Expedition Booking Request")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isContactMode
              ? formConfig?.contactDescription ||
                (isNl
                  ? "Heb je een vraag over het programma, de zwaarte of beschikbaarheid? Stel je vraag direct aan onze reisspecialist."
                  : "Have a question about the itinerary, fitness level, or availability? Ask our expedition specialist directly.")
              : formConfig?.bookingDescription ||
                (isNl
                  ? "Geen directe betaling nodig. Ons team controleert de beschikbaarheid en neemt binnen 24 uur persoonlijk contact op."
                  : "No immediate payment required. Our team will verify spot availability and reach out within 24 hours.")}
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
                {departure.price.toLocaleString()} / {isNl ? "persoon" : "person"}
              </span>
            )}
          </div>
        )}

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
            <h4 className="text-xl font-bold text-foreground">
              {isContactMode
                ? formConfig?.contactSuccessHeading ||
                  (isNl ? "Bericht Ontvangen!" : "Question Received!")
                : formConfig?.bookingSuccessHeading ||
                  (isNl ? "Boekingsaanvraag Ontvangen!" : "Inquiry Received!")}
            </h4>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {formConfig?.successMessage ||
                (isNl
                  ? "Bedankt voor je interesse in Travelwild. Onze expeditiespecialist heeft je aanvraag ontvangen en neemt binnen 24 uur contact met je op."
                  : "Thank you for choosing Travelwild. An expedition specialist has received your request and will contact you shortly.")}
            </p>
            <Button onClick={handleClose} variant="default" className="mt-4">
              {isNl ? "Terug naar de reis" : "Back to Trip"}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Honeypot anti-spam field */}
            <input
              type="text"
              name="_gotcha"
              value={gotcha}
              onChange={(e) => setGotcha(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {errorMessage && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {formConfig?.fullNameLabel ||
                    (isNl ? "Volledige naam *" : "Full Name *")}
                </label>
                <Input
                  required
                  placeholder={isNl ? "Je naam" : "Your name"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {formConfig?.emailLabel ||
                    (isNl ? "E-mailadres *" : "Email Address *")}
                </label>
                <Input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {isContactMode ? (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {isNl
                    ? "Telefoonnummer / WhatsApp (optioneel)"
                    : "Phone / WhatsApp (optional)"}
                </label>
                <Input
                  type="tel"
                  placeholder="+31 6 12345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    {formConfig?.phoneLabel ||
                      (isNl ? "Telefoon / WhatsApp *" : "Phone / WhatsApp *")}
                  </label>
                  <Input
                    type="tel"
                    required
                    placeholder="+31 6 12345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    {formConfig?.travelersLabel ||
                      (isNl ? "Aantal reizigers *" : "Travelers Count *")}
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    required
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Dynamic Custom Questions from CMS */}
            <DynamicFormFields
              fields={customFields}
              values={customValues}
              onChange={updateCustomField}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                {isContactMode
                  ? formConfig?.messageContactLabel ||
                    (isNl
                      ? "Jouw vraag of bericht *"
                      : "Your Question or Message *")
                  : formConfig?.messageBookingLabel ||
                    (isNl
                      ? "Bijzondere wensen / Vragen"
                      : "Special Requests / Questions")}
              </label>
              <Textarea
                rows={3}
                required={isContactMode}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isContactMode
                    ? formConfig?.messageContactPlaceholder ||
                      (isNl
                        ? "Waar kunnen we je mee helpen? Bijv. vragen over de route, accommodaties of reisdata..."
                        : "How can we help you? E.g., questions about the itinerary, lodges, or travel dates...")
                    : formConfig?.messageBookingPlaceholder ||
                      (isNl
                        ? "Dieetwensen, kamerindeling, vragen over vluchten..."
                        : "Dietary requirements, single room preferences, flight questions...")
                }
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              disabled={loading || !canSubmit}
              className="w-full h-12 font-bold text-base mt-2"
            >
              {loading
                ? isNl
                  ? "Aanvraag versturen..."
                  : "Sending Request..."
                : isContactMode
                  ? formConfig?.contactSubmitLabel ||
                    (isNl ? "Vraag Versturen" : "Send Question")
                  : formConfig?.bookingSubmitLabel ||
                    (isNl ? "Boekingsaanvraag Versturen" : "Submit Booking Inquiry")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
