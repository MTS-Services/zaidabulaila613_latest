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
    const { user } = useAuth();
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
            const confirm = await stripe.confirmCardPayment(clientSecret);

            if (confirm.error) {
                setSubmitting(false)
                enqueueSnackbar({ message: confirm.error.message, variant: 'error', anchorOrigin: { horizontal: "center", vertical: "bottom" } })
                // alert(confirm.error.message);
            } else {
                setSubmitting(false)
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

function PaymentForm({ priceId }: { priceId: string }) {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm priceId={priceId} />
        </Elements>
    );
}

function getPlanByPriceId(priceId: string): {
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

export default function Checkout({ priceId }: { priceId: string }) {


    if (!priceId) {
        return <div className="text-red-500">Missing priceId</div>;
    }

    const planInfo = getPlanByPriceId(priceId);

    if (!planInfo) {
        return <div className="text-red-500">Invalid priceId</div>;
    }

    const { plan, duration } = planInfo;
    const price = plan.prices[duration].price;

    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto p-6">
            {/* Left: Checkout Form */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Complete Your Subscription</h2>
                <PaymentForm priceId={priceId} />
            </div>

            {/* Right: Plan Details */}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
                <h3 className="text-2xl font-bold mb-2">{plan.name} Plan</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <div className="text-lg font-medium mb-4">
                    ${price.toFixed(2)} / {duration}
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
