'use client';

import { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { EMAIL_CONFIRM } from '@/graphql/mutation';

export default function VerifyEmail() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const params = new URLSearchParams(window.location.search);
  console.log(email, 'EMail');

  const [emailConfirm] = useMutation(EMAIL_CONFIRM);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const param = params.get('email');
    if (!param) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }
    setEmail(param);
  }, []);
  const handleConfirm = async () => {
    setStatus('loading');

    try {
      // 👇 Replace with logged-in user email (from auth context/session)

      const res = await emailConfirm({ variables: { email } });

      if (res.data?.emailConfirm) {
        setStatus('success');
        setMessage(res.data.emailConfirm.message || 'Verification email sent!');
      } else {
        setStatus('error');
        setMessage(
          res.data?.emailConfirm?.message ||
            'Failed to send verification email.'
        );
      }
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md'>
        <h1 className='text-xl font-bold text-gray-800'>
          Please verify your email
        </h1>
        <p className='mt-2 text-gray-600'>
          Click the button below to confirm your email address.
        </p>

        <div className='mt-6'>
          {status === 'idle' && (
            <button
              onClick={handleConfirm}
              className='w-full rounded-xl bg-black text-white py-3 font-semibold hover:bg-black transition'
            >
              Confirm Email
            </button>
          )}

          {status === 'loading' && (
            <button
              disabled
              className='w-full rounded-xl bg-black text-white py-3 font-semibold flex items-center justify-center'
            >
              <Loader2 className='h-5 w-5 animate-spin mr-2' />
              Sending...
            </button>
          )}

          {status === 'success' && (
            <div className='flex flex-col items-center'>
              <CheckCircle className='h-10 w-10 text-green-500' />
              <p className='mt-4 text-green-700 font-semibold'>{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className='flex flex-col items-center'>
              <XCircle className='h-10 w-10 text-red-500' />
              <p className='mt-4 text-red-700 font-semibold'>{message}</p>
              <button
                onClick={handleConfirm}
                className='mt-4 w-full rounded-xl bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition'
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
