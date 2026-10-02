"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Sparkles,
} from "lucide-react";

interface CustomTripInquiryFormProps {
  heading?: string;
  subheading?: string;
}

export function CustomTripInquiryForm({
  heading = "Start Designing Your Tailor-Made Adventure",
  subheading = "Tell us about your dream expedition. Our destination specialists will craft a customized itinerary just for you.",
}: CustomTripInquiryFormProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    destination: "",
    travelStyle: "wildlife",
    duration: "10-14",
    travelers: "2",
    departureMonth: "",
    budget: "standard",
    fullName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <section className="py-16 sm:py-24 bg-muted/40 border-t border-border/40" id="inquiry-form">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Badge variant="accent" className="mb-3">
            Custom Travel Inquiry
          </Badge>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        <Card className="p-6 sm:p-10 rounded-3xl border-border bg-card shadow-xl">
          {/* Progress Bar */}
          {!submitted && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                <span>Step {step} of 3</span>
                <span>
                  {step === 1
                    ? "Destination & Style"
                    : step === 2
                      ? "Dates & Group"
                      : "Contact Details"}
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
              <h3 className="font-heading text-3xl font-extrabold text-foreground">
                Adventure Proposal Requested!
              </h3>
              <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-foreground">{formData.fullName}</strong>. Your custom trip details have been assigned to a Travelwild destination expert. We will send you an initial itinerary outline within 24–48 hours.
              </p>
              <Button
                variant="default"
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                }}
                className="mt-6"
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Destination & Travel Style */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-accent" />
                      Where would you like to travel? *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Costa Rica, Namibia, Norway, or 'I need inspiration'"
                      value={formData.destination}
                      onChange={(e) => updateField("destination", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-accent" />
                      What is your preferred travel style?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: "wildlife", label: "Wildlife & Safari" },
                        { id: "active", label: "Active Trekking" },
                        { id: "comfort", label: "Eco-Lodge Comfort" },
                        { id: "coastal", label: "Jungle & Ocean" },
                      ].map((style) => (
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

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="accent"
                      size="lg"
                      onClick={handleNext}
                      disabled={!formData.destination.trim()}
                    >
                      Next: Dates & Travelers
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
                        Ideal Travel Month / Year
                      </label>
                      <Input
                        placeholder="e.g. November 2026, or flexible in Autumn"
                        value={formData.departureMonth}
                        onChange={(e) => updateField("departureMonth", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-accent" />
                        Number of Travelers
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
                      Desired Trip Duration (Days)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "7-10", label: "7 – 10 Days" },
                        { id: "10-14", label: "10 – 14 Days" },
                        { id: "15+", label: "15+ Days" },
                      ].map((dur) => (
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

                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" size="lg" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                    <Button type="button" variant="accent" size="lg" onClick={handleNext}>
                      Next: Contact Info
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
                      <label className="text-xs font-bold text-foreground">Your Full Name *</label>
                      <Input
                        required
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Email Address *</label>
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
                    <label className="text-xs font-bold text-foreground">Phone / WhatsApp *</label>
                    <Input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Tell us more about your ideal journey (Optional)
                    </label>
                    <Textarea
                      rows={3}
                      placeholder="Must-see highlights, physical fitness level, accommodation wishes, celebration trips..."
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" size="lg" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="accent"
                      size="lg"
                      disabled={loading || !formData.fullName || !formData.email}
                      className="font-bold"
                    >
                      {loading ? "Sending..." : "Request Custom Itinerary Proposal"}
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
