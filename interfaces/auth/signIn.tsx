'use client';
import { z } from 'zod';
import Form, { Field } from '@/components/form';
import {
  FormSchemaSignUpType,
  signInValidator,
  signUpValidator,
} from '@/lib/validators/auth';
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
  const { t } = useTranslation();

  const formFields: Field[] = [
    {
      type: 'Input',
      name: 'username',
      label: t('login.phonelabel'),
      inputType: 'text',
      placeholder:
        t('login.phoneplaceholder') || 'Enter your username or email',
    },
    {
      type: 'Input',
      name: 'password',
      label: t('login.password'),
      inputType: 'password',
      placeholder: t('login.passwordplaceholder') || 'Enter your password',
    },
  ];

  const router = useRouter();
  const { login } = useAuth();
  const [loginUser, { data, loading, error }] =
    useMutation(LOGIN_USER_MUTATION);
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirectTo');
  const handleSubmit = async (values: any) => {
    try {
      const response = await loginUser({
        variables: {
          username: values?.username,
          password: values?.password,
        },
      });
      const result = response?.data?.loginUser;
      if (!result?.user?.isVerified) {
        router.push(`verify-account?email=${values?.username}`);
        return;
      }
      login(result);
      enqueueSnackbar({
        message: 'Login successful',
        variant: 'success',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
      if (redirect) {
        router.push(redirect);
      } else {
        router.push('/dashboard');
      }
    } catch (e: any) {
      console.error('GraphQL Signup Error:', e);

      const message =
        e?.graphQLErrors?.[0]?.message ||
        e?.message ||
        'Something went wrong during login';

      enqueueSnackbar(message, {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col justify-center'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='text-center'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
            {t('login.title')}
          </h1>
          {/* <p className='mt-2 text-sm text-gray-600'>
            {t('login.subtitle') ||
              'Welcome back! Please sign in to your account.'}
          </p> */}
        </div>

        <div className='mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <Form
            schema={signInValidator}
            formFields={formFields}
            onSubmit={handleSubmit}
            isPending={loading}
            defaultValues={{
              username: '',
              password: '',
            }}
            fieldDir='column'
            buttonTitle={t('login.button')}
          />

          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  {t('login.accountoptions') || 'Account options'}
                </span>
              </div>
            </div>

            <div className='mt-4 grid grid-cols-2 gap-3'>
              <div className='text-center'>
                <Link
                  href={'/signup'}
                  className='text-sm text-indigo-600 hover:text-indigo-500'
                >
                  {t('login.signup')}
                </Link>
              </div>
              <div className='text-center'>
                <Link
                  href={'/forget-password'}
                  className='text-sm text-indigo-600 hover:text-indigo-500'
                >
                  {t('login.forgot')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 text-center'>
          <Link
            href='/'
            className='inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900'
          >
            <ChevronLeft className='h-4 w-4 mr-1' />
            {t('common.continueshopping') || 'Continue Shopping'}
          </Link>
        </div>
      </div>
    </div>
  );
}
