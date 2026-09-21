import { headers } from "next/headers";
import { AUTO_CURRENCY, detectCurrency, isCurrencyCode, resolveCurrency } from "@adea/core";

/**
 * The currency to show this person. Works it out from their location (the host's country
 * header when deployed, otherwise their browser language) unless they picked one by hand.
 */
export async function currencyFor(preferences: Record<string, unknown>) {
  const h = await headers();
  const detected = detectCurrency({
    country: h.get("x-vercel-ip-country"),
    acceptLanguage: h.get("accept-language"),
  });
  return {
    /** What to display. */
    code: resolveCurrency(preferences.currency, detected),
    /** What automatic mode picked. */
    detected,
    /** "auto" or the code they chose. */
    choice: isCurrencyCode(preferences.currency) ? preferences.currency : AUTO_CURRENCY,
  };
}
