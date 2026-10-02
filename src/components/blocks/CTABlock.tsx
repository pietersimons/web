import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SanityImage } from "@/components/shared/SanityImage";
import { ArrowRight, Compass } from "lucide-react";

interface CTABlockProps {
  badge?: string;
  heading: string;
  description?: string;
  backgroundImage?: any;
  primaryButton?: { label?: string; url?: string };
  secondaryButton?: { label?: string; url?: string };
  theme?: "dark" | "accent" | "light";
}

export function CTABlock({
  badge,
  heading,
  description,
  backgroundImage,
  primaryButton,
  secondaryButton,
  theme = "dark",
}: CTABlockProps) {
  const isDark = theme === "dark";
  const isAccent = theme === "accent";

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div
          className={`relative overflow-hidden rounded-3xl p-8 sm:p-14 lg:p-16 border shadow-2xl ${
            isDark
              ? "bg-primary text-primary-foreground border-border"
              : isAccent
                ? "bg-gradient-to-br from-amber-600 via-amber-700 to-primary text-white border-amber-500/30"
                : "bg-card text-card-foreground border-border"
          }`}
        >
          {/* Background image if present */}
          {backgroundImage?.asset && (
            <div className="absolute inset-0 z-0">
              <SanityImage
                image={backgroundImage}
                alt={heading}
                width={1600}
                height={800}
                className="w-full h-full object-cover opacity-25 brightness-75 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 max-w-2xl">
            {badge && (
              <Badge
                variant={isDark ? "accent" : "default"}
                className="mb-4 inline-flex items-center gap-1.5 shadow-sm"
              >
                <Compass className="h-3 w-3" />
                {badge}
              </Badge>
            )}

            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.15]">
              {heading}
            </h2>

            {description && (
              <p
                className={`mt-4 text-base sm:text-lg leading-relaxed ${
                  isDark ? "text-primary-foreground/85" : "text-muted-foreground"
                }`}
              >
                {description}
              </p>
            )}

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              {primaryButton?.label && primaryButton?.url && (
                <Button asChild variant="accent" size="lg">
                  <Link href={primaryButton.url} className="flex items-center gap-2">
                    {primaryButton.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}

              {secondaryButton?.label && secondaryButton?.url && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={
                    isDark
                      ? "bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                      : ""
                  }
                >
                  <Link href={secondaryButton.url}>{secondaryButton.label}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
