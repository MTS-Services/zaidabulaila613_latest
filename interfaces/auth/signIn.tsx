// 'use client';
// import { z } from 'zod';
// import Form, { Field } from '@/components/form';
// import {
//   FormSchemaSignUpType,
//   signInValidator,
//   signUpValidator,
// } from '@/lib/validators/auth';
// import { useRouter } from 'next/navigation';
// import { useMutation, useQuery } from '@apollo/client';
// import { CREATE_USER_MUTATION, LOGIN_USER_MUTATION } from '@/graphql/mutation';
// import Link from 'next/link';
// import { ChevronLeft } from 'lucide-react';
// import { enqueueSnackbar } from 'notistack';
// import { useAuth } from '@/contexts/auth-context';
// import { useSearchParams } from 'next/navigation';
// import { useTranslation } from '@/hooks/use-translation';

// export default function SignIn() {
//   const { t } = useTranslation();

//   const formFields: Field[] = [
//     {
//       type: 'Input',
//       name: 'username',
//       label: t('login.phonelabel'),
//       inputType: 'text',
//     },
//     {
//       type: 'Input',
//       name: 'password',
//       label: t('login.password'),
//       inputType: 'password',
//     },
//   ];

//   const router = useRouter();
//   const { login } = useAuth();
//   const [loginUser, { data, loading, error }] =
//     useMutation(LOGIN_USER_MUTATION);
//   const searchParams = useSearchParams();

//   const redirect = searchParams.get('redirectTo');
//   const handleSubmit = async (values: any) => {
//     try {
//       const response = await loginUser({
//         variables: {
//           username: values?.username,
//           password: values?.password,
//         },
//       });
//       const result = response?.data?.loginUser;
//       if (!result?.user?.isVerified) {
//         router.push(`verify-account?email=${values?.username}`);
//         return;
//       }
//       login(result);
//       enqueueSnackbar({
//         message: 'Login successful',
//         variant: 'success',
//         anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
//       });
//       if (redirect) {
//         router.push(redirect);
//       } else {
//         router.push('/dashboard');
//       }
//     } catch (e: any) {
//       console.error('GraphQL Signup Error:', e);

//       const message =
//         e?.graphQLErrors?.[0]?.message ||
//         e?.message ||
//         'Something went wrong during login';

//       enqueueSnackbar(message, {
//         variant: 'error',
//         anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
//       });
//     }
//   };

//   return (
//     <>
//       <div className='bg-slate-50'>
//         <div className='container pt-[100px]'>
//           <div className='flex items-center justify-center mb-5'>
//             <h1 className='text-2xl md:text-3xl font-bold'>
//               {t('login.title')}
//             </h1>
//             {/* <Link href="/" className="flex items-center text-sm text-slate-600 hover:text-slate-900">
//                                 <ChevronLeft className="h-4 w-4 mr-1" />
//                                 Continue Shopping
//                             </Link> */}
//           </div>

//           <div className='container bg-white py-6 max-w-[500px]'>
//             <Form
//               schema={signInValidator}
//               formFields={formFields}
//               onSubmit={handleSubmit}
//               isPending={loading}
//               defaultValues={{
//                 username: '',
//                 password: '',
//               }}
//               fieldDir='column'
//               buttonTitle={t('login.button')}
//             />
//             <div className='mt-4 flex justify-center gap-5'>
//               <Link href={'/signup'}>{t('login.signup')}</Link>
//               <Link href={'/forget-password'}>{t('login.forgot')}</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

//===================================// 9-17-2025

// 'use client';

// import { useState } from 'react';
// import Form, { Field } from '@/components/form';
// import { signInValidator } from '@/lib/validators/auth';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { enqueueSnackbar } from 'notistack';
// import { useAuth } from '@/contexts/auth-context';
// import { useSearchParams } from 'next/navigation';
// import { useTranslation } from '@/hooks/use-translation';

// export const SignIn = () => {
//   const { t } = useTranslation();
//   const router = useRouter();
//   const { login } = useAuth();
//   const searchParams = useSearchParams();
//   const redirect = searchParams.get('redirectTo');
//   const [isLoading, setIsLoading] = useState(false);

//   const formFields: Field[] = [
//     {
//       type: 'Input',
//       name: 'username',
//       label: t('login.phonelabel'),
//       inputType: 'text',
//     },
//     {
//       type: 'Input',
//       name: 'password',
//       label: t('login.password'),
//       inputType: 'password',
//     },
//   ];

//   const handleSubmit = async (values: any) => {
//     setIsLoading(true);
//     const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/login`;
//     const payload = {
//       username: values.username,
//       password: values.password,
//     };

//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();
//       if (!response.ok) {
//         throw new Error(result.message || 'Login failed.');
//       }

//       login(result.data);
//       enqueueSnackbar('Login successful', { variant: 'success' });
//       router.push(redirect || '/dashboard');
//     } catch (e: any) {
//       enqueueSnackbar(e.message || 'Something went wrong', {
//         variant: 'error',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // The 'return' with all the HTML/JSX must be inside the component function
//   return (
//     <div className='bg-slate-50'>
//       <div className='container pt-[100px]'>
//         <div className='flex items-center justify-center mb-5'>
//           <h1 className='text-2xl md:text-3xl font-bold'>{t('login.title')}</h1>
//         </div>
//         <div className='container bg-white py-6 max-w-[500px]'>
//           <Form
//             schema={signInValidator}
//             formFields={formFields}
//             onSubmit={handleSubmit}
//             isPending={isLoading}
//             defaultValues={{ username: '', password: '' }}
//             fieldDir='column'
//             buttonTitle={t('login.button')}
//           />
//           <div className='mt-4 flex justify-center gap-5'>
//             <Link href={'/signup'}>{t('login.signup')}</Link>
//             <Link href={'/forgot-password'}>{t('login.forgot')}</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

//===================================// 9-18-2025

'use client';

import { useState, useCallback, useEffect } from 'react';
import Form, { Field } from '@/components/form';
import { signInValidator } from '@/lib/validators/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/hooks/use-translation';
import Script from 'next/script';

declare global {
  interface Window {
    google: any;
  }
}

export const SignIn = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirectTo');
  const [isLoading, setIsLoading] = useState(false);

  const formFields: Field[] = [
    {
      type: 'Input',
      name: 'username',
      label: t('login.phonelabel'),
      inputType: 'text',
    },
    {
      type: 'Input',
      name: 'password',
      label: t('login.password'),
      inputType: 'password',
    },
  ];

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/login`;
    const payload = {
      username: values.username,
      password: values.password,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Login failed.');
      }

      login(result.data);
      enqueueSnackbar('Login successful', { variant: 'success' });
      router.push(redirect || '/dashboard');
    } catch (e: any) {
      enqueueSnackbar(e.message || 'Something went wrong', {
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- Google Auth (button only) ---------------- */
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

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

      // robust token extraction
      const token =
        json?.data?.access_token ||
        json?.access_token ||
        json?.token ||
        json?.data?.token;

      if (!token) throw new Error('No access token found in response');

      // ✅ Save exactly how your app expects it: key "loginUser", JSON with access_token
      const loginUser = {
        access_token: token,
        user: json?.data?.user ?? null,
        subscription: json?.data?.subscription ?? null,
        authMethod: 'google',
      };
      try {
        localStorage.setItem('loginUser', JSON.stringify(loginUser));
        sessionStorage.setItem('loginUser', JSON.stringify(loginUser));
      } catch {}

      // (optional) cookie so middleware/SSR can see it
      const isSecure = window.location.protocol === 'https:';
      document.cookie = `access_token=${token}; Path=/; Max-Age=${
        60 * 60 * 24 * 30
      }; SameSite=Lax${isSecure ? '; Secure' : ''}`;

      enqueueSnackbar(json?.message || 'Signed in with Google', {
        variant: 'success',
      });

      // Respect redirect query param; hard navigate so guards re-evaluate
      const dest = redirect || '/dashboard';
      window.location.replace(dest);
    } catch (err: any) {
      enqueueSnackbar(
        err?.message || 'Something went wrong during Google sign-in',
        { variant: 'error' }
      );
    }
  };

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

    const container = document.getElementById('google-login');
    if (container) {
      container.innerHTML = '';
      window.google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signin_with',
        width: 320, // must be a number; avoids GSI_LOGGER width warning
      });
    }
  }, [googleClientId]);

  // If SDK already present (back nav/HMR), init immediately
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      initGoogle();
    }
  }, [initGoogle]);
  /* ---------------- End Google Auth ---------------- */

  // The 'return' with all the HTML/JSX must be inside the component function
  return (
    <div className='bg-slate-50'>
      <div className='container pt-[100px]'>
        <div className='flex items-center justify-center mb-5'>
          <h1 className='text-2xl md:text-3xl font-bold'>{t('login.title')}</h1>
        </div>
        <div className='container bg-white py-6 max-w-[500px]'>
          <Form
            schema={signInValidator}
            formFields={formFields}
            onSubmit={handleSubmit}
            isPending={isLoading}
            defaultValues={{ username: '', password: '' }}
            fieldDir='column'
            buttonTitle={t('login.button')}
          />
          <div className='mt-4 flex justify-center gap-5'>
            <Link href={'/signup'}>{t('login.signup')}</Link>
            <Link href={'/forgot-password'}>{t('login.forgot')}</Link>
          </div>

          {/* ▼▼ added Google block exactly at red area ▼▼ */}
          <div className='mt-6'>
            <div className='w-full flex items-center justify-center gap-2 text-gray-500 text-sm'>
              <hr className='flex-1 border-gray-300' />
              {t('common.or') ?? 'or'}
              <hr className='flex-1 border-gray-300' />
            </div>
            <div
              id='google-login'
              className='mt-3 w-full flex justify-center min-h-[44px]'
            />
          </div>
          {/* ▲▲ end Google block ▲▲ */}
        </div>
      </div>

      {/* Load Google SDK & init immediately on load */}
      <Script
        src='https://accounts.google.com/gsi/client'
        strategy='afterInteractive'
        onLoad={initGoogle}
      />
    </div>
  );
};
