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

export const createDressformSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    oldPrice: z.number().min(0, "Original price must be positive").optional(),
    type: z.string().min(1, "Type is required"),
    category: z.string().min(1, "Category is required"),
    colors: z.array(z.string()).min(1, "At least one color is required"),
    selectedColor: z.string().optional(),
    sizes: z.array(z.string()).min(1, "At least one size is required"),
    material: z.string().min(1, "Material is required"),
    careInstructions: z.string().optional(),
    chest: z.number().min(0, "Chest measurement must be positive").optional(),
    waist: z.number().min(0, "Waist measurement must be positive").optional(),
    hip: z.number().min(0, "Hip measurement must be positive").optional(),
    shoulder: z.number().min(0, "Shoulder measurement must be positive").optional().nullable(),
    high: z.number().min(0, "Height measurement must be positive").optional(),
    length: z.number().min(0, "Length measurement must be positive").optional(),
    sleeve: z.boolean().optional(),
    underlay: z.boolean().optional(),
    qty: z.number().min(1, "Quantity must be at least 1"),
    ref: z.string().optional(),
    state: z.string().min(1, "State is required"),
    terms: z.boolean().refine(val => val, "You must accept the terms and conditions")
})

export const updateDressFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    oldPrice: z.number().min(0, "Original price must be positive").optional(),
    type: z.string().min(1, "Product type is required"),
    category: z.string().min(1, "Category is required"),
    colors: z.array(z.string()).min(1, "At least one color is required"),
    selectedColor: z.string().optional(),
    sizes: z.array(z.string()).min(1, "At least one size is required"),
    material: z.string().min(1, "Material is required"),
    careInstructions: z.string().optional(),
    chest: z.number().min(0, "Chest measurement must be positive").optional(),
    waist: z.number().min(0, "Waist measurement must be positive").optional(),
    hip: z.number().min(0, "Hip measurement must be positive").optional(),
    shoulder: z.number().min(0, "Shoulder measurement must be positive").optional().nullable(),
    high: z.number().min(0, "Height measurement must be positive").optional(),
    length: z.number().min(0, "Length measurement must be positive").optional(),
    sleeve: z.boolean().optional(),
    underlay: z.boolean().optional(),
    qty: z.number().min(1, "Quantity must be at least 1"),
    ref: z.string().optional(),
    state: z.string().min(1, "State is required"),
    terms: z.boolean().refine(val => val, "You must accept the terms and conditions")

})

export const shopFormSchema = z.object({
    shopName: z.string().min(2, 'validator.shop.shopName'),
    description: z.string().min(10, 'validator.shop.description'),
    contact: z.string().min(10, 'validator.shop.contact'),
    tags: z.string().min(1, 'validator.shop.tags'),
    coverImage: z.any(),
    profileImage: z.any(),
});

export const checkoutSchema = z.object({
    address: z.object({
        city: z.string().min(1, 'City is required').max(50, 'City is too long'),
        appartment: z.string().min(1, 'Apartment is required').max(50, 'Apartment is too long'),
        street: z.string().min(1, 'Street is required').max(100, 'Street is too long'),
    }),
    paymentMethod: z.enum(['cash', 'online']),
    additionalNotes: z.string().max(500, 'Notes are too long').optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export type ShopFormSchema = z.infer<typeof shopFormSchema>;

export type FormSchemaUpdateDress = z.infer<typeof updateDressFormSchema>

export type FormSchemaCreateDress = z.infer<typeof createDressformSchema>

export type FormSchemaSignUpType = z.input<typeof signUpValidator>;
export type FormSchemaSignInType = z.input<typeof signInValidator>;
export type FormSchemaForgotPasswordType = z.input<typeof forgetPasswordValidator>;
export type FormSchemaResetPasswordType = z.input<typeof resetPasswordValidator>;
