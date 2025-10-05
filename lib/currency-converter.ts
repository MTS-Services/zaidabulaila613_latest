// Simple currency conversion rates (base: USD)
// These rates are approximate and should ideally come from a real-time API
export const exchangeRates: Record<string, number> = {
  USD: 1.0, // Base currency
  JOD: 0.709, // 1 USD = 0.709 JOD
  SAR: 3.75, // 1 USD = 3.75 SAR
  AED: 3.67, // 1 USD = 3.67 AED
  QAR: 3.64, // 1 USD = 3.64 QAR
  KWD: 0.306, // 1 USD = 0.306 KWD
  OMR: 0.385, // 1 USD = 0.385 OMR
  BHD: 0.376, // 1 USD = 0.376 BHD
  EGP: 47.65, // 1 USD = 47.5 EGP (approximate)
  IQD: 1310.36, // 1 USD = 1310.36 IQD (approximate)
  ILS: 3.3, // 1 USD = 3.3 ILS (approximate)
};

/**
 * Convert amount from one currency to another
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @returns Converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromRate = exchangeRates[fromCurrency.toUpperCase()];
  const toRate = exchangeRates[toCurrency.toUpperCase()];

  if (!fromRate || !toRate) {
    console.warn(
      `Exchange rate not found for ${fromCurrency} or ${toCurrency}`
    );
    return amount; // Return original amount if rates not found
  }

  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  const convertedAmount = usdAmount * toRate;

  return convertedAmount;
}

/**
 * Format currency with proper symbol and formatting
 * @param amount - Amount to format
 * @param currencyCode - Currency code
 * @param currencySymbol - Currency symbol
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currencyCode: string,
  currencySymbol: string
): string {
  return `${currencySymbol} ${amount.toFixed(2)}`;
}
