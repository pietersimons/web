"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Copy,
  Check,
  Type,
  Palette,
  Shield,
  Layers,
  Sparkles,
  Download,
  Eye,
  Sliders,
  Camera,
  ArrowRight,
  ExternalLink,
  Code2,
  TreePine,
  Sun,
  Moon,
  Mountain,
  FileJson,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { TravelWildLogo } from "@/components/layout/TravelWildLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Locale } from "@/lib/i18n/config";

interface BrandGuideClientProps {
  currentLocale: Locale;
}

interface ColorSwatch {
  name: string;
  role: string;
  hex: string;
  rgb: string;
  hsl: string;
  variable: string;
  tailwind: string;
  category: "core" | "earth" | "accent" | "dark" | "semantic";
  textDark?: boolean;
  notes: string;
  contrastOnLight: "AAA" | "AA" | "Fail";
  contrastOnDark: "AAA" | "AA" | "Fail";
}

const BRAND_COLORS: ColorSwatch[] = [
  // Core
  {
    name: "Deep Forest Pine",
    role: "Primary Brand Color — Deep wilderness bedrock, header/footer backgrounds, primary buttons",
    hex: "#122B22",
    rgb: "rgb(18, 43, 34)",
    hsl: "hsl(158, 41%, 12%)",
    variable: "--primary",
    tailwind: "bg-primary / text-primary",
    category: "core",
    textDark: false,
    notes: "Signature brand color. Evokes dense boreal forests, untouched subarctic pines, and tranquil wilderness.",
    contrastOnLight: "AAA",
    contrastOnDark: "Fail",
  },
  {
    name: "Earth Sand",
    role: "Light Mode Background & Primary Foreground in Dark Mode",
    hex: "#FAF7F2",
    rgb: "rgb(250, 247, 242)",
    hsl: "hsl(38, 43%, 96%)",
    variable: "--background / --primary-foreground",
    tailwind: "bg-background / text-primary-foreground",
    category: "core",
    textDark: true,
    notes: "Warm, textured paper tone that replaces harsh digital whites with natural Scandinavian warmth.",
    contrastOnLight: "Fail",
    contrastOnDark: "AAA",
  },
  {
    name: "Dark Timber",
    role: "Primary Text Color on Light Sand backgrounds",
    hex: "#1A2420",
    rgb: "rgb(26, 36, 32)",
    hsl: "hsl(154, 16%, 12%)",
    variable: "--foreground",
    tailwind: "text-foreground",
    category: "core",
    textDark: false,
    notes: "Deep charcoal with pine undertones. High legibility without the harshness of pure black #000.",
    contrastOnLight: "AAA",
    contrastOnDark: "Fail",
  },

  // Earth & Neutrals
  {
    name: "Moss & Sage",
    role: "Secondary Accent — Badges, secondary buttons, subheadings, subtle highlights",
    hex: "#4A6B5D",
    rgb: "rgb(74, 107, 93)",
    hsl: "hsl(153, 18%, 36%)",
    variable: "--secondary",
    tailwind: "bg-secondary / text-secondary",
    category: "earth",
    textDark: false,
    notes: "Natural lichen and moss green. Connects organic topography with clean UI structures.",
    contrastOnLight: "AA",
    contrastOnDark: "AA",
  },
  {
    name: "Light Sand (Muted)",
    role: "Secondary Backgrounds, Form Fields, Card Panels",
    hex: "#EFE9DF",
    rgb: "rgb(239, 233, 223)",
    hsl: "hsl(38, 25%, 90%)",
    variable: "--muted",
    tailwind: "bg-muted",
    category: "earth",
    textDark: true,
    notes: "Subtle neutral backing for chips, search bars, filter controls, and itinerary day containers.",
    contrastOnLight: "Fail",
    contrastOnDark: "AAA",
  },
  {
    name: "Slate Sage",
    role: "Muted Text, Metadata, Helper Labels, Captions",
    hex: "#5C6B63",
    rgb: "rgb(92, 107, 99)",
    hsl: "hsl(150, 7%, 39%)",
    variable: "--muted-foreground",
    tailwind: "text-muted-foreground",
    category: "earth",
    textDark: false,
    notes: "Gentle secondary text tone providing clear visual hierarchy across cards and specifications.",
    contrastOnLight: "AA",
    contrastOnDark: "Fail",
  },
  {
    name: "Warm Muted Bark",
    role: "Border lines, dividers, subtle separators",
    hex: "#E3DBD0",
    rgb: "rgb(227, 219, 208)",
    hsl: "hsl(36, 20%, 85%)",
    variable: "--border",
    tailwind: "border-border",
    category: "earth",
    textDark: true,
    notes: "Earth-toned stroke definition for cards, header lines, and input containers.",
    contrastOnLight: "Fail",
    contrastOnDark: "AAA",
  },

  // Accents & Metallics
  {
    name: "Safari Amber",
    role: "High-Priority Accent — Primary CTA highlights, notification rings, focus rings",
    hex: "#D97706",
    rgb: "rgb(217, 119, 6)",
    hsl: "hsl(37, 91%, 44%)",
    variable: "--accent / --ring",
    tailwind: "bg-accent / text-accent",
    category: "accent",
    textDark: false,
    notes: "Vibrant golden hour amber. Evokes African safari horizons, lantern glow, and bold adventure.",
    contrastOnLight: "AA",
    contrastOnDark: "AAA",
  },
  {
    name: "Warm Gold Border",
    role: "Prestige Accent — Boutiques, Contact CTA outline, luxury itinerary indicators",
    hex: "#C59B6D",
    rgb: "rgb(197, 155, 109)",
    hsl: "hsl(31, 44%, 60%)",
    variable: "--color-gold-border",
    tailwind: "border-[#c59b6d] / text-[#c59b6d]",
    category: "accent",
    textDark: true,
    notes: "Refined architectural gold. Used for the iconic header Contact button outline and bespoke badges.",
    contrastOnLight: "Fail",
    contrastOnDark: "AAA",
  },
  {
    name: "Gold Hover Glow",
    role: "Interactive Hover States for Gold elements",
    hex: "#DFB689",
    rgb: "rgb(223, 182, 137)",
    hsl: "hsl(31, 57%, 71%)",
    variable: "--color-gold-hover",
    tailwind: "hover:border-[#dfb689]",
    category: "accent",
    textDark: true,
    notes: "Warm metallic sheen when hovering interactive gold accents.",
    contrastOnLight: "Fail",
    contrastOnDark: "AAA",
  },
  {
    name: "Wild Sunset Gradient",
    role: "Signature 'Wild' Button gradient & Hero accent banners",
    hex: "Gradient",
    rgb: "linear-gradient(135deg, #D97706, #B45309)",
    hsl: "from-amber-600 to-amber-700",
    variable: "variant: wild",
    tailwind: "bg-gradient-to-r from-accent to-amber-600",
    category: "accent",
    textDark: false,
    notes: "Dynamic sunset warmth applied to booking CTAs and hero adventure badges.",
    contrastOnLight: "AA",
    contrastOnDark: "AAA",
  },

  // Dark Mode System
  {
    name: "Night Forest",
    role: "Dark Mode Background, Scrolled Header backdrop",
    hex: "#0B1914",
    rgb: "rgb(11, 25, 20)",
    hsl: "hsl(158, 39%, 7%)",
    variable: "--background (dark)",
    tailwind: "dark:bg-[#0B1914]",
    category: "dark",
    textDark: false,
    notes: "Deep nocturnal boreal forest tone. Provides immersive cinematic contrast for night view and hero navigation.",
    contrastOnLight: "AAA",
    contrastOnDark: "Fail",
  },
  {
    name: "Forest Dark Panel",
    role: "Dark Mode Cards, Floating Menus, Dropdown Panels",
    hex: "#11231D",
    rgb: "rgb(17, 35, 29)",
    hsl: "hsl(158, 34%, 10%)",
    variable: "--card (dark)",
    tailwind: "dark:bg-[#11231D]",
    category: "dark",
    textDark: false,
    notes: "Used in header mobile drawers, floating mega menus, and dark itinerary cards.",
    contrastOnLight: "AAA",
    contrastOnDark: "Fail",
  },
  {
    name: "Deep Moss",
    role: "Dark Mode Secondary Surface & Borders",
    hex: "#264035",
    rgb: "rgb(38, 64, 53)",
    hsl: "hsl(158, 25%, 20%)",
    variable: "--secondary (dark)",
    tailwind: "dark:bg-[#264035]",
    category: "dark",
    textDark: false,
    notes: "Provides subtle elevation differentiation in dark mode interfaces.",
    contrastOnLight: "AA",
    contrastOnDark: "AA",
  },

  // Semantic
  {
    name: "Eco Emerald (Success / Easy)",
    role: "Easy Hike Badges, Confirmed Departures, Eco-certifications",
    hex: "#059669",
    rgb: "rgb(5, 150, 105)",
    hsl: "hsl(160, 93%, 30%)",
    variable: "badge: success / difficultyEasy",
    tailwind: "bg-emerald-600 / text-emerald-800",
    category: "semantic",
    textDark: false,
    notes: "Represents accessible travel, beginner hiking trails, and guaranteed small-group departures.",
    contrastOnLight: "AA",
    contrastOnDark: "AAA",
  },
  {
    name: "Moderate Trail (Warning / Amber)",
    role: "Moderate Difficulty Badges, Limited Spots Alert",
    hex: "#D97706",
    rgb: "rgb(217, 119, 6)",
    hsl: "hsl(37, 91%, 44%)",
    variable: "badge: warning / difficultyModerate",
    tailwind: "bg-amber-500 / text-amber-900",
    category: "semantic",
    textDark: false,
    notes: "Indicates intermediate physical fitness requirements or limited cabin availability.",
    contrastOnLight: "AA",
    contrastOnDark: "AAA",
  },
  {
    name: "Challenging Expedition (Destructive / Rose)",
    role: "Challenging Peaks, High Altitude Warnings, Cancellation actions",
    hex: "#DC2626",
    rgb: "rgb(220, 38, 38)",
    hsl: "hsl(0, 84%, 60%)",
    variable: "--destructive / difficultyChallenging",
    tailwind: "bg-destructive / text-rose-900",
    category: "semantic",
    textDark: false,
    notes: "Alerts travelers to extreme wilderness conditions, technical climbs, and demanding expeditions.",
    contrastOnLight: "AA",
    contrastOnDark: "AAA",
  },
];

const LOGO_SVG_CODE = `<svg viewBox="0 0 545 240" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M272 1L315 81L319 81L334 71L388 203L431 111L475 202L528 73L543 73L475 239L432 146L387 238L329 95L327 93L311 103L298 81L287 101L294 125L267 173L278 127L265 106L271 30L189 155L176 142L172 145L113 235L73 235L73 73L2 72L2 58L195 58L186 72L87 72L87 220L104 220L173 117L186 130L190 127Z" />
</svg>`;

export function BrandGuideClient({ currentLocale }: BrandGuideClientProps) {
  const isNl = currentLocale === "nl";
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [logoTheme, setLogoTheme] = useState<"light" | "dark" | "night" | "gold">("night");
  const [customText, setCustomText] = useState<string>(
    isNl
      ? "Expedities naar het hart van de ongerepte wildernis."
      : "Expeditions into the heart of untamed wilderness."
  );
  const [fontSize, setFontSize] = useState<number>(36);

  const handleCopy = (text: string, key: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    }
  };

  const filteredColors =
    activeCategory === "all"
      ? BRAND_COLORS
      : BRAND_COLORS.filter((c) => c.category === activeCategory);

  const exportTokensJson = () => {
    const tokens = {
      brand: "Travelwild",
      version: "2.0",
      colors: BRAND_COLORS.reduce((acc, c) => {
        acc[c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")] = {
          hex: c.hex,
          rgb: c.rgb,
          hsl: c.hsl,
          variable: c.variable,
          role: c.role,
        };
        return acc;
      }, {} as Record<string, any>),
      typography: {
        hero: {
          family: "Bebas Neue",
          weight: "400",
          usage: "All H1 page titles site-wide, hero headlines, impactful display figures, uppercase statements",
        },
        brand: {
          family: "Cinzel",
          weight: "500-700",
          usage: "Logo wordmark, editorial titles, luxury destination headers",
        },
        sans: {
          family: "Plus Jakarta Sans",
          weight: "400-800",
          usage: "Primary UI, navigation, buttons, body copy, descriptions",
        },
      },
      radii: {
        sharp: "2px (rounded-sm) — architectural buttons & gold outlines",
        standard: "12px (rounded-xl) — cards, containers, buttons",
        pill: "9999px (rounded-full) — difficulty & status badges",
      },
    };

    handleCopy(JSON.stringify(tokens, null, 2), "tokens-json");
  };

  return (
    <div className="bg-background text-foreground min-h-screen pt-24 pb-28 selection:bg-accent selection:text-white">
      {/* Toast Alert for Copied Action */}
      {copiedKey && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#122B22] text-[#FAF7F2] border border-[#c59b6d] px-5 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-5 w-5 text-accent" />
          <span className="text-sm font-semibold tracking-wide">
            {isNl ? "Gekopieerd naar klembord!" : "Copied to clipboard!"}
          </span>
        </div>
      )}

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1914] via-[#122B22] to-background text-white pt-16 pb-20 border-b border-border/40">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c59b6d_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-[#c59b6d]/60 text-[#c59b6d] bg-black/30 backdrop-blur-md px-3.5 py-1 text-xs tracking-widest uppercase">
                {isNl ? "Travelwild Merkidentiteit" : "Travelwild Brand Identity"}
              </Badge>
              <span className="text-xs text-white/50 font-mono tracking-wider">v2.0 • 2026/2027</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={exportTokensJson}
                className="inline-flex items-center gap-2 border border-[#c59b6d] hover:border-[#dfb689] hover:bg-[#c59b6d]/20 text-white text-xs font-bold tracking-wider px-4 py-2 rounded-sm transition-all"
              >
                <FileJson className="h-4 w-4 text-[#c59b6d]" />
                <span>{isNl ? "Exporteer Tokens (JSON)" : "Export Tokens (JSON)"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-hero text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.9] text-white">
                {isNl ? "Het Merkboek & Design Systeem" : "Brand Book & Design System"}
              </h1>
              <p className="font-sans text-lg sm:text-xl text-white/80 max-w-2xl font-light leading-relaxed">
                {isNl
                  ? "De universele gids voor de kleuren, typografie, logo's en designtokens die de visuele wereld van Travelwild vormgeven."
                  : "The definitive guide to the colors, typography, logos, and design tokens that forge the visual identity of Travelwild."}
              </p>
            </div>

            <div className="lg:col-span-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <Compass className="h-6 w-6 text-accent" />
                <span className="font-brand text-lg font-bold tracking-wider text-white">TRAVEL WILD</span>
              </div>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                {isNl
                  ? "Onze esthetiek balanceert ruige wildernis met Scandinavisch minimalisme en verfijnde luxe. Warm zand, diep naaldbos en zonsondergang-amber."
                  : "Our aesthetic balances untamed wilderness with Scandinavian minimalism and refined luxury. Warm sand, deep pine forest, and sunset amber."}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#c59b6d] font-semibold tracking-wider uppercase">
                <TreePine className="h-4 w-4" />
                <span>{isNl ? "Authentiek • Duurzaam • Kleinschalig" : "Authentic • Sustainable • Small-Group"}</span>
              </div>
            </div>
          </div>

          {/* Quick Anchor Bar */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap gap-3">
            {[
              { id: "colors", label: isNl ? "1. Kleurenpalet" : "1. Color Palette", icon: Palette },
              { id: "typography", label: isNl ? "2. Typografie" : "2. Typography", icon: Type },
              { id: "logo", label: isNl ? "3. Logo & Monogram" : "3. Logo & Monogram", icon: Mountain },
              { id: "components", label: isNl ? "4. UI Componenten" : "4. UI Components", icon: Layers },
              { id: "voice", label: isNl ? "5. Tone of Voice & Fotografie" : "5. Voice & Photography", icon: Camera },
            ].map((section) => {
              const Icon = section.icon;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all"
                >
                  <Icon className="h-3.5 w-3.5 text-accent" />
                  <span>{section.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="container mx-auto px-4 max-w-7xl pt-16 space-y-24">

        {/* SECTION 1: COLORS */}
        <section id="colors" className="scroll-mt-28 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/80 pb-5">
            <div>
              <div className="flex items-center gap-2 text-accent text-xs font-bold tracking-widest uppercase mb-1">
                <Palette className="h-4 w-4" />
                <span>01. {isNl ? "Kleurarchitectuur" : "Color Architecture"}</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isNl ? "Kleurenpalet & Designtokens" : "Color Palette & Design Tokens"}
              </h2>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/60">
              {[
                { id: "all", label: isNl ? "Alle Kleuren" : "All Colors" },
                { id: "core", label: isNl ? "Kernmerk" : "Core Brand" },
                { id: "earth", label: isNl ? "Aarde & Zand" : "Earth & Sand" },
                { id: "accent", label: isNl ? "Amber & Goud" : "Amber & Gold" },
                { id: "dark", label: isNl ? "Nachtbos" : "Night Forest" },
                { id: "semantic", label: isNl ? "Moeilijkheid & Status" : "Difficulty & Status" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
            {isNl
              ? "Klik op een kleurcode (HEX, RGB, HSL of CSS-variabele) om deze direct naar je klembord te kopiëren. Alle kleuren zijn zorgvuldig afgestemd op de WCAG 2.1 contrastnormen voor optimale leesbaarheid in zowel lichte als donkere modi."
              : "Click on any color code (HEX, RGB, HSL, or CSS variable) to copy it immediately to your clipboard. All colors are calibrated for WCAG 2.1 contrast compliance across light and dark interfaces."}
          </p>

          {/* Color Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColors.map((color, idx) => {
              const isGradient = color.hex === "Gradient";
              const isDarkCard = color.category === "dark";

              return (
                <div
                  key={idx}
                  className="group rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Swatch */}
                    <div
                      className="h-36 sm:h-40 w-full relative p-4 flex flex-col justify-between transition-transform duration-300 group-hover:scale-[1.02]"
                      style={{
                        backgroundColor: isGradient ? undefined : color.hex,
                        backgroundImage: isGradient ? color.rgb : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-md backdrop-blur-md shadow-xs ${
                            color.textDark
                              ? "bg-black/10 text-[#1A2420]"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          {color.category}
                        </span>

                        {/* Contrast Badges */}
                        <div className="flex items-center gap-1.5">
                          <span
                            title="Contrast on Light Background"
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              color.contrastOnLight === "AAA"
                                ? "bg-emerald-500/90 text-white"
                                : color.contrastOnLight === "AA"
                                ? "bg-amber-500/90 text-white"
                                : "bg-black/20 text-white/70"
                            }`}
                          >
                            L: {color.contrastOnLight}
                          </span>
                          <span
                            title="Contrast on Dark Background"
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              color.contrastOnDark === "AAA"
                                ? "bg-emerald-500/90 text-white"
                                : color.contrastOnDark === "AA"
                                ? "bg-amber-500/90 text-white"
                                : "bg-black/20 text-white/70"
                            }`}
                          >
                            D: {color.contrastOnDark}
                          </span>
                        </div>
                      </div>

                      {/* Quick copy indicator overlay */}
                      <button
                        type="button"
                        onClick={() => handleCopy(color.hex, `swatch-${idx}`)}
                        className={`self-end flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-md transition-opacity opacity-0 group-hover:opacity-100 ${
                          color.textDark
                            ? "bg-black/20 text-[#1A2420] hover:bg-black/30"
                            : "bg-white/30 text-white hover:bg-white/40"
                        }`}
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy HEX</span>
                      </button>
                    </div>

                    {/* Metadata Details */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-heading text-lg font-bold text-foreground">
                          {color.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                          {color.role}
                        </p>
                      </div>

                      <p className="text-xs text-muted-foreground/90 italic border-l-2 border-accent/40 pl-2.5 py-0.5">
                        {color.notes}
                      </p>
                    </div>
                  </div>

                  {/* Copyable Code Badges */}
                  <div className="p-5 pt-0 border-t border-border/40 mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => handleCopy(color.hex, `hex-${idx}`)}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors group/btn text-left"
                    >
                      <span className="text-muted-foreground text-[10px]">HEX:</span>
                      <span className="font-bold flex items-center gap-1">
                        {color.hex}
                        <Copy className="h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(color.hsl, `hsl-${idx}`)}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors group/btn text-left"
                    >
                      <span className="text-muted-foreground text-[10px]">HSL:</span>
                      <span className="font-bold truncate max-w-[90px] flex items-center gap-1">
                        {color.hsl}
                        <Copy className="h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(color.variable, `var-${idx}`)}
                      className="col-span-2 flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted text-foreground transition-colors group/btn text-left"
                    >
                      <span className="text-muted-foreground text-[10px]">CSS:</span>
                      <span className="text-[11px] font-semibold text-accent truncate flex items-center gap-1">
                        {color.variable}
                        <Copy className="h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: TYPOGRAPHY */}
        <section id="typography" className="scroll-mt-28 space-y-10">
          <div className="border-b border-border/80 pb-5">
            <div className="flex items-center gap-2 text-accent text-xs font-bold tracking-widest uppercase mb-1">
              <Type className="h-4 w-4" />
              <span>02. {isNl ? "Typografisch Systeem" : "Typographic System"}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isNl ? "Lettertypen & Hiërarchie" : "Typography & Hierarchy"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
              {isNl
                ? "Travelwild gebruikt een trio van complementaire lettertypen: Bebas Neue voor heroïsche slagkracht, Cinzel voor tijdloze luxe en het woordmerk, en Plus Jakarta Sans voor ergonomische gebruikersinterfaces."
                : "Travelwild employs a trio of complementary typefaces: Bebas Neue for heroic impact, Cinzel for timeless luxury and wordmark branding, and Plus Jakarta Sans for ergonomic digital interfaces."}
            </p>
          </div>

          {/* Three Fonts Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Font 1: Bebas Neue */}
            <Card className="border-border/80 flex flex-col justify-between">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="accent" className="text-[11px] tracking-wider uppercase">
                    Display & Impact
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">Google Font</span>
                </div>
                <CardTitle className="font-hero text-4xl sm:text-5xl uppercase tracking-wide text-foreground pt-3">
                  Bebas Neue
                </CardTitle>
                <CardDescription className="text-xs">
                  CSS: <code className="font-mono text-accent">font-hero / --font-hero-display</code>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/60 rounded-xl space-y-2">
                  <p className="font-hero text-3xl tracking-wide uppercase leading-none">
                    WILDERNIS EXPEDITIES 2026
                  </p>
                  <p className="font-hero text-xl tracking-wider text-muted-foreground uppercase">
                    01 02 03 04 05 • FAERÖER • COSTA RICA • NAMIBIË
                  </p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li><strong>Gewicht:</strong> 400 (Regular)</li>
                  <li><strong>Gebruik:</strong> Alle H1-titels site-wide, Hero-banners, tellers, impact cijfers</li>
                  <li><strong>Stijl:</strong> Altijd hoofdletters (uppercase), nauwe letterafstand (tracking-wide / tracking-tight)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Font 2: Cinzel */}
            <Card className="border-border/80 flex flex-col justify-between">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-[#c59b6d] text-[#c59b6d] text-[11px] tracking-wider uppercase">
                    Brand & Wordmark
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">Google Font</span>
                </div>
                <CardTitle className="font-brand text-3xl sm:text-4xl font-bold uppercase tracking-widest text-foreground pt-3">
                  Cinzel
                </CardTitle>
                <CardDescription className="text-xs">
                  CSS: <code className="font-mono text-accent">font-brand / --font-brand</code>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/60 rounded-xl space-y-2 text-center">
                  <p className="font-brand text-xs tracking-[0.3em] font-medium uppercase text-muted-foreground">
                    TRAVEL
                  </p>
                  <p className="font-brand text-2xl tracking-[0.1em] font-bold uppercase text-foreground">
                    WILD
                  </p>
                  <p className="font-brand text-xs tracking-widest text-accent italic pt-1">
                    Authentic Explorations
                  </p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li><strong>Gewicht:</strong> 500, 600, 700 (Medium to Bold)</li>
                  <li><strong>Gebruik:</strong> Logo woordmerk, redactionele citaten, prestige badges</li>
                  <li><strong>Stijl:</strong> Klassieke Romeinse proporties, ruime tracking (0.1em - 0.26em)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Font 3: Plus Jakarta Sans */}
            <Card className="border-border/80 flex flex-col justify-between">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[11px] tracking-wider uppercase">
                    Core Interface
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">Google Font</span>
                </div>
                <CardTitle className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground pt-3">
                  Plus Jakarta Sans
                </CardTitle>
                <CardDescription className="text-xs">
                  CSS: <code className="font-mono text-accent">font-sans / --font-sans</code>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/60 rounded-xl space-y-2">
                  <p className="font-sans text-base font-bold text-foreground">
                    Duurzame groepsreizen en expedities
                  </p>
                  <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                    Geometrisch, modern en extreem helder op zowel mobiele schermen als desktopinterfaces.
                  </p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li><strong>Gewichten:</strong> 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)</li>
                  <li><strong>Gebruik:</strong> Bodyteksten, navigatiemenu, knoppen, labels, formulieren</li>
                  <li><strong>Stijl:</strong> Hoge x-hoogte, geoptimaliseerde leesbaarheid</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Typography Playground */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-accent" />
                <h3 className="font-heading text-lg font-bold">
                  {isNl ? "Interactieve Lettertype Tester" : "Interactive Typography Tester"}
                </h3>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <label className="text-xs text-muted-foreground flex items-center gap-2 font-mono">
                  <span>Size: {fontSize}px</span>
                  <input
                    type="range"
                    min="18"
                    max="64"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="accent-accent w-28 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Custom Input */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                {isNl ? "Typ je eigen voorbeeldtekst:" : "Type your sample text:"}
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-accent font-sans text-foreground"
                placeholder="Enter text to preview..."
              />
            </div>

            {/* Live Previews */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-xl bg-muted/40 border border-border/40 space-y-2">
                <span className="text-[11px] font-mono font-bold text-accent tracking-wider uppercase">
                  Bebas Neue (Hero)
                </span>
                <p
                  className="font-hero tracking-wide uppercase text-foreground transition-all break-words leading-none"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {customText || "TRAVELWILD"}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-muted/40 border border-border/40 space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#c59b6d] tracking-wider uppercase">
                  Cinzel (Brand Serif)
                </span>
                <p
                  className="font-brand font-bold tracking-wider text-foreground transition-all break-words leading-snug"
                  style={{ fontSize: `${Math.round(fontSize * 0.75)}px` }}
                >
                  {customText || "TRAVELWILD"}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-muted/40 border border-border/40 space-y-2">
                <span className="text-[11px] font-mono font-bold text-muted-foreground tracking-wider uppercase">
                  Plus Jakarta Sans (UI Sans)
                </span>
                <p
                  className="font-sans font-semibold text-foreground transition-all break-words leading-snug"
                  style={{ fontSize: `${Math.round(fontSize * 0.65)}px` }}
                >
                  {customText || "TRAVELWILD"}
                </p>
              </div>
            </div>
          </div>

          {/* Typography Scale Table */}
          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted/70 text-muted-foreground text-[11px] uppercase tracking-wider font-bold border-b border-border">
                <tr>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Font Family</th>
                  <th className="py-3 px-4">Size / Leading</th>
                  <th className="py-3 px-4">Weight & Tracking</th>
                  <th className="py-3 px-4">Gebruik / Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-sans">
                <tr>
                  <td className="py-3 px-4 font-bold text-accent font-mono">Hero Display</td>
                  <td className="py-3 px-4 font-hero text-xl uppercase">Bebas Neue</td>
                  <td className="py-3 px-4 font-mono text-xs">64px - 96px / 0.9</td>
                  <td className="py-3 px-4 text-xs">400 • tracking-tight</td>
                  <td className="py-3 px-4 text-muted-foreground">Homepage & Landing page main hero headers</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-accent font-mono">H1 Page Title</td>
                  <td className="py-3 px-4 font-hero text-xl uppercase text-foreground">Bebas Neue</td>
                  <td className="py-3 px-4 font-mono text-xs">40px - 72px / 1.0</td>
                  <td className="py-3 px-4 text-xs font-semibold">400 • uppercase • tracking-wide</td>
                  <td className="py-3 px-4 text-muted-foreground">Alle H1 paginatitels op de gehele site (itineraries, bestemmingen, CMS)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-accent font-mono">H2 Section Header</td>
                  <td className="py-3 px-4 font-sans font-bold">Plus Jakarta Sans</td>
                  <td className="py-3 px-4 font-mono text-xs">28px - 36px / 1.2</td>
                  <td className="py-3 px-4 text-xs">700 • tracking-tight</td>
                  <td className="py-3 px-4 text-muted-foreground">Section headers (Dag tot dag, Inbegrepen)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-accent font-mono">H3 Card Title</td>
                  <td className="py-3 px-4 font-sans font-bold">Plus Jakarta Sans</td>
                  <td className="py-3 px-4 font-mono text-xs">20px - 24px / 1.3</td>
                  <td className="py-3 px-4 text-xs">600 / 700</td>
                  <td className="py-3 px-4 text-muted-foreground">Destination cards, feature cards</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-accent font-mono">Body Large</td>
                  <td className="py-3 px-4 font-sans">Plus Jakarta Sans</td>
                  <td className="py-3 px-4 font-mono text-xs">18px / 28px</td>
                  <td className="py-3 px-4 text-xs">400 (Regular)</td>
                  <td className="py-3 px-4 text-muted-foreground">Lead paragraphs, intro highlights</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-accent font-mono">Body Regular</td>
                  <td className="py-3 px-4 font-sans">Plus Jakarta Sans</td>
                  <td className="py-3 px-4 font-mono text-xs">15px - 16px / 24px</td>
                  <td className="py-3 px-4 text-xs">400 (Regular)</td>
                  <td className="py-3 px-4 text-muted-foreground">Standard text, itineraries descriptions</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-accent font-mono">UI Caption / Badge</td>
                  <td className="py-3 px-4 font-sans">Plus Jakarta Sans</td>
                  <td className="py-3 px-4 font-mono text-xs">11px - 12px / 16px</td>
                  <td className="py-3 px-4 text-xs">600 / 700 • uppercase • tracking-wider</td>
                  <td className="py-3 px-4 text-muted-foreground">Difficulty badges, date labels, price tags</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3: LOGO & MONOGRAM */}
        <section id="logo" className="scroll-mt-28 space-y-10">
          <div className="border-b border-border/80 pb-5">
            <div className="flex items-center gap-2 text-accent text-xs font-bold tracking-widest uppercase mb-1">
              <Mountain className="h-4 w-4" />
              <span>03. {isNl ? "Logo & Visuele Merkelementen" : "Logo & Visual Brand Assets"}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isNl ? "Het Bergmonogram & Woordmerk" : "The Mountain Monogram & Wordmark"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
              {isNl
                ? "Het Travelwild logo combineert een gelaagd bergmonogram (waarin de letters 'T' en 'W' samenvloeien met bergpieken) met het verfijnde Cinzel woordmerk."
                : "The Travelwild logo synthesizes a layered mountain monogram (weaving the letters 'T' and 'W' into rugged alpine peaks) with the refined Cinzel wordmark."}
            </p>
          </div>

          {/* Interactive Logo Tester Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Logo Viewer Stage */}
            <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl border border-border/80 overflow-hidden shadow-md">
              {/* Background Theme Switcher Controls */}
              <div className="bg-card/90 p-4 border-b border-border/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isNl ? "Achtergrond testen:" : "Test Background:"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLogoTheme("night")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      logoTheme === "night"
                        ? "bg-[#0B1914] text-white ring-2 ring-accent"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Night Forest (#0B1914)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoTheme("light")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      logoTheme === "light"
                        ? "bg-[#FAF7F2] text-[#1A2420] ring-2 ring-accent"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Earth Sand (#FAF7F2)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoTheme("dark")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      logoTheme === "dark"
                        ? "bg-[#122B22] text-[#FAF7F2] ring-2 ring-accent"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Pine Forest (#122B22)
                  </button>
                </div>
              </div>

              {/* The Live Logo Stage */}
              <div
                className={`flex-1 p-12 sm:p-20 flex flex-col items-center justify-center transition-colors duration-300 relative ${
                  logoTheme === "night"
                    ? "bg-[#0B1914]"
                    : logoTheme === "light"
                    ? "bg-[#FAF7F2]"
                    : "bg-[#122B22]"
                }`}
              >
                {/* Clear Space Guide Lines (Subtle) */}
                <div className="absolute inset-8 sm:inset-12 border border-dashed border-accent/25 rounded-xl pointer-events-none flex items-start justify-end p-2">
                  <span className="text-[10px] font-mono text-accent/60 tracking-wider">
                    Safe Zone 1X
                  </span>
                </div>

                <div className="scale-125 sm:scale-150 transform transition-transform">
                  <TravelWildLogo
                    theme={
                      logoTheme === "light"
                        ? "dark"
                        : logoTheme === "night"
                        ? "light"
                        : "light"
                    }
                  />
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="bg-card p-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground font-mono">
                  Vector SVG • 545 × 240 viewbox
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(LOGO_SVG_CODE, "logo-svg")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors"
                  >
                    <Code2 className="h-3.5 w-3.5 text-accent" />
                    <span>Copy SVG Code</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Logo Specifications & Guidelines */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="border-border/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4 text-accent" />
                    <span>{isNl ? "Vrijruimte & Minimumgrootte" : "Clear Space & Minimum Size"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    <strong>Vrijruimte (X):</strong> Bewaar altijd minimaal de hoogte van de letter 'T' uit het monogram als lege marge rondom alle zijden van het logo.
                  </p>
                  <p>
                    <strong>Minimale Digitale Hoogte:</strong> 28px totale hoogte voor het gecombineerde logo; 20px voor het losse monogram.
                  </p>
                  <p>
                    <strong>Minimale Printhoogte:</strong> 12mm breedte voor gegarandeerde scherpte op drukwerk.
                  </p>
                </CardContent>
              </Card>

              {/* Do's and Don'ts */}
              <Card className="border-border/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {isNl ? "Logo Richtlijnen & Beperkingen" : "Logo Dos & Don'ts"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Gebruik het witte logo op donkere foto's en nachtbos achtergronden.</span>
                  </div>
                  <div className="flex items-start gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Behoud altijd de proporties en letterafstand van het woordmerk.</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span>Vervorm, roteer of stretch het bergmonogram nooit.</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span>Plaats het donkere logo niet op drukke, donkere foto's zonder overlay.</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SECTION 4: UI COMPONENTS */}
        <section id="components" className="scroll-mt-28 space-y-10">
          <div className="border-b border-border/80 pb-5">
            <div className="flex items-center gap-2 text-accent text-xs font-bold tracking-widest uppercase mb-1">
              <Layers className="h-4 w-4" />
              <span>04. {isNl ? "Componentenbibliotheek" : "UI Component Library"}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isNl ? "Knoppen, Badges & Kaarten" : "Buttons, Badges & Cards"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
              {isNl
                ? "Alle UI-componenten zijn gebaseerd op Radix UI primitieven en Tailwind CSS variabelen, met micro-animaties en tastbare hover feedback."
                : "All UI components are built with Radix UI primitives and Tailwind CSS design tokens, featuring tactile micro-animations and purposeful hover feedback."}
            </p>
          </div>

          {/* Buttons Showcase */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold">1. Buttons (Knoppen)</h3>
            <div className="p-6 sm:p-8 bg-card border border-border/80 rounded-2xl flex flex-wrap items-center gap-4">
              <Button variant="default">
                <span>Default / Primary Pine</span>
              </Button>

              <Button variant="wild">
                <Sparkles className="h-4 w-4" />
                <span>Wild Sunset Gradient</span>
              </Button>

              <Button variant="accent">
                <span>Safari Amber Accent</span>
              </Button>

              <Button variant="secondary">
                <span>Moss & Sage Secondary</span>
              </Button>

              {/* The Signature Gold Outlined Contact Button */}
              <Link
                href="#contact-btn"
                className="inline-flex items-center justify-center border border-[#c59b6d] hover:border-[#dfb689] bg-transparent hover:bg-[#c59b6d]/15 text-foreground uppercase text-xs font-bold tracking-widest px-5 py-2.5 rounded-sm transition-all shadow-xs"
              >
                Goud Omlijnd (Contact)
              </Link>

              <Button variant="outline">
                <span>Outline Border</span>
              </Button>

              <Button variant="ghost">
                <span>Ghost Button</span>
              </Button>

              <Button variant="destructive">
                <span>Destructive</span>
              </Button>
            </div>
          </div>

          {/* Badges Showcase */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold">2. Badges & Moeilijkheidsgraden</h3>
            <div className="p-6 sm:p-8 bg-card border border-border/80 rounded-2xl flex flex-wrap items-center gap-3">
              <Badge variant="difficultyEasy">
                <span>● Eenvoudig / Beginner</span>
              </Badge>

              <Badge variant="difficultyModerate">
                <span>● Gemiddeld / Moderate</span>
              </Badge>

              <Badge variant="difficultyChallenging">
                <span>▲ Uitdagend / Alpine</span>
              </Badge>

              <Badge variant="default">
                <span>Primary Pine Badge</span>
              </Badge>

              <Badge variant="accent">
                <span>Safari Amber Badge</span>
              </Badge>

              <Badge variant="secondary">
                <span>Sage Lichen Badge</span>
              </Badge>

              <Badge variant="outline">
                <span>Translucent Glass Badge</span>
              </Badge>

              <Badge variant="sand">
                <span>Earth Sand Tag</span>
              </Badge>
            </div>
          </div>

          {/* Cards Showcase */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold">3. Kaarten & Containers (Cards)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Light Earth Card */}
              <Card className="bg-card border-border/80">
                <CardHeader>
                  <Badge variant="difficultyModerate" className="w-fit mb-2">
                    7 DAGEN • TREKKING
                  </Badge>
                  <CardTitle className="text-xl">Faeröer Wandeltrektocht</CardTitle>
                  <CardDescription>
                    Woeste kliffen, noordse zeevogels en mistige bergpassen.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                    <span>Groepsgrootte: Max 10</span>
                    <span className="font-bold text-foreground text-sm">Vanaf € 1.890</span>
                  </div>
                  <Button variant="default" className="w-full">
                    <span>Bekijk Reis</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Dark Forest Card */}
              <div className="bg-[#0B1914] text-white p-6 rounded-2xl border border-white/10 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[#c59b6d] tracking-widest uppercase">
                      Bespoke Expedition
                    </span>
                    <Compass className="h-5 w-5 text-[#c59b6d]" />
                  </div>
                  <h4 className="font-heading text-xl font-bold text-white mb-2">
                    Reis Op Maat & Maatwerk
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Volledig gepersonaliseerde reisroutes afgestemd op jouw ritme, fysieke conditie en droomlocaties.
                  </p>
                </div>
                <div className="pt-6">
                  <button
                    type="button"
                    className="w-full border border-[#c59b6d] hover:bg-[#c59b6d]/20 text-white text-xs font-bold tracking-widest uppercase py-3 rounded-sm transition-all"
                  >
                    Stel Jouw Reis Samen
                  </button>
                </div>
              </div>

              {/* Frosted Glassmorphism Card */}
              <div className="bg-[#122B22]/90 backdrop-blur-md text-white p-6 rounded-2xl border border-[#c59b6d]/40 flex flex-col justify-between shadow-xl">
                <div>
                  <Badge variant="outline" className="border-accent text-accent mb-3">
                    DUURZAAMHEID
                  </Badge>
                  <h4 className="font-heading text-xl font-bold text-white mb-2">
                    Leave No Trace Filosofie
                  </h4>
                  <p className="text-xs text-white/75 leading-relaxed">
                    100% CO₂-compensatie, lokale gidsen, eco-lodges en respect voor ongerepte ecosystemen.
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-2 text-xs text-accent font-semibold">
                  <span>Lees ons duurzaamheidsverslag</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: VOICE & PHOTOGRAPHY */}
        <section id="voice" className="scroll-mt-28 space-y-10">
          <div className="border-b border-border/80 pb-5">
            <div className="flex items-center gap-2 text-accent text-xs font-bold tracking-widest uppercase mb-1">
              <Camera className="h-4 w-4" />
              <span>05. {isNl ? "Stem, Toon & Beeldtaal" : "Tone of Voice & Photography"}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isNl ? "Hoe Travelwild Spreekt & Ziet" : "How Travelwild Speaks & Sees"}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tone of Voice */}
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <span>{isNl ? "Tone of Voice Principes" : "Tone of Voice Principles"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <div>
                  <h4 className="font-bold text-foreground mb-1">1. Authentiek & Onversierd</h4>
                  <p>
                    Geen toeristische clichés, geen overdreven marketingkreten. We beschrijven de natuur zoals ze is: groots, ruig, stil en onvoorspelbaar.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">2. Deskundig & Betrokken</h4>
                  <p>
                    We spreken als ervaren berg- en wildernisgidsen. We kennen het terrein, respecteren de lokale bevolking en delen praktische wijsheid.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">3. Verfijnd Avontuur</h4>
                  <p>
                    Onze reizen zijn avontuurlijk, maar met zorg georganiseerd. We combineren rauwe wildernis met warme gastvrijheid en kleinschalig comfort.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Photography Art Direction */}
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Camera className="h-5 w-5 text-accent" />
                  <span>{isNl ? "Fotografie & Beeldregels" : "Photography Art Direction"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <div>
                  <h4 className="font-bold text-foreground mb-1">1. Atmosferisch Natuurlijk Licht</h4>
                  <p>
                    Gouden uur, ochtendmist, dramatische wolkenluchten en schemering. Vermijd harde middagzon of vlakke studioverlichting.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">2. Menselijke Schaal in Grootse Landschappen</h4>
                  <p>
                    Toon de reiziger als kleine ontdekker binnen gigantische bergmassieven, fjorden of savannes. Nooit geposeerde selfies.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">3. Aardse Kleurtonen (Earth Tone Grading)</h4>
                  <p>
                    Diepe naaldbostinten, warm zand en zachte schaduwen. Geen oververzadigde neonkleuren of kunstmatige filters.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 6: DESIGN TOKENS CODE SNIPPET */}
        <section className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-xl font-bold">
                {isNl ? "CSS & Tailwind Token Referentie" : "CSS & Tailwind Token Reference"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kopieerbare implementatiecode voor developers en componentcreatie.
              </p>
            </div>
            <button
              type="button"
              onClick={exportTokensJson}
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Full Token JSON</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-[#0B1914] text-[#FAF7F2] font-mono text-xs overflow-x-auto border border-white/10 leading-relaxed">
{`/* Travelwild Design System Core Tokens */
:root {
  --primary: 158 41% 12%;          /* #122B22 Deep Forest Pine */
  --primary-foreground: 38 43% 96%;/* #FAF7F2 Earth Sand */
  --secondary: 153 18% 36%;        /* #4A6B5D Moss & Sage */
  --muted: 38 25% 90%;             /* #EFE9DF Light Sand */
  --muted-foreground: 150 7% 39%;  /* #5C6B63 Slate Sage */
  --accent: 37 91% 44%;            /* #D97706 Safari Amber */
  --border: 36 20% 85%;            /* #E3DBD0 Warm Muted Bark */
  --color-gold-border: #C59B6D;    /* Architectural Gold */
  
  --font-hero: 'Bebas Neue', display, sans-serif;
  --font-brand: 'Cinzel', serif;
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
}`}
          </pre>
        </section>

      </div>
    </div>
  );
}
