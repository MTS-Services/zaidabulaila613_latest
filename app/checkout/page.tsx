import CheckoutPage from "@/interfaces/checkout/checkout";
import { Suspense } from "react";

export default function Page() {
    return (
       <Suspense fallback={<div>Loading category...</div>}>
            <CheckoutPage />
        </Suspense>
    );
}