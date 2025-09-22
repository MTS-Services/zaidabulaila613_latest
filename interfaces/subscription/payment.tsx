'use client'
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    Elements,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_SUBSCRIPTION_MUTATION } from '@/graphql/mutation';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { PlanDuration, PricingPlan, pricingPlans } from '@/lib/pricing';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const inputStyle = {
    base: {
        fontSize: '16px',
        color: '#333',
        '::placeholder': {
            color: '#888',
        },
    },
    invalid: {
        color: '#e5424d',
    },
};

const CheckoutForm = ({ priceId }: { priceId: string }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user, updateUserSubscription } = useAuth();
    const router = useRouter()
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [createSubscription] = useMutation(CREATE_SUBSCRIPTION_MUTATION);

    const handleSubscribe = async () => {

        if (!stripe || !elements || !user) {
            enqueueSnackbar({ 
                message: "Payment system not ready. Please refresh the page.", 
                variant: 'error', 
                anchorOrigin: { horizontal: "center", vertical: "bottom" } 
            });
            return;
        }

        const card = elements.getElement(CardNumberElement);
        if (!card) {
            enqueueSnackbar({ 
                message: "Please enter your card details.", 
                variant: 'error', 
                anchorOrigin: { horizontal: "center", vertical: "bottom" } 
            });
            return;
        }

        try {
            setSubmitting(true)
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card,
                billing_details: {
                    name: user.user.account.firstName,
                    email: user.user.account.email,
                },
            });

            if (error || !paymentMethod?.id) {
                setSubmitting(false)
                enqueueSnackbar({ 
                    message: error?.message || "Invalid payment method. Please check your card details.", 
                    variant: 'error', 
                    anchorOrigin: { horizontal: "center", vertical: "bottom" } 
                });
                return;
            }

            // Create subscription on backend
            const res = await createSubscription({
                variables: {
                    input: {
                        priceId,
                        paymentMethod: paymentMethod.id,
                    },
                },
            });

            if (!res.data?.createSubscription?.success) {
                setSubmitting(false);
                enqueueSnackbar({ 
                    message: res.data?.createSubscription?.message || "Failed to create subscription. Please try again.", 
                    variant: 'error', 
                    anchorOrigin: { horizontal: "center", vertical: "bottom" } 
                });
                return;
            }

            const clientSecret = res.data?.createSubscription?.clientSecret;
            const subscription = res.data?.createSubscription?.subscription;

            if (!clientSecret) {
                setSubmitting(false);
                enqueueSnackbar({ 
                    message: "Payment processing failed. Please try again.", 
                    variant: 'error', 
                    anchorOrigin: { horizontal: "center", vertical: "bottom" } 
                });
                return;
            }

            // Check if this is a pre-confirmed success (subscription already active)
            if (clientSecret.startsWith('pi_success_')) {
                setSubmitting(false);
                
                // Update user subscription in context
                if (subscription) {
                    updateUserSubscription({
                        id: subscription._id,
                        plan: subscription.plan,
                        status: subscription.status,
                        userId: user.user.id,
                        stripePriceId: subscription.stripePriceId,
                        currentPeriodStart: subscription.currentPeriodStart,
                        currentPeriodEnd: subscription.currentPeriodEnd
                    });
                }
                
                enqueueSnackbar({ 
                    message: "Subscription purchased successfully! Welcome to your new plan.", 
                    variant: 'success', 
                    anchorOrigin: { horizontal: "center", vertical: "bottom" } 
                });
                
                // Redirect to dashboard
                router.push('/dashboard');
                return;
            }

            // Confirm payment with Stripe for incomplete subscriptions
            const confirm = await stripe.confirmCardPayment(clientSecret);

            if (confirm.error) {
                setSubmitting(false)
                enqueueSnackbar({ 
                    message: confirm.error.message || "Payment confirmation failed. Please try again.", 
                    variant: 'error', 
                    anchorOrigin: { horizontal: "center", vertical: "bottom" } 
                });
            } else {
                setSubmitting(false)
                
                // Update user subscription in context
                if (subscription) {
                    updateUserSubscription({
                        id: subscription._id,
                        plan: subscription.plan,
                        status: subscription.status,
                        userId: user.user.id,
                        stripePriceId: subscription.stripePriceId,
                        currentPeriodStart: subscription.currentPeriodStart,
                        currentPeriodEnd: subscription.currentPeriodEnd
                    });
                }
                
                enqueueSnackbar({ 
                    message: "Subscription purchased successfully! Welcome to your new plan.", 
                    variant: 'success', 
                    anchorOrigin: { horizontal: "center", vertical: "bottom" } 
                });
                
                // Navigate to dashboard
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error('Subscription error:', err);
            setSubmitting(false);
            
            // Handle different types of errors
            let errorMessage = "Something went wrong. Please try again.";
            
            if (err.networkError) {
                errorMessage = "Network error. Please check your internet connection.";
            } else if (err.graphQLErrors && err.graphQLErrors.length > 0) {
                errorMessage = err.graphQLErrors[0].message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            enqueueSnackbar({ 
                message: errorMessage, 
                variant: 'error', 
                anchorOrigin: { horizontal: "center", vertical: "bottom" } 
            });
        }
    };

    return (
        <div className="grid gap-4 max-w-md mx-auto">
            <div className="p-2 border rounded">
                <label className="block text-sm mb-1">Card Number</label>
                <CardNumberElement options={{ style: inputStyle }} />
            </div>

            <div className="p-2 border rounded">
                <label className="block text-sm mb-1">Expiry</label>
                <CardExpiryElement options={{ style: inputStyle }} />
            </div>

            <div className="p-2 border rounded">
                <label className="block text-sm mb-1">CVC</label>
                <CardCvcElement options={{ style: inputStyle }} />
            </div>

            <Button
                onClick={handleSubscribe}
                disabled={!stripe || submitting}

            // className="p-2 bg-blue-600 text-white rounded"
            >
                Subscribe
            </Button>
        </div>
    );
};

export function PaymentForm({ priceId }: { priceId: string }) {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm priceId={priceId} />
        </Elements>
    );
}

export function getPlanByPriceId(priceId: string, pricingPlans: any[]): {
    plan: PricingPlan;
    duration: PlanDuration;
} | null {
    for (const plan of pricingPlans) {
        for (const duration of ['monthly', 'quarterly', 'yearly'] as PlanDuration[]) {
            if (plan.prices[duration].priceId === priceId) {
                return { plan, duration };
            }
        }
    }
    return null;
}


