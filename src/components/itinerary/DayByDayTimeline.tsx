"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
}

export function DayByDayTimeline({ days = [] }: DayByDayTimelineProps) {
  // Allow expanding / collapsing all days
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Day-by-Day Expedition
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {days.length} Days of detailed adventure steps
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
              <Shrink className="h-3.5 w-3.5 mr-1" /> Collapse All
            </>
          ) : (
            <>
              <Expand className="h-3.5 w-3.5 mr-1" /> Expand All
            </>
          )}
        </Button>
      </div>

      {/* Accordion Timeline */}
      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        className="space-y-4"
      >
        {days.map((day, idx) => {
          const itemKey = `day-${idx}`;

          return (
            <AccordionItem
              key={day._key || idx}
              value={itemKey}
              className="border border-border/80 rounded-2xl bg-card overflow-hidden shadow-xs data-[state=open]:border-primary/40 data-[state=open]:shadow-md transition-all"
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full pr-4">
                  {/* Day Number Pill */}
                  <Badge
                    variant="accent"
                    className="w-fit text-xs font-extrabold tracking-wider py-1 px-3"
                  >
                    {day.dayNumber}
                  </Badge>

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

              <AccordionContent className="px-6 pt-2 pb-6 border-t border-border/40">
                {/* Meta Highlights Row: Meals & Accommodation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-muted/40 p-4 rounded-xl">
                  {/* Meals */}
                  <div className="flex items-center gap-2.5">
                    <Utensils className="h-4 w-4 text-accent shrink-0" />
                    <div>
                      <span className="text-[11px] uppercase font-bold text-muted-foreground block leading-none mb-1">
                        Meals Included
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {day.meals && day.meals.length > 0
                          ? day.meals
                              .map((m) =>
                                m === "breakfast"
                                  ? "Breakfast (B)"
                                  : m === "lunch"
                                    ? "Lunch (L)"
                                    : "Dinner (D)"
                              )
                              .join(", ")
                          : "No meals included on this day"}
                      </span>
                    </div>
                  </div>

                  {/* Accommodation */}
                  {day.accommodation && (
                    <div className="flex items-center gap-2.5">
                      <Hotel className="h-4 w-4 text-secondary shrink-0" />
                      <div>
                        <span className="text-[11px] uppercase font-bold text-muted-foreground block leading-none mb-1">
                          Accommodation
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          {day.accommodation.name || "Designated wild lodge/stay"}
                          {day.accommodation.type && (
                            <span className="text-muted-foreground ml-1">
                              ({day.accommodation.type})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Day Description */}
                {day.description && (
                  <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
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
                          Included Activities
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
                          Optional Activities (Extra)
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
                  <div className="mt-6 pt-4 border-t border-border/40">
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
