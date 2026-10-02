import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SanityImage } from "@/components/shared/SanityImage";
import { ArrowRight, Compass } from "lucide-react";

interface HeroBlockProps {
  badge?: string;
  heading: string;
  subheading?: string;
  backgroundImage?: any;
  videoUrl?: string;
  primaryCta?: { label?: string; url?: string };
  secondaryCta?: { label?: string; url?: string };
  layoutStyle?: "fullscreen" | "split" | "compact";
}

export function HeroBlock({
  badge,
  heading,
  subheading,
  backgroundImage,
  primaryCta,
  secondaryCta,
  layoutStyle = "fullscreen",
}: HeroBlockProps) {
  if (layoutStyle === "compact") {
    return (
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-20 lg:py-28">
        {backgroundImage?.asset && (
          <div className="absolute inset-0 z-0 opacity-20">
            <SanityImage
              image={backgroundImage}
              alt={heading}
              width={1920}
              height={600}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="container relative z-10 mx-auto px-4 max-w-5xl text-center">
          {badge && (
            <Badge variant="accent" className="mb-4">
              {badge}
            </Badge>
          )}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            {heading}
          </h1>
          {subheading && (
            <p className="mt-4 text-base sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
              {subheading}
            </p>
          )}
        </div>
      </section>
    );
  }

  if (layoutStyle === "split") {
    return (
      <section className="relative overflow-hidden py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              {badge && (
                <div className="inline-flex items-center gap-2">
                  <Compass className="h-4 w-4 text-accent" />
                  <Badge variant="outline" className="text-accent border-accent/30 font-semibold">
                    {badge}
                  </Badge>
                </div>
              )}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                {heading}
              </h1>
              {subheading && (
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                  {subheading}
                </p>
              )}
              <div className="flex flex-wrap gap-4 pt-2">
                {primaryCta?.label && primaryCta?.url && (
                  <Button asChild variant="accent" size="lg">
                    <Link href={primaryCta.url}>
                      {primaryCta.label}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {secondaryCta?.label && secondaryCta?.url && (
                  <Button asChild variant="outline" size="lg">
                    <Link href={secondaryCta.url}>{secondaryCta.label}</Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="lg:col-span-6">
              {backgroundImage?.asset && (
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border">
                  <SanityImage
                    image={backgroundImage}
                    alt={heading}
                    width={1000}
                    height={750}
                    priority
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fullscreen Hero (Default)
  return (
    <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden bg-primary text-primary-foreground">
      {/* Background Image with Dark Forest Overlay */}
      {backgroundImage?.asset && (
        <div className="absolute inset-0 z-0">
          <SanityImage
            image={backgroundImage}
            alt={heading}
            width={2000}
            height={1200}
            priority
            className="h-full w-full object-cover brightness-75 scale-105 animate-in fade-in zoom-in-95 duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-primary/40 to-black/30" />
        </div>
      )}

      <div className="container relative z-10 mx-auto px-4 py-24 sm:py-32 max-w-5xl text-center flex flex-col items-center">
        {badge && (
          <Badge
            variant="accent"
            className="mb-6 px-4 py-1.5 text-xs sm:text-sm tracking-wider shadow-lg uppercase"
          >
            {badge}
          </Badge>
        )}
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] drop-shadow-md max-w-4xl">
          {heading}
        </h1>
        {subheading && (
          <p className="mt-6 text-lg sm:text-2xl text-primary-foreground/90 max-w-2xl font-light leading-relaxed drop-shadow-sm">
            {subheading}
          </p>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {primaryCta?.label && primaryCta?.url && (
            <Button asChild variant="accent" size="lg">
              <Link href={primaryCta.url} className="flex items-center gap-2">
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {secondaryCta?.label && secondaryCta?.url && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
            >
              <Link href={secondaryCta.url}>{secondaryCta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
