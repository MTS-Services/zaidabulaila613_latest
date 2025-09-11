"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./auth-context";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "@/graphql/mutation";

type Language = "EN" | "AR";

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const defaultLanguage: Language = "EN";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const { updateUser: updatedUserData, user } = useAuth();
    const [language, setLanguageState] = useState<Language>(defaultLanguage);
    const [updateUser, { data, loading, error }] = useMutation(UPDATE_USER_MUTATION)
    useEffect(() => {
        const saved = localStorage.getItem("selectedLanguage");

        if (user?.user?.account?.lang) {
            const lang = user?.user?.account?.lang.toUpperCase();
            if (lang === "AR" || lang === "EN") {
                setLanguageState(lang as Language);
                localStorage.setItem("selectedLanguage", lang);
                return;
            }
        }

        if (saved === "AR" || saved === "EN") {
            setLanguageState(saved as Language);
        } else {
            setLanguageState(defaultLanguage);
        }
    }, [user]);

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("selectedLanguage", lang);
        if (user?.user?.id) {
            try {
                const response = await updateUser({
                    variables: {
                        user: {
                            account: {
                                lang,
                            },
                        },
                    },
                });
                const result = response?.data?.updateUser?.account;
                console.log(data, "Data")
                updatedUserData(result);
            } catch (error) {
                console.error("Failed to update language:", error);
            }
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
    return context;
};
