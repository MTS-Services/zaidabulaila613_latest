import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const currencies = [
  { id: 'jod', code: "JOD", countryCode: "JO", name: "Jordanian Dinar", symbol: "JD" },
  { id: 'sar', code: "SAR", countryCode: "SA", name: "Saudi Riyal", symbol: "SR" },
  { id: 'qar', code: "QAR", countryCode: "QA", name: "Qatari Riyal", symbol: 'QR' },
  { id: 'aed', code: "AED", countryCode: "AE", name: "UAE Dirham", symbol: "AED" },
  { id: 'kwd', code: "KWD", countryCode: "KW", name: "Kuwaiti Dinar", symbol: "KD" },
  { id: 'omr', code: "OMR", countryCode: "OM", name: "Omani Rial", symbol: "OMR" },
  { id: 'egp', code: "EGP", countryCode: "EG", name: "Egyptian Pound", symbol: 'EGP' },
  // { id: 'lbp', code: "LBP", countryCode: "LB", name: "US Dollar (Lebanon)",  },
  { id: 'bhd', code: "BHD", countryCode: "BH", name: "Bahraini Dinar", symbol: "BD" },
  { id: 'iqd', code: "IQD", countryCode: "IQ", name: "Iraqi Dinar", symbol: "IQD", },
  { id: 'usd', code: "USD", countryCode: "US", name: "US Dollar", symbol: "$", },
]

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();