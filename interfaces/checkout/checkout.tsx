"use client"
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Head from 'next/head';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@apollo/client';
import { CREATE_ORDER_MUTATION } from '@/graphql/mutation';
import { enqueueSnackbar } from 'notistack';
import { useTranslation } from '@/hooks/use-translation';
import { useCurrency } from '@/contexts/currency-context';

// Define Zod schema
const checkoutSchema = z.object({
    address: z.object({
        city: z.string().min(1, 'City is required').max(50, 'City is too long'),
        appartment: z.string().min(1, 'Apartment is required').max(50, 'Apartment is too long'),
        street: z.string().min(1, 'Street is required').max(100, 'Street is too long'),
    }),
    paymentMethod: z.enum(['cash', 'online']),
    additionalNotes: z.string().max(500, 'Notes are too long').optional(),
});

type FormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {

    const { user, isAuthenticated, loading } = useAuth()
    const router = useRouter()
    const { language } = useTranslation()
    const { selectedCurrency } = useCurrency()
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
    const subtotal = cartTotal()
    const shipping = subtotal > 100 ? 0 : 10
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax
    useEffect(() => {

        if (!loading && !isAuthenticated) {
            router.push(`/login?redirectTo=checkout`)
        }
    }, [isAuthenticated,
        loading])
    const [createOrder] = useMutation(CREATE_ORDER_MUTATION);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm<FormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            address: {
                city: '',
                appartment: '',
                street: '',
            },
            paymentMethod: 'cash',
            additionalNotes: '',
        },
    });

    const [submitSuccess, setSubmitSuccess] = useState(false);

    const onSubmit = async (formData: FormData) => {

        try {
            setSubmitSuccess(true);

            const items = cart.map((el) => {
                return {
                    product: el.id, // Replace with actual product ID
                    user: user && user?.user?.id, // Replace with actual user ID
                    qty: el.quantity, // Replace with actual quantity
                    total: el.price * el.quantity, // Replace with actual total
                    size: el.selectedSize, // Replace with actual size
                    color: el.selectedColor,
                }
            })

            const orderInput = {
                // user: user && user?.user?.id, // Replace with actual user ID
                total: subtotal, // Calculate from cart items
                ref: `ORD-${Date.now()}`, // Generate order reference
                status: 'pending',
                notes: formData.additionalNotes,
                items,
                paymentType: formData.paymentMethod,
                address: formData.address,
                language: language,
                currency: selectedCurrency.code.toLowerCase()
            };
            const { data } = await createOrder({
                variables: { order: orderInput },
            });

            enqueueSnackbar("Your order has been placed successfully.", {
                variant: 'success',
                anchorOrigin: { horizontal: "center", vertical: "bottom" },
            });
            setSubmitSuccess(false);
            clearCart()
            reset()
            router.push(`/dashboard`)
        } catch (e: any) {
            const message =
                e?.graphQLErrors?.[0]?.message ||
                e?.message ||
                "Something went wrong during uploading dress";

            enqueueSnackbar(message, {
                variant: 'error',
                anchorOrigin: { horizontal: "center", vertical: "bottom" },
            });
        }
    };



    const paymentMethod = watch('paymentMethod')
const {t} = useTranslation();

    return (
        <>
            <Head>
                <title>{t('checkout.title')}</title>
            </Head>

            <div className="min-h-screen bg-slate-50">
                <div className="container px-4 md:px-6 py-8 md:py-12">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold">{t('checkout.title')}</h1>
                        <Link href="/" className="flex items-center text-sm text-slate-600 hover:text-slate-900">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                             {t('cartpage.continue')}
                        </Link>
                    </div>

                    {cart.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="md:col-span-2 space-y-4">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Address Section */}
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('checkout.info')}</h2>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">
                                                    {t('checkout.city')} <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="city"
                                                    {...register("address.city")}
                                                    placeholder=""
                                                />
                                                {errors.address?.city && <p className="text-sm text-red-500">{errors.address.city.message}</p>}
                                            </div>



                                            <div className="space-y-2">
                                                <Label htmlFor="apartment">
                                                    {t('checkout.apartment')} <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="appartment"
                                                    {...register("address.appartment")}
                                                    placeholder=""
                                                />
                                                {errors.address?.appartment && <p className="text-sm text-red-500">{errors.address.appartment.message}</p>}
                                            </div>


                                            <div className="space-y-2">
                                                <Label htmlFor="street">
                                                    {t('checkout.street')} <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="street"
                                                    {...register("address.street")}
                                                    placeholder=""
                                                />
                                                {errors.address?.street && <p className="text-sm text-red-500">{errors.address.street.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Method Section */}
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('checkout.payment')}</h2>
                                        <div className="space-y-2">

                                            <label className={`cursor-pointer mr-2 px-2 py-1 rounded border text-sm font-medium 
        ${paymentMethod === "cash" ? 'bg-black text-white' : 'bg-white text-black border-gray-400'}
      `}>
                                                <input
                                                    type="radio"
                                                    value={"cash"}
                                                    checked={paymentMethod === "cash"}
                                                    {...register('paymentMethod')}
                                                    className="hidden"
                                                />
                                                <span>{t('checkout.cash')}</span>
                                            </label>
                                            <label className={`cursor-pointer px-2 py-1 rounded border text-sm font-medium 
        ${paymentMethod === "online" ? 'bg-black text-white' : 'bg-white text-black border-gray-400'}
      `}>
                                                <input
                                                    type="radio"
                                                    value={"online"}
                                                    checked={paymentMethod === "online"}
                                                    {...register('paymentMethod')}
                                                    className="hidden"
                                                />
                                                <span>{t('checkout.online')}</span>
                                            </label>
                                            {/* <div className="flex items-center">
                                                <input
                                                    id="cash"
                                                    type="radio"
                                                    value="cash"
                                                    {...register('paymentMethod')}
                                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700">
                                                    Cash on Delivery
                                                </label>
                                            </div> */}


                                        </div>
                                    </div>

                                    {/* Additional Notes Section */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            {t('checkout.additioninfo')}
                                        </Label>
                                        <Textarea
                                            id="additionalNotes"
                                            {...register("additionalNotes")}
                                            placeholder=""
                                            rows={4}
                                        />
                                        {errors.additionalNotes && <p className="text-sm text-red-500">{errors.additionalNotes.message}</p>}
                                    </div>


                                    {/* Submit Button */}
                                    <div>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gold hover:bg-gold/90 text-white"
                                        >
                                            {isSubmitting ? t('checkout.processing') : t('checkout.complete')}
                                        </Button>
                                    </div>
                                </form>


                            </div>

                            {/* Order Summary */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-bold mb-4">{t('cartpage.ordersummary')}</h2>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">{t('cartpage.subtotal')}</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">{t('cartpage.shipping')}</span>
                                        <span className="font-medium">{shipping === 0 ? t('cartpage.freeshipping') : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">{t('cartpage.tax')}</span>
                                        <span className="font-medium">${tax.toFixed(2)}</span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between font-bold">
                                        <span>{t('cartpage.total')}</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>



                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Truck className="h-4 w-4 text-slate-400" />
                                        <span>{t('cartpage.free')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <ShoppingBag className="h-4 w-4 text-slate-400" />
                                        <span>{t('cartpage.return')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <ShoppingBag className="h-16 w-16 text-slate-300" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">{t('cartpage.empty')}</h2>
                            <p className="text-slate-500 mb-6">{t('cartpage.look')}</p>
                            <Button asChild>
                                <Link href="/">{t('cartpage.startshopping')}</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}


