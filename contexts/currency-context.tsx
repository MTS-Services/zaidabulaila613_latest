"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./auth-context";
import { arCurrencies, enCurrencies } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

export type Currency = {
    id: string;
    code: string;
    countryCode: string;
    name: string;
    symbol: string;
};

type CurrencyContextType = {
    selectedCurrency: Currency;
    setSelectedCurrency: (currency: Currency) => void;
};



const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const { language } = useTranslation(); // "en" or "ar"

    const currentCurrencyList = language === "AR" ? arCurrencies : enCurrencies;
    const defaultCurrency = currentCurrencyList.find((c) => c.code === "JOD") || currentCurrencyList.find((c) => c.code === "USD")!;
    const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(defaultCurrency);

 useEffect(() => {
    const currentCurrencyList = language === "AR" ? arCurrencies : enCurrencies;
    const defaultCurrency = currentCurrencyList.find((c) => c.code === "JOD") || currentCurrencyList.find((c) => c.code === "USD")!;
    const saved = localStorage.getItem("selectedCurrency");
    const userCurrencyCode = user?.user?.account?.currency?.value;

    let matched: Currency | undefined;

    if (userCurrencyCode) {
        matched = currentCurrencyList.find((c) => c.code === userCurrencyCode.toUpperCase());
    } else if (saved) {
        try {
            const parsed = JSON.parse(saved);
            matched = currentCurrencyList.find((c) => c.code === parsed.code);
        } catch {
            matched = defaultCurrency;
        }
    }

    setSelectedCurrencyState(matched ?? defaultCurrency);
}, [user, language]);

    const setSelectedCurrency = (currency: Currency) => {
        localStorage.setItem("selectedCurrency", JSON.stringify(currency));
        setSelectedCurrencyState(currency);
    };

    return (
        <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
};
