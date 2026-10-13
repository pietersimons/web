import { LocalizedLink } from "@/components/shared/LocalizedLink";
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
        <Compass className="h-8 w-8 text-accent animate-spin-slow" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
        Error 404
      </span>
      <h1 className="font-hero text-4xl sm:text-6xl font-bold uppercase tracking-wide text-foreground mb-4">
        Off The Beaten Track
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mb-8">
        The page you are looking for has wandered into uncharted territory or no longer exists.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild variant="accent" size="lg">
          <LocalizedLink href="/" className="flex items-center gap-2">
            <span>Back to Home</span>
            <ArrowRight className="h-4 w-4" />
          </LocalizedLink>
        </Button>
        <Button asChild variant="outline" size="lg">
          <LocalizedLink href="/destinations">Explore Destinations</LocalizedLink>
        </Button>
      </div>
    </div>
  );
}
