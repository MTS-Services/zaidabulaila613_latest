import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const enCurrencies = [
  { id: 'jod', code: "JOD", countryCode: "JO", name: "Jordanian Dinar", symbol: "JOD" },
  { id: 'sar', code: "SAR", countryCode: "SA", name: "Saudi Riyal", symbol: "SAR" },
  { id: 'qar', code: "QAR", countryCode: "QA", name: "Qatari Riyal", symbol: 'QAR' },
  { id: 'aed', code: "AED", countryCode: "AE", name: "UAE Dirham", symbol: "AED" },
  { id: 'ils', code: "ILS", countryCode: "ILS", name: "Shekel", symbol: "Shekel", },
  { id: 'kwd', code: "KD", countryCode: "KW", name: "Kuwaiti Dinar", symbol: "KD" },
  { id: 'omr', code: "OMR", countryCode: "OM", name: "Omani Rial", symbol: "OMR" },
  { id: 'egp', code: "EGP", countryCode: "EG", name: "Egyptian Pound", symbol: 'EGP' },
  { id: 'usd', code: "USD", countryCode: "LB", name: "US Dollar (Lebanon)", symbol: 'USD' },
  { id: 'bhd', code: "BHD", countryCode: "BH", name: "Bahraini Dinar", symbol: "BHD" },
  { id: 'iqd', code: "IQD", countryCode: "IQ", name: "Iraqi Dinar", symbol: "IQD", },
]
export const arCurrencies = [
  { id: 'jod', code: "JOD", countryCode: "JO", name: "الأردن", symbol: "د.أ" },
  { id: 'sar', code: "SAR", countryCode: "SA", name: "السعودية", symbol: "ر. س" },
  { id: 'qar', code: "QAR", countryCode: "QA", name: "قطر", symbol: 'ر.ق' },
  { id: 'aed', code: "AED", countryCode: "AE", name: "الامارات ", symbol: "درهم.إ" },
  { id: 'ils', code: "ILS", countryCode: "ILS", name: "فلسطين", symbol: "دولار", },
  { id: 'kwd', code: "KD", countryCode: "KW", name: "كويت", symbol: "د.ك" },
  { id: 'omr', code: "OMR", countryCode: "OM", name: "عمان", symbol: "ر.ع" },
  { id: 'egp', code: "EGP", countryCode: "EG", name: "مصر", symbol: 'ج.م' },
  { id: 'usd', code: "USD", countryCode: "LB", name: "لبنان", symbol: 'دولار' },
  { id: 'bhd', code: "BHD", countryCode: "BH", name: "البحرين", symbol: "د.ب" },
  { id: 'iqd', code: "IQD", countryCode: "IQ", name: "العراق", symbol: "ع.د", },
]

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();