// src/interfaces/auth/verifyOTP.tsx (Final Corrected Code)

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export default function VerifyOTP() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get('mobile');

  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(120); // 2-minute timer

  useEffect(() => {
    if (timer === 0) return;
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleVerify = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (timer === 0) {
        enqueueSnackbar('OTP has expired. Please request a new one.', {
          variant: 'error',
        });
        return;
      }
      if (otp.length < 6 || !mobile) {
        enqueueSnackbar('Please enter a valid 6-digit OTP.', {
          variant: 'warning',
        });
        return;
      }

      setIsVerifying(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/confirm-account`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: mobile, otp }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'OTP verification failed.');
        }

        enqueueSnackbar('Account verified successfully! Please log in.', {
          variant: 'success',
        });
        router.push('/login');
      } catch (error: any) {
        enqueueSnackbar(error.message || 'An error occurred.', {
          variant: 'error',
        });
      } finally {
        setIsVerifying(false);
      }
    },
    [otp, mobile, router, timer]
  );

  const handleResendOtp = useCallback(async () => {
    setIsResending(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/resend-otp`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: mobile, method: 'whatsapp' }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to resend OTP.');
      }

      enqueueSnackbar('A new OTP has been sent to your WhatsApp.', {
        variant: 'info',
      });
      setTimer(120); // Reset timer
    } catch (error: any) {
      enqueueSnackbar(error.message || 'An error occurred.', {
        variant: 'error',
      });
    } finally {
      setIsResending(false);
    }
  }, [mobile]);

  const formattedTime = `${Math.floor(timer / 60)
    .toString()
    .padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`;

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background p-4'>
      <div className='w-full max-w-md space-y-8 rounded-lg bg-card p-8 shadow-md'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-card-foreground'>
            Verify Your Account
          </h1>
          <p className='mt-2 text-md text-muted-foreground'>
            An OTP has been sent to your WhatsApp number:
            <span className='font-semibold text-foreground block mt-1'>
              {mobile || '...'}
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
            {isVerifying ? 'Verifying...' : 'Verify Account'}
          </Button>
        </form>

        <div className='text-center text-sm text-muted-foreground'>
          {timer > 0 ? (
            <p>
              OTP will expire in{' '}
              <span className='font-semibold text-foreground'>
                {formattedTime}
              </span>
            </p>
          ) : (
            <p className='font-semibold text-destructive'>OTP has expired.</p>
          )}
        </div>

        <div className='text-center'>
          <Button
            variant='link'
            onClick={handleResendOtp}
            disabled={timer > 0 || isResending}
          >
            {isResending ? 'Sending...' : 'Resend OTP'}
          </Button>
        </div>
      </div>
    </div>
  );
}
