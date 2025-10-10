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

// utils/formatTimeAgo.ts

export const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 5) return "Just now";
  if (diffInSeconds < 60)
    return diffInSeconds + (diffInSeconds === 1 ? " sec ago" : " secs ago");

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return diffInMinutes + (diffInMinutes === 1 ? " min ago" : " mins ago");

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return diffInHours + (diffInHours === 1 ? " hr ago" : " hrs ago");

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30)
    return diffInDays + (diffInDays === 1 ? " day ago" : " days ago");

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12)
    return diffInMonths + (diffInMonths === 1 ? " month ago" : " months ago");

  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears + (diffInYears === 1 ? " year ago" : " years ago");
};
