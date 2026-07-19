const currencySymbols: Record<string, string> = {
  NGN: "₦",
  GBP: "£",
};

export default function displayCurrency(
  number: number,
  currency: "GBP" | "NGN" = "NGN"
) {
  const num = Number(number);
  if (typeof num !== "number" || isNaN(num)) {
    return `${currencySymbols[currency]}0.00`;
  }
  const locale = currency === "NGN" ? "en-NG" : "en-GB";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}
