"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define the currencies without Israeli Shekel
const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", symbol: "$", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar", flag: "🇰🇼" },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal", flag: "🇶🇦" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound", flag: "🇪🇬" },
  { code: "JOD", symbol: "د.ا", name: "Jordanian Dinar", flag: "🇯🇴" },
  { code: "USD", symbol: "$", name: "Lebanese Dollar", flag: "🇱🇧" }, // Lebanon using USD
]

export default function CurrencySelector() {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 border-none">
          <span className="text-sm font-medium">{selectedCurrency.flag}</span>
          <span className="text-sm font-medium">{selectedCurrency.code}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={`${currency.code}-${currency.flag}`}
            className="flex items-center justify-between"
            onClick={() => setSelectedCurrency(currency)}
          >
            <div className="flex items-center gap-2">
              <span>{currency.flag}</span>
              <span>
                {currency.name} ({currency.symbol})
              </span>
            </div>
            {selectedCurrency.code === currency.code && selectedCurrency.flag === currency.flag && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
