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
      backgroundImage { ${IMAGE_PROJECTION} }
    },
    "introPhilosophy": coalesce(introPhilosophy[$language], introPhilosophy.nl, introPhilosophy.en, introPhilosophy),
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
      backgroundImage { ${IMAGE_PROJECTION} }
    },
    processSection,
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
    }
  }
`);
