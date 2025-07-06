'use client';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_OR_UPDATE_SHOP, CREATE_SHOP } from '@/graphql/mutation';
import { enqueueSnackbar } from 'notistack';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { GET_SHOP } from '@/graphql/query';
import { config } from '@/constants/app';

const shopFormSchema = z.object({
    shopName: z.string().min(2, 'Shop name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    contact: z.string().min(10, 'Contact number is required'),
    tags: z.string().min(1, 'At least one tag is required'),
    coverImage: z.any(),
    profileImage: z.any(),
});

type ShopFormData = z.infer<typeof shopFormSchema>;

export default function CreateShop() {
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ShopFormData>({
        resolver: zodResolver(shopFormSchema),
        defaultValues: {
            shopName: '',
            description: '',
            contact: '',
            tags: '',
            coverImage: null,
            profileImage: null,
        },
    });

    const { language } = useTranslation()

    const { data, loading, refetch, error } = useQuery(GET_SHOP, {
        variables: { language }, // if required
    });

    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [createShop] = useMutation(CREATE_OR_UPDATE_SHOP, {
     
    })

    useEffect(() => {
        if (data?.findOneShopByUser) {
            const shop = data.findOneShopByUser;

            reset({
                shopName: shop.shopName || '',
                description: shop.description || '',
                contact: shop.shopPhoneNumber || '',
                tags: (shop.tags || []).join(', '),
                coverImage: null,
                profileImage: null,
            });

            if (shop.coverImage?.path) setCoverPreview(config.API_URL + shop.coverImage.path);
            if (shop.profileImage?.path) setProfilePreview(config.API_URL + shop.profileImage.path);
        }
    }, [data, reset]);

    const onSubmit = async (data: ShopFormData) => {
        console.log('Form data:', data);
        // You can now POST formData to an API
        if (!coverPreview) {
            enqueueSnackbar('Please upload cover image', {
                variant: 'error',
                anchorOrigin: { horizontal: "center", vertical: "bottom" },
            });
            return
        }
        if (!profilePreview) {
            enqueueSnackbar('Please upload profile image', {
                variant: 'error',
                anchorOrigin: { horizontal: "center", vertical: "bottom" },
            });
            return
        }

        setIsSubmitting(true)
        try {
            const result = await createShop({
                variables: {
                    shop: {
                        shopName: data.shopName,
                        description: data.description,
                        shopPhoneNumber: data.contact,
                        tags: data.tags.split(','),
                        language: language
                    },
                    coverPicture: data.coverImage,
                    profilePicture: data.profileImage
                },
            })
            refetch()
            setIsSubmitting(false)
            enqueueSnackbar({
                message: "Shop details has been saved successfully.",
                variant: 'success',
                anchorOrigin: { horizontal: "center", vertical: "bottom" }
            })

            // router.push("/dashboard/dress")
        } catch (e: any) {
            console.error("GraphQL Update Error:", e);

            const message =
                e?.graphQLErrors?.[0]?.message ||
                e?.message ||
                "Something went wrong during updating dress";
            setIsSubmitting(false)
            enqueueSnackbar(message, {
                variant: 'error',
                anchorOrigin: { horizontal: "center", vertical: "bottom" },
            });

        } finally {
            setIsSubmitting(false)
        }
    };

    const handleImagePreview = (
        file: File | null,
        type: 'coverImage' | 'profileImage'
    ) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'coverImage') setCoverPreview(reader.result as string);
            else setProfilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading shop ...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">
            Error loading shop: {error.message}
        </div>
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
            {/* Cover Image Upload */}
            <Controller
                name="coverImage"
                control={control}
                render={({ field }) => (
                    <div className="relative h-48 bg-gray-100 rounded-md overflow-hidden">
                        {coverPreview ? (
                            <img src={coverPreview} alt="Cover" className="object-cover w-full h-full" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                Upload Cover Image
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                field.onChange(file);
                                handleImagePreview(file, 'coverImage');
                            }}
                        />
                    </div>
                )}
            />
            {errors.coverImage && <p className="text-red-500 text-sm">{errors.coverImage?.message?.toString()}</p>}

            {/* Profile Image Upload */}
            <Controller
                name="profileImage"
                control={control}
                render={({ field }) => (
                    <div className="relative w-28 h-28 -mt-14 mx-4 rounded-full border-4 border-white overflow-hidden">
                        {profilePreview ? (
                            <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                Upload
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                field.onChange(file);
                                handleImagePreview(file, 'profileImage');
                            }}
                        />
                    </div>
                )}
            />
            {errors.profileImage?.message && (
                <p className="text-red-500 text-sm">{errors.profileImage.message?.toString()}</p>
            )}

            {/* Shop Name */}
            <div className="px-4 space-y-4">
                <div>
                    <label className="block font-semibold mb-1">Shop Name</label>
                    <Controller
                        name="shopName"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Bella Boutique"
                            />
                        )}
                    />
                    {errors.shopName && (
                        <p className="text-red-500 text-sm">{errors.shopName.message}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block font-semibold mb-1">Description</label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <textarea
                                {...field}
                                rows={3}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Tell us about your shop..."
                            />
                        )}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description.message}</p>
                    )}
                </div>

                {/* Contact Number */}
                <div>
                    <label className="block font-semibold mb-1">Contact Number</label>
                    <Controller
                        name="contact"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="tel"
                                className="w-full border rounded px-3 py-2"
                                placeholder="+92 300 1234567"
                            />
                        )}
                    />
                    {errors.contact && (
                        <p className="text-red-500 text-sm">{errors.contact.message}</p>
                    )}
                </div>

                {/* Tags */}
                <div>
                    <label className="block font-semibold mb-1">Tags</label>
                    <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                placeholder="e.g., Designer, Affordable, Formal, Casual"
                            />
                        )}
                    />
                    {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    disabled={isSubmitting}
                >
                    Save Shop
                </Button>
            </div>
        </form>
    );
}
