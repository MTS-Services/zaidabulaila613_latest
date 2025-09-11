// components/AppLayout.tsx
"use client";
import { useLanguage } from "@/contexts/language-context";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-great-vibes" })

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { language } = useLanguage();

    return (
        <html lang={language.toLowerCase()} dir={language === "AR" ? "rtl" : "ltr"}>
            <body className={`${language === "AR" ? `text-right ${inter.variable}` : `${inter.variable} font-sans`} pt-16`}>
                {children}
            </body>
        </html>
    );
}