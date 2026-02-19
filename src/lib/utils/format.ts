const persianNumberFormatter = new Intl.NumberFormat("fa-IR");
const persianPercentFormatter = new Intl.NumberFormat("fa-IR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export function toPersianNumber(value: number): string {
  return persianNumberFormatter.format(value);
}

export function toPersianDate(value?: string): string {
  if (!value) return "نامشخص";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "نامشخص";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function categoryToPersian(slug: string): string {
  return slug
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function toPersianPercent(value: number): string {
  return `${persianPercentFormatter.format(value)}٪`;
}
