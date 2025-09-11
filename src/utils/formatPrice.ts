export function formatPriceToLakh(price: number): string {
  if (!Number.isFinite(price)) return "";

  const inLakh = price / 100000;
  const formatted = inLakh % 1 === 0 ? inLakh : inLakh.toFixed(1);
  return `${formatted} Lakhs`;
}
