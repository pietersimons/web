"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer";
import { SanityImage } from "@/components/shared/SanityImage";
import {
  MapPin,
  Utensils,
  Hotel,
  CheckCircle2,
  PlusCircle,
  Expand,
  Shrink,
} from "lucide-react";
import { Locale, defaultLocale } from "@/lib/i18n/config";

export interface ItineraryDay {
  _key?: string;
  dayNumber: string;
  title: string;
  location?: string;
  description?: any;
  meals?: string[];
  accommodation?: {
    name?: string;
    type?: string;
    notes?: string;
  };
  includedActivities?: string[];
  optionalActivities?: string[];
  gallery?: any[];
}

interface DayByDayTimelineProps {
  days: ItineraryDay[];
  locale?: Locale;
}

export function DayByDayTimeline({
  days = [],
  locale = defaultLocale,
}: DayByDayTimelineProps) {
  const isNl = locale === "nl";
  const allKeys = days.map((_, i) => `day-${i}`);
  const [openItems, setOpenItems] = useState<string[]>(["day-0"]);

  const toggleAll = () => {
    if (openItems.length === days.length) {
      setOpenItems([]);
    } else {
      setOpenItems(allKeys);
    }
  };

  if (!days || days.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Header with expand/collapse all button */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div>
          <h2 className="font-hero text-3xl sm:text-4xl font-bold uppercase tracking-wide text-foreground">
            {isNl ? "Dag-tot-dag Programma" : "Day-by-Day Expedition"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {days.length} {isNl ? "dagen vol ongerepte ontdekkingen" : "days of detailed wilderness itinerary"}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleAll}
          className="text-xs font-semibold"
        >
          {openItems.length === days.length ? (
            <>
              <Shrink className="h-3.5 w-3.5 mr-1" />
              {isNl ? "Alles inklappen" : "Collapse All"}
            </>
          ) : (
            <>
              <Expand className="h-3.5 w-3.5 mr-1" />
              {isNl ? "Alles uitklappen" : "Expand All"}
            </>
          )}
        </Button>
      </div>

      {/* Accordion Timeline */}
      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        className="space-y-3.5"
      >
        {days.map((day, idx) => {
          const itemKey = `day-${idx}`;

          return (
            <AccordionItem
              key={day._key || idx}
              value={itemKey}
              className="border border-border/80 rounded-2xl bg-card overflow-hidden shadow-xs data-[state=open]:border-primary/40 data-[state=open]:shadow-sm transition-all"
            >
              <AccordionTrigger className="px-5 sm:px-6 py-4 sm:py-5 hover:no-underline text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full pr-4">
                  {/* Understated Day Number Pill */}
                  <span className="w-fit text-xs font-heading font-extrabold tracking-wider py-1 px-2.5 rounded-md bg-primary/10 text-primary">
                    {day.dayNumber || (isNl ? `Dag ${idx + 1}` : `Day ${idx + 1}`)}
                  </span>

                  {/* Day Title */}
                  <span className="font-heading text-base sm:text-lg font-bold text-foreground">
                    {day.title}
                  </span>

                  {/* Location Tag */}
                  {day.location && (
                    <span className="inline-flex items-center text-xs font-medium text-muted-foreground sm:ml-auto">
                      <MapPin className="h-3.5 w-3.5 text-accent mr-1 shrink-0" />
                      {day.location}
                    </span>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-5 sm:px-6 pt-2 pb-6 border-t border-border/40">
                {/* Clean inline meta line for Meals & Lodging */}
                {(day.meals?.length || day.accommodation?.name || day.accommodation?.type) && (
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground py-2.5 mb-4 border-b border-border/40">
                    {day.accommodation && (
                      <div className="flex items-center gap-1.5">
                        <Hotel className="h-3.5 w-3.5 text-primary/80 shrink-0" />
                        <span className="text-foreground/90 font-medium">
                          {day.accommodation.name || (isNl ? "Wildernis lodge / hotel" : "Lodge / hotel")}
                          {day.accommodation.type ? ` (${day.accommodation.type})` : ""}
                        </span>
                      </div>
                    )}

                    {day.meals && day.meals.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Utensils className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="text-foreground/90">
                          {day.meals
                            .map((m) =>
                              m === "breakfast"
                                ? (isNl ? "Ontbijt (O)" : "Breakfast (B)")
                                : m === "lunch"
                                  ? (isNl ? "Lunch (L)" : "Lunch (L)")
                                  : (isNl ? "Diner (D)" : "Dinner (D)")
                            )
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Day Description Narrative */}
                {day.description && (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/85 leading-relaxed mb-5">
                    <PortableTextRenderer value={day.description} />
                  </div>
                )}

                {/* Activities: Included & Optional */}
                {(day.includedActivities?.length || day.optionalActivities?.length) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/40">
                    {day.includedActivities && day.includedActivities.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase font-bold text-primary tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          {isNl ? "Inbegrepen Activiteiten" : "Included Activities"}
                        </h4>
                        <ul className="space-y-1.5 text-xs text-foreground/90 pl-1">
                          {day.includedActivities.map((act, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {day.optionalActivities && day.optionalActivities.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                          <PlusCircle className="h-3.5 w-3.5 text-accent" />
                          {isNl ? "Optionele Activiteiten" : "Optional Activities"}
                        </h4>
                        <ul className="space-y-1.5 text-xs text-muted-foreground pl-1">
                          {day.optionalActivities.map((opt, oIdx) => (
                            <li key={oIdx} className="flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                              <span>{opt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Day Gallery */}
                {day.gallery && day.gallery.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-border/40">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {day.gallery.map((gImg, gIdx) => (
                        <div
                          key={gIdx}
                          className="aspect-video rounded-xl overflow-hidden border border-border"
                        >
                          <SanityImage
                            image={gImg}
                            alt={`${day.title} image ${gIdx + 1}`}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
