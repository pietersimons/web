import { Badge } from "@/components/ui/badge";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer";

interface RichTextBlockProps {
  badge?: string;
  heading?: string;
  content: any;
  maxWidth?: "prose" | "wide" | "full";
  align?: "left" | "center";
  asH1?: boolean;
}

export function RichTextBlock({
  badge,
  heading,
  content,
  maxWidth = "prose",
  align = "left",
  asH1 = false,
}: RichTextBlockProps) {
  const maxWidthClass =
    maxWidth === "wide"
      ? "max-w-4xl"
      : maxWidth === "full"
        ? "max-w-6xl"
        : "max-w-3xl";

  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className={`container mx-auto px-4 ${maxWidthClass} ${alignClass}`}>
        {badge && (
          <Badge variant="accent" className="mb-3">
            {badge}
          </Badge>
        )}
        {heading &&
          (asH1 ? (
            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              {heading}
            </h1>
          ) : (
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-6">
              {heading}
            </h2>
          ))}
        <PortableTextRenderer value={content} />
      </div>
    </section>
  );
}
