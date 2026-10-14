import { Metadata } from "next";
import { client } from "@/sanity/client";
import { HOME_PAGE_QUERY } from "@/sanity/queries/pages.queries";
import { PageBuilder } from "@/components/page-builder";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { FeaturesBlock } from "@/components/blocks/FeaturesBlock";
import { DestinationGridBlock } from "@/components/blocks/DestinationGridBlock";
import { ProcessStepsBlock } from "@/components/blocks/ProcessStepsBlock";
import { CTABlock } from "@/components/blocks/CTABlock";
import { Locale, defaultLocale, isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizePath } from "@/lib/i18n/navigation";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isValidLocale(locale) ? locale : defaultLocale;
  const isNl = activeLocale === "nl";

  let homeData: any = null;
  try {
    homeData = await client.fetch(HOME_PAGE_QUERY, { language: activeLocale });
  } catch {
    // fallback
  }

  const title =
    homeData?.seo?.metaTitle ||
    (isNl
      ? "Travelwild — Kleinschalige & Duurzame Avontuurlijke Reizen"
      : "Travelwild — Authentic Small-Group & Custom Expeditions");
  const description =
    homeData?.seo?.metaDescription ||
    (isNl
      ? "Duurzame groepsreizen en op maat gemaakte wildernisexpedities naar de mooiste plekken ter wereld."
      : "Immersive, sustainable small group tours and bespoke tailor-made wilderness adventures across the globe.");

  return {
    title,
    description,
    alternates: {
      canonical: `/${activeLocale}`,
      languages: {
        "nl-NL": "/nl",
        "en-US": "/en",
        "x-default": "/nl",
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  const dict = getDictionary(activeLocale);

  let homeData = null;
  try {
    homeData = await client.fetch(HOME_PAGE_QUERY, { language: activeLocale });
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
  }

  // If editor has added sections in Sanity, render with PageBuilder
  if (homeData?.pageBuilder && homeData.pageBuilder.length > 0) {
    return <PageBuilder blocks={homeData.pageBuilder} locale={activeLocale} />;
  }

  // Localized default showcase
  const isNl = activeLocale === "nl";

  return (
    <div>
      <HeroBlock
        heading={isNl ? "AVONTUUR.\nECHT. PUUR.\nOP JOUW MAAT." : "ADVENTURE.\nAUTHENTIC. PURE.\nTAILORED TO YOU."}
        subheading={
          isNl
            ? "Unieke wandel-, duik- en alpinismereizen naar de meest indrukwekkende plekken ter wereld. Kleinschalig. Authentiek. Avontuurlijk."
            : "Unique hiking, diving and mountaineering expeditions to the most awe-inspiring places on Earth. Small-scale. Authentic. Adventurous."
        }
        primaryCta={{ label: isNl ? "ONTDEK ONZE REIZEN" : "DISCOVER OUR EXPEDITIONS", url: localizePath("/destinations", activeLocale) }}
        secondaryCta={{ label: isNl ? "REIZEN OP MAAT" : "TAILOR-MADE EXPEDITIONS", url: localizePath("/travel-on-demand", activeLocale) }}
        layoutStyle="fullscreen"
      />

      <FeaturesBlock
        layoutStyle="bar"
        backgroundColor="subtle"
        items={[
          {
            title: isNl ? "KLEINE GROEPEN" : "SMALL GROUPS",
            description: isNl ? "Max. 12 personen" : "Max. 12 travelers",
            icon: "users",
          },
          {
            title: isNl ? "EXPERT BEGELEIDING" : "EXPERT GUIDANCE",
            description: isNl ? "Ervaren gidsen" : "Experienced guides",
            icon: "mountain",
          },
          {
            title: isNl ? "REIZEN OP MAAT" : "TAILOR-MADE TRIPS",
            description: isNl ? "100% afgestemd op jou" : "100% tailored to you",
            icon: "compass",
          },
          {
            title: isNl ? "LOKALE PARTNERS" : "LOCAL PARTNERS",
            description: isNl ? "Duurzaam & authentiek" : "Sustainable & authentic",
            icon: "leaf",
          },
          {
            title: isNl ? "AVONTUUR & VEILIGHEID" : "ADVENTURE & SAFETY",
            description: isNl ? "Jouw ervaring, onze zorg" : "Your journey, our care",
            icon: "shield",
          },
        ]}
      />

      <DestinationGridBlock
        badge={isNl ? "Waar ga jij heen?" : "Where to Next?"}
        heading={isNl ? "Uitgelichte Wildernisbestemmingen" : "Featured Wilderness Destinations"}
        subheading={
          isNl
            ? "Zorgvuldig geselecteerde bestemmingen met ongeëvenaarde biodiversiteit, wilde dieren en onvergetelijke routes."
            : "Hand-picked regions offering rich biodiversity, rare wildlife, and unforgettable trails."
        }
        layout="bento"
        destinations={[
          {
            _id: "dest-1",
            title: "Costa Rica",
            slug: "costa-rica",
            tagline: isNl
              ? "Vulkanen, nevelwouden en verlaten Pacifische stranden"
              : "Volcanoes, misty cloud forests, and secluded Pacific beaches",
            region: isNl ? "Midden-Amerika" : "Central America",
            tripCount: 4,
          },
          {
            _id: "dest-2",
            title: isNl ? "Noorwegen & Spitsbergen" : "Norway & Svalbard",
            slug: "norway",
            tagline: isNl
              ? "Fjorden, noorderlicht en arctische wildlife expedities"
              : "Fjords, northern lights, and arctic wildlife expeditions",
            region: isNl ? "Europa & Arctisch" : "Europe & Arctic",
            tripCount: 3,
          },
          {
            _id: "dest-3",
            title: "Namibië",
            slug: "namibia",
            tagline: isNl
              ? "Torenhoge rode zandduinen, sterrenhemels en woestijnleeuwen"
              : "Towering red dunes, dark sky reserves, and desert-adapted lions",
            region: isNl ? "Afrika" : "Africa",
            tripCount: 2,
          },
        ]}
      />

      <ProcessStepsBlock
        badge={isNl ? "De Travelwild Filosofie" : "The Travelwild Way"}
        heading={isNl ? "Hoe wij anders reizen" : "How We Travel Differently"}
        subheading={
          isNl
            ? "Wij bouwen duurzame, impactvolle avonturen met respect voor natuur en lokale gemeenschappen."
            : "We build sustainable, immersive adventures with local community respect at the core."
        }
        steps={[
          {
            stepNumber: 1,
            title: isNl ? "Kleine Groepen (Max 12)" : "Small Groups (Max 12)",
            description: isNl
              ? "Geen grote bussen. Intieme groepen die weinig impact hebben en op afgelegen plekken komen."
              : "No massive tour buses. Intimate groups that tread lightly and reach secluded places.",
            icon: "users",
          },
          {
            stepNumber: 2,
            title: isNl ? "Lokale Gidsen & Experts" : "Expert Local Guides",
            description: isNl
              ? "Inheemse natuurgidsen en wildlife-trackers die elk verborgen pad en verhaal kennen."
              : "Native naturalists and wildlife trackers who know every hidden valley and story.",
            icon: "compass",
          },
          {
            stepNumber: 3,
            title: isNl ? "Unieke Eco Lodges" : "Hand-Picked Eco Lodges",
            description: isNl
              ? "Sfeervolle boetiekverblijven, afgelegen tentenkampen en duurzame lodges in de jungle."
              : "Unique boutique stays, remote tented camps, and sustainable rainforest lodges.",
            icon: "map-pin",
          },
          {
            stepNumber: 4,
            title: isNl ? "100% Maatwerk Mogelijk" : "100% Tailor-Made Ready",
            description: isNl
              ? "Liever eigen reisdata of een aangepaste route? Wij stellen jouw droomreis samen."
              : "Want private dates or a custom route? We build bespoke itineraries for you.",
            icon: "shieldCheck",
          },
        ]}
      />

      <CTABlock
        badge={isNl ? "Begin met Plannen" : "Start Planning"}
        heading={isNl ? "Klaar voor je volgende grote avontuur?" : "Ready for your next great adventure?"}
        description={
          isNl
            ? "Spreek met een reisspecialist of vraag een vrijblijvend reisvoorstel op maat aan."
            : "Speak with an expedition specialist or request a custom itinerary proposal crafted exclusively for you."
        }
        primaryButton={{ label: dict.common.travelOnDemand, url: localizePath("/travel-on-demand", activeLocale) }}
        secondaryButton={{ label: dict.common.allDestinations, url: localizePath("/destinations", activeLocale) }}
        theme="dark"
      />
    </div>
  );
}
