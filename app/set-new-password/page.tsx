"use client";

import Form, { Field } from "@/components/form";
import { resetPasswordValidator } from "@/lib/validators/auth";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";

const formFields: Field[] = [
  {
    type: "Input",
    name: "password",
    label: "New Password",
    inputType: "password",
  },
  {
    type: "Input",
    name: "confirmPassword",
    label: "Confirm New Password",
    inputType: "password",
  },
];

export default function SetNewPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  // 1. Get the reset token from sessionStorage when the page loads
  useEffect(() => {
    const token = sessionStorage.getItem("passwordResetToken");
    if (token) {
      setResetToken(token);
    } else {
      enqueueSnackbar("Invalid or expired session. Please start over.", {
        variant: "error",
      });
      router.push("/forgot-password");
    }
  }, [router]);

  // 2. This is the handleSubmit function for the final API call
  const handleSubmit = useCallback(
    async (values: any) => {
      if (!resetToken) {
        enqueueSnackbar("Reset token is missing.", { variant: "error" });
        return;
      }

      setIsLoading(true);
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/set-new-password`;
      const payload = {
        resetToken,
        newPassword: values.password,
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to reset password.");
        }

        enqueueSnackbar("Password has been reset successfully!", {
          variant: "success",
        });

        // 3. On success, clean up sessionStorage and redirect to login
        sessionStorage.removeItem("passwordResetToken");
        sessionStorage.removeItem("resetIdentifier");
        sessionStorage.removeItem("resetVerificationType");

        router.push("/login");
      } catch (e: any) {
        enqueueSnackbar(e.message, { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    },
    [resetToken, router]
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Set New Password</h1>
          <p className="text-gray-600 mt-2">
            Please enter your new password below.
          </p>
        </div>

        {/* <Form
          schema={resetPasswordValidator}
          formFields={formFields}
          onSubmit={handleSubmit}
          isPending={isLoading}
          defaultValues={{
            password: "",
            confirmPassword: "",
          }}
          buttonTitle="Submit New Password"
        /> */}

        <Form
          schema={resetPasswordValidator}
          formFields={formFields}
          onSubmit={handleSubmit}
          isPending={isLoading}
          defaultValues={{
            password: "",
            confirmPassword: "",
          }}
          buttonTitle="Submit New Password"
          showPasswordStrength={true}
          fieldDir="column" // <-- Add this line
        />
      </div>
    </div>
  );
}
