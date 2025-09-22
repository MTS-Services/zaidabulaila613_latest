'use client'
import { useTranslation } from "@/hooks/use-translation";
import { getPlanByPriceId, PaymentForm } from "./payment";

export default function Checkout({ priceId }: { priceId: string }) {

    const {t} = useTranslation()
    if (!priceId) {
        return <div className="text-red-500">Missing priceId</div>;
    }
     const pricingPlans = [
        {
            name: t('dashboard.subcription.basicplan.name'),
            description: t('dashboard.subcription.basicplan.description'),
            features: [
                t('dashboard.subcription.basicplan.feature1'),
                t('dashboard.subcription.basicplan.feature2'),
                t('dashboard.subcription.basicplan.feature3'),
                t('dashboard.subcription.basicplan.feature4')
            ],
            prices: {
                monthly: { price: t('dashboard.subcription.basicplan.monpr'), priceId: 'price_1RYgmZInHvXcV9Pz2seilITg' },
                quarterly: { price: t('dashboard.subcription.basicplan.quarpr'), priceId: 'price_1RYgmZInHvXcV9PzMyZltjkq' }, // 10% discount
                yearly: { price: t('dashboard.subcription.basicplan.yearpr'), priceId: 'price_1RYgmZInHvXcV9PzMPJnMNDc' } // 20% discount
            }
        },
        {
            name: t('dashboard.subcription.platinumplan.name'),
            description: t('dashboard.subcription.platinumplan.description'),
            features: [
                t('dashboard.subcription.platinumplan.feature1'),
                t('dashboard.subcription.platinumplan.feature2'),
                t('dashboard.subcription.platinumplan.feature3'),
                t('dashboard.subcription.platinumplan.feature4'),
                t('dashboard.subcription.platinumplan.feature5')

            ],
            prices: {
                monthly: { price: t('dashboard.subcription.platinumplan.monpr'), priceId: 'price_1S8HnQD60jTqpzFUWDXhVTWE' },
                quarterly: { price: t('dashboard.subcription.platinumplan.quarpr'), priceId: 'price_1RiKX1InHvXcV9PzlO4KAAFl' }, // Quarterly Platinum
                yearly: { price: t('dashboard.subcription.platinumplan.yearpr'), priceId: 'price_1SA4FTD60jTqpzFUXylDnaYz' } // Yearly Platinum
            }
        },
        {
            name: t('dashboard.subcription.vendorplan.name'),
            description: t('dashboard.subcription.vendorplan.description'),
            features: [
                t('dashboard.subcription.vendorplan.feature1'),
                t('dashboard.subcription.vendorplan.feature2'),
                t('dashboard.subcription.vendorplan.feature3'),
                t('dashboard.subcription.vendorplan.feature4'),
                t('dashboard.subcription.vendorplan.feature5'),
                t('dashboard.subcription.vendorplan.feature6')
            ],
            prices: {
                monthly: { price: t('dashboard.subcription.vendorplan.monpr'), priceId: 'price_1RiKY9InHvXcV9Pzfl25jzfU' },
                quarterly: { price: t('dashboard.subcription.vendorplan.quarpr'), priceId: 'price_1RiKZkInHvXcV9PzTruj2Gjg' }, // Quarterly Vendor
                yearly: { price: t('dashboard.subcription.vendorplan.yearpr'), priceId: 'price_1RiKZkInHvXcV9Pzuzj1XGhJ' } // Yearly Vendor
            }
        }
    ];

    const planInfo = getPlanByPriceId(priceId, pricingPlans);

    if (!planInfo) {
        return <div className="text-red-500">Invalid priceId</div>;
    }

    const { plan, duration } = planInfo;
    const price = plan.prices[duration].price;

    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto p-6">
            {/* Left: Checkout Form */}
            <div>
                <h2 className="text-xl font-semibold mb-4">{t("dashboard.subcription.completeSub")}</h2>
                <PaymentForm priceId={priceId} />
            </div>

            {/* Right: Plan Details */}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
                <h3 className="text-2xl font-bold mb-2">{plan.name} {t("dashboard.subcription.plan")}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <div className="text-lg font-medium mb-4">
                    ${price} / {duration === "monthly" ? t('dashboard.subcription.monthly') :
                                    duration === "yearly" ? t('dashboard.subcription.yearly') :
                                        duration === "quarterly" ? t('dashboard.subcription.quarterly') :
                                            null}
                </div>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                    {plan.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}