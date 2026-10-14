import { Metadata } from "next";
import { client } from "@/sanity/client";
import { DESTINATIONS_PAGE_QUERY } from "@/sanity/queries/destination.queries";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { DestinationsClientView } from "@/components/destination/DestinationsClientView";
import { Locale, defaultLocale, isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isValidLocale(locale) ? locale : defaultLocale;
  const isNl = activeLocale === "nl";

  let pageData: any = null;
  try {
    pageData = await client.fetch(DESTINATIONS_PAGE_QUERY, { language: activeLocale });
  } catch {
    // fallback
  }

  const title =
    pageData?.seo?.metaTitle ||
    pageData?.title ||
    (isNl ? "Alle Bestemmingen & Expedities" : "All Destinations & Expeditions");
  const description =
    pageData?.seo?.metaDescription ||
    (isNl
      ? "Ontdek onze unieke wildernisbestemmingen in Midden-Amerika, Afrika, Europa en Azië."
      : "Explore our complete collection of wilderness destinations across Central America, Africa, Europe, and Asia.");

  return {
    title,
    description,
    alternates: {
      canonical: `/${activeLocale}/destinations`,
      languages: {
        "nl-NL": "/nl/destinations",
        "en-US": "/en/destinations",
        "x-default": "/nl/destinations",
      },
    },
  };
}

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  const dict = getDictionary(activeLocale);
  const isNl = activeLocale === "nl";

  let data: any = null;
  try {
    data = await client.fetch(DESTINATIONS_PAGE_QUERY, { language: activeLocale });
  } catch (error) {
    console.error("Failed to fetch destinations page:", error);
  }

  const allDestinations = data?.allDestinations || [
    {
      _id: "dest-1",
      title: "Costa Rica",
      slug: "costa-rica",
      tagline: isNl ? "Vulkanen, nevelwouden en ongerepte Pacifische stranden" : "Volcanoes, misty cloud forests, and secluded Pacific beaches",
      region: isNl ? "Midden-Amerika" : "central-america",
      summary: isNl ? "Wereldhoofdstad van biodiversiteit, nationale parken en eco-lodges." : "A world capital of biodiversity, national parks, and eco-lodges.",
      tripCount: 4,
    },
    {
      _id: "dest-2",
      title: isNl ? "Noorwegen & Spitsbergen" : "Norway & Svalbard",
      slug: "norway",
      tagline: isNl ? "Fjorden, noorderlicht en arctische wildlife expedities" : "Fjords, northern lights, and arctic wildlife expeditions",
      region: isNl ? "Europa & Arctisch" : "europe-arctic",
      summary: isNl ? "Dramatische gletsjerlandschappen en ontmoetingen met ijsberen." : "Dramatic landscapes carved by glaciers with polar bear encounters.",
      tripCount: 3,
    },
    {
      _id: "dest-3",
      title: "Namibië",
      slug: "namibia",
      tagline: isNl ? "Torenhoge rode zandduinen, sterrenhemels en woestijnsafari's" : "Towering red dunes, dark sky reserves, and desert wildlife",
      region: isNl ? "Afrika" : "africa",
      summary: isNl ? "Eindeloze woestijnhorizons en intieme safari's in Etosha." : "Endless desert horizons and intimate wildlife safaris in Etosha.",
      tripCount: 2,
    },
  ];

  const heroBadge = typeof data?.hero?.badge === "string" ? data.hero.badge : (isNl ? "Ontdek De Wildernis" : "Explore The Wild");
  const heroHeading = typeof data?.hero?.heading === "string" ? data.hero.heading : (isNl ? "Waar leidt jouw volgende reis naartoe?" : "Where Does Your Next Adventure Lead?");
  const heroSubheading = typeof data?.hero?.subheading === "string" ? data.hero.subheading : (isNl
    ? "Bekijk onze met zorg samengestelde bestemmingen. Elk land biedt kleinschalige groepsreizen en op maat gemaakte privéreizen."
    : "Browse our curated wilderness destinations. Each country offers hand-crafted group expeditions and private custom routes.");

  return (
    <div>
      <HeroBlock
        badge={heroBadge}
        heading={heroHeading}
        subheading={heroSubheading}
        layoutStyle="compact"
      />

      <div className="pt-12">
        <DestinationsClientView destinations={allDestinations} />
      </div>
    </div>
  );
}
