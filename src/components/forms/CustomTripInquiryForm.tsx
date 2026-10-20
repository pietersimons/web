"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Locale, defaultLocale } from "@/lib/i18n/config";
import { CustomTripFormConfig } from "@/lib/forms.types";
import {
  DynamicFormFields,
  areRequiredCustomFieldsValid,
  formatAdditionalFieldsForSubmission,
} from "./DynamicFormFields";

interface CustomTripInquiryFormProps {
  heading?: string;
  subheading?: string;
  locale?: Locale;
  formConfig?: CustomTripFormConfig | null;
}

export function CustomTripInquiryForm({
  heading,
  subheading,
  locale = defaultLocale,
  formConfig,
}: CustomTripInquiryFormProps) {
  const isNl = locale === "nl";

  // Section Header (page-level prop overrides central formConfig, which overrides fallback)
  const resolvedBadge =
    formConfig?.badge ||
    (isNl ? "Maatwerk Reisaanvraag" : "Custom Travel Inquiry");
  const resolvedHeading =
    heading ||
    formConfig?.heading ||
    (isNl
      ? "Ontwerp Jouw Maatwerk Avontuur"
      : "Start Designing Your Tailor-Made Adventure");
  const resolvedSubheading =
    subheading ||
    formConfig?.subheading ||
    (isNl
      ? "Vertel ons over jouw droomreis. Onze bestemmingsspecialisten stellen een persoonlijk reisvoorstel op maat voor je samen."
      : "Tell us about your dream expedition. Our destination specialists will craft a customized itinerary just for you.");

  // Configurable options with safe defaults
  const travelStyleOptions =
    formConfig?.travelStyleOptions && formConfig.travelStyleOptions.length > 0
      ? formConfig.travelStyleOptions
      : [
          { id: "wildlife", label: isNl ? "Wildlife & Safari" : "Wildlife & Safari" },
          { id: "active", label: isNl ? "Actief & Trekking" : "Active Trekking" },
          { id: "comfort", label: isNl ? "Eco-Lodge Comfort" : "Eco-Lodge Comfort" },
          { id: "coastal", label: isNl ? "Jungle & Oceaan" : "Jungle & Ocean" },
        ];

  const durationOptions =
    formConfig?.durationOptions && formConfig.durationOptions.length > 0
      ? formConfig.durationOptions
      : [
          { id: "7-10", label: isNl ? "7 – 10 Dagen" : "7 – 10 Days" },
          { id: "10-14", label: isNl ? "10 – 14 Dagen" : "10 – 14 Days" },
          { id: "15+", label: isNl ? "15+ Dagen" : "15+ Days" },
        ];

  // Step Titles
  const step1Title =
    formConfig?.step1Title ||
    (isNl ? "Bestemming & Reisstijl" : "Destination & Style");
  const step2Title =
    formConfig?.step2Title ||
    (isNl ? "Reisperiode & Groep" : "Dates & Group");
  const step3Title =
    formConfig?.step3Title ||
    (isNl ? "Contactgegevens" : "Contact Details");

  const phoneRequired = formConfig?.phoneRequired ?? true;

  // Dynamic Custom Questions per step
  const allCustomFields = formConfig?.customFields || [];
  const step1CustomFields = allCustomFields.filter((f) => f.step === 1);
  const step2CustomFields = allCustomFields.filter((f) => !f.step || f.step === 2);
  const step3CustomFields = allCustomFields.filter((f) => f.step === 3);

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Core Form State
  const [formData, setFormData] = useState({
    destination: "",
    travelStyle: travelStyleOptions[0]?.id || "wildlife",
    duration: durationOptions[1]?.id || durationOptions[0]?.id || "10-14",
    travelers: "2",
    departureMonth: "",
    fullName: "",
    email: "",
    phone: "",
    notes: "",
    _gotcha: "",
  });

  // Dynamic Custom Fields State
  const [customValues, setCustomValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const f of allCustomFields) {
      const key = f.fieldKey || f._key;
      if (key && f.fieldType === "select" && f.options && f.options.length > 0) {
        initial[key] = f.options[0].value;
      }
    }
    return initial;
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateCustomField = (fieldKey: string, value: string) => {
    setCustomValues((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const canAdvanceStep1 =
    Boolean(formData.destination.trim()) &&
    areRequiredCustomFieldsValid(step1CustomFields, customValues);

  const canAdvanceStep2 = areRequiredCustomFieldsValid(
    step2CustomFields,
    customValues
  );

  const canSubmitStep3 =
    Boolean(formData.fullName.trim()) &&
    Boolean(formData.email.trim()) &&
    (!phoneRequired || Boolean(formData.phone.trim())) &&
    areRequiredCustomFieldsValid(step3CustomFields, customValues);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const selectedStyleLabel =
      travelStyleOptions.find((s) => s.id === formData.travelStyle)?.label ||
      formData.travelStyle;
    const selectedDurationLabel =
      durationOptions.find((d) => d.id === formData.duration)?.label ||
      formData.duration;

    const additionalFields = formatAdditionalFieldsForSubmission(
      allCustomFields,
      customValues
    );

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryType: "custom_trip",
          locale,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          travelers: Number(formData.travelers) || 2,
          message: formData.notes,
          customTripDetails: {
            destination: formData.destination,
            travelStyle: selectedStyleLabel,
            duration: selectedDurationLabel,
            departureMonth: formData.departureMonth,
          },
          additionalFields,
          _gotcha: formData._gotcha,
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

  return (
    <section className="py-16 sm:py-24 bg-muted/40 border-t border-border/40" id="inquiry-form">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Badge variant="accent" className="mb-3">
            {resolvedBadge}
          </Badge>
          <h2 className="font-hero text-3xl sm:text-5xl font-bold uppercase tracking-wide text-foreground">
            {resolvedHeading}
          </h2>
          {resolvedSubheading && (
            <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {resolvedSubheading}
            </p>
          )}
        </div>

        <Card className="p-6 sm:p-10 rounded-3xl border-border bg-card shadow-xl">
          {/* Progress Bar */}
          {!submitted && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                <span>{isNl ? `Stap ${step} van 3` : `Step ${step} of 3`}</span>
                <span>
                  {step === 1
                    ? step1Title
                    : step === 2
                      ? step2Title
                      : step3Title}
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-emerald-600 mx-auto animate-in zoom-in-75 duration-300" />
              <h3 className="font-hero text-3xl font-bold uppercase tracking-wide text-foreground">
                {formConfig?.successHeading ||
                  (isNl
                    ? "Maatwerk Aanvraag Ontvangen!"
                    : "Adventure Proposal Requested!")}
              </h3>
              <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                {formConfig?.successMessage ? (
                  formConfig.successMessage
                ) : isNl ? (
                  <>
                    Bedankt, <strong className="text-foreground">{formData.fullName}</strong>. Je reiswensen zijn gekoppeld aan een Travelwild bestemmingsspecialist. Binnen 24–48 uur nemen we persoonlijk contact met je op.
                  </>
                ) : (
                  <>
                    Thank you, <strong className="text-foreground">{formData.fullName}</strong>. Your custom trip details have been assigned to a Travelwild destination expert. We will send you an initial itinerary outline within 24–48 hours.
                  </>
                )}
              </p>
              <Button
                variant="default"
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                }}
                className="mt-6"
              >
                {isNl ? "Nieuwe Aanvraag Indienen" : "Submit Another Request"}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot anti-spam field */}
              <input
                type="text"
                name="_gotcha"
                value={formData._gotcha}
                onChange={(e) => updateField("_gotcha", e.target.value)}
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

              {/* STEP 1: Destination & Travel Style */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-accent" />
                      {formConfig?.destinationLabel ||
                        (isNl
                          ? "Waar wil je naartoe reizen? *"
                          : "Where would you like to travel? *")}
                    </label>
                    <Input
                      required
                      placeholder={
                        formConfig?.destinationPlaceholder ||
                        (isNl
                          ? "bijv. Costa Rica, Namibië, Noorwegen of 'Ik zoek inspiratie'"
                          : "e.g. Costa Rica, Namibia, Norway, or 'I need inspiration'")
                      }
                      value={formData.destination}
                      onChange={(e) => updateField("destination", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-accent" />
                      {formConfig?.travelStyleLabel ||
                        (isNl
                          ? "Wat is je favoriete reisstijl?"
                          : "What is your preferred travel style?")}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {travelStyleOptions.map((style) => (
                        <button
                          type="button"
                          key={style.id}
                          onClick={() => updateField("travelStyle", style.id)}
                          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                            formData.travelStyle === style.id
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-background hover:bg-muted text-foreground border-border"
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Custom Fields for Step 1 */}
                  <DynamicFormFields
                    fields={step1CustomFields}
                    values={customValues}
                    onChange={updateCustomField}
                  />

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="accent"
                      size="lg"
                      onClick={handleNext}
                      disabled={!canAdvanceStep1}
                    >
                      {formConfig?.nextButtonStep1 ||
                        (isNl
                          ? "Volgende: Reisperiode & Groep"
                          : "Next: Dates & Travelers")}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: Dates & Group */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-accent" />
                        {formConfig?.departureMonthLabel ||
                          (isNl
                            ? "Gewenste Reismaand / Jaar"
                            : "Ideal Travel Month / Year")}
                      </label>
                      <Input
                        placeholder={
                          formConfig?.departureMonthPlaceholder ||
                          (isNl
                            ? "bijv. November 2026, of flexibel in het najaar"
                            : "e.g. November 2026, or flexible in Autumn")
                        }
                        value={formData.departureMonth}
                        onChange={(e) => updateField("departureMonth", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-accent" />
                        {formConfig?.travelersLabel ||
                          (isNl ? "Aantal Reizigers" : "Number of Travelers")}
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.travelers}
                        onChange={(e) => updateField("travelers", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">
                      {formConfig?.durationLabel ||
                        (isNl
                          ? "Gewenste Reisduur (Dagen)"
                          : "Desired Trip Duration (Days)")}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {durationOptions.map((dur) => (
                        <button
                          type="button"
                          key={dur.id}
                          onClick={() => updateField("duration", dur.id)}
                          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                            formData.duration === dur.id
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-background hover:bg-muted text-foreground border-border"
                          }`}
                        >
                          {dur.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Custom Fields for Step 2 */}
                  <DynamicFormFields
                    fields={step2CustomFields}
                    values={customValues}
                    onChange={updateCustomField}
                  />

                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" size="lg" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      {isNl ? "Vorige" : "Back"}
                    </Button>
                    <Button
                      type="button"
                      variant="accent"
                      size="lg"
                      onClick={handleNext}
                      disabled={!canAdvanceStep2}
                    >
                      {formConfig?.nextButtonStep2 ||
                        (isNl ? "Volgende: Contactgegevens" : "Next: Contact Info")}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact Info & Submit */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">
                        {formConfig?.fullNameLabel ||
                          (isNl ? "Volledige Naam *" : "Your Full Name *")}
                      </label>
                      <Input
                        required
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
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
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      {formConfig?.phoneLabel ||
                        (isNl ? "Telefoonnummer / WhatsApp *" : "Phone / WhatsApp *")}
                    </label>
                    <Input
                      type="tel"
                      required={phoneRequired}
                      placeholder="+31 6 12345678"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                  </div>

                  {/* Dynamic Custom Fields for Step 3 */}
                  <DynamicFormFields
                    fields={step3CustomFields}
                    values={customValues}
                    onChange={updateCustomField}
                  />

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      {formConfig?.notesLabel ||
                        (isNl
                          ? "Vertel ons meer over jouw droomreis (Optioneel)"
                          : "Tell us more about your ideal journey (Optional)")}
                    </label>
                    <Textarea
                      rows={3}
                      placeholder={
                        formConfig?.notesPlaceholder ||
                        (isNl
                          ? "Hoogtepunten die je niet wilt missen, gewenst comfortniveau, bijzondere gelegenheden..."
                          : "Must-see highlights, physical fitness level, accommodation wishes, celebration trips...")
                      }
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" size="lg" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      {isNl ? "Vorige" : "Back"}
                    </Button>
                    <Button
                      type="submit"
                      variant="accent"
                      size="lg"
                      disabled={loading || !canSubmitStep3}
                      className="font-bold"
                    >
                      {loading
                        ? isNl
                          ? "Versturen..."
                          : "Sending..."
                        : formConfig?.submitButtonLabel ||
                          (isNl
                            ? "Maatwerk Reisvoorstel Aanvragen"
                            : "Request Custom Itinerary Proposal")}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </Card>
      </div>
    </section>
  );
}
