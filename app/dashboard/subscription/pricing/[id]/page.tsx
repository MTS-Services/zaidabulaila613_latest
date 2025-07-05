import Checkout from "@/interfaces/subscription/payment";
import Pricing from "@/interfaces/subscription/pricing";


interface Props {
    params: { id: string };
}

export default function Page({ params }: Props) {
    return (
        <>
            <Checkout priceId={params.id} />
        </>
    );
}