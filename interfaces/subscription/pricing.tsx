'use client';
import { useState } from 'react';
import { pricingPlans, PlanDuration } from '@/lib/pricing';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

const Pricing = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [selectedDuration, setSelectedDuration] =
    useState<PlanDuration>('monthly');

  const durations: PlanDuration[] = ['monthly', 'yearly'];

  const getSavings = (
    plan: (typeof pricingPlans)[0],
    duration: PlanDuration
  ) => {
    if (duration === 'monthly') return 0;
    const monthlyCost =
      plan.prices.monthly.price * (duration === 'quarterly' ? 3 : 12);
    return ((monthlyCost - plan.prices[duration].price) / monthlyCost) * 100;
  };
  const pricingPlans = [
    {
      name: t('dashboard.subcription.basicplan.name'),
      description: t('dashboard.subcription.basicplan.description'),
      features: [
        t('dashboard.subcription.basicplan.feature1'),
        t('dashboard.subcription.basicplan.feature2'),
        t('dashboard.subcription.basicplan.feature3'),
        t('dashboard.subcription.basicplan.feature4'),
      ],
      prices: {
        monthly: {
          price: t('dashboard.subcription.basicplan.monpr'),
          priceId: 'price_1RYgmZInHvXcV9Pz2seilITg',
        },
        quarterly: {
          price: t('dashboard.subcription.basicplan.quarpr'),
          priceId: 'price_1RYgmZInHvXcV9PzMyZltjkq',
        }, // 10% discount
        yearly: {
          price: t('dashboard.subcription.basicplan.yearpr'),
          priceId: 'price_1RYgmZInHvXcV9PzMPJnMNDc',
        }, // 20% discount
      },
    },
    {
      name: t('dashboard.subcription.platinumplan.name'),
      description: t('dashboard.subcription.platinumplan.description'),
      features: [
        t('dashboard.subcription.platinumplan.feature1'),
        t('dashboard.subcription.platinumplan.feature2'),
        t('dashboard.subcription.platinumplan.feature3'),
        t('dashboard.subcription.platinumplan.feature4'),
        t('dashboard.subcription.platinumplan.feature5'),
      ],
      prices: {
        monthly: {
          price: t('dashboard.subcription.platinumplan.monpr'),
          priceId: 'price_1RiKX1InHvXcV9PzDZw1sBLl',
        },
        quarterly: {
          price: t('dashboard.subcription.platinumplan.quarpr'),
          priceId: 'price_1RiKX1InHvXcV9PzlO4KAAFl',
        }, // 10% discount
        yearly: {
          price: t('dashboard.subcription.platinumplan.yearpr'),
          priceId: 'price_1RiKX1InHvXcV9PzNXQeCKbr',
        }, // 20% discount
      },
    },
    // {
    //     name: t('dashboard.subcription.vendorplan.name'),
    //     description: t('dashboard.subcription.vendorplan.description'),
    //     features: [
    //         t('dashboard.subcription.vendorplan.feature1'),
    //         t('dashboard.subcription.vendorplan.feature2'),
    //         t('dashboard.subcription.vendorplan.feature3'),
    //         t('dashboard.subcription.vendorplan.feature4'),
    //         t('dashboard.subcription.vendorplan.feature5'),
    //         t('dashboard.subcription.vendorplan.feature6')
    //     ],
    //     prices: {
    //         monthly: { price: t('dashboard.subcription.vendorplan.monpr'), priceId: 'price_1RiKY9InHvXcV9Pzfl25jzfU' },
    //         quarterly: { price: t('dashboard.subcription.vendorplan.quarpr'), priceId: 'price_1RiKZkInHvXcV9PzTruj2Gjg' }, // 10% discount
    //         yearly: { price: t('dashboard.subcription.vendorplan.yearpr'), priceId: 'price_1RiKZkInHvXcV9Pzuzj1XGhJ' }

    //     }
    // }
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900 sm:text-4xl'>
            {t('dashboard.subcription.title')}
          </h2>
          <p className='mt-4 text-xl text-gray-600'>
            {t('dashboard.subcription.description')}
          </p>
        </div>

        {/* Duration Tabs */}
        <div className='flex justify-center mt-8'>
          <div className='inline-flex rounded-md shadow-sm'>
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className={`px-3 sm:px-6 py-3 text-sm font-medium rounded-md ${
                  selectedDuration === duration
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${duration === 'monthly' ? 'rounded-l-lg' : ''} ${
                  duration === 'yearly' ? 'rounded-r-lg' : ''
                }`}
              >
                {/* {duration.charAt(0).toUpperCase() + duration.slice(1)} */}

                {duration === 'monthly'
                  ? t('dashboard.subcription.monthly')
                  : duration === 'yearly'
                  ? t('dashboard.subcription.yearly')
                  : duration === 'quarterly'
                  ? t('dashboard.subcription.quarterly')
                  : null}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className='mt-12 space-y-8 sm:space-y-0 sm:grid sm:grid-cols-[repeat(auto-fill,_minmax(300px,_auto))] sm:gap-8 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0'>
          {user && user?.subscription
            ? pricingPlans.map((plan) => {
                const savings = getSavings(plan, selectedDuration);
                // const currentDate = new Date(user?.subscription.currentPeriodStart);
                // const endDate = new Date(user?.subscription?.currentPeriodEnd);
                return (
                  <div
                    key={plan.name}
                    className={`rounded-lg shadow-lg overflow-hidden ${
                      plan.name === 'Platinum'
                        ? 'border-2 border-indigo-500'
                        : 'border border-gray-200'
                    }`}
                  >
                    <div className='px-6 py-8 bg-white sm:p-10 sm:pb-6'>
                      <div>
                        <h3
                          className='text-2xl font-bold text-gray-900 text-center'
                          id='tier-standard'
                        >
                          {plan.name}
                        </h3>
                        <div className='mt-4 flex items-center justify-center'>
                          <span className='px-3 flex items-center sm:items-start text-[30px]  sm:text-[50px] tracking-tight text-gray-900'>
                            {plan.name !== 'Basic' && (
                              <span className='sm:mt-2 mr-2 sm:text-4xl font-medium'>
                                $
                              </span>
                            )}
                            <span className='font-extrabold'>
                              {plan.prices[selectedDuration].price}
                            </span>
                          </span>
                          {plan.name !== 'Basic' && (
                            <span className='text-xl font-medium text-gray-500'>
                              /
                              {selectedDuration === 'monthly'
                                ? t('dashboard.subcription.month')
                                : selectedDuration === 'yearly'
                                ? t('dashboard.subcription.year')
                                : selectedDuration === 'quarterly'
                                ? t('dashboard.subcription.quarter')
                                : null}
                            </span>
                          )}
                        </div>
                        {savings > 0 && (
                          <p className='mt-2 text-center text-sm text-green-600'>
                            {t('dashboard.subcription.save')}{' '}
                            {savings.toFixed(0)} {t('dashboard.subcription.vs')}
                          </p>
                        )}
                      </div>
                      <p className='mt-5 text-lg text-gray-500 text-center'>
                        {plan.description}
                      </p>
                    </div>
                    <div className='px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6'>
                      <ul className='space-y-4'>
                        {plan.features.map((feature: any) => (
                          <li key={feature} className='flex items-start'>
                            <div className='flex-shrink-0'>
                              <svg
                                className='h-6 w-6 text-green-500'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                aria-hidden='true'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth='2'
                                  d='M5 13l4 4L19 7'
                                />
                              </svg>
                            </div>
                            <p className='ml-3 text-base text-gray-700'>
                              {feature}
                            </p>
                          </li>
                        ))}
                      </ul>
                      <div className='mt-8'>
                        {user?.subscription?.stripePriceId ===
                          plan.prices[selectedDuration].priceId && (
                          <div>
                            <ul>
                              <li className='flex gap-2 mb-2'>
                                <p className='text-gray-500'>Date Start: </p>
                                <p>
                                  {new Date(
                                    parseInt(
                                      user?.subscription?.currentPeriodStart
                                    )
                                  ).toLocaleDateString()}
                                </p>
                              </li>
                              <li className='flex gap-2'>
                                <p className='text-gray-500'>Date End: </p>
                                <p>
                                  {new Date(
                                    parseInt(
                                      user?.subscription?.currentPeriodEnd
                                    )
                                  ).toLocaleDateString()}
                                </p>
                              </li>
                            </ul>
                          </div>
                        )}

                        {user?.subscription?.stripePriceId !==
                          plan.prices[selectedDuration].priceId &&
                          plan.name !== 'Basic' && (
                            <button
                              className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                                plan.name === 'Platinum'
                                  ? 'bg-indigo-600 hover:bg-indigo-700'
                                  : 'bg-gray-800 hover:bg-gray-900'
                              }`}
                              onClick={() => {
                                router.push(
                                  `/dashboard/subscription/pricing/${plan.prices[selectedDuration].priceId}`
                                );
                              }}
                            >
                              {t('dashboard.subcription.upgrade')}
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })
            : pricingPlans.map((plan: any) => {
                const savings = getSavings(plan, selectedDuration);
                return (
                  <div
                    key={plan.name}
                    className={`rounded-lg shadow-lg overflow-hidden ${
                      plan.name === 'Platinum'
                        ? 'border-2 border-indigo-500'
                        : 'border border-gray-200'
                    }`}
                  >
                    <div className='px-6 py-8 bg-white sm:p-10 sm:pb-6'>
                      <div>
                        <h3
                          className='text-2xl font-bold text-gray-900 text-center'
                          id='tier-standard'
                        >
                          {plan.name}
                        </h3>
                        <div className='mt-4 flex items-center justify-center'>
                          <span className='px-3 flex items-center sm:items-start text-[30px]  sm:text-[50px] tracking-tight text-gray-900'>
                            <span className='sm:mt-2 mr-2 sm:text-4xl font-medium'>
                              $
                            </span>
                            <span className='font-extrabold'>
                              {plan.prices[selectedDuration].price}
                            </span>
                          </span>
                          <span className='text-xl font-medium text-gray-500'>
                            /
                            {selectedDuration === 'monthly'
                              ? t('dashboard.subcription.monthly')
                              : selectedDuration === 'yearly'
                              ? t('dashboard.subcription.yearly')
                              : selectedDuration === 'quarterly'
                              ? t('dashboard.subcription.quarterly')
                              : null}
                          </span>
                        </div>
                        {savings > 0 && (
                          <p className='mt-2 text-center text-sm text-green-600'>
                            {t('dashboard.subcription.save')}{' '}
                            {savings.toFixed(0)} {t('dashboard.subcription.vs')}
                          </p>
                        )}
                      </div>
                      <p className='mt-5 text-lg text-gray-500 text-center'>
                        {plan.description}
                      </p>
                    </div>
                    <div className='px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6'>
                      <ul className='space-y-4'>
                        {plan.features.map((feature: any) => (
                          <li key={feature} className='flex items-start'>
                            <div className='flex-shrink-0'>
                              <svg
                                className='h-6 w-6 text-green-500'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                aria-hidden='true'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth='2'
                                  d='M5 13l4 4L19 7'
                                />
                              </svg>
                            </div>
                            <p className='ml-3 text-base text-gray-700'>
                              {feature}
                            </p>
                          </li>
                        ))}
                      </ul>
                      <div className='mt-8'>
                        <button
                          className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                            plan.name === 'Platinum'
                              ? 'bg-indigo-600 hover:bg-indigo-700'
                              : 'bg-gray-800 hover:bg-gray-900'
                          }`}
                        >
                          <Link
                            href={`/dashboard/subscription/pricing/${plan.prices[selectedDuration].priceId}`}
                          >
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
