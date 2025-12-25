import { useUZSExchangeRate } from "@/services/queries/config";

/**
 * Formats a USD amount as Uzbekistani som (UZS) with space-separated thousands
 * Products come from API in USD, so we convert to UZS using exchange rate
 * @param usdAmount - The amount in USD (from API)
 * @param exchangeRate - Exchange rate from USD to UZS (default: 12700)
 * @returns Formatted string with currency symbol "so'm"
 */
export function formatCurrency(
  usdAmount: number,
  exchangeRate: number = 12700
): string {
  // Convert USD to UZS
  const uzsAmount = usdAmount * exchangeRate;

  // Round to nearest integer (no decimals for UZS)
  const roundedAmount = Math.round(uzsAmount);

  // Format with space-separated thousands
  const formatted = roundedAmount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return `${formatted} so'm`;
}

/**
 * Formats a UZS amount (already in som) with space-separated thousands
 * Use this for values that are already in UZS (like delivery costs from API)
 * @param uzsAmount - The amount already in UZS
 * @returns Formatted string with currency symbol "so'm"
 */
export function formatUZS(uzsAmount: number): string {
  // Round to nearest integer (no decimals for UZS)
  const roundedAmount = Math.round(uzsAmount);

  // Format with space-separated thousands
  const formatted = roundedAmount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return `${formatted} so'm`;
}

/**
 * Hook version that automatically gets exchange rate from config API
 * Use this in React components for automatic exchange rate management
 * @returns A function that formats USD amounts to UZS
 */
export function useFormatCurrency() {
  const exchangeRate = useUZSExchangeRate();

  return (amount: number) => formatCurrency(amount, exchangeRate);
}
