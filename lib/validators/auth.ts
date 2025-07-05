import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const signInValidator = z.object({
    username: z
        .string({ message: "Email or Phone is Required" })
        .min(1),
    password: z
        .string({ message: "Password is Required" })
        .min(6, "Password must contain at least 6 character(s)"),
});

export const signUpValidator = z.object({
    firstName: z
        .string({ message: "First name is required" })
        .min(2, "First name must be at least 2 characters"),
    lastName: z
        .string({ message: "Last name is required" })
        .min(2, "Last name must be at least 2 characters"),
    email: z
        .string({ message: "Email is required" })
        .email({ message: "Email is invalid" }),
    password: z
        .string({ message: "Password is required" })
        .min(6, "Password must contain at least 6 characters"),
    confirmPassword: z
        .string({ message: "Confirm password is Required" })
        .min(6, "Confirm password must contain at least 6 character(s)"),
    mobile: z
        .string({ message: "Mobile number is required" })
        .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    country: z
        .string({ message: "Country is required" })
        .min(2, "Country name must be at least 2 characters"),
    lang: z
        .string({ message: "Language is required" })
        .min(2, "Language must be at least 2 characters"),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ['confirmPassword']
        });
    }
})
export const profileValidator = z.object({
    firstName: z
        .string({ message: "First name is required" })
        .min(2, "First name must be at least 2 characters"),
    lastName: z
        .string({ message: "Last name is required" })
        .min(2, "Last name must be at least 2 characters"),
    email: z
        .string({ message: "Email is required" })
        .email({ message: "Email is invalid" }),
    mobile: z
        .string({ message: "Mobile number is required" })
        .min(10, "Mobile number must be at least 10 digits"),
    country: z
        .string({ message: "Country is required" })
        .min(2, "Country name must be at least 2 characters"),
    lang: z
        .string({ message: "Language is required" })
        .min(2, "Language must be at least 2 characters"),
});

export const forgetPasswordValidator = z.object({
    email: z
        .string({ message: "Email is Required" })
        .email({ message: "Email is Invalid" }),
});
export const verifyOTPValidator = z.object({
    email: z
        .string({ message: "Email is Required" })
        .email({ message: "Email is Invalid" }),
    otp: z.string({ message: "OTP is Required" }),
    type: z.enum(["Register", "ForgotPassword"]),
});
export const resetPasswordValidator = z.object({
    password: z
        .string({ message: "Password is Required" })
        .min(6, "Password must contain at least 6 character(s)"),
    confirmPassword: z
        .string({ message: "Confirm password is Required" })
        .min(6, "Confirm password must contain at least 6 character(s)"),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ['confirmPassword']
        });
    }
})

export type FormSchemaSignUpType = z.input<typeof signUpValidator>;
export type FormSchemaSignInType = z.input<typeof signInValidator>;
export type FormSchemaForgotPasswordType = z.input<typeof forgetPasswordValidator>;
export type FormSchemaResetPasswordType = z.input<typeof resetPasswordValidator>;
