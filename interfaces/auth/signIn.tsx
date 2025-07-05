'use client'
import { z } from 'zod';
import Form, { Field } from '@/components/form';
import { FormSchemaSignUpType, signInValidator, signUpValidator } from '@/lib/validators/auth';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_USER_MUTATION, LOGIN_USER_MUTATION } from '@/graphql/mutation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';
import { useAuth } from '@/contexts/auth-context';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';



export default function SignIn() {
const {t} = useTranslation();

    const formFields: Field[] = [
        { type: "Input", name: 'username', label: t('login.phonelabel'), inputType: 'text' },
        { type: "Input", name: 'password', label: t('login.password'), inputType: 'password' },
    ];

    const router = useRouter()
    const { login } = useAuth();
    const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER_MUTATION)
    const searchParams = useSearchParams();

    const redirect = searchParams.get('redirectTo');
    const handleSubmit = async (values: any) => {
        try {
            const response = await loginUser({
                variables: {
                    username: values?.username,
                    password: values?.password
                }
            })
            const result = response?.data?.loginUser;

            console.log(data, "Data")
            login(result);
            enqueueSnackbar({ message: "Login successful", variant: 'success', anchorOrigin: { horizontal: "center", vertical: "bottom" } })
            if (redirect) {
                router.push(redirect)

            } else {

                router.push('/dashboard')
            }
        } catch (e: any) {
            console.error("GraphQL Signup Error:", e);

            const message =
                e?.graphQLErrors?.[0]?.message ||
                e?.message ||
                "Something went wrong during login";

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
                        <h1 className="text-2xl md:text-3xl font-bold">{t('login.title')}</h1>
                        {/* <Link href="/" className="flex items-center text-sm text-slate-600 hover:text-slate-900">
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Continue Shopping
                            </Link> */}
                    </div>


                    <div className="container bg-white py-6 max-w-[500px]">
                        <Form
                            schema={signInValidator}
                            formFields={formFields}
                            onSubmit={handleSubmit}
                            isPending={loading}
                            defaultValues={{
                                username: '',
                                password: ''
                            }}
                            fieldDir='column'
                            buttonTitle={t('login.button')}
                        />
                        <div className='mt-4 flex justify-center gap-5'>

                            <Link href={'/signup'}>{t('login.signup')}</Link>
                            <Link href={'/forget-password'}>{t('login.forgot')}</Link>

                        </div>

                    </div>
                </div>
            </div>

        </>
    );
}