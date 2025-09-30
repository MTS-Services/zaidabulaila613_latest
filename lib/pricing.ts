// types.ts
export type PlanDuration = 'monthly' | 'quarterly' | 'yearly';

export interface PricingPlan {
    name: string;
    description: string;
    features: string[];
    prices: {
        monthly: { price: number, priceId: string };
        quarterly: { price: number, priceId: string };
        yearly: { price: number, priceId: string };
    };
}

export const pricingPlans: PricingPlan[] = [
    {
        name: 'Basic',
        description: 'For individuals getting started with dress listings',
        features: [
            'Add up to 5 dresses',
            '5 images per dress',
            'Edit and upload images',
            'Basic visibility'
        ],
        prices: {
            monthly: { price: 0, priceId: 'price_1RYgmZInHvXcV9Pz2seilITg' },
            quarterly: { price: 0, priceId: 'price_1RYgmZInHvXcV9PzMyZltjkq' }, // 10% discount
            yearly: { price: 0, priceId: 'price_1RYgmZInHvXcV9PzMPJnMNDc' } // 20% discount
        }
    },
    {
        name: 'Platinum',
        description: 'For serious sellers who want more visibility',
        features: [
            'Priority visibility on homepage',
            'Add unlimited dresses',
            'Add more photos and videos per dress',
            'Moderate visibility for listings',
            'Advanced dress management'
        ],
        prices: {
            monthly: { price: 29.99, priceId: 'price_1RiKX1InHvXcV9PzDZw1sBLl' }, // Monthly Platinum
            quarterly: { price: 80.97, priceId: 'price_1RiKX1InHvXcV9PzDZw1sBLl' }, // Use monthly for quarterly as fallback
            yearly: { price: 287.88, priceId: 'price_1RiKX1InHvXcV9PzNXQeCKbr' } // Yearly Platinum
        }
    },
    {
        name: 'Vendor',
        description: 'For professional vendors and boutiques',
        features: [
            'Create and manage a storefront',
            'Access advanced analytics',
            'Bulk upload dresses',
            'Highest visibility priority',
            'Dedicated support',
            'API access'
        ],
        prices: {
            monthly: { price: 99.99, priceId: 'price_1RiKY9InHvXcV9Pzfl25jzfU' }, // Monthly Vendor
            quarterly: { price: 269.97, priceId: 'price_1RiKZkInHvXcV9PzTruj2Gjg' }, // Quarterly Vendor
            yearly: { price: 959.88, priceId: 'price_1RiKZkInHvXcV9Pzuzj1XGhJ' } // Yearly Vendor
        }
    }
];