import { defineQuery } from "next-sanity";
import {
  IMAGE_PROJECTION,
  SEO_PROJECTION,
  ITINERARY_CARD_PROJECTION,
} from "./fragments";

export const ITINERARY_DETAIL_QUERY = defineQuery(`
  *[_type == "itinerary" && slug.current == $slug][0] {
    _id,
    _type,
    "title": coalesce(title[$language], title.nl, title.en, title),
    "slug": slug.current,
    "subtitle": coalesce(subtitle[$language], subtitle.nl, subtitle.en, subtitle),
    travelStyle,
    featured,
    tripSpecs {
      durationDays,
      durationNights,
      difficulty,
      "groupSize": coalesce(groupSize[$language], groupSize.nl, groupSize.en, groupSize),
      startLocation,
      endLocation,
      minimumAge
    },
    pricing {
      priceFrom,
      currency,
      "priceNote": coalesce(priceNote[$language], priceNote.nl, priceNote.en, priceNote)
    },
    featuredImage {
      ${IMAGE_PROJECTION}
    },
    gallery[] {
      ${IMAGE_PROJECTION},
      "caption": coalesce(caption[$language], caption.nl, caption.en, caption)
    },
    "summary": coalesce(summary[$language], summary.nl, summary.en, summary),
    "highlights": highlights[][coalesce(@[$language], @.nl, @.en, @)],
    dayByDay[] {
      _key,
      dayNumber,
      "title": coalesce(title[$language], title.nl, title.en, title),
      "location": coalesce(location[$language], location.nl, location.en, location),
      "description": coalesce(description[$language], description.nl, description.en, description),
      meals,
      accommodation {
        name,
        type,
        "notes": coalesce(notes[$language], notes.nl, notes.en, notes)
      },
      "includedActivities": includedActivities[][coalesce(@[$language], @.nl, @.en, @)],
      "optionalActivities": optionalActivities[][coalesce(@[$language], @.nl, @.en, @)],
      gallery[] {
        ${IMAGE_PROJECTION}
      }
    },
    stepByStepGuide[] {
      _key,
      stepNumber,
      "title": coalesce(title[$language], title.nl, title.en, title),
      "description": coalesce(description[$language], description.nl, description.en, description),
      icon,
      image {
        ${IMAGE_PROJECTION}
      }
    },
    inclusionsExclusions {
      "included": included[][coalesce(@[$language], @.nl, @.en, @)],
      "excluded": excluded[][coalesce(@[$language], @.nl, @.en, @)]
    },
    departures[] {
      _key,
      startDate,
      endDate,
      price,
      status,
      spotsLeft,
      guideName
    },
    faq[] {
      _key,
      "question": coalesce(question[$language], question.nl, question.en, question),
      "answer": coalesce(answer[$language], answer.nl, answer.en, answer)
    },
    destination->{
      _id,
      "title": coalesce(title[$language], title.nl, title.en, title),
      "slug": slug.current,
      region,
      featuredImage {
        ${IMAGE_PROJECTION}
      }
    },
    "relatedItineraries": *[_type == "itinerary" && destination._ref == ^.destination._ref && _id != ^._id][0...3] {
      ${ITINERARY_CARD_PROJECTION}
    },
    ${SEO_PROJECTION}
  }
`);

export const ALL_ITINERARIES_SLUGS_QUERY = defineQuery(`
  *[_type == "itinerary" && defined(slug.current)] {
    "slug": slug.current
  }
`);

export const ALL_GROUP_TRIPS_QUERY = defineQuery(`
  *[_type == "itinerary" && (travelStyle == "group" || travelStyle == "both")] | order(featured desc, _createdAt desc) {
    ${ITINERARY_CARD_PROJECTION},
    departures[] {
      startDate,
      endDate,
      status,
      price
    }
  }
`);
