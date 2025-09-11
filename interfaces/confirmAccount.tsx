"use client";

import { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { VERIFY_EMAIL } from "@/graphql/mutation";
import { useRouter } from "next/navigation";



export default function ConfirmAccount() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const router = useRouter()
    const [verifyEmail] = useMutation(VERIFY_EMAIL);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const email = params.get("email");

        if (!token || !email) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }
        

        // Call GraphQL mutation
        verifyEmail({ variables: { token, email } })
            .then((res) => {
                if (res.data?.verifyEmail) {
                    setStatus("success");
                    setMessage(res.data.verifyEmail.message || "Your email has been verified!");
                    router.push('/login')
                } else {
                    setStatus("error");
                    setMessage(res.data?.verifyEmail?.message || "Verification failed.");
                }
            })
            .catch(() => {
                setStatus("error");
                setMessage("Something went wrong. Please try again.");
            });
    }, [verifyEmail]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                        <p className="mt-4 text-gray-700">Verifying your email...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                        <p className="mt-4 text-green-700 font-semibold">{message}</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <XCircle className="h-10 w-10 text-red-500" />
                        <p className="mt-4 text-red-700 font-semibold">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
