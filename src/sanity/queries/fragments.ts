export const IMAGE_PROJECTION = `
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions {
        width,
        height,
        aspectRatio
      }
    }
  },
  alt,
  caption,
  hotspot,
  crop
`;

export const SEO_PROJECTION = `
  seo {
    "metaTitle": coalesce(metaTitle[$language], metaTitle.nl, metaTitle.en, metaTitle),
    "metaDescription": coalesce(metaDescription[$language], metaDescription.nl, metaDescription.en, metaDescription),
    shareImage {
      ${IMAGE_PROJECTION}
    }
  }
`;

export const ITINERARY_CARD_PROJECTION = `
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
    endLocation
  },
  pricing {
    priceFrom,
    currency,
    "priceNote": coalesce(priceNote[$language], priceNote.nl, priceNote.en, priceNote)
  },
  featuredImage {
    ${IMAGE_PROJECTION}
  },
  destination->{
    "title": coalesce(title[$language], title.nl, title.en, title),
    "slug": slug.current,
    region
  }
`;

export const PAGE_BUILDER_PROJECTION = `
  pageBuilder[] {
    _key,
    _type,
    // Hero Block
    _type == "hero" => {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading),
      backgroundImage {
        ${IMAGE_PROJECTION}
      },
      videoUrl,
      primaryCta {
        "label": coalesce(label[$language], label.nl, label.en, label),
        url
      },
      secondaryCta {
        "label": coalesce(label[$language], label.nl, label.en, label),
        url
      },
      layoutStyle
    },
    // Features & USPs Bar Block
    _type == "featuresBlock" => {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading),
      layoutStyle,
      backgroundColor,
      items[] {
        _key,
        "title": coalesce(title[$language], title.nl, title.en, title),
        "description": coalesce(description[$language], description.nl, description.en, description),
        iconType,
        icon,
        image {
          ${IMAGE_PROJECTION}
        },
        link
      }
    },
    // Itinerary Grid Block
    _type == "itineraryGrid" => {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading),
      displayMode,
      layout,
      viewAllLink {
        "label": coalesce(label[$language], label.nl, label.en, label),
        url
      },
      displayMode == "manual" => {
        selectedItineraries[]->{
          ${ITINERARY_CARD_PROJECTION}
        }
      },
      displayMode == "group" => {
        "itineraries": *[_type == "itinerary" && (travelStyle == "group" || travelStyle == "both")] | order(featured desc, _createdAt desc)[0...6] {
          ${ITINERARY_CARD_PROJECTION}
        }
      },
      displayMode == "on-demand" => {
        "itineraries": *[_type == "itinerary" && (travelStyle == "on-demand" || travelStyle == "both")] | order(featured desc, _createdAt desc)[0...6] {
          ${ITINERARY_CARD_PROJECTION}
        }
      },
      displayMode == "by-destination" => {
        "itineraries": *[_type == "itinerary" && destination._ref == ^.filterDestination._ref] | order(featured desc, _createdAt desc)[0...6] {
          ${ITINERARY_CARD_PROJECTION}
        }
      }
    },
    // Destination Grid Block
    _type == "destinationGrid" => {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading),
      layout,
      defined(destinations) => {
        destinations[]->{
          _id,
          "title": coalesce(title[$language], title.nl, title.en, title),
          "slug": slug.current,
          "tagline": coalesce(tagline[$language], tagline.nl, tagline.en, tagline),
          region,
          featuredImage {
            ${IMAGE_PROJECTION}
          },
          "tripCount": count(*[_type == "itinerary" && references(^._id)])
        }
      },
      !defined(destinations) => {
        "destinations": *[_type == "destination"] | order(featured desc, title.nl asc, title asc) {
          _id,
          "title": coalesce(title[$language], title.nl, title.en, title),
          "slug": slug.current,
          "tagline": coalesce(tagline[$language], tagline.nl, tagline.en, tagline),
          region,
          featuredImage {
            ${IMAGE_PROJECTION}
          },
          "tripCount": count(*[_type == "itinerary" && references(^._id)])
        }
      }
    },
    // Process Steps Block
    _type == "processStepsBlock" => {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading),
      steps[] {
        stepNumber,
        "title": coalesce(title[$language], title.nl, title.en, title),
        "description": coalesce(description[$language], description.nl, description.en, description),
        icon,
        image {
          ${IMAGE_PROJECTION}
        }
      },
      cta {
        "label": coalesce(label[$language], label.nl, label.en, label),
        url
      }
    },
    // Rich Text Block
    _type == "richTextBlock" => {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "content": coalesce(content[$language], content.nl, content.en, content),
      maxWidth,
      align
    },
    // Gallery Block
    _type == "galleryBlock" => {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading),
      layout,
      images[] {
        ${IMAGE_PROJECTION},
        location,
        "caption": coalesce(caption[$language], caption.nl, caption.en, caption)
      }
    },
    // FAQ Block
    _type == "faqBlock" => {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading),
      items[] {
        "question": coalesce(question[$language], question.nl, question.en, question),
        "answer": coalesce(answer[$language], answer.nl, answer.en, answer)
      }
    },
    // Testimonials Block
    _type == "testimonialsBlock" => {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading),
      testimonials[] {
        author,
        location,
        "tripTaken": coalesce(tripTaken[$language], tripTaken.nl, tripTaken.en, tripTaken),
        rating,
        "quote": coalesce(quote[$language], quote.nl, quote.en, quote),
        avatar {
          ${IMAGE_PROJECTION}
        }
      }
    },
    // CTA Block
    _type == "ctaBlock" => {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "description": coalesce(description[$language], description.nl, description.en, description),
      backgroundImage {
        ${IMAGE_PROJECTION}
      },
      primaryButton {
        "label": coalesce(label[$language], label.nl, label.en, label),
        url
      },
      secondaryButton {
        "label": coalesce(label[$language], label.nl, label.en, label),
        url
      },
      theme
    }
  }
`;
