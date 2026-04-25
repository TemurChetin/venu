const PURCHASE_CONVERSION_SEND_TO = "AW-18083229657/ZJZHCMqv758cENnf4K5D";

interface TrackPurchaseConversionParams {
  value: number;
  currency: string;
  transactionId: string | number;
  newCustomer?: boolean;
}

function normalizeValue(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.round(value * 100) / 100;
}

function hasTrackedTransaction(transactionId: string) {
  try {
    return window.localStorage.getItem(transactionId) === "1";
  } catch {
    return false;
  }
}

function markTransactionTracked(transactionId: string) {
  try {
    window.localStorage.setItem(transactionId, "1");
  } catch {
    // Tracking should still work if storage is unavailable.
  }
}

export function trackPurchaseConversion({
  value,
  currency,
  transactionId,
  newCustomer,
}: TrackPurchaseConversionParams) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const normalizedTransactionId = String(transactionId).trim();
  if (!normalizedTransactionId) {
    return;
  }

  const storageKey = `google_ads_purchase:${PURCHASE_CONVERSION_SEND_TO}:${normalizedTransactionId}`;
  if (hasTrackedTransaction(storageKey)) {
    return;
  }

  window.gtag("event", "conversion", {
    send_to: PURCHASE_CONVERSION_SEND_TO,
    value: normalizeValue(value),
    currency,
    transaction_id: normalizedTransactionId,
    ...(typeof newCustomer === "boolean" ? { new_customer: newCustomer } : {}),
  });

  markTransactionTracked(storageKey);
}
