'use client'
import { useState } from 'react';
import { pricingPlans, PlanDuration } from '@/lib/pricing';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';

const Pricing = () => {
        const {t} = useTranslation();
    
    const [selectedDuration, setSelectedDuration] = useState<PlanDuration>('monthly');

    const durations: PlanDuration[] = ['monthly', 'quarterly', 'yearly'];

    const getSavings = (plan: typeof pricingPlans[0], duration: PlanDuration) => {
        if (duration === 'monthly') return 0;
        const monthlyCost = plan.prices.monthly.price * (duration === 'quarterly' ? 3 : 12);
        return ((monthlyCost - plan.prices[duration].price) / monthlyCost) * 100;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        {t('dashboard.subcription.title')}
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                                                {t('dashboard.subcription.description')}
                    </p>
                </div>

                {/* Duration Tabs */}
                <div className="flex justify-center mt-8">
                    <div className="inline-flex rounded-md shadow-sm">
                        {durations.map((duration) => (
                            <button
                                key={duration}
                                onClick={() => setSelectedDuration(duration)}
                                className={`px-6 py-3 text-sm font-medium rounded-md ${selectedDuration === duration
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } ${duration === 'monthly' ? 'rounded-l-lg' : ''} ${duration === 'yearly' ? 'rounded-r-lg' : ''
                                    }`}
                            >
                                {duration.charAt(0).toUpperCase() + duration.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="mt-12 space-y-8 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-8 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                    {pricingPlans.map((plan) => {
                        const savings = getSavings(plan, selectedDuration);
                        return (
                            <div
                                key={plan.name}
                                className={`rounded-lg shadow-lg overflow-hidden ${plan.name === 'Platinum' ? 'border-2 border-indigo-500' : 'border border-gray-200'
                                    }`}
                            >
                                <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                                    <div>
                                        <h3
                                            className="text-2xl font-bold text-gray-900 text-center"
                                            id="tier-standard"
                                        >
                                            {plan.name}
                                        </h3>
                                        <div className="mt-4 flex items-center justify-center">
                                            <span className="px-3 flex items-start text-6xl tracking-tight text-gray-900">
                                                <span className="mt-2 mr-2 text-4xl font-medium">$</span>
                                                <span className="font-extrabold">
                                                    {plan.prices[selectedDuration].price}
                                                </span>
                                            </span>
                                            <span className="text-xl font-medium text-gray-500">
                                                /{selectedDuration.replace(/ly$/, '')}
                                            </span>
                                        </div>
                                        {savings > 0 && (
                                            <p className="mt-2 text-center text-sm text-green-600">
                                                Save {savings.toFixed(0)}% vs monthly
                                            </p>
                                        )}
                                    </div>
                                    <p className="mt-5 text-lg text-gray-500 text-center">
                                        {plan.description}
                                    </p>
                                </div>
                                <div className="px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <svg
                                                        className="h-6 w-6 text-green-500"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                                <p className="ml-3 text-base text-gray-700">{feature}</p>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-8">
                                        <button
                                            className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${plan.name === 'Platinum'
                                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                                : 'bg-gray-800 hover:bg-gray-900'
                                                }`}

                                        >
                                            <Link href={`/dashboard/subscription/pricing/${plan.prices[selectedDuration].priceId}`}>
                                               {t('dashboard.subcription.getstarted')}

                                            </Link>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Pricing;