export function formatPriceToLakh(price: any): string {
  if (!Number.isFinite(price)) return "";

  const inLakh = price / 100000;
  const formatted = inLakh % 1 === 0 ? inLakh : inLakh.toFixed(1);
  return `${formatted} Lakhs`;
}

export function formatPriceToL(price: any): string {
  if (!Number.isFinite(price)) return "";

  const inLakh = price / 100000;
  const formatted = inLakh % 1 === 0 ? inLakh : inLakh.toFixed(1);
  return `${formatted} L`;
}

export const formatShortNumber = (num: any, isKm = false) => {
    if (!num) return isKm ? "0 km" : "0";
    if (num >= 10000000)
      return (num / 10000000).toFixed(1) + " Cr" + (isKm ? " km" : "");
    if (num >= 100000)
      return (num / 100000).toFixed(1) + " L" + (isKm ? " km" : "");
    if (num >= 1000) return (num / 1000).toFixed(1) + "k" + (isKm ? " km" : "");
    return num + (isKm ? " km" : "");
  };
