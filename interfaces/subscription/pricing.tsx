'use client';
import { useState, useEffect } from 'react';
import { pricingPlans, PlanDuration } from '@/lib/pricing';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { CancelSubscription } from '@/components/subscription/cancel-subscription';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MY_SUBSCRIPTION } from '@/graphql/query';
import { CANCEL_SUBSCRIPTION_MUTATION, CREATE_SUBSCRIPTION_MUTATION } from '@/graphql/mutation';
import { enqueueSnackbar } from 'notistack';

const Pricing = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, updateUserSubscription } = useAuth();

  // Fetch latest subscription data
  const { data: subscriptionData, refetch: refetchSubscription, loading: subscriptionLoading } = useQuery(GET_MY_SUBSCRIPTION, {
    skip: !user?.user?.id, // Only fetch if user is logged in
    errorPolicy: 'ignore', // Don't show errors if user doesn't have subscription
    fetchPolicy: 'cache-and-network' // Always fetch from network to get latest data
  });

  // Use fetched subscription data if available, otherwise fall back to user context
  const currentSubscription = subscriptionData?.getMySubscription || user?.subscription;

  const durations: PlanDuration[] = ['monthly', 'yearly'];

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
          priceId: 'price_1RiKX1InHvXcV9PzDZw1sBLl', // Use monthly as fallback
        }, // Quarterly Platinum
        yearly: {
          price: t('dashboard.subcription.platinumplan.yearpr'),
          priceId: 'price_1RiKX1InHvXcV9PzNXQeCKbr',
        }, // Yearly Platinum
      },
    },
  ];

  // Helper function to get user's current subscription duration
  const getUserCurrentDuration = (): PlanDuration => {
    if (!currentSubscription) return 'monthly';
    
    // Check all plans to find which duration matches the current subscription
    for (const plan of pricingPlans) {
      for (const [duration, priceInfo] of Object.entries(plan.prices)) {
        if (currentSubscription.stripePriceId === (priceInfo as any).priceId) {
          return duration as PlanDuration;
        }
      }
    }
    return 'monthly'; // default fallback
  };

  const [selectedDuration, setSelectedDuration] = useState<PlanDuration>(getUserCurrentDuration());
  const [isUpgrading, setIsUpgrading] = useState(false);

  // GraphQL mutations
  const [cancelSubscription] = useMutation(CANCEL_SUBSCRIPTION_MUTATION);
  const [createSubscription] = useMutation(CREATE_SUBSCRIPTION_MUTATION);

  // Update selected duration when subscription changes
  useEffect(() => {
    const newDuration = getUserCurrentDuration();
    setSelectedDuration(newDuration);
  }, [currentSubscription]);

  // Handle upgrade from monthly to yearly - redirect to payment page
  const handleUpgradeWithCancellation = async (newPriceId: string, planName: string) => {
    // For subscription upgrades, redirect to the pricing page where Stripe will handle it properly
    router.push(`/dashboard/subscription/pricing/${newPriceId}`);
  };

  // Helper function to check if user has a subscription for this specific plan and duration
  const hasSubscriptionForPlanAndDuration = (planName: string, duration: PlanDuration) => {
    if (!currentSubscription) return false;
    
    // Find the plan in pricingPlans array
    const plan = pricingPlans.find(p => p.name === planName);
    if (!plan) return false;
    
    // Check if the current subscription's price ID matches this plan's price ID for the selected duration
    return currentSubscription.stripePriceId === plan.prices[duration].priceId;
  };

  // Helper function to check if user has any subscription for this plan (regardless of duration)
  const hasSubscriptionForPlan = (planName: string) => {
    if (!currentSubscription) return false;
    
    // Find the plan in pricingPlans array
    const plan = pricingPlans.find(p => p.name === planName);
    if (!plan) return false;
    
    // Check if the current subscription's price ID matches any duration for this plan
    return Object.values(plan.prices).some(price => 
      currentSubscription.stripePriceId === price.priceId
    );
  };

  // Helper function to get current subscription duration for a plan
  const getCurrentSubscriptionDuration = (planName: string): PlanDuration | null => {
    if (!currentSubscription) return null;
    
    const plan = pricingPlans.find(p => p.name === planName);
    if (!plan) return null;
    
    for (const [duration, priceInfo] of Object.entries(plan.prices)) {
      if (currentSubscription.stripePriceId === priceInfo.priceId) {
        return duration as PlanDuration;
      }
    }
    return null;
  };

  // Helper function to check if subscription is near end (within 7 days)
  const isSubscriptionNearEnd = () => {
    if (!currentSubscription?.currentPeriodEnd) return false;
    
    const endDate = new Date(parseInt(currentSubscription.currentPeriodEnd));
    const now = new Date();
    const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntilEnd <= 7;
  };

  // Helper function to determine if we should show upgrade button for different duration
  const shouldShowDurationUpgrade = (planName: string, targetDuration: PlanDuration) => {
    if (!currentSubscription) return false;
    
    // Allow upgrades even for cancelled subscriptions if they're still active
    // if (currentSubscription.cancelAtPeriodEnd) return false; // Removed this restriction
    
    const hasCurrentPlan = hasSubscriptionForPlan(planName);
    if (!hasCurrentPlan) return false;
    
    const currentDuration = getCurrentSubscriptionDuration(planName);
    if (!currentDuration || currentDuration === targetDuration) return false;
    
    // Don't show monthly upgrade for yearly subscription (yearly is better than monthly)
    if (currentDuration === 'yearly' && targetDuration === 'monthly') {
      return false;
    }
    
    // Show yearly upgrade for active monthly subscription
    if (currentDuration === 'monthly' && targetDuration === 'yearly') {
      return true;
    }
    
    return false;
  };

  const getSavings = (
    plan: (typeof pricingPlans)[0],
    duration: PlanDuration
  ) => {
    if (duration === 'monthly') return 0;
    const monthlyCost =
      plan.prices.monthly.price * (duration === 'quarterly' ? 3 : 12);
    return ((monthlyCost - plan.prices[duration].price) / monthlyCost) * 100;
  };

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
          {user && currentSubscription
            ? pricingPlans.map((plan) => {
                const savings = getSavings(plan, selectedDuration);
                // const currentDate = new Date(currentSubscription.currentPeriodStart);
                // const endDate = new Date(currentSubscription?.currentPeriodEnd);
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
                        {hasSubscriptionForPlanAndDuration(plan.name, selectedDuration) && (
                          <div>
                            <ul>
                              <li className='flex gap-2 mb-2'>
                                <p className='text-gray-500'>Date Start: </p>
                                <p>
                                  {new Date(
                                    parseInt(
                                      currentSubscription?.currentPeriodStart
                                    )
                                  ).toLocaleDateString()}
                                </p>
                              </li>
                              <li className='flex gap-2 mb-4'>
                                <p className='text-gray-500'>Date End: </p>
                                <p>
                                  {new Date(
                                    parseInt(
                                      currentSubscription?.currentPeriodEnd
                                    )
                                  ).toLocaleDateString()}
                                </p>
                              </li>
                            </ul>
                            
                            {/* Cancel Subscription Component */}
                            {currentSubscription && plan.name !== 'Basic' && (
                              <CancelSubscription 
                                subscription={{
                                  id: currentSubscription.id,
                                  plan: currentSubscription.plan,
                                  currentPeriodEnd: currentSubscription.currentPeriodEnd,
                                  cancelAtPeriodEnd: currentSubscription.cancelAtPeriodEnd
                                }}
                                onCancelSuccess={() => {
                                  // Refetch subscription data after successful cancellation
                                  refetchSubscription();
                                }}
                              />
                            )}
                          </div>
                        )}

                        {!hasSubscriptionForPlanAndDuration(plan.name, selectedDuration) &&
                          !shouldShowDurationUpgrade(plan.name, selectedDuration) &&
                          !hasSubscriptionForPlan(plan.name) &&
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


                              {isUpgrading ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  {t('dashboard.subcription.upgrading')}
                                </>
                              ) : (
                                ''
                              )}


                        {/* Show upgrade button for monthly users viewing yearly (duration upgrade) */}
                        {shouldShowDurationUpgrade(plan.name, selectedDuration) && (
                          <div className="mb-4">
                            <button
                              className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                                plan.name === 'Platinum'
                                  ? 'bg-indigo-600 hover:bg-indigo-700'
                                  : 'bg-gray-800 hover:bg-gray-900'
                              } ${isUpgrading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={isUpgrading}
                              onClick={() => {
                                const currentDuration = getCurrentSubscriptionDuration(plan.name);
                                
                                // If switching from monthly to yearly, use cancellation flow
                                if (currentDuration === 'monthly' && selectedDuration === 'yearly') {
                                  handleUpgradeWithCancellation(plan.prices[selectedDuration].priceId, plan.name);
                                } else {
                                  // For other cases, use regular flow
                                  router.push(
                                    `/dashboard/subscription/pricing/${plan.prices[selectedDuration].priceId}`
                                  );
                                }
                              }}
                            >
                              {isUpgrading ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  {t('dashboard.subcription.upgrading')}
                                </>
                              ) : (
                                getCurrentSubscriptionDuration(plan.name) === 'yearly' && selectedDuration === 'monthly'
                                  ? t('dashboard.subcription.switch_to_monthly')
                                  : ''
                              )}
                            </button>

                          </div>
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
