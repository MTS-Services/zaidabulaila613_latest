"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, X, Info, DollarSign } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery } from "@apollo/client"
import { gql } from "@apollo/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { enqueueSnackbar } from "notistack"
import { GET_CATEGORIES, GET_USER_PRODUCT_BY_ID } from "@/graphql/query"
import { UPDATE_PRODUCT } from "@/graphql/mutation"
import Select from "@/components/select"
import { useTranslation } from "@/hooks/use-translation"
import { useCurrency } from "@/contexts/currency-context"
import { arColors, enColors } from "@/constants/colors"
import { config } from "@/constants/app"
import { useUserSubscription } from "@/hooks/useSubscription"
import TooltipBox from "@/components/tooltipBox"
import { FormSchemaUpdateDress, updateDressFormSchema } from "@/lib/validators/auth"

// Zod schema for form validation (same as create)


export default function UpdateProduct({ id }: { id: string }) {
    const router = useRouter()
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [existingImages, setExistingImages] = useState<{ id: string, path: string }[]>([])
    const [showSizeGuide, setShowSizeGuide] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [removedImageIds, setRemovedImageIds] = useState<string[]>([])

    const { t, language } = useTranslation()
    const { selectedCurrency } = useCurrency()
    const { bulkUpload, allowedDressTypes, maxMediaPerDress, maxDresses } = useUserSubscription()
    const { data: categoryData } = useQuery(GET_CATEGORIES)
    const categoryOptions = useMemo(() => {
        return (categoryData?.categories || []).map((category: any) => ({
            value: category.id,
            label: category.name?.[language.toLowerCase()] || "Unnamed",
        }));
    }, [categoryData, language]);
    // Fetch product data
    const { data: productData, loading: productLoading, error: productError } = useQuery(GET_USER_PRODUCT_BY_ID, {
        variables: {
            id,
            language,
            currency: selectedCurrency.code.toLowerCase(),
        },
        fetchPolicy: 'network-only',
    })

    const [updateProduct] = useMutation(UPDATE_PRODUCT, {

    })



    const form = useForm<FormSchemaUpdateDress>({
        resolver: zodResolver(updateDressFormSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            oldPrice: 0,
            type: "New",
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

    const { register, handleSubmit, control, formState: { errors }, watch, setValue, reset } = form

    useEffect(() => {
        if (productData?.userProductById && categoryOptions.length > 0) {
            const product = productData.userProductById;

            setExistingImages(product.pictures || []);

            reset({
                name: product.name,
                description: product.description || "",
                price: parseInt(product.price),
                oldPrice: parseInt(product.oldPrice) || 0,
                type: ["new", "used", "rental"].includes(product.type.toLowerCase())
                    ? (product.type.charAt(0).toUpperCase() + product.type.slice(1).toLowerCase()) as "New" | "Used" | "Rental"
                    : product.type,
                category: product.category?.id, // or use find(categoryOptions) if needed
                colors: product.color.map((el: any) => el.toLowerCase()) || [],
                selectedColor: product.selectedColor || "",
                sizes: product.size?.map((s: any) => s.value) || [],
                material: product.material || "",
                careInstructions: product.careInstructions || "",
                chest: product.chest || 0,
                waist: product.waist || 0,
                hip: product.hip || 0,
                shoulder: product.shoulder || null,
                high: product.high || 0,
                length: product.length || 0,
                sleeve: product.sleeve || false,
                underlay: product.underlay || false,
                qty: product.qty || 1,
                ref: product.ref || "",
                state: product.state || "",
            });
        }
    }, [productData, categoryOptions, reset]);

    const category = watch("category")
    const selectedColor = watch("selectedColor")

    console.log(category, "category")

    if (!user) {
        return null
    }

    if (productLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading product data...</div>
    }

    if (productError) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">
            Error loading product: {productError.message}
        </div>
    }

    const dressType = watch("type")

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

    // Remove existing image
    const removeExistingImage = (id: string) => {
        setExistingImages(prev => prev.filter(img => img.id !== id))
        setRemovedImageIds(prev => [...prev, id])
    }

    // Remove new image
    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    // Handle form submission
    const onSubmit = async (data: FormSchemaUpdateDress) => {


        const fAr = [...files, ...existingImages]


        if (fAr.length < 2) {
            enqueueSnackbar({ message: "Please upload minimum 2 images.", variant: 'warning', anchorOrigin: { horizontal: "center", vertical: "bottom" } })
            return
        }
        setIsSubmitting(true)

        try {
            const result = await updateProduct({
                variables: {
                    productId: id,
                    product: {
                        currency: selectedCurrency?.code,
                        language: language,
                        name: data.name,
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
                    picturesToAdd: files,
                    picturesToRemove: removedImageIds
                },
            })

            enqueueSnackbar({
                message: "Your dress has been updated successfully.",
                variant: 'success',
                anchorOrigin: { horizontal: "center", vertical: "bottom" }
            })

            router.push("/dashboard/dress")
        } catch (e: any) {
            toast({
                title: "Error updating dress",
                description: "There was an error updating your dress. Please try again.",
                variant: "destructive",
            })
            console.error("GraphQL Update Error:", e);

            const message =
                e?.graphQLErrors?.[0]?.message ||
                e?.message ||
                "Something went wrong during updating dress";

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

    // Color options with hex values
    const colorOptions = language === 'AR' ? arColors : enColors

    console.log(dressType, "Dress type")

    const price = watch('price')
    console.log(price, "Price")
    console.log(images, "images")
    return (
        <div className="min-h-screen bg-slate-50 py-8 md:py-12">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair">
                            {t('updateProduct.title')}
                        </h1>
                        <p className="max-w-[700px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            {t('updateProduct.description')}
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

                                        {/* Existing image previews */}
                                        {/* {existingImages.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">{t('updateProduct.current_images')}</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {existingImages.map((image, index) => (
                                                        <div key={image.id} className="relative group">
                                                            <div className="aspect-square relative rounded-md overflow-hidden">
                                                                <Image
                                                                    src={`${config.API_URL}${image.path}` || "/placeholder.svg"}
                                                                    alt={`Dress image ${index + 1}`}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExistingImage(image.id)}
                                                                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="h-4 w-4 text-red-500" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )} */}
                                        {existingImages.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">
                                                    {t("updateProduct.new_images")} ({images.length}/5)
                                                </p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {existingImages.map((src, index) => {
                                                        // const isVideo = typeof src === "string" && /\.(mp4|webm|ogg)$/i.test(src);
                                                        const isVideo = typeof src?.path === "string" && /\.(mp4|webm|ogg)$/i.test((src as any).path);

                                                        return (
                                                            <div key={index} className="relative group">
                                                                <div className="aspect-square relative rounded-md overflow-hidden bg-gray-100">
                                                                    {isVideo ? (
                                                                        <video
                                                                            src={config.API_URL + (src as any)?.path}
                                                                            controls
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <Image
                                                                            src={config.API_URL + src.path || "/placeholder.svg"}
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

                                        {/* New image previews */}
                                        {files.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">
                                                    {t("updateProduct.new_images")} ({files.length}/5)
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
                                    <Controller
                                        name="type"
                                        control={control}
                                        render={({ field }) => (





                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="space-y-3"
                                            >
                                                {!allowedDressTypes.includes('new') ?
                                                    <TooltipBox text={"Upgrade plan to add new dresses"}>

                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem disabled value={t('productTypes.new')} id="type-new" />
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
                                        )}
                                    />
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
                                        <Controller
                                            name="name"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="name"
                                                    {...field}
                                                    placeholder={t("createProduct.basicInfo.name.placeholder")}
                                                />
                                            )}
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{t(errors.name.message as string)}</p>}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            {t("createProduct.basicInfo.description.label")} <span className="text-red-500">*</span>
                                        </Label>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea
                                                    id="description"
                                                    {...field}
                                                    placeholder={t("createProduct.basicInfo.description.placeholder")}
                                                    rows={4}
                                                />
                                            )}
                                        />
                                        {errors.description && <p className="text-sm text-red-500">{t(errors.description.message as string)}</p>}
                                    </div>

                                    {/* Category */}
                                    <div className="space-y-2">
                                        <Label htmlFor="category">
                                            {t("createProduct.basicInfo.category.label")} <span className="text-red-500">*</span>
                                        </Label>
                                        <Controller
                                            name="category"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    options={categoryOptions.map((el: any) => ({
                                                        value: el.value,
                                                        label: el.label,
                                                    }))}
                                                    onSelect={field.onChange}
                                                    error={errors?.[field.name as keyof typeof errors]?.message as string}
                                                    defaultValue={category}
                                                />
                                            )}
                                        />
                                        {errors.category && <p className="text-sm text-red-500">{t(errors.category.message as string)}</p>}
                                    </div>

                                    {/* Price Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="price">
                                                {t("createProduct.basicInfo.price.label")} ({selectedCurrency.code})
                                                {dressType === "Rental" && ` / ${t("createProduct.perDay")}`}
                                                <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Controller
                                                    name="price"
                                                    control={control}
                                                    rules={{
                                                        required: t("createProduct.basicInfo.price.required"),
                                                    }}
                                                    render={({ field }) => (
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                            <Input
                                                                id="price"
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                placeholder={t("createProduct.basicInfo.price.placeholder")}
                                                                className="pl-9"
                                                                value={field.value ?? ""}
                                                                onChange={(e) =>
                                                                    field.onChange(e.target.value === "" ? undefined : parseInt(e.target.value))
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                            {errors.price && <p className="text-sm text-red-500">{t(errors.price.message as string)}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="oldPrice">
                                                {t("createProduct.basicInfo.oldPrice.label")} ({selectedCurrency.code})
                                                {dressType === "Rental" && ` / ${t("createProduct.perDay")}`}
                                            </Label>
                                            <Controller
                                                name="oldPrice"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                        <Input
                                                            id="oldPrice"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            className="pl-9"
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                        />
                                                    </div>
                                                )}
                                            />
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

                                        <Controller
                                            name="sizes"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                    {sizeOptions.map((size) => (
                                                        <div key={size} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`size-${size}`}
                                                                checked={field.value.includes(size)}
                                                                onCheckedChange={(checked) => {
                                                                    const newSizes = checked
                                                                        ? [...field.value, size]
                                                                        : field.value.filter(s => s !== size);
                                                                    field.onChange(newSizes);
                                                                }}
                                                            />
                                                            <Label htmlFor={`size-${size}`}>{size}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        />
                                        {errors.sizes && <p className="text-sm text-red-500">{t(errors.sizes.message as string)}</p>}
                                    </div>

                                    <Separator />

                                    {/* Colors */}
                                    <div className="space-y-3">
                                        <Label>
                                            {t("createProduct.specifications.colors.label")} <span className="text-red-500">*</span>
                                        </Label>
                                        <Controller
                                            name="colors"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                                    {colorOptions.map((color) => (
                                                        <div key={color.name} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`color-${color.name}`}
                                                                checked={watch("colors").includes(color.value)}
                                                                // onCheckedChange={(checked) => {
                                                                //     const newColors = checked
                                                                //         ? [...field.value, color.name]
                                                                //         : field.value.filter(c => c !== color.name);
                                                                //     field.onChange(newColors);
                                                                // }}
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
                                            )}
                                        />
                                        {errors.colors && <p className="text-sm text-red-500">{t(errors.colors.message as string)}</p>}
                                    </div>

                                    {/* Selected Color */}
                                    {/* <div className="space-y-2">
                                        <Label htmlFor="selectedColor">
                                            {t("createProduct.specifications.colors.selectedColor.label")} <span className="text-red-500">*</span>
                                        </Label>
                                        <Controller
                                            name="selectedColor"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    // label={'Main Color'}
                                                    options={colorOptions.map((el) => ({ value: el.value, label: el.name }))}
                                                    onSelect={field.onChange}
                                                    // error={errors?.[field.name as keyof typeof errors]?.message as string}
                                                    defaultValue={selectedColor}
                                                    placeholder={t("createProduct.specifications.colors.selectedColor.placeholder")}
                                                />

                                            )}
                                        />
                                        {errors.selectedColor && <p className="text-sm text-red-500">{errors.selectedColor.message}</p>}
                                    </div> */}

                                    <Separator />

                                    {/* Material and Care */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="material">{t("createProduct.specifications.material.label")}  <span className="text-red-500">*</span></Label>
                                            <Controller
                                                name="material"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="material"
                                                        {...field}
                                                        placeholder={t("createProduct.specifications.material.placeholder")}
                                                    />
                                                )}
                                            />
                                            {errors.material && <p className="text-sm text-red-500">{t(errors.material.message as string)}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="careInstructions">{t("createProduct.specifications.careInstructions.label")}</Label>
                                            <Controller
                                                name="careInstructions"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="careInstructions"
                                                        {...field}
                                                        placeholder={t("createProduct.specifications.careInstructions.placeholder")}
                                                    />
                                                )}
                                            />
                                            {errors.careInstructions && <p className="text-sm text-red-500">{t(errors.careInstructions.message as string)}</p>}
                                        </div>
                                    </div>

                                    {/* Measurements */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="chest">{t("createProduct.specifications.measurements.chest")}</Label>
                                            <Controller
                                                name="chest"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="chest"
                                                        type="number"
                                                        min="0"
                                                        step="0.5"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="waist">{t("createProduct.specifications.measurements.waist")}</Label>
                                            <Controller
                                                name="waist"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="waist"
                                                        type="number"
                                                        min="0"
                                                        step="0.5"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="shoulder">{t("createProduct.specifications.measurements.hip")}</Label>
                                            <Controller
                                                name="shoulder"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="shoulder"
                                                        type="number"
                                                        min="0"
                                                        step="0.5"
                                                        value={field.value ? field.value : 0}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="high">{t("createProduct.specifications.measurements.shoulder")}</Label>
                                            <Controller
                                                name="high"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="high"
                                                        type="number"
                                                        min="0"
                                                        step="0.5"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="Hip">{t("createProduct.specifications.measurements.height")}</Label>
                                            <Controller
                                                name="hip"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="hip"
                                                        type="number"
                                                        min="0"
                                                        step="0.5"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="length">{t("createProduct.specifications.measurements.length")}</Label>
                                            <Controller
                                                name="length"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="length"
                                                        type="number"
                                                        min="0"
                                                        step="0.5"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                    />
                                                )}
                                            />
                                        </div>
                                        {/* Repeat for other measurement fields */}
                                    </div>

                                    {/* Additional Options */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <Controller
                                            name="sleeve"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="sleeve"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                    <Label htmlFor="sleeve">{t("createProduct.specifications.options.sleeve")}</Label>
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name="underlay"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="underlay"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                    <Label htmlFor="underlay">{t("createProduct.specifications.options.underlay")}</Label>
                                                </div>
                                            )}
                                        />

                                        {/* Repeat for other checkbox fields */}
                                    </div>

                                    {/* Rental Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    </div>

                                    {/* Condition - Only for Used items */}
                                    {/* {dressType === "Used" && (
                                        <>
                                            <Separator />
                                            <div className="space-y-2">
                                                <Label htmlFor="condition">Condition</Label>
                                                <Controller
                                                    name="condition"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            options={['Like New', 'Excellent', 'Good', 'Fair'].map((el) => ({ value: el, label: el }))}
                                                            onSelect={field.onChange}
                                                            defaultValue={condition}

                                                        />
                                                    
                                                    )}
                                                />
                                            </div>
                                        </>
                                    )} */}

                                    {/* Quantity and Reference */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="qty">{t("createProduct.specifications.quantity.label")} <span className="text-red-500">*</span></Label>
                                            <Controller
                                                name="qty"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="qty"
                                                        type="number"
                                                        min="1"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                    />
                                                )}
                                            />
                                            {errors.qty && <p className="text-sm text-red-500">{t(errors.qty.message as string)}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ref">{t("createProduct.specifications.reference.label")} </Label>
                                            <Controller
                                                name="ref"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="ref"
                                                        {...field}
                                                        placeholder="e.g., Designer reference number"
                                                    />
                                                )}
                                            />
                                            {errors.ref && <p className="text-sm text-red-500">{t(errors.ref.message as string)}</p>}
                                        </div>
                                    </div>

                                    {/* State */}
                                    <div className="space-y-2">
                                        <Label htmlFor="state">{t("createProduct.specifications.city.label")} <span className="text-red-500">*</span></Label>
                                        <Controller
                                            name="state"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="state"
                                                    {...field}
                                                    placeholder={t("createProduct.specifications.city.placeholder")}
                                                />
                                            )}
                                        />
                                        {errors.state && <p className="text-sm text-red-500">{t(errors.state.message as string)}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>

                                <CardContent className="space-y-4">


                                    <div className="flex items-center space-x-2 pt-2">


                                        <Controller
                                            name="terms"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="terms"
                                                    
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
                                            )}
                                        />
                                        {errors.terms && <p className="text-sm text-red-500">{t(errors.terms.message as string)}</p>}

                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" type="button" onClick={() => router.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-black hover:bg-black/90 text-white" disabled={isSubmitting}>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Update
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