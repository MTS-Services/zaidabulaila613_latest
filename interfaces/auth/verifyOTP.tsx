'use client'
import PrimaryButton from '@/components/buttons/PrimaryButton'
import Input from '@/components/inputs/input'
import { FormSchemaForgotPasswordType, FormSchemaSignInType, signInValidator } from '@/lib/validators/auth'
import { forgotPassword, login, verifyOTP } from '@/services/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import OtpInput from 'react-otp-input';
import { useSearchParams } from 'next/navigation'
import TextButton from '@/components/buttons/TextButton'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'

const VerifyOTP = () => {

    const [otp, setOtp] = useState('');
    const [seconds, setSeconds] = useState(60);
    const [disableResendOTP, setDisableResendOTP] = useState(true);
    const [resending, setResending] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    const type = searchParams.get('type')

    useEffect(() => {
        if (!email || !type) {
            router.push('/signin')
        }
    }, [searchParams])

    useEffect(() => {
        if (disableResendOTP) {

            const timerId = setInterval(() => {
                setSeconds(prevSeconds => {
                    const newSeconds = prevSeconds - 1;
                    // if (customLogic) {
                    //   customLogic(newSeconds);
                    // }
                    if (newSeconds <= 0) { // Example logic: when timer reaches 60 seconds
                        clearInterval(timerId);
                        setDisableResendOTP(false)
                        console.log("Timer reaches 60 seconds")
                        //   if (onTimeUp) {
                        //     onTimeUp();
                        //   }
                    }
                    return newSeconds;
                });
            }, 1000);

            return () => clearInterval(timerId);
        }
    }, [disableResendOTP]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true)
        try {
            const res = await verifyOTP({ email: email as string, otp: otp, type: (type as string).toUpperCase() });
            console.log(res, "Response")
            router.push('/new-password')
            setIsSubmitting(false)

            // router.push(`/verify-otp?email=${data.email}&type=ForgotPassword`)
            // const setCookieHeader = res.headers['set-cookie'];

            // // You can now store the cookie or use it for subsequent requests
            // console.log('Cookie received:', setCookieHeader);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // do whatever you want with native error
                enqueueSnackbar({ message: error?.response?.data?.error, variant: 'error',anchorOrigin:{horizontal:"center", vertical:"bottom"} })
            }
            setIsSubmitting(false)
            console.log(error, "Error in on submit")
        }
    }
    const handleResendOTP = async () => {
        try {
            setResending(true)
            const res = await forgotPassword({ email: email as string })
            console.log(res, "Response")
            setDisableResendOTP(true)
            setSeconds(60)
            setResending(false)
            // router.push(`/verify-otp?email=${data.email}&type=ForgotPassword`)
            // const setCookieHeader = res.headers['set-cookie'];

            // // You can now store the cookie or use it for subsequent requests
            // console.log('Cookie received:', setCookieHeader);
        } catch (error) {
            console.log(error, "Error in on submit")
        }
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-10 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Verify OTP
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-3" onSubmit={handleSubmit}>

                    <div>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={4}
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props}

                            />}
                            inputStyle={'OtpInputStyle'}
                            inputType='number'
                        />
                    </div>

                    <div className='flex justify-between items-center mr-4 ml-4'>
                        <p className='text-sm'>{seconds} seconds</p>
                        <TextButton type='button' label={resending ? 'Resending...' : 'Resend'} disabled={disableResendOTP || resending} onClick={handleResendOTP} />
                    </div>

                    <div>
                        <PrimaryButton type='submit' disabled={otp.length < 4 || isSubmitting} label={isSubmitting ? 'Verifying' : 'Verify'} />
                    </div>
                </form>


            </div>
        </div>
    )
}

export default VerifyOTP