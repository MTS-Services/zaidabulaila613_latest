import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const signInValidator = z.object({
    username: z
        .string({ message: 'validator.reset.phone' })
        .min(1),
    password: z
        .string({ message: 'validator.reset.password' })
        .min(6, 'validator.reset.passwordleast'),
});

export const signUpValidator = z.object({
    firstName: z
        .string({ message: 'validator.profile.firstname' })
        .min(2, 'validator.profile.firstleast'),
    lastName: z
        .string({ message: 'validator.profile.lastname' })
        .min(2, 'validator.profile.lastleast'),
    email: z
        .string({ message: 'validator.profile.email' })
        .email({ message: 'validator.profile.invalid' }),
    password: z
        .string({ message: 'validator.reset.password' })
        .min(6, 'validator.reset.passwordleast'),
    confirmPassword: z
        .string({ message: 'validator.reset.confirm' })
        .min(6, 'validator.reset.confirmleast'),
    mobile: z
        .string({ message: 'validator.profile.mobile' })
        .refine(isValidPhoneNumber, { message: 'validator.profile.mobileinvalid' }),
    country: z
        .string({ message: 'validator.profile.country' })
        .min(2, 'validator.profile.countryleast'),
    lang: z
        .string({ message: 'validator.profile.lang' })
        .min(2, 'validator.profile.langleast'),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: 'validator.reset.notmatch',
            path: ['confirmPassword']
        });
    }
})
export const profileValidator = z.object({
    firstName: z
        .string({ message: 'validator.profile.firstname' })
        .min(2, 'validator.profile.firstleast'),
    lastName: z
        .string({ message: 'validator.profile.lastname' })
        .min(2, 'validator.profile.lastleast'),
    email: z
        .string({ message: 'validator.profile.email' })
        .email({ message: 'validator.profile.invalid' }),
    mobile: z
        .string({ message: 'validator.profile.mobile' })
        .min(10, 'validator.profile.mobileleast'),
    country: z
        .string({ message: 'validator.profile.country' })
        .min(2, 'validator.profile.countryleast'),
    lang: z
        .string({ message: 'validator.profile.lang' })
        .min(2, 'validator.profile.langleast'),
});

export const forgetPasswordValidator = z.object({
    email: z
        .string({ message: 'validator.profile.email' })
        .email({ message: 'validator.profile.invalid' }),
});
export const verifyOTPValidator = z.object({
    email: z
        .string({ message: 'validator.profile.email' })
        .email({ message: 'validator.profile.invalid' }),
    otp: z.string({ message: 'validator.profile.otp' }),
    type: z.enum(['validator.profile.reg', 'validator.profile.forgot']),
});
export const resetPasswordValidator = z.object({
    password: z
        .string({ message: 'validator.reset.password' })
        .min(6, 'validator.reset.passwordleast'),
    confirmPassword: z
        .string({ message: 'validator.reset.confirm' })
        .min(6, 'validator.reset.confirmleast'),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: 'validator.reset.notmatch',
            path: ['confirmPassword']
        });
    }
})

export const createDressformSchema = z.object({
    name: z.string().min(1, 'validator.dress.name'),
    description: z.string().min(1, 'validator.dress.description'),
    price: z.number().min(0, 'validator.dress.price'),
    oldPrice: z.number().min(0, 'validator.dress.orgprice').optional(),
    type: z.string().min(1,'validator.dress.product'),
    category: z.string().min(1, 'validator.dress.category'),
    colors: z.array(z.string()).min(1, 'validator.dress.color'),
    selectedColor: z.string().optional(),
    sizes: z.array(z.string()).min(1, 'validator.dress.size'),
    material: z.string().min(1, 'validator.dress.material'),
    careInstructions: z.string().optional(),
    chest: z.number().min(0, 'validator.dress.chest').optional(),
    waist: z.number().min(0, 'validator.dress.waist').optional(),
    hip: z.number().min(0, 'validator.dress.hip').optional(),
    shoulder: z.number().min(0, 'validator.dress.shoulder').optional().nullable(),
    high: z.number().min(0, 'validator.dress.height').optional(),
    length: z.number().min(0, 'validator.dress.lenght').optional(),
    sleeve: z.boolean().optional(),
    underlay: z.boolean().optional(),
    qty: z.number().min(1, 'validator.dress.quantity'),
    ref: z.string().optional(),
    state: z.string().min(1, 'validator.dress.state'),
    terms: z.boolean().refine(val => val, 'validator.dress.term')
})

export const updateDressFormSchema = z.object({
    name: z.string().min(1, 'validator.dress.name'),
    description: z.string().min(1, 'validator.dress.description'),
    price: z.number().min(0, 'validator.dress.price'),
    oldPrice: z.number().min(0, 'validator.dress.orgprice').optional(),
    type: z.string().min(1, 'validator.dress.product'),
    category: z.string().min(1, 'validator.dress.category'),
    colors: z.array(z.string()).min(1, 'validator.dress.color'),
    selectedColor: z.string().optional(),
    sizes: z.array(z.string()).min(1, 'validator.dress.size'),
    material: z.string().min(1, 'validator.dress.material'),
    careInstructions: z.string().optional(),
    chest: z.number().min(0, 'validator.dress.chest').optional(),
    waist: z.number().min(0, 'validator.dress.waist').optional(),
    hip: z.number().min(0, 'validator.dress.hip').optional(),
    shoulder: z.number().min(0, 'validator.dress.shoulder').optional().nullable(),
    high: z.number().min(0, 'validator.dress.height').optional(),
    length: z.number().min(0, 'validator.dress.lenght').optional(),
    sleeve: z.boolean().optional(),
    underlay: z.boolean().optional(),
    qty: z.number().min(1, 'validator.dress.quantity'),
    ref: z.string().optional(),
    state: z.string().min(1, 'validator.dress.state'),
    terms: z.boolean().refine(val => val, 'validator.dress.term')

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
        city: z.string().min(1, 'validator.checkout.city').max(50, 'validator.checkout.citylong'),
        appartment: z.string().min(1, 'validator.checkout.apartment').max(50, 'validator.checkout.apartmentlong'),
        street: z.string().min(1, 'validator.checkout.street').max(100, 'validator.checkout.streetlong'),
    }),
    paymentMethod: z.enum(['cash', 'online']),
    additionalNotes: z.string().max(500, 'validator.checkout.note').optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export type ShopFormSchema = z.infer<typeof shopFormSchema>;

export type FormSchemaUpdateDress = z.infer<typeof updateDressFormSchema>

export type FormSchemaCreateDress = z.infer<typeof createDressformSchema>

export type FormSchemaSignUpType = z.input<typeof signUpValidator>;
export type FormSchemaSignInType = z.input<typeof signInValidator>;
export type FormSchemaForgotPasswordType = z.input<typeof forgetPasswordValidator>;
export type FormSchemaResetPasswordType = z.input<typeof resetPasswordValidator>;
