// 'use client';

// import { useRouter, useSearchParams } from 'next/navigation';
// import { useState, useCallback } from 'react';
// import { enqueueSnackbar } from 'notistack';
// import { Button } from '@/components/ui/button';
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// export default function VerifyOTP() {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const mobile = searchParams.get('mobile');

//     const [otp, setOtp] = useState('');
//     const [isVerifying, setIsVerifying] = useState(false);

//     const handleVerify = useCallback(async (event: React.FormEvent) => {
//         event.preventDefault();
//         if (otp.length < 6 || !mobile) {
//             enqueueSnackbar('Please enter a valid 6-digit OTP.', { variant: 'warning' });
//             return;
//         }
//         setIsVerifying(true);
//         try {
//             const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/confirm-account`;
//             const response = await fetch(apiUrl, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ phoneNumber: mobile, otp }),
//             });

//             const result = await response.json();
//             if (!response.ok) {
//                 throw new Error(result.message || 'OTP verification failed.');
//             }

//             enqueueSnackbar('Account verified successfully! Please log in.', { variant: 'success' });
//             router.push('/login');

//         } catch (error: any) {
//             enqueueSnackbar(error.message || 'An error occurred.', { variant: 'error' });
//         } finally {
//             setIsVerifying(false);
//         }
//     }, [otp, mobile, router]);

//     return (
//         <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
//             <div className="w-full max-w-md space-y-8">
//                 <div className="text-center">
//                     <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//                         Verify Your Account
//                     </h1>
//                     <p className="mt-2 text-md text-gray-600">
//                         An OTP has been sent to your WhatsApp number:
//                         <span className="font-bold text-gray-800 block mt-1">{mobile || '...'}</span>
//                     </p>
//                 </div>

//                 <form onSubmit={handleVerify} className="mt-8 space-y-6">
//                     <div className="flex justify-center">
//                         <InputOTP maxLength={6} value={otp} onChange={setOtp}>
//                             <InputOTPGroup>
//                                 <InputOTPSlot index={0} />
//                                 <InputOTPSlot index={1} />
//                                 <InputOTPSlot index={2} />
//                                 <InputOTPSlot index={3} />
//                                 <InputOTPSlot index={4} />
//                                 <InputOTPSlot index={5} />
//                             </InputOTPGroup>
//                         </InputOTP>
//                     </div>

//                     <Button type="submit" className="w-full" disabled={isVerifying || otp.length < 6}>
//                         {isVerifying ? 'Verifying...' : 'Verify Account'}
//                     </Button>
//                 </form>
//             </div>
//         </div>
//     );
// };

//=============================//9-15-2025

// src/components/ui/input-otp.tsx (Correct Code)

// src/components/ui/input-otp.tsx (Correct and Final Code)

'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { Dot } from 'lucide-react';

import { cn } from '@/lib/utils'; // Ensure you have this utility file

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      'flex items-center gap-2 has-[:disabled]:opacity-50',
      containerClassName
    )}
    className={cn('disabled:cursor-not-allowed', className)}
    {...props}
  />
));
InputOTP.displayName = 'InputOTP';

const InputOTPGroup = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
));
InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
        isActive && 'z-10 ring-2 ring-ring ring-offset-background',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div className='h-4 w-px animate-caret-blink bg-foreground duration-1000' />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = 'InputOTPSlot';

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ ...props }, ref) => (
  <div ref={ref} role='separator' {...props}>
    <Dot />
  </div>
));
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
