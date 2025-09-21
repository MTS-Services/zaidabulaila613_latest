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

"use client";
import Form, { Field } from "@/components/form";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/hooks/use-translation";
import { FormSchemaSignUpType, signUpValidator } from "@/lib/validators/auth";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";

export default function SignUp() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<
    "whatsapp" | "email"
  >("whatsapp");
  const router = useRouter();
  const { user } = useAuth();

  const formFields: Field[] = [
    {
      type: "Input",
      name: "firstName",
      label: t("signup.firstname"),
      inputType: "text",
    },
    {
      type: "Input",
      name: "lastName",
      label: t("signup.lastname"),
      inputType: "text",
    },
    {
      type: "Input",
      name: "email",
      label: t("signup.email"),
      inputType: "email",
    },
    { type: "Phone", name: "mobile", label: t("signup.mobile") },
    { type: "Country", name: "country", label: t("signup.country") },
    {
      type: "Select",
      name: "lang",
      label: t("signup.language"),
      options: [
        { label: "Arabic", value: "ar" },
        { label: "English", value: "en" },
      ],
    },
    {
      type: "Input",
      name: "password",
      label: t("signup.password"),
      inputType: "password",
    },
    {
      type: "Input",
      name: "confirmPassword",
      label: t("signup.confirmpassword"),
      inputType: "password",
    },
  ];

  useEffect(() => {
    if (user) {
      redirect("/dashboard");
    }
  }, [user]);

  // --- Main Updated Part Starts Here ---
  const handleSubmit = useCallback(
    async (data: FormSchemaSignUpType) => {
      setIsLoading(true);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/signup-with-verification`;

      // 1. Create the correct payload for your new API
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        country: data.country,
        lang: data.lang,
        verificationType: verificationMethod, // The value from the toggle switch
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          // If the API returns an error (like "user already exists"), show it
          throw new Error(result.message || "Registration failed.");
        }

        // 2. On success, save data to sessionStorage for the OTP page to use
        sessionStorage.setItem(
          "verificationIdentifier",
          result.data.identifier
        );
        sessionStorage.setItem(
          "verificationType",
          result.data.verificationType
        );

        enqueueSnackbar(result.message, { variant: "success" });

        // 3. Redirect to the new OTP verification page
        router.push("/verify-account");
      } catch (error: any) {
        enqueueSnackbar(error.message || "Something went wrong.", {
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [verificationMethod, router] // Dependencies for the function
  );
  // --- Main Updated Part Ends Here ---

  return (
    <div className="bg-slate-50">
      <div className="container pt-[100px]">
        <div className="flex items-center justify-center mb-5">
          <h1 className="text-2xl md:text-3xl font-bold">
            {t("signup.title")}
          </h1>
        </div>
        <div className="container bg-white py-6">
          <div className="flex flex-col items-center justify-center mb-8">
            <Label className="font-semibold mb-3 text-gray-700">
              Verification Method
            </Label>
            <ToggleGroup
              type="single"
              defaultValue="whatsapp"
              onValueChange={(value: "whatsapp" | "email") => {
                if (value) setVerificationMethod(value);
              }}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1"
            >
              <ToggleGroupItem
                value="whatsapp"
                aria-label="Toggle WhatsApp"
                className="inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-white text-black data-[state=on]:shadow-sm"
              >
                WhatsApp
              </ToggleGroupItem>
              <ToggleGroupItem
                value="email"
                aria-label="Toggle Email"
                className="inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=on]:bg-[#CC9765] data-[state=on]:text-white text-black data-[state=on]:shadow-sm"
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
              firstName: "",
              lastName: "",
              email: "",
              mobile: "",
              country: "",
              password: "",
              confirmPassword: "",
              lang: "en",
            }}
            buttonTitle="Sign Up"
          />
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              {"Already have an account? "}{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {"Login"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
