"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TravelWildLogo } from "./TravelWildLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Locale, defaultLocale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/navigation";
import { Menu, ChevronDown, Mail } from "lucide-react";

interface HeaderProps {
  siteName?: string;
  logo?: any;
  logoLight?: any;
  currentLocale?: Locale;
  navigation?: Array<{
    label: string | null;
    url?: string | null;
    children?: Array<{ label: string | null; url?: string | null }> | null;
  }> | null;
}

export function Header({
  siteName = "Travelwild",
  currentLocale = defaultLocale,
  navigation,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const defaultNav = [
    { label: "BESTEMMINGEN", url: "/destinations" },
    { label: "REIZEN OP MAAT", url: "/travel-on-demand" },
    { label: "GROEPSREIZEN", url: "/group-travel" },
    {
      label: "ACTIVITEITEN",
      url: "#",
      children: [
        { label: "Wandelreizen", url: "/destinations?activity=hiking" },
        { label: "Duikreizen", url: "/destinations?activity=diving" },
        { label: "Alpinisme", url: "/destinations?activity=mountaineering" },
      ],
    },
    { label: "OVER ONS", url: "/over-ons" },
    { label: "BLOG", url: "/blog" },
  ];

  const navItems = navigation && navigation.length > 0 ? navigation : defaultNav;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0B1914]/92 backdrop-blur-md border-b border-white/10 shadow-lg py-3 sm:py-4"
          : "bg-gradient-to-b from-black/75 via-black/35 to-transparent py-5 sm:py-6"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link
          href={localizePath("/", currentLocale)}
          className="focus:outline-hidden group"
          aria-label={siteName}
        >
          <TravelWildLogo theme="light" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {navItems.map((item, idx) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            return (
              <div key={idx} className="relative group/nav py-2">
                <Link
                  href={localizePath(item.url || "#", currentLocale)}
                  className="flex items-center gap-1.5 text-[12px] xl:text-[13px] font-semibold tracking-[0.08em] text-white/90 hover:text-white transition-colors uppercase"
                >
                  <span>{item.label}</span>
                  {hasChildren && (
                    <ChevronDown className="h-3.5 w-3.5 opacity-75 group-hover/nav:rotate-180 transition-transform duration-200" />
                  )}
                </Link>

                {/* Submenu Dropdown */}
                {hasChildren && item.children && (
                  <div className="absolute top-full left-0 pt-2 hidden group-hover/nav:block z-50">
                    <div className="bg-[#0B1914]/95 backdrop-blur-md border border-white/15 rounded-sm py-2 px-1 min-w-[210px] shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                      {item.children.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          href={localizePath(sub.url || "#", currentLocale)}
                          className="block px-3.5 py-2 text-xs font-semibold tracking-wider text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors uppercase"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Action: Language Switcher & CONTACT Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Desktop Language Switcher */}
          <div className="hidden sm:block text-white/90">
            <LanguageSwitcher currentLocale={currentLocale} variant="header" />
          </div>

          {/* Golden Outlined Contact Button */}
          <Link
            href={localizePath("/contact", currentLocale)}
            className="hidden sm:inline-flex items-center justify-center border border-[#c59b6d] hover:border-[#dfb689] bg-transparent hover:bg-[#c59b6d]/15 text-white uppercase text-[12px] xl:text-[13px] font-bold tracking-widest px-5 py-2 rounded-sm transition-all duration-200 shadow-xs"
          >
            CONTACT
          </Link>

          {/* Mobile Drawer Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="lg:hidden p-2 text-white hover:text-accent focus:outline-hidden transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[350px] p-6 flex flex-col justify-between bg-[#0B1914] text-white border-l border-white/15"
            >
              <div>
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="flex items-center gap-2">
                    <TravelWildLogo theme="light" />
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Language Switcher */}
                <div className="mb-6 pb-4 border-b border-white/15">
                  <LanguageSwitcher currentLocale={currentLocale} variant="mobile" />
                </div>

                {/* Mobile Navigation Links */}
                <nav className="space-y-3">
                  {navItems.map((item, idx) => {
                    const hasChildren = Boolean(item.children && item.children.length > 0);
                    const isOpen = openSubmenu === item.label;

                    return (
                      <div key={idx} className="border-b border-white/10 pb-2">
                        {hasChildren ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setOpenSubmenu(isOpen ? null : item.label)}
                              className="w-full flex items-center justify-between text-sm font-bold text-white hover:text-accent transition-colors py-1.5 uppercase tracking-wider text-left"
                            >
                              <span>{item.label}</span>
                              <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {isOpen && item.children && (
                              <div className="pl-3 py-1 space-y-1.5 border-l border-[#c59b6d]/40 ml-1 mt-1">
                                {item.children.map((sub, sIdx) => (
                                  <Link
                                    key={sIdx}
                                    href={localizePath(sub.url || "#", currentLocale)}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-xs font-semibold tracking-wider text-white/80 hover:text-white py-1 uppercase"
                                  >
                                    {sub.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <Link
                            href={localizePath(item.url || "#", currentLocale)}
                            onClick={() => setMobileOpen(false)}
                            className="block text-sm font-bold text-white hover:text-accent transition-colors py-1.5 uppercase tracking-wider"
                          >
                            {item.label}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile CTA */}
              <div className="pt-6 border-t border-white/15 space-y-4">
                <Link
                  href={localizePath("/contact", currentLocale)}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full border border-[#c59b6d] hover:bg-[#c59b6d]/20 text-white font-bold uppercase tracking-widest text-sm h-12 rounded-sm transition-all"
                >
                  CONTACT
                </Link>

                <div className="text-xs text-white/70 space-y-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[#c59b6d]" />
                    <span>hello@travelwild.com</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
