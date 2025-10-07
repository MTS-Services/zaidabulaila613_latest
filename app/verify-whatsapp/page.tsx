'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/hooks/use-translation';
import { enqueueSnackbar } from 'notistack';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { updateWhatsAppVerificationStatus } from '@/lib/whatsapp-utils';

export default function VerifyWhatsAppPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Check if user is already verified
  useEffect(() => {
    const checkVerificationStatus = () => {
      try {
        const loginUser = localStorage.getItem('loginUser');
        if (loginUser) {
          const userData = JSON.parse(loginUser);
          console.log('Checking existing verification status:', userData);
          if (userData.isWhatsAppVerified === true) {
            console.log('User already verified, redirecting to upload page');
            router.push('/dashboard/dress/create');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking existing verification status:', error);
      }
    };

    // Small delay to ensure localStorage is ready
    const timeoutId = setTimeout(checkVerificationStatus, 100);
    return () => clearTimeout(timeoutId);
  }, [router]);

  const handleSendOtp = async () => {
    if (!phoneNumber.trim()) {
      enqueueSnackbar('Please enter your WhatsApp number', {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/send-whatsapp-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.access_token}`,
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
        setTimer(60); // 60 seconds timer
        enqueueSnackbar('OTP sent to your WhatsApp number', {
          variant: 'success',
          anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
        });
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to send OTP', {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      enqueueSnackbar('Please enter the OTP', {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/verify-whatsapp-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.access_token}`,
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber,
            otp: otp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with the full API response data
        try {
          console.log(
            'WhatsApp OTP verified successfully - updating localStorage with API response'
          );
          console.log('API Response data:', data);

          // If the API response contains the full user data, replace the localStorage
          if (data.data && data.data.user) {
            const newUserData = {
              access_token: data.data.access_token,
              user: data.data.user,
              subscription: data.data.subscription,
              userDetails: data.data.user, // For compatibility
              isWhatsAppVerified: true, // Direct property for compatibility
              verifiedWhatsAppNumber: phoneNumber,
              whatsAppVerificationDate: new Date().toISOString(),
            };

            localStorage.setItem('loginUser', JSON.stringify(newUserData));
            console.log(
              '✅ localStorage updated with complete API response data'
            );
          } else {
            // Fallback to updating existing data
            const loginUser = localStorage.getItem('loginUser');
            if (loginUser) {
              const userData = JSON.parse(loginUser);
              console.log('Fallback: Current user data:', userData);

              // Update multiple paths for verification
              userData.isWhatsAppVerified = true;
              userData.verifiedWhatsAppNumber = phoneNumber;
              userData.whatsAppVerificationDate = new Date().toISOString();

              if (userData.user) {
                userData.user.isWhatsAppVerified = true;
                userData.user.whatsAppVerifiedAt = new Date().toISOString();
              }

              if (userData.userDetails) {
                userData.userDetails.isWhatsAppVerified = true;
              }

              localStorage.setItem('loginUser', JSON.stringify(userData));
              console.log('✅ localStorage updated via fallback method');
            }
          }

          // Verify the final result
          const finalCheck = localStorage.getItem('loginUser');
          const finalData = JSON.parse(finalCheck || '{}');
          console.log('✅ Final verification check:', {
            direct: finalData.isWhatsAppVerified,
            user: finalData.user?.isWhatsAppVerified,
            userDetails: finalData.userDetails?.isWhatsAppVerified,
          });
        } catch (storageError) {
          console.error('❌ Error updating localStorage:', storageError);
        }

        enqueueSnackbar('WhatsApp number verified successfully!', {
          variant: 'success',
          anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
        });

        // Redirect to dress upload page
        router.push('/dashboard/dress/create');
      } else {
        throw new Error(data.message || 'Invalid OTP');
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to verify OTP', {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      handleSendOtp();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Verify WhatsApp Number
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Please verify your WhatsApp number to upload dresses
          </p>
        </div>

        <div className='mt-8 space-y-6'>
          {!isOtpSent ? (
            // Phone Number Input
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium text-gray-700'
                >
                  WhatsApp Number
                </label>
                <div className='mt-1'>
                  <PhoneInput
                    international
                    defaultCountry='JO'
                    value={phoneNumber}
                    onChange={(value) => setPhoneNumber(value || '')}
                    placeholder='Enter your WhatsApp number'
                    className='appearance-none rounded-md relative block w-full border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gold focus:border-gold focus:z-10 sm:text-sm'
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gold hover:bg-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            // OTP Input
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='otp'
                  className='block text-sm font-medium text-gray-700'
                >
                  Enter OTP
                </label>
                <div className='mt-1'>
                  <input
                    id='otp'
                    name='otp'
                    type='text'
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder='Enter 6-digit OTP'
                    className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gold focus:border-gold focus:z-10 sm:text-sm text-center text-lg tracking-widest'
                  />
                </div>
                <p className='mt-1 text-xs text-gray-500'>
                  OTP sent to: {phoneNumber}
                </p>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gold hover:bg-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className='text-center'>
                <button
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                  className='text-sm text-gold hover:text-gold-dark disabled:text-gray-400 disabled:cursor-not-allowed'
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                onClick={() => {
                  setIsOtpSent(false);
                  setOtp('');
                  setTimer(0);
                }}
                className='w-full text-center text-sm text-gray-600 hover:text-gray-900'
              >
                Change phone number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
