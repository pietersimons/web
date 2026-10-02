"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SanityImage } from "@/components/shared/SanityImage";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Locale, defaultLocale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Menu, Compass, ArrowRight, Mail } from "lucide-react";

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
  logo,
  logoLight,
  currentLocale = defaultLocale,
  navigation,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dict = getDictionary(currentLocale);

  const defaultNav = [
    { label: "Destinations", url: "/destinations" },
    { label: "Group Travel", url: "/group-travel" },
    { label: "Travel on Demand", url: "/travel-on-demand" },
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
          ? "bg-card/95 backdrop-blur-md border-b border-border/80 shadow-sm py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={localizePath("/", currentLocale)} className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105">
            <Compass className="h-5 w-5 text-accent" />
          </div>
          <span className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            {siteName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={localizePath(item.url || "#", currentLocale)}
              className="text-sm font-semibold text-foreground/90 hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Action & Language Switcher & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          {/* Desktop Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher currentLocale={currentLocale} variant="header" />
          </div>

          <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex font-bold">
            <Link href={localizePath("/travel-on-demand#inquiry-form", currentLocale)} className="flex items-center gap-1.5">
              <span>{dict.common.requestQuote}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>

          {/* Mobile Drawer Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden rounded-xl">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6 flex flex-col justify-between">
              <div>
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="flex items-center gap-2 text-xl font-heading font-extrabold text-foreground">
                    <Compass className="h-5 w-5 text-accent" />
                    {siteName}
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Language Switcher */}
                <div className="mb-6 pb-4 border-b border-border/60">
                  <LanguageSwitcher currentLocale={currentLocale} variant="mobile" />
                </div>

                {/* Mobile Links */}
                <nav className="space-y-4">
                  {navItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={localizePath(item.url || "#", currentLocale)}
                      onClick={() => setMobileOpen(false)}
                      className="block text-base font-bold text-foreground hover:text-accent transition-colors py-1.5 border-b border-border/40"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Mobile CTA & Quick Contacts */}
              <div className="pt-6 border-t border-border space-y-4">
                <Button asChild variant="accent" className="w-full font-bold h-12">
                  <Link
                    href={localizePath("/travel-on-demand#inquiry-form", currentLocale)}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2"
                  >
                    <span>{dict.common.requestQuote}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <div className="text-xs text-muted-foreground space-y-1.5 pt-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-accent" />
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
