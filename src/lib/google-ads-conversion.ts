const GOOGLE_ADS_ID = "AW-18083229657";

const GOOGLE_ADS_CONVERSION_LABELS = {
  registration: "Z6obCP6psKQcENnf4K5D",
  productPage: "pd9nCLWrsKQcENnf4K5D",
  addToCart: "qZ69CI_D3Z8cENnf4K5D",
  purchase: "ZJZHCMqv758cENnf4K5D",
} as const;

type ConversionName = keyof typeof GOOGLE_ADS_CONVERSION_LABELS;

interface ConversionPayload {
  send_to?: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
  new_customer?: boolean;
  product_id?: string | number;
  product_name?: string;
  quantity?: number;
}

interface TrackProductConversionParams {
  productId: string | number;
  productName?: string;
}

interface TrackAddToCartConversionParams extends TrackProductConversionParams {
  value: number;
  currency?: string;
  quantity?: number;
}

interface TrackPurchaseConversionParams {
  value: number;
  currency: string;
  transactionId: string | number;
  newCustomer?: boolean;
}

function normalizeValue(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  return Math.round(Number(value) * 100) / 100;
}

function getSendTo(conversionName: ConversionName) {
  return `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABELS[conversionName]}`;
}

function hasTrackedConversion(storageKey: string) {
  try {
    return window.localStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

function markConversionTracked(storageKey: string) {
  try {
    window.localStorage.setItem(storageKey, "1");
  } catch {
    // Tracking should still work if storage is unavailable.
  }
}

function sendConversion(
  conversionName: ConversionName,
  payload: ConversionPayload = {}
) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedPayload: ConversionPayload = {
    ...payload,
    send_to: getSendTo(conversionName),
  };

  if (typeof payload.value === "number") {
    const value = normalizeValue(payload.value);

    if (typeof value === "number") {
      normalizedPayload.value = value;
    } else {
      delete normalizedPayload.value;
    }
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", normalizedPayload);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["event", "conversion", normalizedPayload]);
}

export function trackRegistrationConversion() {
  sendConversion("registration");
}

export function trackProductPageConversion({
  productId,
  productName,
}: TrackProductConversionParams) {
  sendConversion("productPage", {
    product_id: productId,
    ...(productName ? { product_name: productName } : {}),
  });
}

export function trackAddToCartConversion({
  value,
  currency = "USD",
  productId,
  productName,
  quantity = 1,
}: TrackAddToCartConversionParams) {
  sendConversion("addToCart", {
    value,
    currency,
    product_id: productId,
    ...(productName ? { product_name: productName } : {}),
    quantity,
  });
}

export function trackPurchaseConversion({
  value,
  currency,
  transactionId,
  newCustomer,
}: TrackPurchaseConversionParams) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedTransactionId = String(transactionId).trim();
  if (!normalizedTransactionId) {
    return;
  }

  const storageKey = `google_ads_purchase:${getSendTo(
    "purchase"
  )}:${normalizedTransactionId}`;
  if (hasTrackedConversion(storageKey)) {
    return;
  }

  sendConversion("purchase", {
    value,
    currency,
    transaction_id: normalizedTransactionId,
    ...(typeof newCustomer === "boolean" ? { new_customer: newCustomer } : {}),
  });

  markConversionTracked(storageKey);
}
