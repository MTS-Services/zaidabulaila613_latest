import SignIn from "@/interfaces/auth/signIn";
import { Suspense } from 'react';
export default function Page() {
    return (
        <Suspense>
            <SignIn />
        </Suspense>
    );
}