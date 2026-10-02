import { defineQuery } from "next-sanity";
import {
  IMAGE_PROJECTION,
  SEO_PROJECTION,
  ITINERARY_CARD_PROJECTION,
} from "./fragments";

export const DESTINATIONS_PAGE_QUERY = defineQuery(`
  *[_type == "destinationsPage"][0] {
    _id,
    "title": coalesce(title[$language], title.nl, title.en, title),
    hero {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading),
      backgroundImage {
        ${IMAGE_PROJECTION}
      }
    },
    featuredDestinations[]->{
      _id,
      "title": coalesce(title[$language], title.nl, title.en, title),
      "slug": slug.current,
      "tagline": coalesce(tagline[$language], tagline.nl, tagline.en, tagline),
      region,
      featuredImage {
        ${IMAGE_PROJECTION}
      },
      "tripCount": count(*[_type == "itinerary" && references(^._id)])
    },
    filterSettings,
    ${SEO_PROJECTION},
    "allDestinations": *[_type == "destination"] | order(featured desc, title.nl asc, title asc) {
      _id,
      "title": coalesce(title[$language], title.nl, title.en, title),
      "slug": slug.current,
      "tagline": coalesce(tagline[$language], tagline.nl, tagline.en, tagline),
      region,
      featuredImage {
        ${IMAGE_PROJECTION}
      },
      "summary": coalesce(summary[$language], summary.nl, summary.en, summary),
      "tripCount": count(*[_type == "itinerary" && references(^._id)])
    }
  }
`);

export const DESTINATION_DETAIL_QUERY = defineQuery(`
  *[_type == "destination" && slug.current == $slug][0] {
    _id,
    _type,
    "title": coalesce(title[$language], title.nl, title.en, title),
    "slug": slug.current,
    "tagline": coalesce(tagline[$language], tagline.nl, tagline.en, tagline),
    region,
    featuredImage {
      ${IMAGE_PROJECTION}
    },
    gallery[] {
      ${IMAGE_PROJECTION},
      "caption": coalesce(caption[$language], caption.nl, caption.en, caption)
    },
    "summary": coalesce(summary[$language], summary.nl, summary.en, summary),
    "overview": coalesce(overview[$language], overview.nl, overview.en, overview),
    travelGuide {
      "bestTimeToVisit": coalesce(bestTimeToVisit[$language], bestTimeToVisit.nl, bestTimeToVisit.en, bestTimeToVisit),
      "climate": coalesce(climate[$language], climate.nl, climate.en, climate),
      "currency": coalesce(currency[$language], currency.nl, currency.en, currency),
      "visaInfo": coalesce(visaInfo[$language], visaInfo.nl, visaInfo.en, visaInfo),
      "languages": coalesce(languages[$language], languages.nl, languages.en, languages),
      "timeZone": coalesce(timeZone[$language], timeZone.nl, timeZone.en, timeZone)
    },
    "itineraries": *[_type == "itinerary" && references(^._id)] | order(featured desc, _createdAt desc) {
      ${ITINERARY_CARD_PROJECTION}
    },
    ${SEO_PROJECTION}
  }
`);

export const ALL_DESTINATIONS_SLUGS_QUERY = defineQuery(`
  *[_type == "destination" && defined(slug.current)] {
    "slug": slug.current
  }
`);
