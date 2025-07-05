'use client'
import { z } from 'zod';
import Form, { Field } from '@/components/form';
import { FormSchemaSignUpType, profileValidator, signUpValidator } from '@/lib/validators/auth';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_USER_MUTATION, UPDATE_USER_MUTATION } from '@/graphql/mutation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';
import { useAuth } from '@/contexts/auth-context';
import { useEffect } from 'react';

const formFields: Field[] = [
    { type: "Input", name: 'firstName', label: 'First Name', inputType: 'text' },
    { type: "Input", name: 'lastName', label: 'Last Name', inputType: 'text' },
    { type: "Input", name: 'email', label: 'Email', inputType: 'email' },
    { type: "Input", name: 'mobile', label: 'Mobile', inputType: 'text' },
    { type: "Input", name: 'country', label: 'Country', inputType: 'text' },
    { type: "Input", name: 'lang', label: 'Language', inputType: 'text' },
];

export default function Profile() {

    const router = useRouter()
    const { updateUser: updatedUserData, user } = useAuth();
    const [updateUser, { data, loading, error }] = useMutation(UPDATE_USER_MUTATION)
    const handleSubmit = async (data: any) => {
        try {
            const response = await updateUser({
                variables: {
                    user: {
                        account: {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            country: data.country,
                            email: data.email,
                            mobile: data.mobile,
                            lang: data.lang,
                        },
                    },
                },
            })
            const result = response?.data?.updateUser?.account;
            console.log(data, "Data")
            updatedUserData(result);
            enqueueSnackbar({ message: "Profile updated successful", variant: 'success', anchorOrigin: { horizontal: "center", vertical: "bottom" } })
        } catch (e: any) {
            console.error("GraphQL Signup Error:", e);

            const message =
                e?.graphQLErrors?.[0]?.message ||
                e?.message ||
                "Something went wrong during signup";

            enqueueSnackbar(message, {
                variant: 'error',
                anchorOrigin: { horizontal: "center", vertical: "bottom" },
            });

        }
    }
    // useEffect(() => {
    //     if(!user){
    //         router.push('/login')
    //     }
    // }, [])
    if (!user) {

        router.push('/login')
        return
    }
    return (
        <>
            <div className='bg-slate-50'>
                <div className="container pt-10">
                    <div className="flex items-center justify-center mb-5">
                        <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>

                    </div>


                    <div className="container bg-white py-6">
                        <Form
                            schema={profileValidator}
                            formFields={formFields}
                            onSubmit={handleSubmit}
                            isPending={loading}
                            defaultValues={{
                                firstName: user.user.account.firstName,
                                lastName: user.user.account.lastName,
                                email: user.user.account.email,
                                mobile: user.user.account.mobile,
                                country: user.user.account.country,
                                lang: user.user.account.lang
                            }}
                            buttonTitle='Update'
                        />

                    </div>
                </div>
            </div>

        </>
    );
}