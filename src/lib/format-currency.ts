/**
 * Formats a number as currency with space-separated thousands
 * @param amount - The amount to format
 * @returns Formatted string with currency symbol
 */
export function formatCurrency(amount: number): string {
  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} so'm`;
}
