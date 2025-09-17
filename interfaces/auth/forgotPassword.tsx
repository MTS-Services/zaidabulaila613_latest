// 'use client';
// import { z } from 'zod';
// import Form, { Field } from '@/components/form';
// import {
//   forgetPasswordValidator,
//   FormSchemaSignUpType,
//   signInValidator,
//   signUpValidator,
// } from '@/lib/validators/auth';
// import { useRouter } from 'next/navigation';
// import { useMutation, useQuery } from '@apollo/client';
// import {
//   CREATE_USER_MUTATION,
//   FORGET_PASSWORD_MUTATION,
//   LOGIN_USER_MUTATION,
// } from '@/graphql/mutation';
// import Link from 'next/link';
// import { ChevronLeft, Mail } from 'lucide-react';
// import { enqueueSnackbar } from 'notistack';
// import { useAuth } from '@/contexts/auth-context';
// import { useTranslation } from '@/hooks/use-translation';

// export default function ForgetPassword() {
//   const { t } = useTranslation();

//   const formFields: Field[] = [
//     {
//       type: 'Input',
//       name: 'email',
//       label: t('forgetpassword.email'),
//       inputType: 'email',
//       placeholder:
//         t('forgetpassword.emailplaceholder') || 'Enter your email address',
//       icon: <Mail className='h-5 w-5 text-gray-400' />,
//     },
//   ];

//   const router = useRouter();
//   const [forgetPassword, { data, loading, error }] = useMutation(
//     FORGET_PASSWORD_MUTATION
//   );

//   const handleSubmit = async (values: any) => {
//     try {
//       const response = await forgetPassword({
//         variables: {
//           email: values?.email,
//         },
//       });

//       enqueueSnackbar({
//         message: 'Password reset token sent to your email.',
//         variant: 'success',
//         anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
//       });
//       router.push('/');
//     } catch (e: any) {
//       console.error('GraphQL Forget Error:', e);

//       const message =
//         e?.graphQLErrors?.[0]?.message ||
//         e?.message ||
//         'Something went wrong during forgetPassword';

//       enqueueSnackbar(message, {
//         variant: 'error',
//         anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
//       });
//     }
//   };

//   return (
//     <div className='min-h-screen bg-slate-50 flex flex-col justify-center py-8'>
//       <div className='sm:mx-auto sm:w-full sm:max-w-md'>
//         <div className='text-center mb-8'>
//           <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100'>
//             <Mail className='h-6 w-6 text-indigo-600' />
//           </div>
//           <h1 className='mt-4 text-2xl md:text-3xl font-bold text-gray-900'>
//             {t('forgetpassword.title')}
//           </h1>
//         </div>

//         <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
//           <Form
//             schema={forgetPasswordValidator}
//             formFields={formFields}
//             onSubmit={handleSubmit}
//             isPending={loading}
//             defaultValues={{
//               email: '',
//             }}
//             fieldDir='column'
//             buttonTitle={t('forgetpassword.button')}
//             // buttonClassName='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
//           />

//           <div className='mt-6 text-center'>
//             <p className='text-sm text-gray-600'>
//               {t('forgetpassword.rememberpassword') ||
//                 'Remember your password?'}{' '}
//               <Link
//                 href='/login'
//                 className='font-medium text-indigo-600 hover:text-indigo-500'
//               >
//                 {t('signup.button') || 'Sign in'}
//               </Link>
//             </p>
//           </div>
//         </div>

//         <div className='mt-6 text-center'>
//           <Link
//             href='/'
//             className='inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900'
//           >
//             <ChevronLeft className='h-4 w-4 mr-1' />
//             {t('common.continueshopping') || 'Continue Shopping'}
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

//======================================// 9-17-2025

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { enqueueSnackbar } from 'notistack';
// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';

// export default function ForgotPassword() {
//   const router = useRouter();
//   const [identifier, setIdentifier] = useState('');
//   const [verificationType, setVerificationType] = useState<
//     'email' | 'whatsapp'
//   >('email');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsLoading(true);

//     const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/forgot-password`;
//     const payload = { identifier, verificationType };

//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();
//       if (!response.ok) {
//         throw new Error(result.message || 'Failed to send reset code.');
//       }

//       // 1. Save the identifier and type for the next page (OTP page)
//       sessionStorage.setItem('resetIdentifier', identifier);
//       sessionStorage.setItem('resetVerificationType', verificationType);

//       enqueueSnackbar('A password reset code has been sent.', {
//         variant: 'success',
//       });

//       // 2. Redirect to the page where the user will enter the OTP
//       router.push('/reset-password-verify');
//     } catch (error: any) {
//       enqueueSnackbar(error.message, { variant: 'error' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className='flex items-center justify-center min-h-screen bg-gray-50'>
//       <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
//         <div className='text-center'>
//           <h1 className='text-2xl font-bold'>Forgot Password</h1>
//           <p className='text-gray-600 mt-2'>
//             Enter your email or WhatsApp number to receive a verification code.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className='space-y-6'>
//           <div className='flex flex-col items-center justify-center'>
//             <Label className='font-semibold mb-3 text-gray-700'>
//               Receive Code Via
//             </Label>
//             <ToggleGroup
//               type='single'
//               value={verificationType}
//               onValueChange={(value: 'email' | 'whatsapp') => {
//                 if (value) setVerificationType(value);
//               }}
//               className='inline-flex'
//             >
//               <ToggleGroupItem value='email'>Email</ToggleGroupItem>
//               <ToggleGroupItem value='whatsapp'>WhatsApp</ToggleGroupItem>
//             </ToggleGroup>
//           </div>

//           <div>
//             <label
//               htmlFor='identifier'
//               className='block text-sm font-medium text-gray-700'
//             >
//               {verificationType === 'email'
//                 ? 'Email Address'
//                 : 'WhatsApp Number'}
//             </label>
//             <input
//               id='identifier'
//               name='identifier'
//               type={verificationType === 'email' ? 'email' : 'tel'}
//               value={identifier}
//               onChange={(e) => setIdentifier(e.target.value)}
//               placeholder={
//                 verificationType === 'email' ? 'you@example.com' : '+8801...'
//               }
//               required
//               className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
//             />
//           </div>

//           <Button type='submit' disabled={isLoading} className='w-full'>
//             {isLoading ? 'Sending...' : 'Send Reset Code'}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }

//=================================// 9-17-2025 added number with country code

// In: src/app/forgot-password/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// --- Step 1: Add the necessary imports ---
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [verificationType, setVerificationType] = useState<
    'email' | 'whatsapp'
  >('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/forgot-password`;
    const payload = { identifier, verificationType };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send reset code.');
      }

      sessionStorage.setItem('resetIdentifier', identifier);
      sessionStorage.setItem('resetVerificationType', verificationType);

      enqueueSnackbar('A password reset code has been sent.', {
        variant: 'success',
      });

      router.push('/reset-password-verify');
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Forgot Password</h1>
          <p className='text-gray-600 mt-2'>
            Enter your email or WhatsApp number to receive a verification code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex flex-col items-center justify-center'>
            <Label className='font-semibold mb-3 text-gray-700'>
              Receive Code Via
            </Label>
            <ToggleGroup
              type='single'
              value={verificationType}
              onValueChange={(value: 'email' | 'whatsapp') => {
                if (value) {
                  setVerificationType(value);
                  setIdentifier(''); // Clear the input when changing method
                }
              }}
              className='inline-flex'
            >
              <ToggleGroupItem value='email'>Email</ToggleGroupItem>
              <ToggleGroupItem value='whatsapp'>WhatsApp</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div>
            <label
              htmlFor='identifier'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              {verificationType === 'email'
                ? 'Email Address'
                : 'WhatsApp Number'}
            </label>

            {/* --- Step 2 & 3: Conditional Rendering and State Connection --- */}
            {verificationType === 'email' ? (
              <input
                id='identifier'
                name='identifier'
                type='email'
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder='you@example.com'
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
              />
            ) : (
              <PhoneInput
                id='identifier'
                international
                defaultCountry='KW' // Set default country to Kuwait
                value={identifier}
                onChange={(value) => setIdentifier(value || '')}
                className='PhoneInputInput' // Use this class for custom styling if needed
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                }}
              />
            )}
          </div>

          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading ? 'Sending...' : 'Send Reset Code'}
          </Button>
        </form>
        <div className='text-center text-sm'>
          <p>
            Remember your password?{' '}
            <Link
              href='/login'
              className='font-medium text-indigo-600 hover:text-indigo-500'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
