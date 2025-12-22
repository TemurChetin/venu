// src/lib/format-currensy.ts
export function formatCurrency(amount: number) {
  // Manual formatting: 1234567 -> "1 234 567 so'm"
  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} so'm`;
}
