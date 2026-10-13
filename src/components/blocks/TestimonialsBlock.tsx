import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SanityImage } from "@/components/shared/SanityImage";
import { Star, Quote, MapPin } from "lucide-react";

interface Testimonial {
  author: string;
  location?: string;
  tripTaken?: string;
  rating?: number;
  quote: string;
  avatar?: any;
}

interface TestimonialsBlockProps {
  badge?: string;
  heading: string;
  subheading?: string;
  testimonials: Testimonial[];
}

export function TestimonialsBlock({
  badge,
  heading,
  subheading,
  testimonials = [],
}: TestimonialsBlockProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-2xl mb-12 text-center mx-auto">
          {badge && (
            <Badge variant="accent" className="mb-3">
              {badge}
            </Badge>
          )}
          <h2 className="font-hero text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wide text-foreground">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => {
            const stars = Array.from({ length: t.rating || 5 });

            return (
              <Card
                key={idx}
                className="flex flex-col justify-between p-7 rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/40"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-accent mb-4">
                    {stars.map((_, sIdx) => (
                      <Star key={sIdx} className="h-4 w-4 fill-accent" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative">
                    <Quote className="h-8 w-8 text-muted/60 absolute -top-3 -left-2 -z-0" />
                    <p className="relative z-10 text-sm sm:text-base text-foreground/90 leading-relaxed italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-3">
                  {t.avatar?.asset ? (
                    <div className="h-11 w-11 rounded-full overflow-hidden shrink-0 border border-border">
                      <SanityImage
                        image={t.avatar}
                        alt={t.author}
                        width={88}
                        height={88}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {t.author.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h4 className="font-heading text-sm font-bold text-foreground">
                      {t.author}
                    </h4>
                    <div className="flex flex-wrap gap-x-2 text-[11px] text-muted-foreground">
                      {t.location && (
                        <span className="inline-flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5 text-accent" />
                          {t.location}
                        </span>
                      )}
                      {t.tripTaken && <span>• {t.tripTaken}</span>}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
