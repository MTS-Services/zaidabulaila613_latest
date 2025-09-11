'use client'
import Checkout from "@/interfaces/subscription/paymentChckout";
import { useParams } from "next/navigation";

export default function Page() {

    const {id} = useParams()

    if(!id)
        return
    return (
        <>
            <Checkout priceId={id?.toString()} />
        </>
    );
}