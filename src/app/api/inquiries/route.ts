import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { client as readClient } from "@/sanity/client";
import { FORMS_CONFIGURATION_QUERY } from "@/sanity/queries/pages.queries";
import { AdditionalFieldSubmission } from "@/lib/forms.types";

export interface InquiryPayload {
  inquiryType: "booking" | "contact" | "custom_trip";
  locale?: "nl" | "en";
  fullName: string;
  email: string;
  phone?: string;
  // Booking / Contact fields
  tripTitle?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
  currency?: string;
  travelers?: number;
  message?: string;
  // Custom trip fields
  customTripDetails?: {
    destination?: string;
    travelStyle?: string;
    duration?: string;
    departureMonth?: string;
  };
  // Dynamic CMS fields
  additionalFields?: AdditionalFieldSubmission[];
  // Honeypot anti-spam field
  _gotcha?: string;
}

interface EmailNotificationsConfig {
  recipientEmailOverride?: string | null;
  customTripConfirmationSubject?: string | null;
  customTripConfirmationIntro?: string | null;
  bookingConfirmationSubject?: string | null;
  bookingConfirmationIntro?: string | null;
  contactConfirmationSubject?: string | null;
  contactConfirmationIntro?: string | null;
  emailSignoff?: string | null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function interpolateTarget(template: string, target: string, asHtml = false): string {
  const safeTarget = asHtml ? `<strong>${escapeHtml(target)}</strong>` : target;
  if (template.includes("{target}")) {
    return asHtml
      ? escapeHtml(template).replace(/\{target\}/g, safeTarget)
      : template.replace(/\{target\}/g, safeTarget);
  }
  return asHtml ? escapeHtml(template) : template;
}

function buildTeamEmailHtml(payload: InquiryPayload, submittedAt: string): string {
  const typeBadge =
    payload.inquiryType === "booking"
      ? "🌿 Boekingsaanvraag / Booking Request"
      : payload.inquiryType === "contact"
        ? "💬 Informatieaanvraag / Contact Question"
        : "✨ Maatwerk Aanvraag / Custom Trip Proposal";

  const priceFormatted = payload.price
    ? `${payload.currency === "USD" ? "$" : "€"}${payload.price.toLocaleString()} p.p.`
    : null;

  const validAdditionalFields = (payload.additionalFields || []).filter(
    (f) => f && f.label && f.value
  );

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1c2826; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: #14362b; color: #ffffff; padding: 24px;">
        <p style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #d97736; font-weight: 700;">
          ${escapeHtml(typeBadge)}
        </p>
        <h1 style="margin: 0; font-size: 22px; font-weight: 800;">
          ${escapeHtml(
            payload.tripTitle ||
              payload.customTripDetails?.destination ||
              "Travelwild Website Lead"
          )}
        </h1>
      </div>

      <div style="padding: 24px;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin: 0 0 12px 0;">
          Gegevens Reiziger / Traveler Details
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; width: 40%;">Naam / Name</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${escapeHtml(payload.fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">E-mail</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
              <a href="mailto:${escapeHtml(payload.email)}" style="color: #d97736;">${escapeHtml(payload.email)}</a>
            </td>
          </tr>
          ${
            payload.phone
              ? `<tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">Telefoon / WhatsApp</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${escapeHtml(payload.phone)}</td>
                </tr>`
              : ""
          }
          ${
            payload.travelers
              ? `<tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">Aantal reizigers / Travelers</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${payload.travelers}</td>
                </tr>`
              : ""
          }
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">Taal / Locale</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${(payload.locale || "nl").toUpperCase()}</td>
          </tr>
        </table>

        ${
          payload.tripTitle || payload.startDate || priceFormatted
            ? `
          <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin: 0 0 12px 0;">
            Reis & Vertrek / Expedition Details
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            ${
              payload.tripTitle
                ? `<tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; width: 40%;">Reis / Expedition</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${escapeHtml(payload.tripTitle)}</td>
                  </tr>`
                : ""
            }
            ${
              payload.startDate
                ? `<tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">Vertrekdatum / Dates</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${escapeHtml(payload.startDate)}${payload.endDate ? ` → ${escapeHtml(payload.endDate)}` : ""}</td>
                  </tr>`
                : ""
            }
            ${
              priceFormatted
                ? `<tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">Richtprijs / Listed Price</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${escapeHtml(priceFormatted)}</td>
                  </tr>`
                : ""
            }
          </table>
        `
            : ""
        }

        ${
          payload.customTripDetails
            ? `
          <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin: 0 0 12px 0;">
            Maatwerk Voorkeuren / Custom Trip Preferences
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            ${
              payload.customTripDetails.destination
                ? `<tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; width: 40%;">Bestemming / Destination</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${escapeHtml(payload.customTripDetails.destination)}</td>
                  </tr>`
                : ""
            }
            ${
              payload.customTripDetails.travelStyle
                ? `<tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">Reisstijl / Travel Style</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${escapeHtml(payload.customTripDetails.travelStyle)}</td>
                  </tr>`
                : ""
            }
            ${
              payload.customTripDetails.duration
                ? `<tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">Reisduur / Duration</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${escapeHtml(payload.customTripDetails.duration)}</td>
                  </tr>`
                : ""
            }
            ${
              payload.customTripDetails.departureMonth
                ? `<tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">Reisperiode / Period</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${escapeHtml(payload.customTripDetails.departureMonth)}</td>
                  </tr>`
                : ""
            }
          </table>
        `
            : ""
        }

        ${
          validAdditionalFields.length > 0
            ? `
          <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin: 0 0 12px 0;">
            Extra Vragen / Additional Form Answers
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            ${validAdditionalFields
              .map(
                (field) => `<tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; width: 40%;">${escapeHtml(field.label)}</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${escapeHtml(field.value)}</td>
                </tr>`
              )
              .join("")}
          </table>
        `
            : ""
        }

        ${
          payload.message
            ? `
          <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin: 0 0 8px 0;">
            Bericht of Vraag / Message
          </h2>
          <div style="background: #f9fafb; border-left: 4px solid #d97736; padding: 14px; border-radius: 6px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(payload.message)}</div>
        `
            : ""
        }

        <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
          Ontvangen op ${new Date(submittedAt).toLocaleString("nl-NL")} • Klik direct op Beantwoorden (Reply) om terug te mailen naar ${escapeHtml(payload.fullName)}.
        </p>
      </div>
    </div>
  `;
}

function buildTravelerConfirmationHtml(
  payload: InquiryPayload,
  emailConfig?: EmailNotificationsConfig | null
): {
  subject: string;
  html: string;
} {
  const isNl = (payload.locale || "nl") === "nl";
  const subjectTarget =
    payload.tripTitle ||
    payload.customTripDetails?.destination ||
    (isNl ? "jouw reisaanvraag" : "your travel inquiry");

  const defaultSubject = isNl
    ? `Bevestiging van je aanvraag — ${subjectTarget} | Travelwild`
    : `We received your inquiry — ${subjectTarget} | Travelwild`;

  const configuredSubjectTemplate =
    payload.inquiryType === "booking"
      ? emailConfig?.bookingConfirmationSubject
      : payload.inquiryType === "contact"
        ? emailConfig?.contactConfirmationSubject
        : emailConfig?.customTripConfirmationSubject;

  const subject = configuredSubjectTemplate
    ? interpolateTarget(configuredSubjectTemplate, subjectTarget, false)
    : defaultSubject;

  const configuredIntroTemplate =
    payload.inquiryType === "booking"
      ? emailConfig?.bookingConfirmationIntro
      : payload.inquiryType === "contact"
        ? emailConfig?.contactConfirmationIntro
        : emailConfig?.customTripConfirmationIntro;

  const defaultIntroHtml =
    payload.inquiryType === "booking"
      ? isNl
        ? `Bedankt voor je boekingsaanvraag voor <strong>${escapeHtml(subjectTarget)}</strong>. Onze expeditiespecialist controleert direct de beschikbaarheid en neemt binnen 24 uur persoonlijk contact met je op.`
        : `Thank you for your booking inquiry for <strong>${escapeHtml(subjectTarget)}</strong>. Our expedition specialist is verifying availability and will reach out to you personally within 24 hours.`
      : payload.inquiryType === "contact"
        ? isNl
          ? `Bedankt voor je bericht over <strong>${escapeHtml(subjectTarget)}</strong>. We hebben je vraag goed ontvangen en komen binnen 24 uur bij je terug met een persoonlijk antwoord.`
          : `Thank you for your question regarding <strong>${escapeHtml(subjectTarget)}</strong>. We have received your message and an expedition specialist will reply within 24 hours.`
        : isNl
          ? `Bedankt voor je maatwerkaanvraag voor <strong>${escapeHtml(subjectTarget)}</strong>. Onze bestemmingsspecialist gaat aan de slag met jouw wensen en neemt binnen 24–48 uur contact met je op.`
          : `Thank you for your custom trip request for <strong>${escapeHtml(subjectTarget)}</strong>. Our destination specialist is reviewing your preferences and will contact you within 24–48 hours.`;

  const introText = configuredIntroTemplate
    ? interpolateTarget(configuredIntroTemplate, subjectTarget, true)
    : defaultIntroHtml;

  const signoffText =
    emailConfig?.emailSignoff ||
    (isNl ? "Met avontuurlijke groet," : "Warm regards,");

  const validAdditionalFields = (payload.additionalFields || []).filter(
    (f) => f && f.label && f.value
  );

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1c2826; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: #14362b; color: #ffffff; padding: 24px;">
        <p style="margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #d97736; font-weight: 700;">
          Travelwild Expeditions
        </p>
        <h1 style="margin: 0; font-size: 20px; font-weight: 800;">
          ${isNl ? `Beste ${escapeHtml(payload.fullName)},` : `Dear ${escapeHtml(payload.fullName)},`}
        </h1>
      </div>
      <div style="padding: 24px; font-size: 15px; line-height: 1.6;">
        <p style="margin-top: 0;">${introText}</p>
        ${
          payload.startDate
            ? `<p style="background: #f9fafb; padding: 12px 16px; border-radius: 8px; font-size: 14px;">
                <strong>${isNl ? "Geselecteerd vertrek:" : "Selected departure:"}</strong> ${escapeHtml(payload.startDate)}${payload.endDate ? ` → ${escapeHtml(payload.endDate)}` : ""}
              </p>`
            : ""
        }
        ${
          validAdditionalFields.length > 0
            ? `<div style="background: #f9fafb; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 16px;">
                ${validAdditionalFields
                  .map(
                    (f) =>
                      `<div style="margin-bottom: 4px;"><strong>${escapeHtml(f.label)}:</strong> ${escapeHtml(f.value)}</div>`
                  )
                  .join("")}
              </div>`
            : ""
        }
        ${
          payload.message
            ? `<p style="font-size: 13px; color: #4b5563;">
                <strong>${isNl ? "Jouw bericht:" : "Your message:"}</strong><br/>
                <em>"${escapeHtml(payload.message)}"</em>
              </p>`
            : ""
        }
        <p style="margin-bottom: 0; color: #4b5563; font-size: 14px;">
          ${escapeHtml(signoffText)}<br/>
          <strong>Team Travelwild</strong>
        </p>
      </div>
    </div>
  `;

  return { subject, html };
}

/**
 * GET /api/inquiries?locale=nl|en
 * Returns the localized formsConfiguration from Sanity so client-side modals (e.g. BookingModalDialog)
 * can render CMS-configured labels and custom questions without prop drilling.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") === "en" ? "en" : "nl";
    const data = await readClient.fetch(FORMS_CONFIGURATION_QUERY, {
      language: locale,
    });
    return NextResponse.json(data || {});
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InquiryPayload;

    // 1. Honeypot anti-spam check
    if (body._gotcha) {
      return NextResponse.json({ ok: true });
    }

    // 2. Basic validation
    const fullName = body.fullName?.trim();
    const email = body.email?.trim();
    const inquiryType = body.inquiryType || "booking";

    if (!fullName || !email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid name and email address." },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toISOString();
    const activeLocale = body.locale === "en" ? "en" : "nl";
    const payload: InquiryPayload = {
      ...body,
      inquiryType,
      fullName,
      email,
      locale: activeLocale,
    };

    // 3. Save lead backup in Sanity Studio & fetch email settings
    let sanityLeadId: string | null = null;
    let sanityRecipientEmail: string | null = null;
    let emailConfig: EmailNotificationsConfig | null = null;

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
    const writeToken = process.env.SANITY_API_WRITE_TOKEN;

    if (projectId && dataset) {
      const sanityClient = createClient({
        projectId,
        dataset,
        apiVersion: "2026-10-02",
        token: writeToken,
        useCdn: false,
      });

      // Fetch recipient email override & Resend email templates from siteSettings + formsConfiguration
      try {
        const [settings, formsDoc] = await Promise.all([
          sanityClient.fetch<{
            leadEmail?: string | null;
            generalEmail?: string | null;
          } | null>(
            `*[_type == "siteSettings"][0]{
              "leadEmail": contactInfo.leadNotificationEmail,
              "generalEmail": contactInfo.email
            }`
          ),
          sanityClient.fetch<{
            emailNotifications?: EmailNotificationsConfig | null;
          } | null>(
            `*[_type == "formsConfiguration"][0]{
              emailNotifications {
                recipientEmailOverride,
                "customTripConfirmationSubject": coalesce(customTripConfirmationSubject[$language], customTripConfirmationSubject.nl, customTripConfirmationSubject.en, customTripConfirmationSubject),
                "customTripConfirmationIntro": coalesce(customTripConfirmationIntro[$language], customTripConfirmationIntro.nl, customTripConfirmationIntro.en, customTripConfirmationIntro),
                "bookingConfirmationSubject": coalesce(bookingConfirmationSubject[$language], bookingConfirmationSubject.nl, bookingConfirmationSubject.en, bookingConfirmationSubject),
                "bookingConfirmationIntro": coalesce(bookingConfirmationIntro[$language], bookingConfirmationIntro.nl, bookingConfirmationIntro.en, bookingConfirmationIntro),
                "contactConfirmationSubject": coalesce(contactConfirmationSubject[$language], contactConfirmationSubject.nl, contactConfirmationSubject.en, contactConfirmationSubject),
                "contactConfirmationIntro": coalesce(contactConfirmationIntro[$language], contactConfirmationIntro.nl, contactConfirmationIntro.en, contactConfirmationIntro),
                "emailSignoff": coalesce(emailSignoff[$language], emailSignoff.nl, emailSignoff.en, emailSignoff)
              }
            }`,
            { language: activeLocale }
          ),
        ]);

        emailConfig = formsDoc?.emailNotifications || null;
        sanityRecipientEmail =
          emailConfig?.recipientEmailOverride ||
          settings?.leadEmail ||
          settings?.generalEmail ||
          null;
      } catch {
        // Ignore read error
      }

      if (writeToken) {
        try {
          const additionalFieldsDocs =
            payload.additionalFields && payload.additionalFields.length > 0
              ? payload.additionalFields.map((item, idx) => ({
                  _key: `${item.fieldKey || "field"}_${idx}`,
                  fieldKey: item.fieldKey,
                  label: item.label,
                  value: item.value,
                }))
              : undefined;

          const createdDoc = await sanityClient.create({
            _type: "leadInquiry",
            inquiryType: payload.inquiryType,
            status: "new",
            fullName: payload.fullName,
            email: payload.email,
            phone: payload.phone || undefined,
            locale: payload.locale,
            tripTitle: payload.tripTitle || undefined,
            startDate: payload.startDate || undefined,
            endDate: payload.endDate || undefined,
            price: payload.price ? Number(payload.price) : undefined,
            currency: payload.currency || undefined,
            travelers: payload.travelers ? Number(payload.travelers) : undefined,
            customTripDetails: payload.customTripDetails || undefined,
            additionalFields: additionalFieldsDocs,
            message: payload.message || undefined,
            submittedAt,
          });
          sanityLeadId = createdDoc._id;
        } catch (sanityErr) {
          console.error("[Inquiries API] Failed to store lead in Sanity:", sanityErr);
        }
      }
    }

    // 4. Send Emails via Resend (when RESEND_API_KEY is configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Travelwild <onboarding@resend.dev>";
    const recipientEmail =
      process.env.LEAD_NOTIFICATION_EMAIL ||
      sanityRecipientEmail ||
      "info@travelwild.nl";

    const subjectPrefix =
      payload.inquiryType === "booking"
        ? "🌿 [Boeking Aanvraag]"
        : payload.inquiryType === "contact"
          ? "💬 [Informatie Aanvraag]"
          : "✨ [Maatwerk Aanvraag]";

    const subjectTarget =
      payload.tripTitle ||
      payload.customTripDetails?.destination ||
      "Travelwild";

    const teamSubject = `${subjectPrefix} ${subjectTarget} — ${payload.fullName}`;
    const teamHtml = buildTeamEmailHtml(payload, submittedAt);
    const travelerConfirmation = buildTravelerConfirmationHtml(
      payload,
      emailConfig
    );

    let emailSent = false;

    if (resendApiKey) {
      // Send internal lead notification email to Travelwild team
      const teamRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [recipientEmail],
          reply_to: payload.email,
          subject: teamSubject,
          html: teamHtml,
        }),
      });

      if (!teamRes.ok) {
        const errText = await teamRes.text();
        console.error("[Inquiries API] Resend team email error:", errText);
      } else {
        emailSent = true;
      }

      // Send confirmation email copy to traveler
      const travelerRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [payload.email],
          reply_to: recipientEmail,
          subject: travelerConfirmation.subject,
          html: travelerConfirmation.html,
        }),
      });

      if (!travelerRes.ok) {
        const errText = await travelerRes.text();
        console.warn("[Inquiries API] Resend traveler confirmation warning:", errText);
      }
    } else {
      console.info(
        `[Inquiries API] Lead captured (${payload.inquiryType}) from ${payload.fullName} <${payload.email}> for "${subjectTarget}". (RESEND_API_KEY not configured yet — skipping email dispatch until configured).`
      );
    }

    return NextResponse.json({
      ok: true,
      sanityLeadId,
      emailSent,
    });
  } catch (error) {
    console.error("[Inquiries API] Unexpected error:", error);
    return NextResponse.json(
      { error: "Unable to process your inquiry right now. Please try again." },
      { status: 500 }
    );
  }
}
