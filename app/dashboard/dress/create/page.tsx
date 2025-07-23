"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, X, Info, DollarSign } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery } from "@apollo/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import UploadButton from "@/components/upload-button"
import { CREATE_PRODUCT } from "@/graphql/mutation"
import { useAuth } from "@/contexts/auth-context"
import { enqueueSnackbar } from "notistack"
import { GET_CATEGORIES, GET_USER_PRODUCTS } from "@/graphql/query"
import { useCurrency } from "@/contexts/currency-context"
import { useTranslation } from "@/hooks/use-translation"
import { arColors, enColors } from "@/constants/colors"
import { useUserSubscription } from "@/hooks/useSubscription"
import TooltipBox from "@/components/tooltipBox"
import { createDressformSchema, FormSchemaCreateDress } from "@/lib/validators/auth"

// Zod schema for form validation


export default function UploadPage() {
    const router = useRouter()
    const { user } = useAuth()
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [showSizeGuide, setShowSizeGuide] = useState(false)
    const [files, setFiles] = useState<File[]>([])

    const { selectedCurrency } = useCurrency();
    const { language } = useTranslation();
    const { bulkUpload, allowedDressTypes, maxMediaPerDress, maxDresses } = useUserSubscription()

    const [createProduct] = useMutation(CREATE_PRODUCT)
    const { data } = useQuery(GET_CATEGORIES)
    const categoryOptions = (data?.categories || []).map((category: any) => ({
        value: category.id,
        label: category.name?.[language.toLowerCase()] || "Unnamed",
    }));

    console.log(categoryOptions, "Category ees")

    const form = useForm<FormSchemaCreateDress>({
        resolver: zodResolver(createDressformSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            oldPrice: 0,
            type: "Used",
            category: "",
            colors: [],
            selectedColor: "",
            sizes: [],
            material: "",
            careInstructions: "",
            chest: 0,
            waist: 0,
            hip: 0,
            shoulder: null,
            high: 0,
            length: 0,
            sleeve: false,
            underlay: false,
            qty: 1,
            ref: "",
            state: "",
            terms: false
        }
    })

    const { register, handleSubmit, formState: { errors }, watch, setValue } = form
    const dressType = watch("type")

    if (!user) {
        return null
    }

    if (user.productsCount === maxDresses) {
        return <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg max-w-xl mx-auto">
            <p className="font-semibold text-lg">Upgrade your subscription to add more dresses.</p>
            <p className="text-sm mt-1">
                Unlock the ability to upload more items, showcase videos, and increase your store’s visibility.
            </p>
            <a
                href="/dashboard/subscription"
                className="inline-block mt-3 text-sm font-medium text-yellow-700 bg-yellow-300 hover:bg-yellow-400 transition px-4 py-2 rounded-md shadow"
            >
                Upgrade Now →
            </a>
        </div>
    }

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        if (maxMediaPerDress !== "unlimited" && images.length + files.length > maxMediaPerDress) {

            enqueueSnackbar(`Maximum ${maxMediaPerDress} images allowed, upgrade your subscription to add more.`, {
                variant: 'error',
                anchorOrigin: { horizontal: "center", vertical: "bottom" },
            });
            return
        }
        // if (!user?.subscription) {
        //     // Limit to 5 images

        // }

        // Create preview URLs for the images
        Array.from(files).forEach((file) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    setImages((prev) => [...prev, e.target!.result as string])
                }
            }
            reader.readAsDataURL(file)
            setFiles((prev) => [...prev, file])
        })
    }

    // Remove image
    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }



    // Handle form submission
    const onSubmit = async (data: FormSchemaCreateDress) => {


        if (files.length < 2) {
            enqueueSnackbar({ message: "Please upload minimum 2 images.", variant: 'warning', anchorOrigin: { horizontal: "center", vertical: "bottom" } })
            return
        }
        if (maxMediaPerDress !== "unlimited" && files.length > maxMediaPerDress) {
            enqueueSnackbar(`Maximum ${maxMediaPerDress} images allowed, upgrade your subscription to add unlimited.`, {
                variant: 'error',
                anchorOrigin: { horizontal: "center", vertical: "bottom" },
            });
            return
        }
        setIsSubmitting(true)

        try {
            const result = await createProduct({
                variables: {
                    product: {
                        currency: selectedCurrency?.code,
                        language: language,
                        name: data.name,
                        user: user.user.id,
                        description: data.description,
                        price: data.price,
                        oldPrice: data.oldPrice,
                        type: data.type.toLowerCase(),
                        color: data.colors,
                        selectedColor: data.selectedColor,
                        chest: data.chest,
                        waist: data.waist,
                        hip: data.hip,
                        shoulder: data.shoulder,
                        high: data.high,
                        length: data.length,
                        sleeve: data.sleeve,
                        underlay: data.underlay,
                        qty: data.qty,
                        ref: data.ref,
                        state: data.state,
                        size: data.sizes.map(size => ({ value: size, label: size })),
                        category: data.category,
                        material: data.material,
                        careInstructions: data.careInstructions,
                        // condition: data.condition
                    },
                    pictures: files,
                },
            })

            enqueueSnackbar({ message: "Your dress has been submitted for review.", variant: 'success', anchorOrigin: { horizontal: "center", vertical: "bottom" } })


            router.push("/dashboard/dress")
        } catch (e: any) {
            toast({
                title: "Error uploading dress",
                description: "There was an error submitting your dress. Please try again.",
                variant: "destructive",
            })
            console.error("GraphQL Signup Error:", e);

            const message =
                e?.graphQLErrors?.[0]?.message ||
                e?.message ||
                "Something went wrong during uploading dress";

            enqueueSnackbar(message, {
                variant: 'error',
                anchorOrigin: { horizontal: "center", vertical: "bottom" },
            });

        } finally {
            setIsSubmitting(false)
        }
    }

    // Size options
    const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "Custom"]



    const colorOptions = language === 'AR' ? arColors : enColors

    console.log(language)
    const isVendor = user?.subscription?.plan?.toUpperCase() === "VENDOR";
    // Category options
    // const categoryOptions = [
    //     "Wedding",
    //     "Evening",
    //     "Casual",
    //     "Formal",
    //     "Cocktail",
    //     "Prom",
    //     "Bridal",
    //     "Bridesmaid",
    //     "Maternity",
    //     "Plus Size",
    //     "Petite",
    //     "Vintage",
    //     "Designer",
    //     "Traditional",
    //     "Seasonal",
    // ]

    return (
        <div className="min-h-screen bg-slate-50 py-8 md:py-12">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair">
                            {t("createProduct.title")}
                        </h1>
                        <p className="max-w-[700px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            {t("createProduct.description")}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column - Images */}
                        <div className="md:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("createProduct.images.title")}</CardTitle>
                                    <CardDescription>{t("createProduct.images.description")}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Image upload area */}
                                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                                            <input
                                                type="file"
                                                id="images"
                                                multiple
                                                accept={user?.subscription?.plan === "BASIC" ? `image/*` : `image/*,video/*`}
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                            <label
                                                htmlFor="images"
                                                className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4"
                                            >
                                                <Upload className="h-8 w-8 text-slate-400" />
                                                <span className="text-sm font-medium text-slate-900">{t("createProduct.images.uploadText")}</span>
                                                <span className="text-xs text-slate-500">{t("createProduct.images.uploadHint")}</span>
                                            </label>
                                        </div>

                                        {/* Image previews */}
                                        {/* {images.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">{t("createProduct.images.uploadedImages")} ({images.length}/5)</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {images.map((image, index) => (
                                                        <div key={index} className="relative group">
                                                            <div className="aspect-square relative rounded-md overflow-hidden">
                                                                <Image
                                                                    src={image || "/placeholder.svg"}
                                                                    alt={`Dress image ${index + 1}`}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="h-4 w-4 text-red-500" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )} */}

                                        {files.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">
                                                    {t("createProduct.images.uploadedImages")} ({files.length}/5)
                                                </p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {files.map((fileOrUrl, index) => {
                                                        const src =
                                                            typeof fileOrUrl === "string"
                                                                ? fileOrUrl
                                                                : URL.createObjectURL(fileOrUrl);

                                                        const isVideo =
                                                            typeof fileOrUrl === "string"
                                                                ? /\.(mp4|webm|ogg)$/i.test(fileOrUrl)
                                                                : fileOrUrl.type.startsWith("video");

                                                        return (
                                                            <div key={index} className="relative group">
                                                                <div className="aspect-square relative rounded-md overflow-hidden bg-gray-100">
                                                                    {isVideo ? (
                                                                        <video
                                                                            src={src}
                                                                            controls
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <Image
                                                                            src={src || "/placeholder.svg"}
                                                                            alt={`Media ${index + 1}`}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    )}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(index)}
                                                                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <X className="h-4 w-4 text-red-500" />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>{t("createProduct.dressType.title")}</CardTitle>
                                    <CardDescription>{t("createProduct.dressType.description")}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={dressType}
                                        onValueChange={(value) => setValue("type", value)}
                                        className="space-y-3"
                                    >

                                        {/* { &&} */}
                                        {!allowedDressTypes.includes('new') ?

                                            <TooltipBox text={allowedDressTypes.includes('new') ? "" : "Upgrade plan to add new dresses"}>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem disabled={!allowedDressTypes.includes('new')} value={t('productTypes.new')} id="type-new" />
                                                    <Label htmlFor="type-new" className="flex items-center">
                                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                                                            {t("createProduct.dressType.new.label")}
                                                        </span>
                                                        {t("createProduct.dressType.new.description")}
                                                    </Label>
                                                </div>
                                            </TooltipBox>
                                            :
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value={t('productTypes.new')} id="type-new" />
                                                <Label htmlFor="type-new" className="flex items-center">
                                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                                                        {t("createProduct.dressType.new.label")}
                                                    </span>
                                                    {t("createProduct.dressType.new.description")}
                                                </Label>
                                            </div>
                                        }



                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value={t('productTypes.used')} id="type-used" />
                                            <Label htmlFor="type-used" className="flex items-center">
                                                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                                                    {t("createProduct.dressType.used.label")}
                                                </span>
                                                {t("createProduct.dressType.used.description")}
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value={t('productTypes.rental')} id="type-rental" />
                                            <Label htmlFor="type-rental" className="flex items-center">
                                                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                                                    {t("createProduct.dressType.rental.label")}
                                                </span>
                                                {t("createProduct.dressType.rental.description")}
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Details */}
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("createProduct.basicInfo.title")}</CardTitle>
                                    <CardDescription>{t("createProduct.basicInfo.subtitle")}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Dress Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            {t("createProduct.basicInfo.name.label")} <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            {...register("name")}
                                            placeholder={t("createProduct.basicInfo.name.placeholder")}
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            {t("createProduct.basicInfo.description.label")} <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            {...register("description")}
                                            placeholder={t("createProduct.basicInfo.description.placeholder")}
                                            rows={4}
                                        />
                                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                                    </div>

                                    {/* Category */}
                                    <div className="space-y-2">
                                        <Label htmlFor="category">
                                            {t("createProduct.basicInfo.category.label")} <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={watch("category")}
                                            onValueChange={(value) => setValue("category", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t("createProduct.basicInfo.category.placeholder")} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoryOptions.map((category: any) => (
                                                    <SelectItem key={category} value={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
                                    </div>

                                    {/* Price Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* <div className="flex items-center space-x-2 mt-3 mb-3">
                                            <Checkbox
                                                id="rent"
                                                {...register("rent")}
                                                onCheckedChange={(checked) => {
                                                    const check = watch("rent")
                                                    if (checked) {
                                                        setValue("rent", true)
                                                    } else {
                                                        setValue("rent", false)
                                                    }
                                                }}
                                            />
                                            <Label htmlFor="rent">Available for Rent</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-3 mb-3">
                                            <Checkbox
                                                id="sell"
                                                {...register("sell")}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setValue("sell", true)
                                                    } else {
                                                        setValue("sell", false)
                                                    }
                                                }}
                                            />
                                            <Label htmlFor="sell">Available for Sale</Label>
                                        </div> */}
                                        <div className="space-y-2">
                                            <Label htmlFor="price">
                                                {t("createProduct.basicInfo.price.label")} ({selectedCurrency.code}) {dressType === 'Rental' && `/ ${t("createProduct.perDay")}`} <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                {/* <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" /> */}
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder={t("createProduct.basicInfo.price.placeholder")}
                                                    className="pl-9"
                                                    // {...register("price", { valueAsNumber: true })}
                                                    {...register("price", {
                                                        required: "Price is required",
                                                        valueAsNumber: true,
                                                    })}
                                                />
                                            </div>
                                            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="oldPrice">{t("createProduct.basicInfo.oldPrice.label")} ({selectedCurrency.code}) {dressType === 'Rental' && `/ ${t("createProduct.perDay")}`}</Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="h-4 w-4 text-slate-400" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="w-[200px] text-xs">
                                                                {t("createProduct.basicInfo.oldPrice.tooltip")}
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="oldPrice"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    className="pl-9"
                                                    {...register("oldPrice", { valueAsNumber: true })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("createProduct.specifications.title")}</CardTitle>
                                    <CardDescription>{t("createProduct.specifications.description")}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Sizes */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label>
                                                {t("createProduct.specifications.sizes.label")} <span className="text-red-500">*</span>
                                            </Label>
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="text-gold p-0 h-auto"
                                                onClick={() => setShowSizeGuide(!showSizeGuide)}
                                            >
                                                {t("createProduct.specifications.sizes.guide")}
                                            </Button>
                                        </div>

                                        {showSizeGuide && (
                                            <div className="bg-slate-50 p-3 rounded-md text-sm mb-2">
                                                <h4 className="font-medium mb-1">{t("createProduct.specifications.sizes.guide")}</h4>
                                                <div className="grid grid-cols-4 gap-2 text-xs">
                                                    <div>{t("createProduct.specifications.sizes.guideContent.xs")}</div>
                                                    <div>{t("createProduct.specifications.sizes.guideContent.s")}</div>
                                                    <div>{t("createProduct.specifications.sizes.guideContent.m")}</div>
                                                    <div>{t("createProduct.specifications.sizes.guideContent.l")}</div>
                                                    <div>{t("createProduct.specifications.sizes.guideContent.xl")}</div>
                                                    <div>{t("createProduct.specifications.sizes.guideContent.xxl")}</div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {sizeOptions.map((size) => (
                                                <div key={size} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`size-${size}`}
                                                        checked={watch("sizes").includes(size)}
                                                        onCheckedChange={(checked) => {
                                                            const sizes = watch("sizes")
                                                            if (checked) {
                                                                setValue("sizes", [...sizes, size])
                                                            } else {
                                                                setValue("sizes", sizes.filter(s => s !== size))
                                                            }
                                                        }}
                                                    />
                                                    <Label htmlFor={`size-${size}`}>{size}</Label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.sizes && <p className="text-sm text-red-500">{errors.sizes.message}</p>}
                                    </div>

                                    <Separator />

                                    {/* Colors */}
                                    <div className="space-y-3">
                                        <Label>
                                            {t("createProduct.specifications.colors.label")} <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                            {colorOptions.map((color) => (
                                                <div key={color.name} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`color-${color.name}`}
                                                        checked={watch("colors").includes(color.value)}
                                                        onCheckedChange={(checked) => {
                                                            const colors = watch("colors")
                                                            if (checked) {
                                                                setValue("colors", [...colors, color.value])
                                                            } else {
                                                                setValue("colors", colors.filter(c => c !== color.value))
                                                            }
                                                        }}
                                                    />
                                                    <Label htmlFor={`color-${color.name}`} className="flex items-center gap-2">
                                                        <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: color.hex }} />
                                                        {color.name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.colors && <p className="text-sm text-red-500">{errors.colors.message}</p>}
                                    </div>

                                    {/* Selected Color */}
                                    {/* <div className="space-y-2">
                                        <Label htmlFor="selectedColor">
                                            {t("createProduct.specifications.colors.selectedColor.label")} <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={watch("selectedColor")}
                                            onValueChange={(value) => setValue("selectedColor", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t("createProduct.specifications.colors.selectedColor.placeholder")} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {colorOptions.map((color) => (
                                                    <SelectItem key={color.name} value={color.value}>
                                                        <div className="flex items-center gap-2">
                                                            <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: color.hex }} />
                                                            {color.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.selectedColor && <p className="text-sm text-red-500">{errors.selectedColor.message}</p>}
                                    </div> */}

                                    <Separator />

                                    {/* Material and Care */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="material">{t("createProduct.specifications.material.label")} </Label>
                                            <Input
                                                id="material"
                                                {...register("material")}
                                                placeholder={t("createProduct.specifications.material.placeholder")}
                                            />
                                            {/* {errors.material && <p className="text-sm text-red-500">{errors.material.message}</p>} */}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="careInstructions">{t("createProduct.specifications.careInstructions.label")}</Label>
                                            <Input
                                                id="careInstructions"
                                                {...register("careInstructions")}
                                                placeholder={t("createProduct.specifications.careInstructions.placeholder")}
                                            />
                                            {errors.careInstructions && <p className="text-sm text-red-500">{errors.careInstructions.message}</p>}
                                        </div>
                                    </div>

                                    {/* Measurements */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="chest">{t("createProduct.specifications.measurements.chest")}</Label>
                                            <Input
                                                id="chest"
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                {...register("chest", { valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="waist">{t("createProduct.specifications.measurements.waist")}</Label>
                                            <Input
                                                id="waist"
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                {...register("waist", { valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hip">{t("createProduct.specifications.measurements.hip")}</Label>
                                            <Input
                                                id="hip"
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                {...register("hip", { valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="shoulder">{t("createProduct.specifications.measurements.shoulder")}</Label>
                                            <Input
                                                id="shoulder"
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                {...register("shoulder", { valueAsNumber: true, setValueAs: v => v === "" ? null : v })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="high">{t("createProduct.specifications.measurements.height")}</Label>
                                            <Input
                                                id="high"
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                {...register("high", { valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="length">{t("createProduct.specifications.measurements.length")}</Label>
                                            <Input
                                                id="length"
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                {...register("length", { valueAsNumber: true })}
                                            />
                                        </div>
                                    </div>

                                    {/* Additional Options */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="sleeve"
                                                {...register("sleeve")}
                                                onCheckedChange={(checked) => {
                                                    const check = watch("sleeve")
                                                    if (checked) {
                                                        setValue("sleeve", true)
                                                    } else {
                                                        setValue("sleeve", false)
                                                    }
                                                }}
                                            />
                                            <Label htmlFor="sleeve">{t("createProduct.specifications.options.sleeve")}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="underlay"
                                                {...register("underlay")}
                                                onCheckedChange={(checked) => {
                                                    const check = watch("underlay")
                                                    if (checked) {
                                                        setValue("underlay", true)
                                                    } else {
                                                        setValue("underlay", false)
                                                    }
                                                }}
                                            />
                                            <Label htmlFor="underlay">{t("createProduct.specifications.options.underlay")}</Label>
                                        </div>

                                    </div>

                                    {/* Rental Information */}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    </div>




                                    {/* Quantity and Reference */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {
                                            !isVendor ?

                                                <TooltipBox text={t("common.upgradeToVendor")}>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="qty">
                                                            {t("createProduct.specifications.quantity.label")}
                                                            <span className="text-red-500">*</span>
                                                        </Label>

                                                        <Input
                                                            id="qty"
                                                            type="number"
                                                            disabled={!isVendor}
                                                            min={1}
                                                            /* ⬇️  allow >1 only for Vendor  */
                                                            max={isVendor ? undefined : 1}
                                                            /* react‑hook‑form validation */
                                                            {...register("qty", {
                                                                valueAsNumber: true,
                                                                min: { value: 1, message: t("validation.minOne") },
                                                                validate: value =>
                                                                    isVendor || value <= 1 || t("validation.needVendorForMore"),
                                                            })}
                                                        />

                                                        {errors.qty && (
                                                            <p className="text-sm text-red-500">{errors.qty.message}</p>
                                                        )}
                                                    </div>
                                                </TooltipBox>
                                                :
                                                <div className="space-y-2">
                                                    <Label htmlFor="qty">
                                                        {t("createProduct.specifications.quantity.label")}
                                                        <span className="text-red-500">*</span>
                                                    </Label>

                                                    <Input
                                                        id="qty"
                                                        type="number"
                                                        disabled={!isVendor}
                                                        min={1}
                                                        /* ⬇️  allow >1 only for Vendor  */
                                                        max={isVendor ? undefined : 1}
                                                        /* react‑hook‑form validation */
                                                        {...register("qty", {
                                                            valueAsNumber: true,
                                                            min: { value: 1, message: t("validation.minOne") },
                                                            validate: value =>
                                                                isVendor || value <= 1 || t("validation.needVendorForMore"),
                                                        })}
                                                    />

                                                    {errors.qty && (
                                                        <p className="text-sm text-red-500">{errors.qty.message}</p>
                                                    )}
                                                </div>
                                        }
                                        <div className="space-y-2">
                                            <Label htmlFor="ref">{t("createProduct.specifications.reference.label")} </Label>
                                            <Input
                                                id="ref"
                                                {...register("ref")}
                                                placeholder={t("createProduct.specifications.reference.placeholder")}
                                            />
                                            {errors.ref && <p className="text-sm text-red-500">{errors.ref.message}</p>}
                                        </div>
                                    </div>

                                    {/* State */}
                                    <div className="space-y-2">
                                        <Label htmlFor="state">{t("createProduct.specifications.city.label")} <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="state"
                                            {...register("state")}
                                            placeholder={t("createProduct.specifications.city.placeholder")}
                                        />
                                        {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>

                                <CardContent className="space-y-4">


                                    <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox
                                            id="terms"
                                            {...register("terms")}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setValue("terms", true)
                                                } else {
                                                    setValue("terms", false)
                                                }
                                            }}

                                        />
                                        <Label htmlFor="terms" className="text-sm">
                                            {t("createProduct.terms.agree")}{" "}
                                            <Link href="#" className="text-gold hover:underline">
                                                {t("createProduct.terms.terms")}
                                            </Link>{" "}

                                            <Link href="#" className="text-gold hover:underline">
                                                {t("createProduct.terms.privacy")}
                                            </Link>
                                        </Label>
                                    </div>
                                    {errors.terms && <p className="text-sm text-red-500">{errors.terms.message}</p>}
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" type="button" onClick={() => router.back()}>
                                        {t("createProduct.actions.cancel")}
                                    </Button>
                                    <Button type="submit" className="bg-black hover:bg-black/90 text-white" disabled={isSubmitting}>
                                        <Upload className="h-4 w-4 mr-2" />
                                        {t("createProduct.actions.publish")}
                                    </Button>

                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

