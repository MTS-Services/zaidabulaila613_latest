'use client'
import SignIn from "@/interfaces/auth/signIn";
import { useTranslation } from "@/hooks/use-translation";

export default function Page() {
    const {t} = useTranslation();
    
    return (
        <>
            <h1>{t('dashboard.title')}</h1>
        </>
    );
}