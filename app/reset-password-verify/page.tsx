// In: src/app/reset-password-verify/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export default function ResetPasswordVerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [identifier, setIdentifier] = useState('');
  const [verificationType, setVerificationType] = useState('');

  useEffect(() => {
    // Read the data we saved from the previous page
    const savedIdentifier = sessionStorage.getItem('resetIdentifier');
    const savedVerificationType = sessionStorage.getItem(
      'resetVerificationType'
    );

    if (savedIdentifier && savedVerificationType) {
      setIdentifier(savedIdentifier);
      setVerificationType(savedVerificationType);
    } else {
      enqueueSnackbar('Could not find reset data. Please try again.', {
        variant: 'error',
      });
      router.push('/forgot-password');
    }
  }, [router]);

  const handleVerify = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (otp.length < 6) return;

      setIsVerifying(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/verify-password-reset-otp`;
        const payload = { identifier, verificationType, otp };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'OTP verification failed.');
        }

        // IMPORTANT: The API should give us a "resetToken" to use on the next page
        const resetToken = result.data?.resetToken;
        if (!resetToken) {
          throw new Error(
            'Did not receive a valid reset token from the server.'
          );
        }

        // Save the token for the FINAL step
        sessionStorage.setItem('passwordResetToken', resetToken);

        enqueueSnackbar('OTP verified successfully!', { variant: 'success' });
        router.push('/set-new-password'); // Redirect to the final page
      } catch (error: any) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } finally {
        setIsVerifying(false);
      }
    },
    [otp, identifier, verificationType, router]
  );

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background p-4'>
      <div className='w-full max-w-md space-y-8 rounded-lg bg-card p-8 shadow-md'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>Verify Reset Code</h1>
          <p className='mt-2 text-md text-muted-foreground'>
            An OTP has been sent to your {verificationType}:
            <span className='font-semibold text-foreground block mt-1'>
              {identifier || '...'}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerify} className='mt-8 space-y-6'>
          <div className='flex justify-center'>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={isVerifying || otp.length < 6}
          >
            {isVerifying ? 'Verifying...' : 'Verify Code'}
          </Button>
        </form>
      </div>
    </div>
  );
}
