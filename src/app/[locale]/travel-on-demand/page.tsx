import { Metadata } from "next";
import { sanityFetch } from "@/sanity/live";
import {
  TRAVEL_ON_DEMAND_PAGE_QUERY,
  FORMS_CONFIGURATION_QUERY,
} from "@/sanity/queries/pages.queries";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { ProcessStepsBlock } from "@/components/blocks/ProcessStepsBlock";
import { CustomTripInquiryForm } from "@/components/forms/CustomTripInquiryForm";
import { PageBuilder } from "@/components/page-builder";
import { Locale, defaultLocale, isValidLocale } from "@/lib/i18n/config";

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
      query: TRAVEL_ON_DEMAND_PAGE_QUERY,
      params: { language: activeLocale },
      stega: false,
    });
    pageData = res.data;
  } catch {
    // fallback to defaults
  }

  const title = pageData?.seo?.metaTitle || pageData?.title || (isNl ? "Maatwerkreizen — 100% Jouw Droomreis" : "Travel on Demand — Custom Tailor-Made Expeditions");
  const description = pageData?.seo?.metaDescription || (isNl
    ? "Ontwerp een 100% op maat gemaakte wildernisreis met onze bestemmingsspecialisten. Privégidsen, flexibele data en unieke routes."
    : "Design 100% bespoke wilderness journeys with our destination specialists. Private guides, flexible dates, and custom routing.");

  return {
    title,
    description,
    alternates: {
      canonical: `/${activeLocale}/travel-on-demand`,
      languages: {
        "nl-NL": "/nl/travel-on-demand",
        "en-US": "/en/travel-on-demand",
        "x-default": "/nl/travel-on-demand",
      },
    },
  };
}

export default async function TravelOnDemandPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  const isNl = activeLocale === "nl";

  let pageData: any = null;
  let formsConfig: any = null;

  try {
    const [pageRes, formsRes] = await Promise.all([
      sanityFetch({
        query: TRAVEL_ON_DEMAND_PAGE_QUERY,
        params: { language: activeLocale },
      }),
      sanityFetch({
        query: FORMS_CONFIGURATION_QUERY,
        params: { language: activeLocale },
      }),
    ]);
    pageData = pageRes.data;
    formsConfig = formsRes.data;
  } catch (error) {
    console.error("Failed to load travel on demand page:", error);
  }

  const heroBadge = typeof pageData?.hero?.badge === "string" ? pageData.hero.badge : (isNl ? "100% Maatwerk Avonturen" : "100% Bespoke Adventures");
  const heroHeading = typeof pageData?.hero?.heading === "string" ? pageData.hero.heading : (isNl ? "Jouw Droomreis, Exclusief Voor Jou Samengesteld" : "Your Journey, Crafted Exclusively For You");
  const heroSubheading = typeof pageData?.hero?.subheading === "string" ? pageData.hero.subheading : (isNl
    ? "Of je nu droomt van een actieve vulkaantrek, een wildlife safari per boot of een exclusieve gezinsreis: wij bouwen de perfecte route."
    : "Whether you seek an active volcano trek, a secluded coastal wildlife safari, or a private family expedition, we design the perfect route.");

  const fallbackSteps = [
    {
      stepNumber: 1,
      title: isNl ? "1. Deel Je Reiswensen" : "1. Share Your Vision",
      description: isNl
        ? "Vul ons formulier in met je gewenste bestemming, reisperiode en favoriete reisstijl."
        : "Fill out our interactive inquiry form with your dream regions, travel dates, and activity preferences.",
      icon: "send",
    },
    {
      stepNumber: 2,
      title: isNl ? "2. Ontvang Een Reisvoorstel" : "2. Receive a Custom Proposal",
      description: isNl
        ? "Je persoonlijke specialist ontwerpt een dag-tot-dag route met bijzondere eco-lodges en gidsen."
        : "Your dedicated destination specialist drafts a day-by-day route with curated eco-lodges and private guides.",
      icon: "mapPin",
    },
    {
      stepNumber: 3,
      title: isNl ? "3. Finetunen & Perfectioneren" : "3. Refine & Perfect",
      description: isNl
        ? "Pas het reistempo aan, voeg extra excursies toe of upgrade lodges tot het helemaal klopt."
        : "Adjust day pacing, add optional wildlife activities, or upgrade stays until the itinerary is 100% your vision.",
      icon: "compass",
    },
    {
      stepNumber: 4,
      title: isNl ? "4. Zorgeloos Op Reis" : "4. Travel Hassle-Free",
      description: isNl
        ? "Vertrek met volledige gemoedsrust, 24/7 lokale ondersteuning en privéchauffeurs ter plaatse."
        : "Depart with complete peace of mind, 24/7 local support, and private transport throughout.",
      icon: "shieldCheck",
    },
  ];

  const processBadge = pageData?.processSection?.badge || (isNl ? "Hoe Maatwerk Werkt" : "How Tailor-Made Works");
  const processHeading = pageData?.processSection?.heading || (isNl ? "Van Wens tot Vertrek in 4 Stappen" : "From Dream to Departure in 4 Simple Steps");
  const processSubheading = pageData?.processSection?.subheading || (isNl
    ? "Werk samen met onze lokale specialisten om elke lodge, wandeling en activiteit perfect af te stemmen."
    : "Collaborate directly with native specialists to fine-tune every lodge, trail, and detail.");
  const processSteps = pageData?.processSection?.steps?.length > 0 ? pageData.processSection.steps : fallbackSteps;

  return (
    <div>
      <HeroBlock
        badge={heroBadge}
        heading={heroHeading}
        subheading={heroSubheading}
        backgroundImage={pageData?.hero?.backgroundImage}
        layoutStyle={pageData?.hero?.layoutStyle || "compact"}
        primaryCta={pageData?.hero?.primaryCta?.label ? pageData.hero.primaryCta : { label: isNl ? "Start Je Reisontwerp" : "Start Designing Your Trip", url: "#inquiry-form" }}
        secondaryCta={pageData?.hero?.secondaryCta}
      />

      {/* How It Works Steps */}
      <ProcessStepsBlock
        badge={processBadge}
        heading={processHeading}
        subheading={processSubheading}
        steps={processSteps}
        cta={pageData?.processSection?.cta}
      />

      {/* Interactive Custom Inquiry Form */}
      <CustomTripInquiryForm
        heading={typeof pageData?.inquiryFormIntro?.heading === "string" ? pageData.inquiryFormIntro.heading : undefined}
        subheading={typeof pageData?.inquiryFormIntro?.subheading === "string" ? pageData.inquiryFormIntro.subheading : undefined}
        locale={activeLocale}
        formConfig={formsConfig?.customTripForm}
      />

      {pageData?.pageBuilder && <PageBuilder blocks={pageData.pageBuilder} locale={activeLocale} />}
    </div>
  );
}
