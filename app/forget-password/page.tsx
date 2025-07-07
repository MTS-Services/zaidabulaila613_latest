import ForgetPassword from "@/interfaces/auth/forgotPassword";
import { Suspense } from "react";

export default function Page() {
    return (
         <Suspense fallback={<div>Loading ...</div>}>
            <ForgetPassword />
        </Suspense>
    );
}