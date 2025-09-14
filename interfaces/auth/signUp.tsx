'use client';
import Form, { Field } from '@/components/form';
import { FormSchemaSignUpType, signUpValidator } from '@/lib/validators/auth';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/hooks/use-translation';
import { useEffect, useState } from 'react';
import React from 'react'; // Make sure React is in scope

// --- Integrated Password Strength UI ---
// This component is now inside your SignUp file to avoid import issues.
const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const validation = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*]/.test(password),
  };
  const strength = Object.values(validation).filter(Boolean).length;

  let strengthText = 'Weak';
  if (strength >= 5) strengthText = 'Strong';
  else if (strength >= 3) strengthText = 'Medium';

  const strengthColorClass = {
    Weak: 'text-red-500',
    Medium: 'text-yellow-500',
    Strong: 'text-green-500',
  }[strengthText];

  const ValidationItem = ({
    isValid,
    text,
  }: {
    isValid: boolean;
    text: string;
  }) => (
    <li
      className={`flex items-center text-sm ${
        isValid ? 'text-green-500' : 'text-gray-400'
      }`}
    >
      {/* Using simple check/cross icons */}
      <span className='mr-2'>{isValid ? '✓' : '✗'}</span>
      {text}
    </li>
  );

  return (
    <div className='mt-4 p-4 border rounded-lg bg-gray-50'>
      <p className={`text-sm font-semibold mb-2 ${strengthColorClass}`}>
        Password strength: {strengthText}
      </p>
      <ul className='space-y-1'>
        <ValidationItem
          isValid={validation.length}
          text='At least 8 characters'
        />
        <ValidationItem
          isValid={validation.uppercase}
          text='Uppercase letter'
        />
        <ValidationItem
          isValid={validation.lowercase}
          text='Lowercase letter'
        />
        <ValidationItem isValid={validation.number} text='Number' />
        <ValidationItem
          isValid={validation.specialChar}
          text='Special character (!@#$%^&*)'
        />
      </ul>
    </div>
  );
};

export default function SignUp() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Add state to track the password and whether the user is typing in the password field
  const [password, setPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPassword(e.target.value),
      onFocus: () => setIsPasswordFocused(true),
      onBlur: () => setIsPasswordFocused(false), 
    },
    {
      type: 'Input',
      name: 'confirmPassword',
      label: t('signup.confirmpassword'),
      inputType: 'password',
    },
  ];
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      redirect('/dashboard');
    }
  }, [user]);

  const handleSubmit = async (data: FormSchemaSignUpType) => {
    setIsLoading(true);
    try {
      const response = await fetch('/user/register-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed.');
      }

      enqueueSnackbar({
        message: 'Account created! An OTP has been sent to your WhatsApp.',
        variant: 'success',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });

      router.push(`/verify-account?mobile=${data.mobile}`);
    } catch (e: any) {
      console.error('REST API Signup Error:', e);
      enqueueSnackbar(e.message || 'Something went wrong during signup', {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
    } finally {
      setIsLoading(false);
    }
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
            />
            {/* 3. Conditionally render the meter only when the password field is focused or has content */}
            {(isPasswordFocused || password) && (
              <PasswordStrengthMeter password={password} />
            )}
            <div className='mt-6 pt-6 border-t border-gray-200'>
              <p className='text-center text-sm text-gray-500'>
                {t('signup.alreadyhaveaccount') || 'Already have an account?'}{' '}
                <Link
                  href='/login'
                  className='font-medium text-indigo-600 hover:text-indigo-500'
                >
                  {t('login.button') || 'Sign in'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
