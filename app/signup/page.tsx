import SignUp from "@/interfaces/auth/signUp";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading category...</div>}>
            <SignUp />
      </Suspense>
    );
}