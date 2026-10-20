"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomFieldDefinition } from "@/lib/forms.types";

interface DynamicFormFieldsProps {
  fields: CustomFieldDefinition[];
  values: Record<string, string>;
  onChange: (fieldKey: string, value: string) => void;
}

export function DynamicFormFields({
  fields,
  values,
  onChange,
}: DynamicFormFieldsProps) {
  if (!fields || fields.length === 0) return null;

  return (
    <div className="space-y-5">
      {fields.map((field) => {
        const key = field.fieldKey || field._key || "";
        if (!key) return null;
        const currentValue = values[key] ?? "";
        const labelText = field.label || key;
        const hasAsterisk = labelText.trim().endsWith("*");
        const displayLabel =
          field.required && !hasAsterisk ? `${labelText} *` : labelText;

        if (field.fieldType === "select" && field.options && field.options.length > 0) {
          const colsClass =
            field.options.length === 2
              ? "grid-cols-2"
              : field.options.length === 3
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-2 sm:grid-cols-4";

          return (
            <div key={key} className="space-y-2">
              <label className="text-sm font-bold text-foreground block">
                {displayLabel}
              </label>
              <div className={`grid ${colsClass} gap-3`}>
                {field.options.map((opt) => {
                  const isSelected = currentValue === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => onChange(key, opt.value)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-background hover:bg-muted text-foreground border-border"
                      }`}
                    >
                      {opt.label || opt.value}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        if (field.fieldType === "textarea") {
          return (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-bold text-foreground block">
                {displayLabel}
              </label>
              <Textarea
                rows={3}
                required={field.required}
                placeholder={field.placeholder || ""}
                value={currentValue}
                onChange={(e) => onChange(key, e.target.value)}
              />
            </div>
          );
        }

        if (field.fieldType === "number") {
          return (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-bold text-foreground block">
                {displayLabel}
              </label>
              <Input
                type="number"
                required={field.required}
                placeholder={field.placeholder || ""}
                value={currentValue}
                onChange={(e) => onChange(key, e.target.value)}
              />
            </div>
          );
        }

        // Default: 'text'
        return (
          <div key={key} className="space-y-1.5">
            <label className="text-sm font-bold text-foreground block">
              {displayLabel}
            </label>
            <Input
              type="text"
              required={field.required}
              placeholder={field.placeholder || ""}
              value={currentValue}
              onChange={(e) => onChange(key, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Helper to check if all required custom fields in a given list have non-empty values.
 */
export function areRequiredCustomFieldsValid(
  fields: CustomFieldDefinition[],
  values: Record<string, string>
): boolean {
  for (const field of fields) {
    if (field.required) {
      const key = field.fieldKey || field._key || "";
      if (key && !(values[key] ?? "").trim()) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Converts custom field state into structured `{ fieldKey, label, value }[]` for the API.
 * Resolves option labels when `fieldType === 'select'`.
 */
export function formatAdditionalFieldsForSubmission(
  fields: CustomFieldDefinition[] | undefined,
  values: Record<string, string>
) {
  if (!fields || fields.length === 0) return undefined;

  const result: Array<{ fieldKey: string; label: string; value: string }> = [];

  for (const field of fields) {
    const key = field.fieldKey || field._key || "";
    if (!key) continue;
    const rawValue = (values[key] ?? "").trim();
    if (!rawValue) continue;

    let displayValue = rawValue;
    if (field.fieldType === "select" && field.options) {
      const matchedOpt = field.options.find((o) => o.value === rawValue);
      if (matchedOpt?.label) {
        displayValue = matchedOpt.label;
      }
    }

    result.push({
      fieldKey: key,
      label: (field.label || key).replace(/\s*\*$/, ""),
      value: displayValue,
    });
  }

  return result.length > 0 ? result : undefined;
}
