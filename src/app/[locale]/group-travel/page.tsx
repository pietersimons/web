import { Metadata } from "next";
import { sanityFetch } from "@/sanity/live";
import { GROUP_TRAVEL_PAGE_QUERY } from "@/sanity/queries/pages.queries";
import { ALL_GROUP_TRIPS_QUERY } from "@/sanity/queries/itinerary.queries";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { PageBuilder } from "@/components/page-builder";
import { ItineraryCard } from "@/components/itinerary/ItineraryCard";
import { ProcessStepsBlock } from "@/components/blocks/ProcessStepsBlock";
import { CTABlock } from "@/components/blocks/CTABlock";
import { Badge } from "@/components/ui/badge";
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

  let pageData: any = null;
  try {
    const res = await sanityFetch({
      query: GROUP_TRAVEL_PAGE_QUERY,
      params: { language: activeLocale },
      stega: false,
    });
    pageData = res.data;
  } catch {
    // fallback
  }

  const title = pageData?.seo?.metaTitle || pageData?.title || (isNl ? "Kleinschalige Groepsreizen & Vertrekdata" : "Small Group Expeditions & Departures");
  const description = pageData?.seo?.metaDescription || (isNl
    ? "Reis in kleine groepen (max 12 reizigers) onder leiding van lokale natuurgidsen. Gegarandeerde vertrekdata en solo-reiziger vriendelijk."
    : "Join small groups (max 12 travelers) led by native expert naturalists. Guaranteed departure dates and solo traveler friendly.");

  return {
    title,
    description,
    alternates: {
      canonical: `/${activeLocale}/group-travel`,
      languages: {
        "nl-NL": "/nl/group-travel",
        "en-US": "/en/group-travel",
        "x-default": "/nl/group-travel",
      },
    },
  };
}

export default async function GroupTravelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  const dict = getDictionary(activeLocale);
  const isNl = activeLocale === "nl";

  let pageData: any = null;
  let groupTrips: any[] = [];

  try {
    const [pageRes, tripsRes] = await Promise.all([
      sanityFetch({
        query: GROUP_TRAVEL_PAGE_QUERY,
        params: { language: activeLocale },
      }),
      sanityFetch({
        query: ALL_GROUP_TRIPS_QUERY,
        params: { language: activeLocale },
      }),
    ]);
    pageData = pageRes.data;
    groupTrips = tripsRes.data;
  } catch (error) {
    console.error("Failed to load group travel page:", error);
  }

  const heroBadge = typeof pageData?.hero?.badge === "string" ? pageData.hero.badge : (isNl ? "Kleine Groepen (Max 12)" : "Small Groups (Max 12)");
  const heroHeading = typeof pageData?.hero?.heading === "string" ? pageData.hero.heading : (isNl ? "Intieme Groepsreizen Vol Avontuur" : "Immersive Small Group Adventures");
  const heroSubheading = typeof pageData?.hero?.subheading === "string" ? pageData.hero.subheading : (isNl
    ? "Reis samen met gelijkgestemde avonturiers onder leiding van lokale natuurgidsen, met overnachtingen in unieke eco-lodges."
    : "Travel alongside like-minded adventurers with native naturalist guides, hand-picked eco-lodges, and intimate wildlife encounters.");

  const fallbackSteps = [
    {
      stepNumber: 1,
      title: isNl ? "Maximaal 12 Deelnemers" : "Strictly Max 12 People",
      description: isNl
        ? "Kleine voetafdruk zorgt voor diepere wildlife-ontmoetingen, flexibel tempo en toegang tot kleinschalige lodges."
        : "Small footprints allow deeper wildlife encounters, flexible pacing, and access to boutique lodges.",
      icon: "users",
    },
    {
      stepNumber: 2,
      title: isNl ? "Solo Reizigers Welkom" : "Solo Traveler Welcoming",
      description: isNl
        ? "Reis solo zonder verplichte eenpersoonstoeslag wanneer je een kamer deelt met een reiziger van hetzelfde geslacht."
        : "Join as a solo adventurer without mandatory single supplements when paired with same-gender roommates.",
      icon: "compass",
    },
    {
      stepNumber: 3,
      title: isNl ? "Gegarandeerd Vertrek" : "Guaranteed Departures",
      description: isNl
        ? "Zodra het minimum aantal reizigers is bereikt, is je vertrek gegarandeerd zonder zorgen over annuleringen."
        : "Once minimum numbers are reached, your departure is locked in with zero cancellation worries.",
      icon: "calendar",
    },
    {
      stepNumber: 4,
      title: isNl ? "Lokale Natuurgidsen" : "Expert Local Naturalists",
      description: isNl
        ? "Elke groep wordt geleid door gepassioneerde lokale specialisten met hart voor natuurbescherming."
        : "Every group is led by local specialists passionate about conservation and regional culture.",
      icon: "shieldCheck",
    },
  ];

  const introBadge = pageData?.introPhilosophy?.badge || (isNl ? "Waarom Travelwild Groepen?" : "Why Travelwild Groups?");
  const introHeading = pageData?.introPhilosophy?.heading || (isNl ? "Het Verschil van Reizen in Kleine Groepen" : "The Small Group Difference");
  const introSubheading = pageData?.introPhilosophy?.subheading || (isNl
    ? "Ervaar ongerepte natuur met échte connectie en zonder enig massatoerisme-gevoel."
    : "Experience wild destinations with authentic connection and zero mass-tourism feel.");
  const introSteps = pageData?.introPhilosophy?.benefits?.length > 0 ? pageData.introPhilosophy.benefits : fallbackSteps;

  const tripsBadge = typeof pageData?.tripsSection?.badge === "string"
    ? pageData.tripsSection.badge
    : (isNl ? "Aankomende Seizoenen" : "Upcoming Seasons");
  const tripsHeading = typeof pageData?.tripsSection?.heading === "string"
    ? pageData.tripsSection.heading
    : (isNl ? "Onze Groepsrondreizen" : "Small Group Itineraries");
  const tripsSubheading = typeof pageData?.tripsSection?.subheading === "string"
    ? pageData.tripsSection.subheading
    : (isNl
        ? "Bekijk geplande groepsvertrekken met gegarandeerde vertrekdata. Solo-reizigers zijn altijd van harte welkom."
        : "Explore scheduled group departures with guaranteed dates. Solo travelers are always welcome.");

  return (
    <div>
      <HeroBlock
        badge={heroBadge}
        heading={heroHeading}
        subheading={heroSubheading}
        backgroundImage={pageData?.hero?.backgroundImage}
        layoutStyle={pageData?.hero?.layoutStyle || "compact"}
        primaryCta={pageData?.hero?.primaryCta?.label ? pageData.hero.primaryCta : { label: isNl ? "Bekijk Groepsreizen" : "Explore Group Trips", url: "#trips-grid" }}
        secondaryCta={pageData?.hero?.secondaryCta}
      />

      {/* Group Trips Grid */}
      <section id="trips-grid" className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-7xl space-y-12">
          <div className="max-w-2xl">
            {tripsBadge && (
              <Badge variant="accent" className="mb-3">
                {tripsBadge}
              </Badge>
            )}
            <h2 className="font-hero text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wide text-foreground">
              {tripsHeading}
            </h2>
            {tripsSubheading && (
              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                {tripsSubheading}
              </p>
            )}
          </div>

          {groupTrips && groupTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {groupTrips.map((trip: any) => (
                <ItineraryCard key={trip._id} {...trip} locale={activeLocale} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              {isNl ? "Er zijn momenteel geen groepsreizen gepland. Kom snel terug!" : "No group itineraries scheduled yet. Check back soon!"}
            </div>
          )}
        </div>
      </section>

      {/* Group Philosophy / Benefits */}
      <ProcessStepsBlock
        badge={introBadge}
        heading={introHeading}
        subheading={introSubheading}
        steps={introSteps}
      />

      {pageData?.pageBuilder && <PageBuilder blocks={pageData.pageBuilder} locale={activeLocale} />}

      <CTABlock
        badge={isNl ? "Eigen Reisperiode?" : "Custom Dates Available"}
        heading={isNl ? "Liever reizen met je eigen besloten gezelschap?" : "Prefer to travel with your own private group?"}
        description={
          isNl
            ? "Elke groepsreis kan worden omgezet in een privéreis voor vrienden, familie of fotoclubs."
            : "Every group itinerary can be adapted into a private trip for friends, family, or photography clubs."
        }
        primaryButton={{ label: isNl ? "Vraag Maatwerkreis Aan" : "Request Private Custom Route", url: localizePath("/travel-on-demand", activeLocale) }}
        theme="dark"
      />
    </div>
  );
}
