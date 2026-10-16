'use client';

import { useState } from 'react';
import { ShieldCheck, BarChart3, Megaphone, SlidersHorizontal, Lock } from 'lucide-react';
import { useCookieConsent } from './CookieConsentProvider';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { CookieConsentCategories, DEFAULT_CATEGORIES } from '@/lib/cookies/consent-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Locale } from '@/lib/i18n/config';

interface PreferencesFormProps {
  initialCategories: CookieConsentCategories;
  locale: Locale;
  onSave: (categories: CookieConsentCategories) => void;
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
}

function PreferencesForm({
  initialCategories,
  locale,
  onSave,
  onAcceptAll,
  onRejectNonEssential,
}: PreferencesFormProps) {
  const [categories, setCategories] = useState<CookieConsentCategories>(initialCategories);

  const dict = getDictionary(locale);
  const t = dict.cookieBanner;

  const handleToggle = (key: keyof CookieConsentCategories) => {
    if (key === 'necessary') return; // Cannot disable necessary under GDPR
    setCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <DialogHeader className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <DialogTitle className="font-heading text-xl font-bold tracking-tight">
            {t.manageTitle}
          </DialogTitle>
        </div>
        <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
          {t.manageDescription}
        </DialogDescription>
      </DialogHeader>

      {/* Categories List */}
      <div className="space-y-4 my-6">
        {/* Strictly Necessary */}
        <div className="flex items-start justify-between gap-4 rounded-xl border border-border/80 bg-muted/40 p-4 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 text-accent">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-semibold text-foreground">
                  {t.categories.necessary.title}
                </h4>
                <Badge variant="sand" className="text-[10px] gap-1 font-medium">
                  <Lock className="h-2.5 w-2.5" />
                  {t.alwaysActive}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.categories.necessary.description}
              </p>
            </div>
          </div>
          <div className="pt-0.5">
            <Checkbox
              checked={true}
              disabled={true}
              aria-label={t.categories.necessary.title}
            />
          </div>
        </div>

        {/* Analytics / Google Analytics */}
        <div
          onClick={() => handleToggle('analytics')}
          className={`flex items-start justify-between gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
            categories.analytics
              ? 'border-accent/40 bg-accent/5'
              : 'border-border/80 bg-card hover:bg-muted/30'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 text-accent">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                {t.categories.analytics.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.categories.analytics.description}
              </p>
            </div>
          </div>
          <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={categories.analytics}
              onCheckedChange={() => handleToggle('analytics')}
              aria-label={t.categories.analytics.title}
            />
          </div>
        </div>

        {/* Marketing */}
        <div
          onClick={() => handleToggle('marketing')}
          className={`flex items-start justify-between gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
            categories.marketing
              ? 'border-accent/40 bg-accent/5'
              : 'border-border/80 bg-card hover:bg-muted/30'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 text-accent">
              <Megaphone className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                {t.categories.marketing.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.categories.marketing.description}
              </p>
            </div>
          </div>
          <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={categories.marketing}
              onCheckedChange={() => handleToggle('marketing')}
              aria-label={t.categories.marketing.title}
            />
          </div>
        </div>

        {/* Functional */}
        <div
          onClick={() => handleToggle('functional')}
          className={`flex items-start justify-between gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
            categories.functional
              ? 'border-accent/40 bg-accent/5'
              : 'border-border/80 bg-card hover:bg-muted/30'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 text-accent">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                {t.categories.functional.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.categories.functional.description}
              </p>
            </div>
          </div>
          <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={categories.functional}
              onCheckedChange={() => handleToggle('functional')}
              aria-label={t.categories.functional.title}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRejectNonEssential}
          className="text-xs"
        >
          {t.rejectNonEssential}
        </Button>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => onSave(categories)}
            className="text-xs font-semibold"
          >
            {t.savePreferences}
          </Button>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={onAcceptAll}
            className="text-xs font-semibold"
          >
            {t.acceptAll}
          </Button>
        </div>
      </div>
    </>
  );
}

export function CookiePreferencesDialog() {
  const {
    isPreferencesOpen,
    closePreferences,
    consent,
    locale,
    savePreferences,
    acceptAll,
    rejectNonEssential,
  } = useCookieConsent();

  return (
    <Dialog open={isPreferencesOpen} onOpenChange={(open) => !open && closePreferences()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        {isPreferencesOpen && (
          <PreferencesForm
            key={consent?.timestamp || 'initial'}
            initialCategories={consent?.categories || DEFAULT_CATEGORIES}
            locale={locale}
            onSave={savePreferences}
            onAcceptAll={acceptAll}
            onRejectNonEssential={rejectNonEssential}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
