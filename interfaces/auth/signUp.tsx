// 'use client';
// import Form, { Field } from '@/components/form';
// import { FormSchemaSignUpType, signUpValidator } from '@/lib/validators/auth';
// import { redirect, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { enqueueSnackbar } from 'notistack';
// import { useAuth } from '@/contexts/auth-context';
// import { useTranslation } from '@/hooks/use-translation';
// import { useEffect, useState, useCallback } from 'react';
// import React from 'react';
// import { useMutation } from '@apollo/client';
// import { CREATE_USER_MUTATION } from '@/graphql/mutation';
// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'; // Assuming Radix UI component
// import { Label } from '@/components/ui/label';

// export default function SignUp() {
//   const { t } = useTranslation();
//   const [isLoading, setIsLoading] = useState(false);
//   const [verificationMethod, setVerificationMethod] = useState<
//     'whatsapp' | 'email'
//   >('whatsapp');
//   const router = useRouter();
//   const { user } = useAuth();

//   const [createUser] = useMutation(CREATE_USER_MUTATION);

//   const formFields: Field[] = [
//     {
//       type: 'Input',
//       name: 'firstName',
//       label: t('signup.firstname'),
//       inputType: 'text',
//     },
//     {
//       type: 'Input',
//       name: 'lastName',
//       label: t('signup.lastname'),
//       inputType: 'text',
//     },
//     {
//       type: 'Input',
//       name: 'email',
//       label: t('signup.email'),
//       inputType: 'email',
//     },
//     { type: 'Phone', name: 'mobile', label: t('signup.mobile') },
//     { type: 'Country', name: 'country', label: t('signup.country') },
//     {
//       type: 'Select',
//       name: 'lang',
//       label: t('signup.language'),
//       options: [
//         { label: 'Arabic', value: 'ar' },
//         { label: 'English', value: 'en' },
//       ],
//     },
//     {
//       type: 'Input',
//       name: 'password',
//       label: t('signup.password'),
//       inputType: 'password',
//     },
//     {
//       type: 'Input',
//       name: 'confirmPassword',
//       label: t('signup.confirmpassword'),
//       inputType: 'password',
//     },
//   ];

//   useEffect(() => {
//     if (user) {
//       redirect('/dashboard');
//     }
//   }, [user]);

//   const handleSubmit = useCallback(
//     async (data: FormSchemaSignUpType) => {
//       setIsLoading(true);

//       if (verificationMethod === 'whatsapp') {
//         try {
//           const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/register-account`;
//           const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(data),
//           });
//           const result = await response.json();
//           if (!response.ok) {
//             throw new Error(result.message || 'Registration failed.');
//           }
//           enqueueSnackbar(
//             'Registration successful! An OTP has been sent to your WhatsApp.',
//             { variant: 'success' }
//           );
//           router.push(`/verify-account?mobile=${data.mobile}`);
//         } catch (error: any) {
//           enqueueSnackbar(error.message || 'Something went wrong.', {
//             variant: 'error',
//           });
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         try {
//           await createUser({
//             variables: {
//               user: {
//                 account: {
//                   firstName: data.firstName,
//                   lastName: data.lastName,
//                   country: data.country,
//                   password: data.password,
//                   email: data.email,
//                   mobile: data.mobile,
//                   lang: data.lang,
//                 },
//               },
//             },
//           });
//           enqueueSnackbar(
//             'Registration successful! A verification link has been sent to your email.',
//             { variant: 'success' }
//           );
//           router.push(`/check-your-email`);
//         } catch (error: any) {
//           const message =
//             error?.graphQLErrors?.[0]?.message ||
//             error.message ||
//             'An error occurred.';
//           enqueueSnackbar(message, { variant: 'error' });
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     },
//     [verificationMethod, router, createUser]
//   );

//   return (
//     <div className='bg-slate-50'>
//       <div className='container pt-[100px]'>
//         <div className='flex items-center justify-center mb-5'>
//           <h1 className='text-2xl md:text-3xl font-bold'>
//             {t('signup.title')}
//           </h1>
//         </div>
//         <div className='container bg-white py-6'>
//           {/* --- START: New Segmented Control Design --- */}
//           <div className='flex flex-col items-center justify-center mb-8'>
//             <Label className='font-semibold mb-3 text-gray-700'>
//               Verification Method
//             </Label>
//             <ToggleGroup
//               type='single'
//               defaultValue='whatsapp'
//               onValueChange={(value: 'whatsapp' | 'email') => {
//                 if (value) setVerificationMethod(value);
//               }}
//               className='inline-flex h-10 items-center justify-center rounded-lg bg-white p-1'
//             >
//               <ToggleGroupItem
//                 value='whatsapp'
//                 aria-label='Toggle WhatsApp'
//                 className='inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-black data-[state=on]:shadow-sm'
//               >
//                 WhatsApp
//               </ToggleGroupItem>
//               <ToggleGroupItem
//                 value='email'
//                 aria-label='Toggle Email'
//                 className='inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-black data-[state=on]:shadow-sm'
//               >
//                 Email
//               </ToggleGroupItem>
//             </ToggleGroup>
//           </div>
//           {/* --- END: New Segmented Control Design --- */}

//           <Form
//             schema={signUpValidator}
//             formFields={formFields}
//             onSubmit={handleSubmit}
//             isPending={isLoading}
//             showPasswordStrength={true}
//             defaultValues={{
//               firstName: '',
//               lastName: '',
//               email: '',
//               mobile: '',
//               country: '',
//               password: '',
//               confirmPassword: '',
//               lang: 'en',
//             }}
//             buttonTitle='Signup'
//           />
//           <div className='mt-6 pt-6 border-t border-gray-200'>
//             <p className='text-center text-sm text-gray-500'>
//               {'Already have an account? '}{' '}
//               <Link
//                 href='/login'
//                 className='font-medium text-indigo-600 hover:text-indigo-500'
//               >
//                 {'Login'}
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//===========================//

// 'use client';
// import Form, { Field } from '@/components/form';
// import { FormSchemaSignUpType, signUpValidator } from '@/lib/validators/auth';
// import { redirect, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { enqueueSnackbar } from 'notistack';
// import { useAuth } from '@/contexts/auth-context';
// import { useTranslation } from '@/hooks/use-translation';
// import { useEffect, useState, useCallback } from 'react';
// import React from 'react';
// import { useMutation } from '@apollo/client';
// import { CREATE_USER_MUTATION } from '@/graphql/mutation';
// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
// import { Label } from '@/components/ui/label';

// export default function SignUp() {
//   const { t } = useTranslation();
//   const [isLoading, setIsLoading] = useState(false);
//   const [verificationMethod, setVerificationMethod] = useState<
//     'whatsapp' | 'email'
//   >('whatsapp');
//   const router = useRouter();
//   const { user } = useAuth();

//   const [createUser] = useMutation(CREATE_USER_MUTATION);

//   const formFields: Field[] = [
//     {
//       type: 'Input',
//       name: 'firstName',
//       label: t('signup.firstname'),
//       inputType: 'text',
//     },
//     {
//       type: 'Input',
//       name: 'lastName',
//       label: t('signup.lastname'),
//       inputType: 'text',
//     },
//     {
//       type: 'Input',
//       name: 'email',
//       label: t('signup.email'),
//       inputType: 'email',
//     },
//     { type: 'Phone', name: 'mobile', label: t('signup.mobile') },
//     { type: 'Country', name: 'country', label: t('signup.country') },
//     {
//       type: 'Select',
//       name: 'lang',
//       label: t('signup.language'),
//       options: [
//         { label: 'Arabic', value: 'ar' },
//         { label: 'English', value: 'en' },
//       ],
//     },
//     {
//       type: 'Input',
//       name: 'password',
//       label: t('signup.password'),
//       inputType: 'password',
//     },
//     {
//       type: 'Input',
//       name: 'confirmPassword',
//       label: t('signup.confirmpassword'),
//       inputType: 'password',
//     },
//   ];

//   useEffect(() => {
//     if (user) {
//       redirect('/dashboard');
//     }
//   }, [user]);

//   // SignUp.tsx file er handleSubmit function...

//   const handleSubmit = useCallback(
//     async (data: FormSchemaSignUpType) => {
//       setIsLoading(true);

//       const { mobile, firstName, lastName, email, password, country, lang } =
//         data;
//       const payload = {
//         phoneNumber: mobile,
//         account: { firstName, lastName, email, password, country, lang },
//       };

//       if (verificationMethod === 'whatsapp') {
//         try {
//           const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/register-account`;
//           const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload),
//           });
//           const result = await response.json();
//           if (!response.ok) {
//             throw new Error(result.message || 'Registration failed.');
//           }
//           enqueueSnackbar(
//             'Registration successful! An OTP has been sent to your WhatsApp.',
//             { variant: 'success' }
//           );

//           // --- Shudhu ei line ti poriborton kora hoyeche ---
//           router.push(`/verify-account?mobile=${payload.phoneNumber}`);
//         } catch (error: any) {
//           enqueueSnackbar(error.message || 'Something went wrong.', {
//             variant: 'error',
//           });
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         // ... apnar Email (GraphQL) er logic ...
//       }
//     },
//     [verificationMethod, router, createUser]
//   );

//   return (
//     <div className='bg-slate-50'>
//       <div className='container pt-[100px]'>
//         <div className='flex items-center justify-center mb-5'>
//           <h1 className='text-2xl md:text-3xl font-bold'>
//             {t('signup.title')}
//           </h1>
//         </div>
//         <div className='container bg-white py-6'>
//           <div className='flex flex-col items-center justify-center mb-8'>
//             <Label className='font-semibold mb-3 text-gray-700'>
//               Verification Method
//             </Label>
//             <ToggleGroup
//               type='single'
//               defaultValue='whatsapp'
//               onValueChange={(value: 'whatsapp' | 'email') => {
//                 if (value) setVerificationMethod(value);
//               }}
//               className='inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1'
//             >
//               <ToggleGroupItem
//                 value='whatsapp'
//                 aria-label='Toggle WhatsApp'
//                 className='inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-white text-black data-[state=on]:shadow-sm'
//               >
//                 WhatsApp
//               </ToggleGroupItem>
//               <ToggleGroupItem
//                 value='email'
//                 aria-label='Toggle Email'
//                 className='inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-white text-black data-[state=on]:shadow-sm'
//               >
//                 Email
//               </ToggleGroupItem>
//             </ToggleGroup>
//           </div>

//           <Form
//             schema={signUpValidator}
//             formFields={formFields}
//             onSubmit={handleSubmit}
//             isPending={isLoading}
//             showPasswordStrength={true}
//             defaultValues={{
//               firstName: '',
//               lastName: '',
//               email: '',
//               mobile: '',
//               country: '',
//               password: '',
//               confirmPassword: '',
//               lang: 'en',
//             }}
//             buttonTitle='Signup'
//           />
//           <div className='mt-6 pt-6 border-t border-gray-200'>
//             <p className='text-center text-sm text-gray-500'>
//               {'Already have an account? '}{' '}
//               <Link
//                 href='/login'
//                 className='font-medium text-indigo-600 hover:text-indigo-500'
//               >
//                 {'Login'}
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//===================================//9-17-2025

// 'use client';
// import Form, { Field } from '@/components/form';
// import { FormSchemaSignUpType, signUpValidator } from '@/lib/validators/auth';
// import { redirect, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { enqueueSnackbar } from 'notistack';
// import { useAuth } from '@/contexts/auth-context';
// import { useTranslation } from '@/hooks/use-translation';
// import { useEffect, useState, useCallback } from 'react';
// import React from 'react';
// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
// import { Label } from '@/components/ui/label';

// export default function SignUp() {
//   const { t } = useTranslation();
//   const [isLoading, setIsLoading] = useState(false);
//   const [verificationMethod, setVerificationMethod] = useState<
//     'whatsapp' | 'email'
//   >('whatsapp');
//   const router = useRouter();
//   const { user } = useAuth();

//   const formFields: Field[] = [
//     {
//       type: 'Input',
//       name: 'firstName',
//       label: t('signup.firstname'),
//       inputType: 'text',
//     },
//     {
//       type: 'Input',
//       name: 'lastName',
//       label: t('signup.lastname'),
//       inputType: 'text',
//     },
//     {
//       type: 'Input',
//       name: 'email',
//       label: t('signup.email'),
//       inputType: 'email',
//     },
//     { type: 'Phone', name: 'mobile', label: t('signup.mobile') },
//     { type: 'Country', name: 'country', label: t('signup.country') },
//     {
//       type: 'Select',
//       name: 'lang',
//       label: t('signup.language'),
//       options: [
//         { label: 'Arabic', value: 'ar' },
//         { label: 'English', value: 'en' },
//       ],
//     },
//     {
//       type: 'Input',
//       name: 'password',
//       label: t('signup.password'),
//       inputType: 'password',
//     },
//     {
//       type: 'Input',
//       name: 'confirmPassword',
//       label: t('signup.confirmpassword'),
//       inputType: 'password',
//     },
//   ];

//   useEffect(() => {
//     if (user) {
//       redirect('/dashboard');
//     }
//   }, [user]);

//   // --- Main Updated Part Starts Here ---
//   const handleSubmit = useCallback(
//     async (data: FormSchemaSignUpType) => {
//       setIsLoading(true);

//       const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/signup-with-verification`;

//       // 1. Create the correct payload for your new API
//       const payload = {
//         firstName: data.firstName,
//         lastName: data.lastName,
//         email: data.email,
//         mobile: data.mobile,
//         password: data.password,
//         country: data.country,
//         lang: data.lang,
//         verificationType: verificationMethod, // The value from the toggle switch
//       };

//       try {
//         const response = await fetch(apiUrl, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });

//         const result = await response.json();

//         if (!response.ok) {
//           // If the API returns an error (like "user already exists"), show it
//           throw new Error(result.message || 'Registration failed.');
//         }

//         // 2. On success, save data to sessionStorage for the OTP page to use
//         sessionStorage.setItem(
//           'verificationIdentifier',
//           result.data.identifier
//         );
//         sessionStorage.setItem(
//           'verificationType',
//           result.data.verificationType
//         );

//         enqueueSnackbar(result.message, { variant: 'success' });

//         // 3. Redirect to the new OTP verification page
//         router.push('/verify-account');
//       } catch (error: any) {
//         enqueueSnackbar(error.message || 'Something went wrong.', {
//           variant: 'error',
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [verificationMethod, router] // Dependencies for the function
//   );
//   // --- Main Updated Part Ends Here ---

//   return (
//     <div className='bg-slate-50'>
//       <div className='container pt-[100px]'>
//         <div className='flex items-center justify-center mb-5'>
//           <h1 className='text-2xl md:text-3xl font-bold'>
//             {t('signup.title')}
//           </h1>
//         </div>
//         <div className='container bg-white py-6'>
//           <div className='flex flex-col items-center justify-center mb-8'>
//             <Label className='font-semibold mb-3 text-gray-700'>
//               Verification Method
//             </Label>
//             <ToggleGroup
//               type='single'
//               defaultValue='whatsapp'
//               onValueChange={(value: 'whatsapp' | 'email') => {
//                 if (value) setVerificationMethod(value);
//               }}
//               className='inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1'
//             >
//               <ToggleGroupItem
//                 value='whatsapp'
//                 aria-label='Toggle WhatsApp'
//                 className='inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-white text-black data-[state=on]:shadow-sm'
//               >
//                 WhatsApp
//               </ToggleGroupItem>
//               <ToggleGroupItem
//                 value='email'
//                 aria-label='Toggle Email'
//                 className='inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-white text-black data-[state=on]:shadow-sm'
//               >
//                 Email
//               </ToggleGroupItem>
//             </ToggleGroup>
//           </div>

//           <Form
//             schema={signUpValidator}
//             formFields={formFields}
//             onSubmit={handleSubmit}
//             isPending={isLoading}
//             showPasswordStrength={true}
//             defaultValues={{
//               firstName: '',
//               lastName: '',
//               email: '',
//               mobile: '',
//               country: '',
//               password: '',
//               confirmPassword: '',
//               lang: 'en',
//             }}
//             buttonTitle='Signup'
//           />
//           <div className='mt-6 pt-6 border-t border-gray-200'>
//             <p className='text-center text-sm text-gray-500'>
//               {'Already have an account? '}{' '}
//               <Link
//                 href='/login'
//                 className='font-medium text-indigo-600 hover:text-indigo-500'
//               >
//                 {'Login'}
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//==============================================// 9-18-2025

// 'use client';

// import Form, { Field } from '@/components/form';
// import { FormSchemaSignUpType, signUpValidator } from '@/lib/validators/auth';
// import { redirect, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { enqueueSnackbar } from 'notistack';
// import { useAuth } from '@/contexts/auth-context';
// import { useTranslation } from '@/hooks/use-translation';
// import { useEffect, useState, useCallback } from 'react';
// import React from 'react';
// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
// import { Label } from '@/components/ui/label';
// import Script from 'next/script';

// declare global {
//   interface Window {
//     google: any;
//   }
// }

// export default function SignUp() {
//   const { t } = useTranslation();
//   const [isLoading, setIsLoading] = useState(false);
//   const [verificationMethod, setVerificationMethod] = useState<
//     'whatsapp' | 'email'
//   >('whatsapp');
//   const router = useRouter();
//   const { user } = useAuth();

//   const formFields: Field[] = [
//     {
//       type: 'Input',
//       name: 'firstName',
//       label: t('signup.firstname'),
//       inputType: 'text',
//     },
//     {
//       type: 'Input',
//       name: 'lastName',
//       label: t('signup.lastname'),
//       inputType: 'text',
//     },
//     {
//       type: 'Input',
//       name: 'email',
//       label: t('signup.email'),
//       inputType: 'email',
//     },
//     { type: 'Phone', name: 'mobile', label: t('signup.mobile') },
//     { type: 'Country', name: 'country', label: t('signup.country') },
//     {
//       type: 'Select',
//       name: 'lang',
//       label: t('signup.language'),
//       options: [
//         { label: 'Arabic', value: 'ar' },
//         { label: 'English', value: 'en' },
//       ],
//     },
//     {
//       type: 'Input',
//       name: 'password',
//       label: t('signup.password'),
//       inputType: 'password',
//     },
//     {
//       type: 'Input',
//       name: 'confirmPassword',
//       label: t('signup.confirmpassword'),
//       inputType: 'password',
//     },
//   ];

//   useEffect(() => {
//     if (user) {
//       redirect('/dashboard');
//     }
//   }, [user]);

//   const handleSubmit = useCallback(
//     async (data: FormSchemaSignUpType) => {
//       setIsLoading(true);

//       const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/signup-with-verification`;

//       const payload = {
//         firstName: data.firstName,
//         lastName: data.lastName,
//         email: data.email,
//         mobile: data.mobile,
//         password: data.password,
//         country: data.country,
//         lang: data.lang,
//         verificationType: verificationMethod,
//       };

//       try {
//         const response = await fetch(apiUrl, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });

//         const result = await response.json();

//         if (!response.ok) {
//           throw new Error(result.message || 'Registration failed.');
//         }

//         sessionStorage.setItem(
//           'verificationIdentifier',
//           result.data.identifier
//         );
//         sessionStorage.setItem(
//           'verificationType',
//           result.data.verificationType
//         );

//         enqueueSnackbar(result.message, { variant: 'success' });
//         router.push('/verify-account');
//       } catch (error: any) {
//         enqueueSnackbar(error.message || 'Something went wrong.', {
//           variant: 'error',
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [verificationMethod, router]
//   );

//   const handleGoogleResponse = async (response: any) => {
//     try {
//       const idToken = response.credential;

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/user/google-signin`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ idToken }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || 'Google sign-in failed');
//       }

//       enqueueSnackbar(data.message, { variant: 'success' });
//       sessionStorage.setItem('access_token', data.data.access_token);
//       router.push('/dashboard');
//     } catch (err: any) {
//       enqueueSnackbar(
//         err.message || 'Something went wrong during Google sign-in',
//         {
//           variant: 'error',
//         }
//       );
//     }
//   };

// useEffect(() => {
//   const interval = setInterval(() => {
//     if (typeof window !== 'undefined' && window.google && window.google.accounts) {
//       window.google.accounts.id.initialize({
//         client_id: '546186166762-nso036ghrvjgjlcb9po201bi22pvkniv.apps.googleusercontent.com',
//         callback: handleGoogleResponse,
//       });

//       window.google.accounts.id.renderButton(
//         document.getElementById('google-signup'),
//         {
//           theme: 'outline',
//           size: 'large',
//           width: '100%',
//         }
//       );

//       clearInterval(interval); // ✅ Stop once loaded
//     }
//   }, 500); // Retry every 500ms

//   return () => clearInterval(interval); // Clean up
// }, []);

//   return (
//     <div className='bg-slate-50'>
//       <div className='container pt-[100px]'>
//         <div className='flex items-center justify-center mb-5'>
//           <h1 className='text-2xl md:text-3xl font-bold'>
//             {t('signup.title')}
//           </h1>
//         </div>
//         <div className='container bg-white py-6'>
//           <div className='flex flex-col items-center justify-center mb-8'>
//             <Label className='font-semibold mb-3 text-gray-700'>
//               Verification Method
//             </Label>
//             <ToggleGroup
//               type='single'
//               defaultValue='whatsapp'
//               onValueChange={(value: 'whatsapp' | 'email') => {
//                 if (value) setVerificationMethod(value);
//               }}
//               className='inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1'
//             >
//               <ToggleGroupItem
//                 value='whatsapp'
//                 aria-label='Toggle WhatsApp'
//                 className='inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-white text-black data-[state=on]:shadow-sm'
//               >
//                 WhatsApp
//               </ToggleGroupItem>
//               <ToggleGroupItem
//                 value='email'
//                 aria-label='Toggle Email'
//                 className='inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-white text-black data-[state=on]:shadow-sm'
//               >
//                 Email
//               </ToggleGroupItem>
//             </ToggleGroup>
//           </div>

//           <Form
//             schema={signUpValidator}
//             formFields={formFields}
//             onSubmit={handleSubmit}
//             isPending={isLoading}
//             showPasswordStrength={true}
//             defaultValues={{
//               firstName: '',
//               lastName: '',
//               email: '',
//               mobile: '',
//               country: '',
//               password: '',
//               confirmPassword: '',
//               lang: 'en',
//             }}
//             buttonTitle='Signup'
//           />

//           {/* ✅ Google Sign-Up Option */}
//           <div className='flex flex-col items-center mt-4 gap-2'>
//             <div className='w-full flex items-center justify-center gap-2 text-gray-500 text-sm'>
//               <hr className='flex-1 border-gray-300' />
//               OR
//               <hr className='flex-1 border-gray-300' />
//             </div>

//             <div
//               id='google-signup'
//               className='w-full flex justify-center'
//             ></div>
//           </div>

//           <div className='mt-6 pt-6 border-t border-gray-200'>
//             <p className='text-center text-sm text-gray-500'>
//               {'Already have an account? '}
//               <Link
//                 href='/login'
//                 className='font-medium text-indigo-600 hover:text-indigo-500'
//               >
//                 {'Login'}
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Load Google Sign-In SDK */}
//       <Script
//         src='https://accounts.google.com/gsi/client'
//         strategy='afterInteractive'
//       />
//     </div>
//   );
// }

//===============================================// 9-18-2025 latest with google auth

// 'use client';

// import Form, { Field } from '@/components/form';
// import { FormSchemaSignUpType, signUpValidator } from '@/lib/validators/auth';
// import { redirect, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { enqueueSnackbar } from 'notistack';
// import { useAuth } from '@/contexts/auth-context';
// import { useTranslation } from '@/hooks/use-translation';
// import { useEffect, useState, useCallback } from 'react';
// import React from 'react';
// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
// import { Label } from '@/components/ui/label';
// import Script from 'next/script';

// declare global {
//   interface Window {
//     google: any;
//   }
// }

// export default function SignUp() {
//   const { t } = useTranslation();
//   const [isLoading, setIsLoading] = useState(false);
//   const [verificationMethod, setVerificationMethod] = useState<
//     'whatsapp' | 'email'
//   >('whatsapp');
//   const router = useRouter();
//   const { user } = useAuth();

//   const formFields: Field[] = [
//     {
//       type: 'Input',
//       name: 'firstName',
//       label: t('signup.firstname'),
//       inputType: 'text',
//     },
//     {
//       type: 'Input',
//       name: 'lastName',
//       label: t('signup.lastname'),
//       inputType: 'text',
//     },
//     {
//       type: 'Input',
//       name: 'email',
//       label: t('signup.email'),
//       inputType: 'email',
//     },
//     { type: 'Phone', name: 'mobile', label: t('signup.mobile') },
//     { type: 'Country', name: 'country', label: t('signup.country') },
//     {
//       type: 'Select',
//       name: 'lang',
//       label: t('signup.language'),
//       options: [
//         { label: 'Arabic', value: 'ar' },
//         { label: 'English', value: 'en' },
//       ],
//     },
//     {
//       type: 'Input',
//       name: 'password',
//       label: t('signup.password'),
//       inputType: 'password',
//     },
//     {
//       type: 'Input',
//       name: 'confirmPassword',
//       label: t('signup.confirmpassword'),
//       inputType: 'password',
//     },
//   ];

//   useEffect(() => {
//     if (user) {
//       redirect('/dashboard');
//     }
//   }, [user]);

//   const handleSubmit = useCallback(
//     async (data: FormSchemaSignUpType) => {
//       setIsLoading(true);

//       const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/signup-with-verification`;

//       const payload = {
//         firstName: data.firstName,
//         lastName: data.lastName,
//         email: data.email,
//         mobile: data.mobile,
//         password: data.password,
//         country: data.country,
//         lang: data.lang,
//         verificationType: verificationMethod,
//       };

//       try {
//         const response = await fetch(apiUrl, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });

//         const result = await response.json();

//         if (!response.ok) {
//           throw new Error(result.message || 'Registration failed.');
//         }

//         sessionStorage.setItem(
//           'verificationIdentifier',
//           result.data.identifier
//         );
//         sessionStorage.setItem(
//           'verificationType',
//           result.data.verificationType
//         );

//         enqueueSnackbar(result.message, { variant: 'success' });
//         router.push('/verify-account');
//       } catch (error: any) {
//         enqueueSnackbar(error.message || 'Something went wrong.', {
//           variant: 'error',
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [verificationMethod, router]
//   );

//   const handleGoogleResponse = async (response: any) => {
//     try {
//       const idToken = response.credential;

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/user/google-signin`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ idToken }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || 'Google sign-in failed');
//       }

//       enqueueSnackbar(data.message, { variant: 'success' });
//       sessionStorage.setItem('access_token', data.data.access_token);
//       router.push('/dashboard');
//     } catch (err: any) {
//       enqueueSnackbar(
//         err.message || 'Something went wrong during Google sign-in',
//         {
//           variant: 'error',
//         }
//       );
//     }
//   };

//   /** -------- Google Auth: production-ready init (no delay) -------- */
//   const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

//   const initGoogle = useCallback(() => {
//     if (!googleClientId) {
//       console.error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID');
//       return;
//     }
//     if (!window.google || !window.google.accounts) {
//       // SDK not ready yet (shouldn’t happen because we call from Script onLoad)
//       return;
//     }

//     window.google.accounts.id.initialize({
//       client_id: googleClientId,
//       callback: handleGoogleResponse,
//     });

//     const container = document.getElementById('google-signup');
//     if (container) {
//       // Clear to avoid duplicates on HMR
//       container.innerHTML = '';
//       window.google.accounts.id.renderButton(container, {
//         theme: 'outline',
//         size: 'large',
//         width: '100%',
//       });
//     }
//   }, [googleClientId]);
//   /** --------------------------------------------------------------- */

//   return (
//     <div className='bg-slate-50'>
//       <div className='container pt-[100px]'>
//         <div className='flex items-center justify-center mb-5'>
//           <h1 className='text-2xl md:text-3xl font-bold'>
//             {t('signup.title')}
//           </h1>
//         </div>
//         <div className='container bg-white py-6'>
//           <div className='flex flex-col items-center justify-center mb-8'>
//             <Label className='font-semibold mb-3 text-gray-700'>
//               Verification Method
//             </Label>
//             <ToggleGroup
//               type='single'
//               defaultValue='whatsapp'
//               onValueChange={(value: 'whatsapp' | 'email') => {
//                 if (value) setVerificationMethod(value);
//               }}
//               className='inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1'
//             >
//               <ToggleGroupItem
//                 value='whatsapp'
//                 aria-label='Toggle WhatsApp'
//                 className='inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-white text-black data-[state=on]:shadow-sm'
//               >
//                 WhatsApp
//               </ToggleGroupItem>
//               <ToggleGroupItem
//                 value='email'
//                 aria-label='Toggle Email'
//                 className='inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-white text-black data-[state=on]:shadow-sm'
//               >
//                 Email
//               </ToggleGroupItem>
//             </ToggleGroup>
//           </div>

//           <Form
//             schema={signUpValidator}
//             formFields={formFields}
//             onSubmit={handleSubmit}
//             isPending={isLoading}
//             showPasswordStrength={true}
//             defaultValues={{
//               firstName: '',
//               lastName: '',
//               email: '',
//               mobile: '',
//               country: '',
//               password: '',
//               confirmPassword: '',
//               lang: 'en',
//             }}
//             buttonTitle='Signup'
//           />

//           {/* ✅ Google Sign-Up Option */}
//           <div className='flex flex-col items-center mt-4 gap-2'>
//             <div className='w-full flex items-center justify-center gap-2 text-gray-500 text-sm'>
//               <hr className='flex-1 border-gray-300' />
//               OR
//               <hr className='flex-1 border-gray-300' />
//             </div>

//             <div
//               id='google-signup'
//               className='w-full flex justify-center min-h-[44px]'
//             ></div>
//           </div>

//           <div className='mt-6 pt-6 border-t border-gray-200'>
//             <p className='text-center text-sm text-gray-500'>
//               {'Already have an account? '}
//               <Link
//                 href='/login'
//                 className='font-medium text-indigo-600 hover:text-indigo-500'
//               >
//                 {'Login'}
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Load Google Sign-In SDK and init immediately on load */}
//       <Script
//         src='https://accounts.google.com/gsi/client'
//         strategy='afterInteractive'
//         onLoad={initGoogle}
//       />
//     </div>
//   );
// }

//============================//

'use client';

import Form, { Field } from '@/components/form';
import { FormSchemaSignUpType, signUpValidator } from '@/lib/validators/auth';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/hooks/use-translation';
import { useEffect, useState, useCallback } from 'react';
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import Script from 'next/script';

declare global {
  interface Window {
    google: any;
  }
}

export default function SignUp() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<
    'whatsapp' | 'email'
  >('whatsapp');
  const router = useRouter();
  const { user } = useAuth();

  const formFields: Field[] = [
    {
      type: 'Input',
      name: 'firstName',
      label: t('signup.firstname'),
      inputType: 'text',
    },
    {
      type: 'Input',
      name: 'lastName',
      label: t('signup.lastname'),
      inputType: 'text',
    },
    {
      type: 'Input',
      name: 'email',
      label: t('signup.email'),
      inputType: 'email',
    },
    { type: 'Phone', name: 'mobile', label: t('signup.mobile') },
    { type: 'Country', name: 'country', label: t('signup.country') },
    {
      type: 'Select',
      name: 'lang',
      label: t('signup.language'),
      options: [
        { label: 'Arabic', value: 'ar' },
        { label: 'English', value: 'en' },
      ],
    },
    {
      type: 'Input',
      name: 'password',
      label: t('signup.password'),
      inputType: 'password',
    },
    {
      type: 'Input',
      name: 'confirmPassword',
      label: t('signup.confirmpassword'),
      inputType: 'password',
    },
  ];

  useEffect(() => {
    if (user) {
      redirect('/dashboard');
    }
  }, [user]);

  const handleSubmit = useCallback(
    async (data: FormSchemaSignUpType) => {
      setIsLoading(true);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/signup-with-verification`;

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        country: data.country,
        lang: data.lang,
        verificationType: verificationMethod,
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Registration failed.');
        }

        sessionStorage.setItem(
          'verificationIdentifier',
          result.data.identifier
        );
        sessionStorage.setItem(
          'verificationType',
          result.data.verificationType
        );

        enqueueSnackbar(result.message, { variant: 'success' });
        router.push('/verify-account');
      } catch (error: any) {
        enqueueSnackbar(error.message || 'Something went wrong.', {
          variant: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [verificationMethod, router]
  );

  // --------------- GOOGLE AUTH (updated) ---------------
  const handleGoogleResponse = async (response: any) => {
    try {
      const idToken = response?.credential;
      if (!idToken) throw new Error('No Google credential received.');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/google-signin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Google sign-in failed');

      // token extract (from your sample response)
      const token =
        json?.data?.access_token ||
        json?.access_token ||
        json?.token ||
        json?.data?.token;

      if (!token) throw new Error('No access token found in response');

      // ✅ Save EXACTLY like your app expects: key = "loginUser", value = JSON string with { access_token: "..." }
      const loginUser = {
        access_token: token,
        // optional but useful:
        user: json?.data?.user ?? null,
        subscription: json?.data?.subscription ?? null,
        authMethod: 'google',
      };

      try {
        localStorage.setItem('loginUser', JSON.stringify(loginUser));
        // (optional) keep sessionStorage mirror if your code reads from there anywhere
        sessionStorage.setItem('loginUser', JSON.stringify(loginUser));
      } catch {
        /* ignore storage errors */
      }

      // (optional) cookie for middleware/SSR
      const isSecure = window.location.protocol === 'https:';
      document.cookie = `access_token=${token}; Path=/; Max-Age=${
        60 * 60 * 24 * 30
      }; SameSite=Lax${isSecure ? '; Secure' : ''}`;

      enqueueSnackbar(json?.message || 'Signed in with Google', {
        variant: 'success',
      });

      // Hard navigate so guards/providers re-evaluate using `loginUser`
      window.location.replace('/dashboard');
      setTimeout(() => {
        try {
          // @ts-ignore
          router.replace('/dashboard');
        } catch {}
      }, 50);
    } catch (err: any) {
      console.error('[Google Sign-In] error:', err);
      enqueueSnackbar(
        err?.message || 'Something went wrong during Google sign-in',
        { variant: 'error' }
      );
    }
  };

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

  const initGoogle = useCallback(() => {
    if (!googleClientId) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID');
      return;
    }
    if (!window.google || !window.google.accounts) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: false,
    });

    const container = document.getElementById('google-signup');
    if (container) {
      container.innerHTML = '';
      window.google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signup_with',
        width: 320, // number required (fixes GSI_LOGGER)
      });
    }
  }, [googleClientId]);

  // if SDK already present (back nav/HMR), init immediately
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      initGoogle();
    }
  }, [initGoogle]);
  // ------------- END GOOGLE AUTH ----------------------

  return (
    <div className='bg-slate-50'>
      <div className='container pt-[100px]'>
        <div className='flex items-center justify-center mb-5'>
          <h1 className='text-2xl md:text-3xl font-bold'>
            {t('signup.title')}
          </h1>
        </div>
        <div className='container bg-white py-6'>
          <div className='flex flex-col items-center justify-center mb-8'>
            <Label className='font-semibold mb-3 text-gray-700'>
              Verification Method
            </Label>
            <ToggleGroup
              type='single'
              defaultValue='whatsapp'
              onValueChange={(value: 'whatsapp' | 'email') => {
                if (value) setVerificationMethod(value);
              }}
              className='inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1'
            >
              <ToggleGroupItem
                value='whatsapp'
                aria-label='Toggle WhatsApp'
                className='inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-white text-black data-[state=on]:shadow-sm'
              >
                WhatsApp
              </ToggleGroupItem>
              <ToggleGroupItem
                value='email'
                aria-label='Toggle Email'
                className='inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-white text-black data-[state=on]:shadow-sm'
              >
                Email
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Form
            schema={signUpValidator}
            formFields={formFields}
            onSubmit={handleSubmit}
            isPending={isLoading}
            showPasswordStrength={true}
            defaultValues={{
              firstName: '',
              lastName: '',
              email: '',
              mobile: '',
              country: '',
              password: '',
              confirmPassword: '',
              lang: 'en',
            }}
            buttonTitle='Signup'
          />

          {/* ✅ Google Sign-Up Option */}
          <div className='flex flex-col items-center mt-4 gap-2'>
            <div className='w-full flex items-center justify-center gap-2 text-gray-500 text-sm'>
              <hr className='flex-1 border-gray-300' />
              OR
              <hr className='flex-1 border-gray-300' />
            </div>

            <div
              id='google-signup'
              className='w-full flex justify-center min-h-[44px]'
            ></div>
          </div>

          <div className='mt-6 pt-6 border-t border-gray-200'>
            <p className='text-center text-sm text-gray-500'>
              {'Already have an account? '}
              <Link
                href='/login'
                className='font-medium text-indigo-600 hover:text-indigo-500'
              >
                {'Login'}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Load Google SDK & init */}
      <Script
        src='https://accounts.google.com/gsi/client'
        strategy='afterInteractive'
        onLoad={initGoogle}
      />
    </div>
  );
}
