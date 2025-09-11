// 'use client'
// import { googleLogin } from '@/actions';
// import PrimaryButton from '@/components/buttons/PrimaryButton'
// import SecondaryButton from '@/components/buttons/SecondaryButton';
// import Input from '@/components/inputs/input'
// import Separator from '@/components/separator/separator';
// import { FormSchemaSignUpType, signUpValidator } from '@/lib/validators/auth';
// import { signUp } from '@/services/auth';
// import { zodResolver } from '@hookform/resolvers/zod';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { enqueueSnackbar } from 'notistack';
// import React from 'react'
// import { SubmitHandler, useForm } from 'react-hook-form';

// const SignUp = () => {

//     const {
//         register,
//         handleSubmit,
//         formState: { errors, isSubmitting },
//     } = useForm<FormSchemaSignUpType>({
//         resolver: zodResolver(signUpValidator, {}, { raw: true }),
//         defaultValues: {

//         },
//         // mode: "onBlur" || "onSubmit"
//     });

//     const router = useRouter()

//     const onSubmit: SubmitHandler<FormSchemaSignUpType> = async (data) => {

//         console.log(data, "DATA")
//         try {
//             const res = await signUp({ email: data.email, password: data.password, fullName: data.fullName })
//             console.log(res, "Response")
//             router.push('/dashboard')
//             // const setCookieHeader = res.headers['set-cookie'];

//             // // You can now store the cookie or use it for subsequent requests
//             // console.log('Cookie received:', setCookieHeader);
//         } catch (error) {
//             // console.log(errors, "Error in on submit")
//             if (axios.isAxiosError(error)) {
//                 // do whatever you want with native error
//                 console.log(errors, "Error in on submit")
//                 enqueueSnackbar({ message: error?.response?.data?.error, variant: 'error', anchorOrigin: { horizontal: "center", vertical: "bottom" } })
//             }

//         }
//         // await fetch('/api/v1/form', { body: formData, method: 'POST' });
//     };

//     return (
//         <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//             <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//                 <img
//                     className="mx-auto h-10 w-auto"
//                     src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
//                     alt="Your Company"
//                 />
//                 <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
//                     Sign up
//                 </h2>
//                 <div className='mt-5'>

//                 <button 
//                 onClick={async () => {await googleLogin()}}
//                 className="flex w-full justify-center items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
//                     <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg"  width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
//                     <span>Continue with Google</span>
//                 </button>
//         </div>
//             </div>

//             <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
//                 <form className="space-y-3" action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
//                     <Input
//                         {...register('fullName')}
//                         error={errors.fullName?.message}
//                         label='Name'
//                         type='text'
//                     />
//                     <Input
//                         label='Email'
//                         {...register('email')}
//                         error={errors.email?.message}
//                         type='email'
//                     />
//                     <Input
//                         label='Password'
//                         {...register('password')}
//                         error={errors.password?.message}
//                         type='password'
//                     />



//                     <div>


//                         <div className='mt-5'>
//                             <PrimaryButton type='submit' disabled={isSubmitting} label={isSubmitting ? 'Registering...' : 'Register'} />
//                         </div>
//                         <Separator>
//                             <span className="text-sm text-gray-500">Already account?</span>

//                         </Separator>
//                         <div className='mt-5'>
//                             <SecondaryButton type='button' label={'Sign In'}
//                                 onClick={() => router.push('signin')}
//                             />

//                         </div>

//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default SignUp

'use client'
import { z } from 'zod';
import Form, { Field } from '@/components/form';
import { FormSchemaSignUpType, signUpValidator } from '@/lib/validators/auth';
import { redirect, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_USER_MUTATION } from '@/graphql/mutation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/hooks/use-translation';
import { useEffect } from 'react';


export default function SignUp() {
    const {t} = useTranslation();
    
    const formFields: Field[] = [
        { type: "Input", name: 'firstName', label: t('signup.firstname'), inputType: 'text' },
        { type: "Input", name: 'lastName', label: t('signup.lastname'), inputType: 'text' },
        { type: "Input", name: 'email', label: t('signup.email'), inputType: 'email' },
        { type: "Phone", name: 'mobile', label: t('signup.mobile') },
        { type: "Country", name: 'country', label: t('signup.country')},
        { type: "Select", name: 'lang', label: t('signup.language'), options:[{label:'Arabic',value:'ar'}, {label:'English',value:'en'}] },
        { type: "Input", name: 'password', label: t('signup.password'), inputType: 'password' },
        { type: "Input", name: 'confirmPassword', label: t('signup.confirmpassword'), inputType: 'password' },
    ];
    const router = useRouter()
    const { login, user } = useAuth();
    useEffect(() => {
        if(user){
            redirect('/dashboard')
        }
    }, [user])
    const [createUser, { data, loading, error }] = useMutation(CREATE_USER_MUTATION)
    const handleSubmit = async (data: any) => {
        try {
            const response = await createUser({
                variables: {
                    user: {
                        account: {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            country: data.country,
                            password: data.password,
                            email: data.email,
                            mobile: data.mobile,
                            lang: data.lang,

                        },
                    },
                },
            })
            const result = response?.data?.createUser;
            console.log(data, "Data")
            // login(result);
            enqueueSnackbar({ message: "Confirmation link sent to your email!", variant: 'success', anchorOrigin: { horizontal: "center", vertical: "bottom" }, transitionDuration:10000 })
            router.push('/')
        } catch (e: any) {
            console.error("GraphQL Signup Error:", e);

            const message =
                e?.graphQLErrors?.[0]?.message ||
                e?.message ||
                "Something went wrong during signup";

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
                        <h1 className="text-2xl md:text-3xl font-bold">{t('signup.title')}</h1>
                        {/* <Link href="/" className="flex items-center text-sm text-slate-600 hover:text-slate-900">
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Continue Shopping
                            </Link> */}
                    </div>


                    <div className="container bg-white py-6">
                        <Form
                            schema={signUpValidator}
                            formFields={formFields}
                            onSubmit={handleSubmit}
                            isPending={loading}
                            defaultValues={{
                                firstName: '',
                                lastName: '',
                                email: '',
                                mobile: '',
                                country: '',
                                password: '',
                                lang: ''
                            }}
                            buttonTitle={t('signup.button')}
                        />

                    </div>
                </div>
            </div>

        </>
    );
}