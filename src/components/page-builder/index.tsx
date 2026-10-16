import { HeroBlock } from "@/components/blocks/HeroBlock";
import { FeaturesBlock } from "@/components/blocks/FeaturesBlock";
import { ItineraryGridBlock } from "@/components/blocks/ItineraryGridBlock";
import { DestinationGridBlock } from "@/components/blocks/DestinationGridBlock";
import { ProcessStepsBlock } from "@/components/blocks/ProcessStepsBlock";
import { RichTextBlock } from "@/components/blocks/RichTextBlock";
import { GalleryBlock } from "@/components/blocks/GalleryBlock";
import { FAQBlock } from "@/components/blocks/FAQBlock";
import { TestimonialsBlock } from "@/components/blocks/TestimonialsBlock";
import { CTABlock } from "@/components/blocks/CTABlock";
import { Locale } from "@/lib/i18n/config";

interface PageBuilderProps {
  blocks?: any[];
  locale?: Locale;
}

export function PageBuilder({ blocks, locale }: PageBuilderProps) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        const key = block._key || block._type;

        switch (block._type) {
          case "hero":
            return <HeroBlock key={key} {...block} />;
          case "featuresBlock":
            return <FeaturesBlock key={key} {...block} />;
          case "itineraryGrid":
            return <ItineraryGridBlock key={key} {...block} locale={locale} />;
          case "destinationGrid":
            return <DestinationGridBlock key={key} {...block} />;
          case "processStepsBlock":
            return <ProcessStepsBlock key={key} {...block} />;
          case "richTextBlock":
            return (
              <RichTextBlock
                key={key}
                {...block}
                asH1={index === 0 && blocks[0]?._type === "richTextBlock"}
              />
            );
          case "galleryBlock":
            return <GalleryBlock key={key} {...block} />;
          case "faqBlock":
            return <FAQBlock key={key} {...block} />;
          case "testimonialsBlock":
            return <TestimonialsBlock key={key} {...block} />;
          case "ctaBlock":
            return <CTABlock key={key} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
