export interface CustomFieldOption {
  value: string;
  label: string;
}

export interface CustomFieldDefinition {
  _key?: string;
  fieldKey: string;
  label: string;
  fieldType: "select" | "text" | "textarea" | "number";
  step?: number;
  placeholder?: string;
  options?: CustomFieldOption[];
  required?: boolean;
}

export interface AdditionalFieldSubmission {
  fieldKey: string;
  label: string;
  value: string;
}

export interface SelectOptionItem {
  id: string;
  label: string;
}

export interface CustomTripFormConfig {
  badge?: string;
  heading?: string;
  subheading?: string;
  // Step 1
  step1Title?: string;
  destinationLabel?: string;
  destinationPlaceholder?: string;
  travelStyleLabel?: string;
  travelStyleOptions?: SelectOptionItem[];
  nextButtonStep1?: string;
  // Step 2
  step2Title?: string;
  departureMonthLabel?: string;
  departureMonthPlaceholder?: string;
  travelersLabel?: string;
  durationLabel?: string;
  durationOptions?: SelectOptionItem[];
  nextButtonStep2?: string;
  // Step 3
  step3Title?: string;
  fullNameLabel?: string;
  emailLabel?: string;
  phoneLabel?: string;
  phoneRequired?: boolean;
  notesLabel?: string;
  notesPlaceholder?: string;
  submitButtonLabel?: string;
  // Dynamic Custom Fields
  customFields?: CustomFieldDefinition[];
  // Success Screen
  successHeading?: string;
  successMessage?: string;
}

export interface BookingContactFormConfig {
  bookingBadge?: string;
  bookingHeading?: string;
  bookingDescription?: string;
  contactBadge?: string;
  contactHeading?: string;
  contactDescription?: string;
  fullNameLabel?: string;
  emailLabel?: string;
  phoneLabel?: string;
  travelersLabel?: string;
  messageBookingLabel?: string;
  messageBookingPlaceholder?: string;
  messageContactLabel?: string;
  messageContactPlaceholder?: string;
  bookingSubmitLabel?: string;
  contactSubmitLabel?: string;
  bookingSuccessHeading?: string;
  contactSuccessHeading?: string;
  successMessage?: string;
  customFields?: CustomFieldDefinition[];
}

export interface FormsConfigurationData {
  customTripForm?: CustomTripFormConfig;
  bookingContactForm?: BookingContactFormConfig;
}
