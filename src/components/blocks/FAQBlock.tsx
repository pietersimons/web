import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer";

interface FAQItem {
  question: string;
  answer: any;
}

interface FAQBlockProps {
  badge?: string;
  heading: string;
  subheading?: string;
  items: FAQItem[];
}

export function FAQBlock({
  badge,
  heading,
  subheading,
  items = [],
}: FAQBlockProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-muted/30 border-y border-border/40">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
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

        {/* Accordion List */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-8 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className={index === items.length - 1 ? "border-b-0" : ""}>
                <AccordionTrigger className="text-left text-base sm:text-lg font-bold py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  <PortableTextRenderer value={item.answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
