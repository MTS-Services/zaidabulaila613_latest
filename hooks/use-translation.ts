import en from "@/lib/i18n/en.json";
import ar from "@/lib/i18n/ar.json";
import { useLanguage } from "@/contexts/language-context";
import React from "react";

const translations = {
    EN: en,
    AR: ar,
};

export const useTranslation = () => {
    const { language } = useLanguage();

    const t = (key: string, params?: Record<string, any>): string | any => {
        const keys = key.split('.');
        let result: any = translations[language];

        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) break;
        }

        // Return the exact value if it's a string or ReactNode
        if (typeof result === 'string' || React.isValidElement(result)) {
            if (params && typeof result === 'string') {
                return Object.keys(params).reduce((acc, paramKey) => {
                    return acc.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
                }, result);
            }
            return result;
        }

        // If we didn't find a translation, return the last part of the key
        return keys[keys.length - 1];
    };

    return { t, language };
};