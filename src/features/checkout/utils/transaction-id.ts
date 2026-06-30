export function createFallbackTransactionId(guestId: string | number) {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `checkout-${guestId}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}
