'use client'
import { z } from 'zod';
import Form, { Field } from '@/components/form';
import { forgetPasswordValidator, FormSchemaSignUpType, signInValidator, signUpValidator } from '@/lib/validators/auth';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_USER_MUTATION, FORGET_PASSWORD_MUTATION, LOGIN_USER_MUTATION } from '@/graphql/mutation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/hooks/use-translation';


export default function ForgetPassword() {
        const {t} = useTranslation();
    
    const formFields: Field[] = [
        { type: "Input", name: 'email', label: t('forgetpassword.email'), inputType: 'email' },
    ];
    const router = useRouter()
    const [forgetPassword, { data, loading, error }] = useMutation(FORGET_PASSWORD_MUTATION)
    const handleSubmit = async (values: any) => {
        try {
            const response = await forgetPassword({
                variables: {
                    email: values?.email,
                }
            })

            console.log(data, "Data")
            enqueueSnackbar({ message: "Password reset token sent to your email.", variant: 'success', anchorOrigin: { horizontal: "center", vertical: "bottom" } })
            router.push('/')
        } catch (e: any) {
            console.error("GraphQL Forget Error:", e);

            const message =
                e?.graphQLErrors?.[0]?.message ||
                e?.message ||
                "Something went wrong during forgetPassword";

            enqueueSnackbar(message, {
                variant: 'error',
                anchorOrigin: { horizontal: "center", vertical: "bottom" },
            });

        }
    }
    return (
        <>
            <div className='bg-slate-50'>
                <div className="container pt-[100px]">
                    <div className="flex items-center justify-center mb-5">
                        <h1 className="text-2xl md:text-3xl font-bold">{t('forgetpassword.title')}</h1>
                        {/* <Link href="/" className="flex items-center text-sm text-slate-600 hover:text-slate-900">
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Continue Shopping
                            </Link> */}
                    </div>


                    <div className="container bg-white py-6 max-w-[500px]">
                        <Form
                            schema={forgetPasswordValidator}
                            formFields={formFields}
                            onSubmit={handleSubmit}
                            isPending={loading}
                            defaultValues={{
                                email: '',
                            }}
                            fieldDir='column'
                            buttonTitle={t('forgetpassword.button')}
                        />

                    </div>
                </div>
            </div>

        </>
    );
}