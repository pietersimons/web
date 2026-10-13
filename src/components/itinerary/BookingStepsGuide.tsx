import { Card } from "@/components/ui/card";
import { Compass, Check } from "lucide-react";

interface Step {
  stepNumber?: number;
  title: string;
  description?: string;
}

interface BookingStepsGuideProps {
  steps?: Step[];
}

export function BookingStepsGuide({ steps = [] }: BookingStepsGuideProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-hero text-3xl sm:text-4xl font-bold uppercase tracking-wide text-foreground">
          How to Prepare & Book
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Simple step-by-step guidance from inquiry to departure
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, idx) => (
          <Card
            key={idx}
            className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-8 w-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-bold text-sm">
                  {step.stepNumber || idx + 1}
                </div>
                <Check className="h-4 w-4 text-muted-foreground/40" />
              </div>

              <h4 className="font-heading text-base font-bold text-foreground mb-1.5">
                {step.title}
              </h4>

              {step.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
