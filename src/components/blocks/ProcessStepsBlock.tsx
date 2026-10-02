import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SanityImage } from "@/components/shared/SanityImage";
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Send,
  ArrowRight,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  compass: Compass,
  mapPin: MapPin,
  "map-pin": MapPin,
  calendar: Calendar,
  users: Users,
  shield: ShieldCheck,
  shieldCheck: ShieldCheck,
  send: Send,
};

interface StepItem {
  stepNumber?: number;
  title: string;
  description?: string;
  icon?: string;
  image?: any;
}

interface ProcessStepsBlockProps {
  badge?: string;
  heading: string;
  subheading?: string;
  steps: StepItem[];
  cta?: { label?: string; url?: string };
}

export function ProcessStepsBlock({
  badge,
  heading,
  subheading,
  steps = [],
  cta,
}: ProcessStepsBlockProps) {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-2xl mb-16 text-center mx-auto">
          {badge && (
            <Badge variant="accent" className="mb-3">
              {badge}
            </Badge>
          )}
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((step, index) => {
            const IconComponent =
              (step.icon && ICON_MAP[step.icon]) || Compass;
            const stepNum = step.stepNumber || index + 1;

            return (
              <Card
                key={index}
                className="relative overflow-hidden border-border/80 bg-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Step Number Top Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-heading font-extrabold text-lg">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-heading text-3xl font-extrabold text-muted-foreground/30">
                    0{stepNum}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>

                {step.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                )}

                {step.image?.asset && (
                  <div className="mt-4 rounded-xl overflow-hidden aspect-video border border-border">
                    <SanityImage
                      image={step.image}
                      alt={step.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {cta?.label && cta?.url && (
          <div className="mt-12 text-center">
            <Button asChild variant="accent" size="lg">
              <Link href={cta.url} className="flex items-center gap-2">
                {cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
