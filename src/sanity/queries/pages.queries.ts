import { defineQuery } from "next-sanity";
import {
  IMAGE_PROJECTION,
  SEO_PROJECTION,
  PAGE_BUILDER_PROJECTION,
} from "./fragments";

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0] {
    _id,
    "title": coalesce(title[$language], title.nl, title.en, title),
    ${PAGE_BUILDER_PROJECTION},
    ${SEO_PROJECTION}
  }
`);

export const GROUP_TRAVEL_PAGE_QUERY = defineQuery(`
  *[_type == "groupTravelPage"][0] {
    _id,
    "title": coalesce(title[$language], title.nl, title.en, title),
    hero {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading),
      layoutStyle,
      backgroundImage { ${IMAGE_PROJECTION} },
      primaryCta {
        "label": coalesce(label[$language], label.nl, label.en, label),
        url
      },
      secondaryCta {
        "label": coalesce(label[$language], label.nl, label.en, label),
        url
      }
    },
    tripsSection {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading)
    },
    introPhilosophy {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading),
      description,
      benefits[] {
        stepNumber,
        "title": coalesce(title[$language], title.nl, title.en, title),
        "description": coalesce(description[$language], description.nl, description.en, description),
        icon,
        image {
          ${IMAGE_PROJECTION}
        }
      }
    },
    ${PAGE_BUILDER_PROJECTION},
    ${SEO_PROJECTION}
  }
`);

export const TRAVEL_ON_DEMAND_PAGE_QUERY = defineQuery(`
  *[_type == "travelOnDemandPage"][0] {
    _id,
    "title": coalesce(title[$language], title.nl, title.en, title),
    hero {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading),
      layoutStyle,
      backgroundImage { ${IMAGE_PROJECTION} },
      primaryCta {
        "label": coalesce(label[$language], label.nl, label.en, label),
        url
      },
      secondaryCta {
        "label": coalesce(label[$language], label.nl, label.en, label),
        url
      }
    },
    processSection {
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
    themes[] {
      "title": coalesce(title[$language], title.nl, title.en, title),
      "description": coalesce(description[$language], description.nl, description.en, description),
      image {
        ${IMAGE_PROJECTION}
      }
    },
    inquiryFormIntro {
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading)
    },
    ${PAGE_BUILDER_PROJECTION},
    ${SEO_PROJECTION}
  }
`);

export const CUSTOM_PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    "title": coalesce(title[$language], title.nl, title.en, title),
    "slug": slug.current,
    ${PAGE_BUILDER_PROJECTION},
    ${SEO_PROJECTION}
  }
`);

export const ALL_PAGES_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)] {
    "slug": slug.current
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    _id,
    siteName,
    logo {
      ${IMAGE_PROJECTION}
    },
    logoLight {
      ${IMAGE_PROJECTION}
    },
    navigation[] {
      "label": coalesce(label[$language], label.nl, label.en, label),
      url,
      children[] {
        "label": coalesce(label[$language], label.nl, label.en, label),
        url
      }
    },
    contactInfo,
    socialLinks,
    footer {
      "tagline": coalesce(tagline[$language], tagline.nl, tagline.en, tagline),
      "copyrightText": coalesce(copyrightText[$language], copyrightText.nl, copyrightText.en, copyrightText),
      columns[] {
        "title": coalesce(title[$language], title.nl, title.en, title),
        links[] {
          "label": coalesce(label[$language], label.nl, label.en, label),
          url
        }
      }
    },
    defaultSeo {
      "metaTitle": coalesce(metaTitle[$language], metaTitle.nl, metaTitle.en, metaTitle),
      "metaDescription": coalesce(metaDescription[$language], metaDescription.nl, metaDescription.en, metaDescription),
      shareImage {
        ${IMAGE_PROJECTION}
      }
    },
    analytics {
      googleAnalyticsId
    }
  }
`);

export const FORMS_CONFIGURATION_QUERY = defineQuery(`
  *[_type == "formsConfiguration"][0] {
    _id,
    customTripForm {
      "badge": coalesce(badge[$language], badge.nl, badge.en, badge),
      "heading": coalesce(heading[$language], heading.nl, heading.en, heading),
      "subheading": coalesce(subheading[$language], subheading.nl, subheading.en, subheading),
      "step1Title": coalesce(step1Title[$language], step1Title.nl, step1Title.en, step1Title),
      "destinationLabel": coalesce(destinationLabel[$language], destinationLabel.nl, destinationLabel.en, destinationLabel),
      "destinationPlaceholder": coalesce(destinationPlaceholder[$language], destinationPlaceholder.nl, destinationPlaceholder.en, destinationPlaceholder),
      "travelStyleLabel": coalesce(travelStyleLabel[$language], travelStyleLabel.nl, travelStyleLabel.en, travelStyleLabel),
      travelStyleOptions[] {
        id,
        "label": coalesce(label[$language], label.nl, label.en, label)
      },
      "nextButtonStep1": coalesce(nextButtonStep1[$language], nextButtonStep1.nl, nextButtonStep1.en, nextButtonStep1),
      "step2Title": coalesce(step2Title[$language], step2Title.nl, step2Title.en, step2Title),
      "departureMonthLabel": coalesce(departureMonthLabel[$language], departureMonthLabel.nl, departureMonthLabel.en, departureMonthLabel),
      "departureMonthPlaceholder": coalesce(departureMonthPlaceholder[$language], departureMonthPlaceholder.nl, departureMonthPlaceholder.en, departureMonthPlaceholder),
      "travelersLabel": coalesce(travelersLabel[$language], travelersLabel.nl, travelersLabel.en, travelersLabel),
      "durationLabel": coalesce(durationLabel[$language], durationLabel.nl, durationLabel.en, durationLabel),
      durationOptions[] {
        id,
        "label": coalesce(label[$language], label.nl, label.en, label)
      },
      "nextButtonStep2": coalesce(nextButtonStep2[$language], nextButtonStep2.nl, nextButtonStep2.en, nextButtonStep2),
      "step3Title": coalesce(step3Title[$language], step3Title.nl, step3Title.en, step3Title),
      "fullNameLabel": coalesce(fullNameLabel[$language], fullNameLabel.nl, fullNameLabel.en, fullNameLabel),
      "emailLabel": coalesce(emailLabel[$language], emailLabel.nl, emailLabel.en, emailLabel),
      "phoneLabel": coalesce(phoneLabel[$language], phoneLabel.nl, phoneLabel.en, phoneLabel),
      phoneRequired,
      "notesLabel": coalesce(notesLabel[$language], notesLabel.nl, notesLabel.en, notesLabel),
      "notesPlaceholder": coalesce(notesPlaceholder[$language], notesPlaceholder.nl, notesPlaceholder.en, notesPlaceholder),
      "submitButtonLabel": coalesce(submitButtonLabel[$language], submitButtonLabel.nl, submitButtonLabel.en, submitButtonLabel),
      customFields[] {
        _key,
        fieldKey,
        "label": coalesce(label[$language], label.nl, label.en, label),
        fieldType,
        step,
        "placeholder": coalesce(placeholder[$language], placeholder.nl, placeholder.en, placeholder),
        options[] {
          value,
          "label": coalesce(label[$language], label.nl, label.en, label)
        },
        required
      },
      "successHeading": coalesce(successHeading[$language], successHeading.nl, successHeading.en, successHeading),
      "successMessage": coalesce(successMessage[$language], successMessage.nl, successMessage.en, successMessage)
    },
    bookingContactForm {
      "bookingBadge": coalesce(bookingBadge[$language], bookingBadge.nl, bookingBadge.en, bookingBadge),
      "bookingHeading": coalesce(bookingHeading[$language], bookingHeading.nl, bookingHeading.en, bookingHeading),
      "bookingDescription": coalesce(bookingDescription[$language], bookingDescription.nl, bookingDescription.en, bookingDescription),
      "contactBadge": coalesce(contactBadge[$language], contactBadge.nl, contactBadge.en, contactBadge),
      "contactHeading": coalesce(contactHeading[$language], contactHeading.nl, contactHeading.en, contactHeading),
      "contactDescription": coalesce(contactDescription[$language], contactDescription.nl, contactDescription.en, contactDescription),
      "fullNameLabel": coalesce(fullNameLabel[$language], fullNameLabel.nl, fullNameLabel.en, fullNameLabel),
      "emailLabel": coalesce(emailLabel[$language], emailLabel.nl, emailLabel.en, emailLabel),
      "phoneLabel": coalesce(phoneLabel[$language], phoneLabel.nl, phoneLabel.en, phoneLabel),
      "travelersLabel": coalesce(travelersLabel[$language], travelersLabel.nl, travelersLabel.en, travelersLabel),
      "messageBookingLabel": coalesce(messageBookingLabel[$language], messageBookingLabel.nl, messageBookingLabel.en, messageBookingLabel),
      "messageBookingPlaceholder": coalesce(messageBookingPlaceholder[$language], messageBookingPlaceholder.nl, messageBookingPlaceholder.en, messageBookingPlaceholder),
      "messageContactLabel": coalesce(messageContactLabel[$language], messageContactLabel.nl, messageContactLabel.en, messageContactLabel),
      "messageContactPlaceholder": coalesce(messageContactPlaceholder[$language], messageContactPlaceholder.nl, messageContactPlaceholder.en, messageContactPlaceholder),
      "bookingSubmitLabel": coalesce(bookingSubmitLabel[$language], bookingSubmitLabel.nl, bookingSubmitLabel.en, bookingSubmitLabel),
      "contactSubmitLabel": coalesce(contactSubmitLabel[$language], contactSubmitLabel.nl, contactSubmitLabel.en, contactSubmitLabel),
      "bookingSuccessHeading": coalesce(bookingSuccessHeading[$language], bookingSuccessHeading.nl, bookingSuccessHeading.en, bookingSuccessHeading),
      "contactSuccessHeading": coalesce(contactSuccessHeading[$language], contactSuccessHeading.nl, contactSuccessHeading.en, contactSuccessHeading),
      "successMessage": coalesce(successMessage[$language], successMessage.nl, successMessage.en, successMessage),
      customFields[] {
        _key,
        fieldKey,
        "label": coalesce(label[$language], label.nl, label.en, label),
        fieldType,
        step,
        "placeholder": coalesce(placeholder[$language], placeholder.nl, placeholder.en, placeholder),
        options[] {
          value,
          "label": coalesce(label[$language], label.nl, label.en, label)
        },
        required
      }
    }
  }
`);

