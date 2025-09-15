// app/verify-account/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import VerifyEmail from '@/interfaces/auth/verifyEmail';
import VerifyOTP from '@/interfaces/auth/verifyOTP'; // <-- Notun OTP component import korun

function VerificationPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const mobile = searchParams.get('mobile');

    // URL e 'mobile' parameter thakle OTP component dekhabe
    if (mobile) {
        return <VerifyOTP />;
    }

    // URL e 'email' parameter thakle Email component dekhabe
    if (email) {
        return <VerifyEmail />;
    }

    // Kichu na pele default Email component dekhabe
    return <VerifyEmail />;
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerificationPage />
        </Suspense>
    );
}