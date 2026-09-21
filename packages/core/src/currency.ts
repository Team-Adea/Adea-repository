/**
 * Currency: detected automatically from where the person is, and always changeable by hand.
 * Amounts stay plain numbers in the database; the currency only affects how they are shown.
 */

export interface CurrencyOption {
  code: string;
  name: string;
}

export const CURRENCIES: readonly CurrencyOption[] = [
  { code: "PHP", name: "Philippine peso" },
  { code: "USD", name: "US dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British pound" },
  { code: "CAD", name: "Canadian dollar" },
  { code: "AUD", name: "Australian dollar" },
  { code: "NZD", name: "New Zealand dollar" },
  { code: "SGD", name: "Singapore dollar" },
  { code: "HKD", name: "Hong Kong dollar" },
  { code: "JPY", name: "Japanese yen" },
  { code: "KRW", name: "South Korean won" },
  { code: "INR", name: "Indian rupee" },
  { code: "IDR", name: "Indonesian rupiah" },
  { code: "MYR", name: "Malaysian ringgit" },
  { code: "THB", name: "Thai baht" },
  { code: "AED", name: "UAE dirham" },
  { code: "SAR", name: "Saudi riyal" },
  { code: "CHF", name: "Swiss franc" },
  { code: "SEK", name: "Swedish krona" },
  { code: "NOK", name: "Norwegian krone" },
  { code: "DKK", name: "Danish krone" },
  { code: "ZAR", name: "South African rand" },
  { code: "BRL", name: "Brazilian real" },
  { code: "MXN", name: "Mexican peso" },
] as const;

export const DEFAULT_CURRENCY = "USD";

/** The stored choice that means "work it out for me". */
export const AUTO_CURRENCY = "auto";

const REGION_TO_CURRENCY: Record<string, string> = {
  PH: "PHP", US: "USD", GB: "GBP", CA: "CAD", AU: "AUD", NZ: "NZD", SG: "SGD", HK: "HKD",
  JP: "JPY", KR: "KRW", IN: "INR", ID: "IDR", MY: "MYR", TH: "THB", AE: "AED", SA: "SAR",
  CH: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", ZA: "ZAR", BR: "BRL", MX: "MXN",
  ...Object.fromEntries(
    ["AT", "BE", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES", "HR"].map(
      (region) => [region, "EUR"],
    ),
  ),
};

export function isCurrencyCode(value: unknown): value is string {
  return typeof value === "string" && CURRENCIES.some((c) => c.code === value);
}

/**
 * Best guess at someone's currency. Their country (from the network, when the host gives it)
 * wins; otherwise the first region named in their browser languages, e.g. "en-PH,en;q=0.9".
 */
export function detectCurrency({
  country,
  acceptLanguage,
}: {
  country?: string | null;
  acceptLanguage?: string | null;
}): string {
  const fromCountry = country ? REGION_TO_CURRENCY[country.trim().toUpperCase()] : undefined;
  if (fromCountry) return fromCountry;

  for (const part of (acceptLanguage ?? "").split(",")) {
    const region = part.split(";")[0].trim().match(/^[a-z]{2,3}-([a-z]{2})$/i)?.[1];
    const currency = region ? REGION_TO_CURRENCY[region.toUpperCase()] : undefined;
    if (currency) return currency;
  }
  return DEFAULT_CURRENCY;
}

/** The currency to show: their manual choice if they made one, else what we detected. */
export function resolveCurrency(choice: unknown, detected: string): string {
  return isCurrencyCode(choice) ? choice : detected;
}

export function formatMoney(amount: number, currency: string = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

/** Just the symbol, e.g. "₱" or "$". */
export function currencySymbol(currency: string): string {
  const part = new Intl.NumberFormat("en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol" })
    .formatToParts(0)
    .find((p) => p.type === "currency");
  return part?.value ?? currency;
}
