'use client';
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
  const { t } = useTranslation();

  const formFields: Field[] = [
    {
      type: 'Input',
      name: 'firstName',
      label: t('signup.firstname'),
      inputType: 'text',
      placeholder: t('signup.firstnameplaceholder') || 'Enter your first name',
    },
    {
      type: 'Input',
      name: 'lastName',
      label: t('signup.lastname'),
      inputType: 'text',
      placeholder: t('signup.lastnameplaceholder') || 'Enter your last name',
    },
    {
      type: 'Input',
      name: 'email',
      label: t('signup.email'),
      inputType: 'email',
      placeholder: t('signup.emailplaceholder') || 'Enter your email address',
    },
    {
      type: 'Phone',
      name: 'mobile',
      label: t('signup.mobile'),
      placeholder: t('signup.mobileplaceholder') || 'Enter your mobile number',
    },
    {
      type: 'Country',
      name: 'country',
      label: t('signup.country'),
      placeholder: t('signup.countryplaceholder') || 'Select your country',
    },
    {
      type: 'Select',
      name: 'lang',
      label: t('signup.language'),
      options: [
        { label: 'Arabic', value: 'ar' },
        { label: 'English', value: 'en' },
      ],
      placeholder: t('signup.languageplaceholder') || 'Select your language',
    },
    {
      type: 'Input',
      name: 'password',
      label: t('signup.password'),
      inputType: 'password',
      placeholder: t('signup.passwordplaceholder') || 'Create a password',
    },
    {
      type: 'Input',
      name: 'confirmPassword',
      label: t('signup.confirmpassword'),
      inputType: 'password',
      placeholder:
        t('signup.confirmpasswordplaceholder') || 'Confirm your password',
    },
  ];

  const router = useRouter();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      redirect('/dashboard');
    }
  }, [user]);

  const [createUser, { data, loading, error }] =
    useMutation(CREATE_USER_MUTATION);

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
      });

      const result = response?.data?.createUser;

      enqueueSnackbar({
        message: 'Confirmation link sent to your email!',
        variant: 'success',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
        transitionDuration: 10000,
      });

      router.push('/');
    } catch (e: any) {
      console.error('GraphQL Signup Error:', e);

      const message =
        e?.graphQLErrors?.[0]?.message ||
        e?.message ||
        'Something went wrong during signup';

      enqueueSnackbar(message, {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col justify-center py-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-3xl'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
            {t('signup.title')}
          </h1>
        </div>

        <div className='bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10 mx-4'>
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
              lang: '',
            }}
            buttonTitle={t('signup.button')}
            buttonClassName='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2'
            fieldLayout='grid'
            gridColumns={2}
            exceptions={[
              'email',
              'mobile',
              'country',
              'lang',
              'password',
              'confirmPassword',
            ]}
          />

          <div className='mt-6 pt-6 border-t border-gray-200'>
            <p className='text-center text-sm text-gray-500'>
              {t('signup.alreadyhaveaccount') || 'Already have an account?'}{' '}
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
