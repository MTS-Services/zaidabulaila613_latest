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
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full'>
        {/* Header Section */}
        <div className='text-center mb-8'>
          <div className='mx-auto h-16 w-16 bg-gradient-to-r from-gold to-gold-dark rounded-full flex items-center justify-center mb-6 shadow-lg'>
            <svg
              className='h-8 w-8 text-white'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488' />
            </svg>
          </div>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            Verify WhatsApp Number
          </h2>
          <p className='text-gray-600 text-base'>
            Please verify your WhatsApp number to upload dresses
          </p>
        </div>

        {/* Main Card */}
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8'>
          {!isOtpSent ? (
            // Phone Number Input Section
            <div className='space-y-6'>
              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm font-semibold text-gray-700 mb-3'
                >
                  WhatsApp Number
                </label>
                <div className='relative'>
                  <PhoneInput
                    international
                    defaultCountry='JO'
                    value={phoneNumber}
                    onChange={(value) => setPhoneNumber(value || '')}
                    placeholder='Enter your WhatsApp number'
                    className='phone-input-custom'
                    style={{
                      '--PhoneInputCountrySelectArrow-color': '#CC9765',
                      '--PhoneInput-color--focus': '#CC9765',
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-gold to-gold-dark text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg'
              >
                <div className='flex items-center justify-center space-x-2'>
                  {isLoading ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className='h-5 w-5'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span>Send OTP</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          ) : (
            // OTP Verification Section
            <div className='space-y-6'>
              <div className='text-center mb-6'>
                <div className='mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4'>
                  <svg
                    className='h-6 w-6 text-green-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  OTP Sent Successfully
                </h3>
                <p className='text-sm text-gray-600'>
                  We've sent a 6-digit verification code to
                </p>
                <p className='text-sm font-semibold text-gold'>{phoneNumber}</p>
              </div>

              <div>
                <label
                  htmlFor='otp'
                  className='block text-sm font-semibold text-gray-700 mb-3 text-center'
                >
                  Enter OTP Code
                </label>
                <div className='relative'>
                  <input
                    id='otp'
                    name='otp'
                    type='text'
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder='••••••'
                    className='w-full px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] border-2 border-gray-200 rounded-xl focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all duration-200 outline-none'
                  />
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-gold to-gold-dark text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg'
              >
                <div className='flex items-center justify-center space-x-2'>
                  {isLoading ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className='h-5 w-5'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span>Verify OTP</span>
                    </>
                  )}
                </div>
              </button>

              {/* Resend and Change Number Actions */}
              <div className='flex flex-col space-y-3 pt-4 border-t border-gray-100'>
                <button
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                  className='text-center text-sm font-medium text-gold hover:text-gold-dark disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200'
                >
                  {timer > 0 ? (
                    <div className='flex items-center justify-center space-x-2'>
                      <svg
                        className='h-4 w-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span>Resend OTP in {timer}s</span>
                    </div>
                  ) : (
                    <div className='flex items-center justify-center space-x-2'>
                      <svg
                        className='h-4 w-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span>Resend OTP</span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsOtpSent(false);
                    setOtp('');
                    setTimer(0);
                  }}
                  className='text-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200'
                >
                  <div className='flex items-center justify-center space-x-2'>
                    <svg
                      className='h-4 w-4'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M7.707 14.707a1 1 0 01-1.414 0L2.586 11H4a7 7 0 017-7h2a1 1 0 010 2h-2a5 5 0 00-5 5v.586l3.707-3.707a1 1 0 011.414 1.414l-5 5z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span>Change phone number</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='text-center mt-6'>
          <p className='text-xs text-gray-500'>
            By verifying your number, you agree to receive WhatsApp
            notifications for order updates
          </p>
        </div>
      </div>
    </div>
  );
}
