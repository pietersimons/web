import Link from "next/link";
import { Compass, Mail, Phone } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Locale, defaultLocale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";

interface FooterProps {
  siteName?: string;
  currentLocale?: Locale;
  footer?: {
    tagline?: string | null;
    copyrightText?: string | null;
    columns?: Array<{
      title?: string | null;
      links?: Array<{ label?: string | null; url?: string | null }> | null;
    }> | null;
  } | null;
  contactInfo?: {
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    address?: string | null;
  } | null;
  socialLinks?: Array<{
    platform?: string | null;
    url?: string | null;
  }> | null;
}

export function Footer({
  siteName = "Travelwild",
  currentLocale = defaultLocale,
  footer,
  contactInfo,
  socialLinks = [],
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const dict = getDictionary(currentLocale);

  const defaultColumns = [
    {
      title: currentLocale === "nl" ? "Rondreizen" : "Expeditions",
      links: [
        { label: dict.nav.destinations, url: "/destinations" },
        { label: dict.nav.groupTravel, url: "/group-travel" },
        { label: dict.nav.travelOnDemand, url: "/travel-on-demand" },
      ],
    },
    {
      title: currentLocale === "nl" ? "Over Ons" : "About Us",
      links: [
        { label: dict.nav.about, url: "/about" },
        { label: currentLocale === "nl" ? "Duurzaamheid & Impact" : "Sustainability & Impact", url: "/sustainability" },
        { label: dict.nav.contact, url: "/contact" },
      ],
    },
  ];

  const columns = footer?.columns && footer.columns.length > 0 ? footer.columns : defaultColumns;

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-12 border-t border-border/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href={localizePath("/", currentLocale)} className="inline-flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-accent text-accent-foreground flex items-center justify-center font-bold">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-2xl font-extrabold tracking-tight text-white">
                {siteName}
              </span>
            </Link>

            <p className="text-sm text-primary-foreground/75 leading-relaxed max-w-sm">
              {footer?.tagline || dict.footer.tagline}
            </p>

            {/* Quick Contact */}
            <div className="space-y-2 pt-2 text-xs text-primary-foreground/80">
              {contactInfo?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-accent shrink-0" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-accent transition-colors">
                    {contactInfo.email}
                  </a>
                </div>
              )}
              {contactInfo?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-accent shrink-0" />
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-accent transition-colors">
                    {contactInfo.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {columns.map((col, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm text-primary-foreground/75">
                {col.links?.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={localizePath(link.url || "#", currentLocale)}
                      className="hover:text-accent transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social / Trust */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              {currentLocale === "nl" ? "Volg Onze Reizen" : "Follow the Wild"}
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-xl bg-white/10 hover:bg-accent text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-xl bg-white/10 hover:bg-accent text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-xl bg-white/10 hover:bg-accent text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Language Switcher */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-primary-foreground/60 gap-4">
          <p>
            &copy; {currentYear} {siteName}. {dict.footer.allRightsReserved}
          </p>

          <div className="flex items-center gap-6">
            <LanguageSwitcher currentLocale={currentLocale} variant="footer" />
            <Link href={localizePath("/privacy", currentLocale)} className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href={localizePath("/terms", currentLocale)} className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
