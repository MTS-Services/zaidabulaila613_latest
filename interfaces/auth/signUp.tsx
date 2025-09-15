'use client';
import Form, { Field } from '@/components/form';
import { FormSchemaSignUpType, signUpValidator } from '@/lib/validators/auth';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/hooks/use-translation';
import { useEffect, useState } from 'react';
import React from 'react';

export default function SignUp() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (data: FormSchemaSignUpType) => {
    setIsLoading(true);
    // ... আপনার submit logic ...
  };

  return (
    <>
      <div className='bg-slate-50'>
        <div className='container pt-[100px]'>
          <div className='flex items-center justify-center mb-5'>
            <h1 className='text-2xl md:text-3xl font-bold'>
              {t('signup.title')}
            </h1>
          </div>
          <div className='container bg-white py-6'>
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
            <div className='mt-6 pt-6 border-t border-gray-200'>
              <p className='text-center text-sm text-gray-500'>
                {'Already have an account? '}{' '}
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
      </div>
    </>
  );
}
