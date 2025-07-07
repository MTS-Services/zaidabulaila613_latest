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

        if (!stripe || !elements || !user) return;

        const card = elements.getElement(CardNumberElement);
        if (!card) return;

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
                enqueueSnackbar({ message: error?.message, variant: 'error', anchorOrigin: { horizontal: "center", vertical: "bottom" } })

                return;
            }

            const res = await createSubscription({
                variables: {
                    input: {
                        priceId,
                        paymentMethod: paymentMethod.id,
                    },
                },
            });

            const clientSecret = res.data?.createSubscription?.clientSecret;
            const subscription = res.data?.createSubscription?.subscription;
            const confirm = await stripe.confirmCardPayment(clientSecret);

            if (confirm.error) {
                setSubmitting(false)
                enqueueSnackbar({ message: confirm.error.message, variant: 'error', anchorOrigin: { horizontal: "center", vertical: "bottom" } })
                // alert(confirm.error.message);
            } else {
                setSubmitting(false)
                updateUserSubscription({
                    id: subscription?._id,
                    plan: subscription.plan,
                    status: subscription.status,
                    userId: user.user.id
                })
                router.push('/dashboard')
                enqueueSnackbar({ message: "Subscription purchased successfully", variant: 'success', anchorOrigin: { horizontal: "center", vertical: "bottom" } })

            }
        } catch (err) {
            console.error('Subscription error:', err);
            enqueueSnackbar({ message: "Something went wrong.", variant: 'error', anchorOrigin: { horizontal: "center", vertical: "bottom" } })
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

export function getPlanByPriceId(priceId: string, pricingPlans:any[]): {
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


