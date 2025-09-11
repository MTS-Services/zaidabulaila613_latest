import Products from "@/interfaces/product/products";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading cart...</div>}>
            <Products />
        </Suspense>
    );
}