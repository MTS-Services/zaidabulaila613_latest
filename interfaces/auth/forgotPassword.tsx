'use client';
import { z } from 'zod';
import Form, { Field } from '@/components/form';
import {
  forgetPasswordValidator,
  FormSchemaSignUpType,
  signInValidator,
  signUpValidator,
} from '@/lib/validators/auth';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_USER_MUTATION,
  FORGET_PASSWORD_MUTATION,
  LOGIN_USER_MUTATION,
} from '@/graphql/mutation';
import Link from 'next/link';
import { ChevronLeft, Mail } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/hooks/use-translation';

export default function ForgetPassword() {
  const { t } = useTranslation();

  const formFields: Field[] = [
    {
      type: 'Input',
      name: 'email',
      label: t('forgetpassword.email'),
      inputType: 'email',
      placeholder:
        t('forgetpassword.emailplaceholder') || 'Enter your email address',
      icon: <Mail className='h-5 w-5 text-gray-400' />,
    },
  ];

  const router = useRouter();
  const [forgetPassword, { data, loading, error }] = useMutation(
    FORGET_PASSWORD_MUTATION
  );

  const handleSubmit = async (values: any) => {
    try {
      const response = await forgetPassword({
        variables: {
          email: values?.email,
        },
      });

      enqueueSnackbar({
        message: 'Password reset token sent to your email.',
        variant: 'success',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
      router.push('/');
    } catch (e: any) {
      console.error('GraphQL Forget Error:', e);

      const message =
        e?.graphQLErrors?.[0]?.message ||
        e?.message ||
        'Something went wrong during forgetPassword';

      enqueueSnackbar(message, {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col justify-center py-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='text-center mb-8'>
          <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100'>
            <Mail className='h-6 w-6 text-indigo-600' />
          </div>
          <h1 className='mt-4 text-2xl md:text-3xl font-bold text-gray-900'>
            {t('forgetpassword.title')}
          </h1>
        </div>

        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
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
            // buttonClassName='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          />

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              {t('forgetpassword.rememberpassword') ||
                'Remember your password?'}{' '}
              <Link
                href='/login'
                className='font-medium text-indigo-600 hover:text-indigo-500'
              >
                {t('signup.button') || 'Sign in'}
              </Link>
            </p>
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
