'use client';

import { useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Upload, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { arColors, enColors } from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';
import { useCurrency } from '@/contexts/currency-context';
import { GET_CATEGORIES } from '@/graphql/query';
import { useTranslation } from '@/hooks/use-translation';
import { useUserSubscription } from '@/hooks/useSubscription';
import {
  createDressformSchema,
  FormSchemaCreateDress,
} from '@/lib/validators/auth';
import { enqueueSnackbar } from 'notistack';

// Zod schema for form validation

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // NEW: upload limits state from REST
  const [uploadLimits, setUploadLimits] = useState<{
    subscriptionType?: string;
    limits?: {
      maxDressesFromAddScreen: number;
      maxImagesPerDress: number;
      maxVideosPerDress: number;
      canUploadVideos: boolean;
      canAddNewDresses: boolean;
      uploadedDressVisibilityPriority: string;
      bulkUploadDresses: boolean;
    };
    currentUsage?: {
      currentProductCount: number;
      remainingUploads: number;
    };
  } | null>(null);

  // derive limits with fallbacks
  const maxImagesLimit = uploadLimits?.limits?.maxImagesPerDress ?? 5;
  const canUploadVideos = uploadLimits?.limits?.canUploadVideos ?? false;
  const canAddNewDresses = uploadLimits?.limits?.canAddNewDresses ?? false;

  const { selectedCurrency } = useCurrency();
  const { language } = useTranslation();
  const { bulkUpload, allowedDressTypes, maxMediaPerDress, maxDresses } =
    useUserSubscription();

  // Remove GraphQL createProduct, keep categories query
  const { data } = useQuery(GET_CATEGORIES);
  const categoryOptions = (data?.categories || []).map((category: any) => ({
    value: category.id,
    label: category.name?.[language.toLowerCase()] || 'Unnamed',
  }));

  const form = useForm<FormSchemaCreateDress>({
    resolver: zodResolver(createDressformSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      oldPrice: 0,
      type: 'used',
      category: '',
      colors: [],
      selectedColor: '',
      sizes: [],
      material: '',
      careInstructions: '',
      chest: 0,
      waist: 0,
      hip: 0,
      shoulder: null,
      high: 0,
      length: 0,
      sleeve: false,
      underlay: false,
      qty: 1,
      ref: '',
      state: '',
      terms: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;
  const dressType = watch('type');
  const selectedColors = watch('colors') || [];

  // NEW: color details state (per selected color)
  type ColorDetails = Record<
    string,
    {
      description: string;
      quantities: Record<string, number>;
    }
  >;
  const [colorDetails, setColorDetails] = useState<ColorDetails>({});

  // Helper: check AbortError
  const isAbortError = (e: any) =>
    e?.name === 'AbortError' || /aborted/i.test(e?.message || '');

  // Helper: fetch with timeout that also respects an external signal and sets a reason
  const fetchWithTimeout = async (
    input: RequestInfo | URL,
    init: RequestInit = {},
    timeoutMs = 60000
  ) => {
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => {
      // Give a reason to avoid "aborted without reason"
      timeoutController.abort(
        new DOMException('Timeout', 'TimeoutError') as any
      );
    }, timeoutMs);

    const externalSignal = init.signal as AbortSignal | undefined;
    const onExternalAbort = () => {
      timeoutController.abort(
        ((externalSignal as any)?.reason as any) ??
          (new DOMException('Aborted', 'AbortError') as any)
      );
    };

    try {
      if (externalSignal) {
        if (externalSignal.aborted) {
          onExternalAbort();
        } else {
          externalSignal.addEventListener('abort', onExternalAbort, {
            once: true,
          });
        }
      }

      const res = await fetch(input, {
        ...init,
        signal: timeoutController.signal,
      });
      return res;
    } finally {
      clearTimeout(timeoutId);
      if (externalSignal) {
        externalSignal.removeEventListener('abort', onExternalAbort);
      }
    }
  };

  // Fetch upload limits on mount
  useEffect(() => {
    if (!user?.access_token) return;
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetchWithTimeout(
          `${process.env.NEXT_PUBLIC_API_URL}/products/upload-limits`,
          {
            headers: { Authorization: `Bearer ${user.access_token}` },
            // Pass external signal; fetchWithTimeout merges it with internal timeout
            signal: controller.signal,
          },
          20000
        );
        if (!res.ok) throw new Error('Failed to fetch upload limits');
        const json = await res.json();

        console.groupCollapsed('[Upload Limits] Response');
        console.log('subscriptionType:', json?.subscriptionType);
        console.log('limits:', json?.limits);
        console.log('currentUsage:', json?.currentUsage);
        console.groupEnd();

        setUploadLimits(json);
        setValue('type', json?.limits?.canAddNewDresses ? 'new' : 'used');
      } catch (e: any) {
        if (isAbortError(e)) {
          console.info('upload-limits request aborted:', e?.message);
        } else {
          console.error('upload-limits fetch error:', e);
        }
      }
    })();
    return () =>
      controller.abort(new DOMException('Unmounted', 'AbortError') as any);
  }, [user?.access_token, setValue]);

  // Keep colorDetails in sync with selected colors
  useEffect(() => {
    setColorDetails((prev) => {
      const next: ColorDetails = {};
      // keep existing for still-selected colors
      selectedColors.forEach((c: string) => {
        next[c] = prev[c] || { description: '', quantities: {} };
      });
      return next;
    });
    // also prune sizes when color removed
    const sizesSet = new Set<string>();
    selectedColors.forEach((c: string) => {
      const q = colorDetails[c]?.quantities || {};
      Object.keys(q).forEach((size) => sizesSet.add(size));
    });
    setValue('sizes', Array.from(sizesSet));
  }, [selectedColors]);

  // Auto-calc total qty
  useEffect(() => {
    const total = Object.values(colorDetails).reduce((sum, cd) => {
      return (
        sum +
        Object.values(cd.quantities).reduce((s, q) => s + (Number(q) || 0), 0)
      );
    }, 0);
    setValue('qty', total);
  }, [colorDetails, setValue]);

  if (!user) {
    return null;
  }

  if (user.productsCount === maxDresses) {
    return (
      <div className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg max-w-xl mx-auto'>
        <p className='font-semibold text-lg'>
          Upgrade your subscription to add more dresses.
        </p>
        <p className='text-sm mt-1'>
          Unlock the ability to upload more items, showcase videos, and increase
          your store’s visibility.
        </p>
        <a
          href='/dashboard/subscription'
          className='inline-block mt-3 text-sm font-medium text-yellow-700 bg-yellow-300 hover:bg-yellow-400 transition px-4 py-2 rounded-md shadow'
        >
          Upgrade Now →
        </a>
      </div>
    );
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList) return;

    if (images.length + filesList.length > maxImagesLimit) {
      enqueueSnackbar(
        `Maximum ${maxImagesLimit} media allowed, upgrade your subscription to add more.`,
        {
          variant: 'error',
          anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
        }
      );
      return;
    }

    Array.from(filesList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImages((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
      setFiles((prev) => [...prev, file]);
    });
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Build availableColors payload from colorDetails
  const buildAvailableColors = () => {
    return selectedColors.map((color: string) => {
      const details = colorDetails[color] || {
        description: '',
        quantities: {},
      };
      const desc = (details.description || '').trim();
      const sizes = Object.entries(details.quantities)
        .filter(([, qty]) => (Number(qty) || 0) > 0)
        .map(([size, qty]) => ({
          size,
          sizeSpecific: /^\d+$/.test(size) ? size : '',
          quantity: Number(qty),
          // Send multilingual color description to match backend shape
          colorDisction: {
            en: desc,
            ar: desc,
          },
        }));
      return {
        color,
        sizes,
      };
    });
  };

  // Handle form submission via REST
  const onSubmit = async (data: FormSchemaCreateDress) => {
    // DEBUG: log raw form values before validations
    console.group('[Submit] Raw Form Values');
    console.log('form data:', data);
    console.log('selected colors:', selectedColors);
    console.log('colorDetails:', colorDetails);
    console.log('derived sizes:', watch('sizes'));
    console.log(
      'files count:',
      files.length,
      files.map((f) => ({ name: f.name, type: f.type, size: f.size }))
    );
    console.groupEnd();

    if (files.length < 2) {
      enqueueSnackbar({
        message: t('createProduct.messages.minImages'),
        variant: 'warning',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
      return;
    }
    if (files.length > maxImagesLimit) {
      enqueueSnackbar(
        t('createProduct.messages.maxImages').replace(
          '5',
          String(maxImagesLimit)
        ),
        {
          variant: 'error',
          anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
        }
      );
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = {
        // ...existing fields...
        language: language || 'EN',
        currency: selectedCurrency?.code || 'USD',
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        oldPrice: data.oldPrice,
        type: (data.type || '').toLowerCase(),
        color: data.colors,
        sleeve: data.sleeve,
        underlay: data.underlay,
        qty: data.qty,
        ref: data.ref,
        material: data.material,
        careInstructions: data.careInstructions,
        availableColors: buildAvailableColors(),
        length: data.length || 0,
        height: data.high || 0,
        high: data.high || 0,
        shoulder: data.shoulder ?? 0,
        hip: data.hip || 0,
        waist: data.waist || 0,
        chest: data.chest || 0,
        // send size as objects to match backend response
        size: Array.from(new Set(watch('sizes') || [])).map((s) => ({
          value: s,
          label: s,
        })),
        state: data.state || '', // add state to payload
      };

      // DEBUG: log payload object
      console.groupCollapsed('[Submit] Payload Preview');
      console.log('payload:', payload);
      console.groupEnd();

      // Helper: build flat multipart form-data with a dynamic files field name
      const buildFormData = (fileFieldName: string) => {
        const fd = new FormData();
        fd.append('language', String(payload.language));
        fd.append('currency', String(payload.currency));
        fd.append('name', String(payload.name));
        fd.append('description', String(payload.description));
        fd.append('category', String(payload.category));
        fd.append('price', String(payload.price ?? ''));
        fd.append('oldPrice', String(payload.oldPrice ?? ''));
        fd.append('type', String(payload.type));
        fd.append('sleeve', String(payload.sleeve));
        fd.append('underlay', String(payload.underlay));
        fd.append('qty', String(payload.qty ?? 0));
        fd.append('ref', String(payload.ref || ''));
        fd.append('material', String(payload.material || ''));
        fd.append('careInstructions', String(payload.careInstructions || ''));
        fd.append('length', String(payload.length ?? 0));
        fd.append('height', String(payload.height ?? 0));
        fd.append('high', String(payload.high ?? 0));
        fd.append('shoulder', String(payload.shoulder ?? 0));
        fd.append('hip', String(payload.hip ?? 0));
        fd.append('waist', String(payload.waist ?? 0));
        fd.append('chest', String(payload.chest ?? 0));
        fd.append('color', JSON.stringify(payload.color || []));
        fd.append('size', JSON.stringify(payload.size || []));
        fd.append(
          'availableColors',
          JSON.stringify(payload.availableColors || [])
        );
        fd.append('state', String(payload.state || '')); // append state
        files.forEach((file) => fd.append(fileFieldName, file));
        return fd;
      };

      // Try a set of common file field names until one succeeds
      const FILE_FIELD_CANDIDATES = [
        'images',
        'image',
        'files',
        'file',
        'photos',
        'photo',
        'pictures',
        'pictures[]',
        'images[]',
      ];

      const url = `${process.env.NEXT_PUBLIC_API_URL}/products`;
      const headers = { Authorization: `Bearer ${user.access_token}` };

      // DEBUG: request info
      console.groupCollapsed('[Submit] Request');
      console.log('URL:', url);
      console.log('Method:', 'POST');
      console.log('Headers:', headers);
      console.groupEnd();

      let success = false;
      let lastErrMessage = '';
      for (let i = 0; i < FILE_FIELD_CANDIDATES.length; i++) {
        const fieldName = FILE_FIELD_CANDIDATES[i];
        const formData = buildFormData(fieldName);

        // DEBUG: log FormData entries
        console.groupCollapsed(
          `[Submit] Attempt ${i + 1}/${
            FILE_FIELD_CANDIDATES.length
          } with field "${fieldName}"`
        );
        formData.forEach((value, key) => {
          if (value instanceof File) {
            console.log(
              `${key}: [File] name=${value.name} type=${value.type} size=${value.size}`
            );
          } else {
            console.log(`${key}:`, value);
          }
        });
        console.groupEnd();

        const res = await fetchWithTimeout(
          url,
          {
            method: 'POST',
            headers,
            body: formData,
          },
          60000
        );

        // DEBUG: response status
        console.groupCollapsed(`[Submit] Response for field "${fieldName}"`);
        console.log(
          'status:',
          res.status,
          'ok:',
          res.ok,
          'statusText:',
          res.statusText
        );
        console.groupEnd();

        if (res.ok) {
          success = true;
          enqueueSnackbar({
            message: t('createProduct.messages.success'),
            variant: 'success',
            anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
          });
          router.push('/dashboard/dress');
          break;
        } else {
          // Try parse json, then text, then generic error
          let serverMessage = 'Failed to create product';
          let rawBody: any = null;
          try {
            rawBody = await res.json();
            serverMessage = rawBody?.message || JSON.stringify(rawBody);
          } catch {
            try {
              rawBody = await res.text();
              if (rawBody) serverMessage = rawBody;
            } catch {}
          }

          // DEBUG: log error body
          console.group('[Submit] Error Body');
          console.log(rawBody);
          console.groupEnd();

          lastErrMessage = serverMessage || 'Unknown error';
          // If error is NOT about unexpected field, no point retrying different names
          if (!/Unexpected field/i.test(lastErrMessage)) {
            throw new Error(lastErrMessage);
          }
          // Otherwise, continue to next candidate
          console.warn(
            `Server said "Unexpected field" for "${fieldName}". Trying next candidate...`
          );
        }
      }

      if (!success) {
        // All candidates failed with "Unexpected field"
        const tried = FILE_FIELD_CANDIDATES.join(', ');
        throw new Error(
          `Unexpected field for uploaded files. Tried: ${tried}. Please confirm the expected field name on the server.`
        );
      }
    } catch (e: any) {
      const message =
        e?.message ||
        'There was an error submitting your dress. Please try again.';

      if (/Unexpected field/i.test(message)) {
        console.warn(
          `[Hint] Server still returns "Unexpected field". Adjust the files field name on the client to match the server's multer config.`
        );
      }

      // DEBUG: log final error
      console.group('[Submit] Final Error');
      console.error(message, e);
      console.groupEnd();

      toast({
        title: 'Error uploading dress',
        description: message,
        variant: 'destructive',
      });
      enqueueSnackbar(message, {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
    } finally {
      // DEBUG: re-enable submit button
      console.log('[Submit] Done. Re-enabling submit button.');
      setIsSubmitting(false);
    }
  };

  // Size options + extra numeric sizes
  const baseSizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const numericSizes = ['36', '38', '40', '42', '44', '46', '48', '50', '52'];
  const sizeOptions = useMemo(() => [...baseSizeOptions, ...numericSizes], []);

  const colorOptions = language === 'AR' ? arColors : enColors;

  return (
    <div className='min-h-screen bg-slate-50 py-8 md:py-12'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center mb-8'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair'>
              {t('createProduct.title')}
            </h1>
            <p className='max-w-[700px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              {t('createProduct.description')}
            </p>
            {/* NEW: subscription type display */}
            {uploadLimits?.subscriptionType && (
              <p className='text-sm text-slate-600'>
                Subscription:{' '}
                <span className='font-medium'>
                  {uploadLimits.subscriptionType}
                </span>
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='max-w-4xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Left Column - Images */}
            <div className='md:col-span-1'>
              <Card>
                <CardHeader>
                  <CardTitle>{t('createProduct.images.title')}</CardTitle>
                  <CardDescription>
                    {t('createProduct.images.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {/* Image upload area */}
                    <div className='border-2 border-dashed border-slate-200 rounded-lg p-4 text-center'>
                      <input
                        type='file'
                        id='images'
                        multiple
                        accept={canUploadVideos ? `image/*,video/*` : `image/*`}
                        className='hidden'
                        onChange={handleImageUpload}
                      />
                      <label
                        htmlFor='images'
                        className='flex flex-col items-center justify-center gap-2 cursor-pointer py-4'
                      >
                        <Upload className='h-8 w-8 text-slate-400' />
                        <span className='text-sm font-medium text-slate-9 00'>
                          {t('createProduct.images.uploadText')}
                        </span>
                        <span className='text-xs text-slate-500'>
                          {t('createProduct.images.uploadHint')}
                        </span>
                        <span className='text-xs text-slate-500'>
                          Limit: {maxImagesLimit} media
                        </span>
                      </label>
                    </div>

                    {/* Image/Video previews */}
                    {files.length > 0 && (
                      <div className='space-y-2'>
                        <p className='text-sm font-medium'>
                          {t('createProduct.images.uploadedImages')} (
                          {files.length}/{maxImagesLimit})
                        </p>
                        <div className='grid grid-cols-2 gap-2'>
                          {files.map((fileOrUrl, index) => {
                            const src =
                              typeof fileOrUrl === 'string'
                                ? fileOrUrl
                                : URL.createObjectURL(fileOrUrl);

                            const isVideo =
                              typeof fileOrUrl === 'string'
                                ? /\.(mp4|webm|ogg)$/i.test(fileOrUrl)
                                : fileOrUrl.type.startsWith('video');

                            return (
                              <div key={index} className='relative group'>
                                <div className='aspect-square relative rounded-md overflow-hidden bg-gray-100'>
                                  {isVideo ? (
                                    <video
                                      src={src}
                                      controls
                                      className='w-full h-full object-cover'
                                    />
                                  ) : (
                                    <Image
                                      src={src || '/placeholder.svg'}
                                      alt={`Media ${index + 1}`}
                                      fill
                                      className='object-cover'
                                    />
                                  )}
                                </div>
                                <button
                                  type='button'
                                  onClick={() => removeImage(index)}
                                  className='absolute top-1 right-1 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                                >
                                  <X className='h-4 w-4 text-red-500' />
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

              <Card className='mt-6'>
                <CardHeader>
                  <CardTitle>{t('createProduct.dressType.title')}</CardTitle>
                  <CardDescription>
                    {t('createProduct.dressType.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={dressType}
                    onValueChange={(value) => setValue('type', value)}
                    className='space-y-3'
                  >
                    {/* NEW: Respect canAddNewDresses */}
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem
                        value='new'
                        id='type-new'
                        disabled={!canAddNewDresses}
                      />
                      <Label htmlFor='type-new' className='flex items-center'>
                        <span className='bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2'>
                          {t('createProduct.dressType.new.label')}
                        </span>
                        {t('createProduct.dressType.new.description')}
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='used' id='type-used' />
                      <Label htmlFor='type-used' className='flex items-center'>
                        <span className='bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2'>
                          {t('createProduct.dressType.used.label')}
                        </span>
                        {t('createProduct.dressType.used.description')}
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='rental' id='type-rental' />
                      <Label
                        htmlFor='type-rental'
                        className='flex items-center'
                      >
                        <span className='bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2'>
                          {t('createProduct.dressType.rental.label')}
                        </span>
                        {t('createProduct.dressType.rental.description')}
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className='md:col-span-2 space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>{t('createProduct.basicInfo.title')}</CardTitle>
                  <CardDescription>
                    {t('createProduct.basicInfo.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Dress Name */}
                  <div className='space-y-2'>
                    <Label htmlFor='name'>
                      {t('createProduct.basicInfo.name.label')}{' '}
                      <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='name'
                      {...register('name')}
                      placeholder={t(
                        'createProduct.basicInfo.name.placeholder'
                      )}
                    />
                    {errors.name && (
                      <p className='text-sm text-red-500'>
                        {t(errors.name.message as string)}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className='space-y-2'>
                    <Label htmlFor='description'>
                      {t('createProduct.basicInfo.description.label')}{' '}
                      <span className='text-red-500'>*</span>
                    </Label>
                    <Textarea
                      id='description'
                      {...register('description')}
                      placeholder={t(
                        'createProduct.basicInfo.description.placeholder'
                      )}
                      rows={4}
                    />
                    {errors.description && (
                      <p className='text-sm text-red-500'>
                        {t(errors.description.message as string)}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className='space-y-2'>
                    <Label htmlFor='category'>
                      {t('createProduct.basicInfo.category.label')}{' '}
                      <span className='text-red-500'>*</span>
                    </Label>
                    <Select
                      value={watch('category')}
                      onValueChange={(value) => setValue('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            'createProduct.basicInfo.category.placeholder'
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category: any) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className='text-sm text-red-500'>
                        {t(errors.category.message as string)}
                      </p>
                    )}
                  </div>

                  {/* Price Information */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                    <div className='space-y-2'>
                      <Label htmlFor='price'>
                        {t('createProduct.basicInfo.price.label')} (
                        {selectedCurrency.code})
                        {dressType === 'rental' &&
                          ` / ${t('createProduct.perDay')}`}{' '}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <div className='relative'>
                        {/* <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" /> */}
                        <Input
                          id='price'
                          type='number'
                          min='0'
                          step='0.01'
                          placeholder={t(
                            'createProduct.basicInfo.price.placeholder'
                          )}
                          className='pl-9'
                          // {...register("price", { valueAsNumber: true })}
                          {...register('price', {
                            required: 'Price is required',
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      {errors.price && (
                        <p className='text-sm text-red-500'>
                          {t(errors.price.message as string)}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='oldPrice'>
                          {t('createProduct.basicInfo.oldPrice.label')} (
                          {selectedCurrency.code})
                          {dressType === 'rental' &&
                            ` / ${t('createProduct.perDay')}`}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className='h-4 w-4 text-slate-400' />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className='w-[200px] text-xs'>
                                {t('createProduct.basicInfo.oldPrice.tooltip')}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className='relative'>
                        <Input
                          id='oldPrice'
                          type='number'
                          min='0'
                          step='0.01'
                          placeholder='0.00'
                          className='pl-9'
                          {...register('oldPrice', { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('createProduct.specifications.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('createProduct.specifications.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Sizes - now shown per selected color; hidden until a color is selected */}
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <Label>
                        {t('createProduct.specifications.sizes.label')}{' '}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <Button
                        type='button'
                        variant='link'
                        className='text-gold p-0 h-auto'
                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                      >
                        {t('createProduct.specifications.sizes.guide')}
                      </Button>
                    </div>

                    {showSizeGuide && (
                      <div className='bg-slate-50 p-3 rounded-md text-sm mb-2'>
                        <h4 className='font-medium mb-1'>
                          {t('createProduct.specifications.sizes.guide')}
                        </h4>
                        <div className='grid grid-cols-4 gap-2 text-xs'>
                          <div>
                            {t(
                              'createProduct.specifications.sizes.guideContent.xs'
                            )}
                          </div>
                          <div>
                            {t(
                              'createProduct.specifications.sizes.guideContent.s'
                            )}
                          </div>
                          <div>
                            {t(
                              'createProduct.specifications.sizes.guideContent.m'
                            )}
                          </div>
                          <div>
                            {t(
                              'createProduct.specifications.sizes.guideContent.l'
                            )}
                          </div>
                          <div>
                            {t(
                              'createProduct.specifications.sizes.guideContent.xl'
                            )}
                          </div>
                          <div>
                            {t(
                              'createProduct.specifications.sizes.guideContent.xxl'
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedColors.length === 0 ? (
                      <p className='text-sm text-slate-500'>
                        {t('createProduct.specifications.colors.label')} —
                        please select at least one color to choose sizes.
                      </p>
                    ) : (
                      <div className='space-y-6'>
                        {selectedColors.map((color: string) => (
                          <div key={color} className='border rounded-md p-3'>
                            <div className='flex items-center justify-between mb-3'>
                              <div className='flex items-center gap-2'>
                                <span
                                  className='h-4 w-4 rounded-full border'
                                  style={{
                                    backgroundColor:
                                      colorOptions.find(
                                        (c) => c.value === color
                                      )?.hex || '#ddd',
                                  }}
                                />
                                <span className='font-medium'>{color}</span>
                              </div>
                            </div>

                            {/* Color description */}
                            <div className='mb-3'>
                              <Label className='text-xs'>
                                Color Description
                              </Label>
                              <Input
                                value={colorDetails[color]?.description || ''}
                                onChange={(e) =>
                                  setColorDetails((prev) => ({
                                    ...prev,
                                    [color]: {
                                      ...(prev[color] || {
                                        description: '',
                                        quantities: {},
                                      }),
                                      description: e.target.value,
                                    },
                                  }))
                                }
                                placeholder='e.g., Dark red'
                              />
                            </div>

                            {/* Sizes for this color */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                              {sizeOptions.map((size) => {
                                const checked =
                                  !!colorDetails[color]?.quantities?.[size] ||
                                  colorDetails[color]?.quantities?.[size] === 0;
                                const qty =
                                  colorDetails[color]?.quantities?.[size] ?? 0;
                                return (
                                  <div
                                    key={`${color}-${size}`}
                                    className='flex items-center gap-2'
                                  >
                                    <Checkbox
                                      id={`size-${color}-${size}`}
                                      checked={checked}
                                      onCheckedChange={(c) => {
                                        setColorDetails((prev) => {
                                          const current = prev[color] || {
                                            description: '',
                                            quantities: {},
                                          };
                                          const nextQuantities = {
                                            ...current.quantities,
                                          };
                                          if (c) {
                                            if (!(size in nextQuantities))
                                              nextQuantities[size] = 0;
                                          } else {
                                            delete nextQuantities[size];
                                          }
                                          // update global sizes
                                          const sizesSet = new Set(
                                            Object.values({
                                              ...prev,
                                              [color]: {
                                                ...current,
                                                quantities: nextQuantities,
                                              },
                                            })
                                              .map((cd) =>
                                                Object.keys(cd.quantities)
                                              )
                                              .flat()
                                          );
                                          setValue(
                                            'sizes',
                                            Array.from(sizesSet)
                                          );
                                          return {
                                            ...prev,
                                            [color]: {
                                              ...current,
                                              quantities: nextQuantities,
                                            },
                                          };
                                        });
                                      }}
                                    />
                                    <Label
                                      htmlFor={`size-${color}-${size}`}
                                      className='mr-2'
                                    >
                                      {size}
                                    </Label>
                                    {checked && (
                                      <Input
                                        type='number'
                                        min={0}
                                        className='h-8 w-24'
                                        value={qty}
                                        onChange={(e) => {
                                          const val = Number(
                                            e.target.value || 0
                                          );
                                          setColorDetails((prev) => {
                                            const current = prev[color] || {
                                              description: '',
                                              quantities: {},
                                            };
                                            const nextQuantities = {
                                              ...current.quantities,
                                              [size]: val,
                                            };
                                            // update global sizes list (keep if >0 or keep presence)
                                            const sizesSet = new Set(
                                              Object.values({
                                                ...prev,
                                                [color]: {
                                                  ...current,
                                                  quantities: nextQuantities,
                                                },
                                              })
                                                .map((cd) =>
                                                  Object.keys(cd.quantities)
                                                )
                                                .flat()
                                            );
                                            setValue(
                                              'sizes',
                                              Array.from(sizesSet)
                                            );
                                            return {
                                              ...prev,
                                              [color]: {
                                                ...current,
                                                quantities: nextQuantities,
                                              },
                                            };
                                          });
                                        }}
                                        placeholder='Qty'
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.sizes && (
                      <p className='text-sm text-red-500'>
                        {t(errors.sizes.message as string)}
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Colors */}
                  <div className='space-y-3'>
                    <Label>
                      {t('createProduct.specifications.colors.label')}{' '}
                      <span className='text-red-500'>*</span>
                    </Label>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
                      {colorOptions.map((color) => (
                        <div
                          key={color.name}
                          className='flex items-center space-x-2'
                        >
                          <Checkbox
                            id={`color-${color.name}`}
                            checked={watch('colors').includes(color.value)}
                            onCheckedChange={(checked) => {
                              const colors = watch('colors');
                              if (checked) {
                                setValue('colors', [...colors, color.value]);
                                setColorDetails((prev) => ({
                                  ...prev,
                                  [color.value]: prev[color.value] || {
                                    description: '',
                                    quantities: {},
                                  },
                                }));
                              } else {
                                setValue(
                                  'colors',
                                  colors.filter((c) => c !== color.value)
                                );
                                setColorDetails((prev) => {
                                  const next = { ...prev };
                                  delete next[color.value];
                                  return next;
                                });
                              }
                            }}
                          />
                          <Label
                            htmlFor={`color-${color.name}`}
                            className='flex items-center gap-2'
                          >
                            <span
                              className='h-4 w-4 rounded-full border'
                              style={{ backgroundColor: color.hex }}
                            />
                            {color.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.colors && (
                      <p className='text-sm text-red-500'>
                        {t(errors.colors.message as string)}
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Material and Care */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='material'>
                        {t('createProduct.specifications.material.label')}{' '}
                      </Label>
                      <Input
                        id='material'
                        {...register('material')}
                        placeholder={t(
                          'createProduct.specifications.material.placeholder'
                        )}
                      />
                      {errors.material && (
                        <p className='text-sm text-red-500'>
                          {t(errors.material.message as string)}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='careInstructions'>
                        {t(
                          'createProduct.specifications.careInstructions.label'
                        )}
                      </Label>
                      <Input
                        id='careInstructions'
                        {...register('careInstructions')}
                        placeholder={t(
                          'createProduct.specifications.careInstructions.placeholder'
                        )}
                      />
                      {errors.careInstructions && (
                        <p className='text-sm text-red-500'>
                          {t(errors.careInstructions.message as string)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Measurements */}
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='chest'>
                        {t('createProduct.specifications.measurements.chest')}
                      </Label>
                      <Input
                        id='chest'
                        type='number'
                        min='0'
                        step='0.5'
                        {...register('chest', { valueAsNumber: true })}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='waist'>
                        {t('createProduct.specifications.measurements.waist')}
                      </Label>
                      <Input
                        id='waist'
                        type='number'
                        min='0'
                        step='0.5'
                        {...register('waist', { valueAsNumber: true })}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='hip'>
                        {t('createProduct.specifications.measurements.hip')}
                      </Label>
                      <Input
                        id='hip'
                        type='number'
                        min='0'
                        step='0.5'
                        {...register('hip', { valueAsNumber: true })}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='shoulder'>
                        {t(
                          'createProduct.specifications.measurements.shoulder'
                        )}
                      </Label>
                      <Input
                        id='shoulder'
                        type='number'
                        min='0'
                        step='0.5'
                        {...register('shoulder', {
                          valueAsNumber: true,
                          setValueAs: (v) => (v === '' ? null : v),
                        })}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='high'>
                        {t('createProduct.specifications.measurements.height')}
                      </Label>
                      <Input
                        id='high'
                        type='number'
                        min='0'
                        step='0.5'
                        {...register('high', { valueAsNumber: true })}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='length'>
                        {t('createProduct.specifications.measurements.length')}
                      </Label>
                      <Input
                        id='length'
                        type='number'
                        min='0'
                        step='0.5'
                        {...register('length', { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='sleeve'
                        {...register('sleeve')}
                        onCheckedChange={(checked) => {
                          const check = watch('sleeve');
                          if (checked) {
                            setValue('sleeve', true);
                          } else {
                            setValue('sleeve', false);
                          }
                        }}
                      />
                      <Label htmlFor='sleeve'>
                        {t('createProduct.specifications.options.sleeve')}
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='underlay'
                        {...register('underlay')}
                        onCheckedChange={(checked) => {
                          const check = watch('underlay');
                          if (checked) {
                            setValue('underlay', true);
                          } else {
                            setValue('underlay', false);
                          }
                        }}
                      />
                      <Label htmlFor='underlay'>
                        {t('createProduct.specifications.options.underlay')}
                      </Label>
                    </div>
                  </div>

                  {/* Rental Information */}

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'></div>

                  {/* Quantity and Reference */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='qty'>
                        {t('createProduct.specifications.quantity.label')}{' '}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='qty'
                        type='number'
                        min='1'
                        {...register('qty', { valueAsNumber: true })}
                        readOnly
                      />
                      {errors.qty && (
                        <p className='text-sm text-red-500'>
                          {t(errors.qty.message as string)}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='ref'>
                        {t('createProduct.specifications.reference.label')}{' '}
                      </Label>
                      <Input
                        id='ref'
                        {...register('ref')}
                        placeholder={t(
                          'createProduct.specifications.reference.placeholder'
                        )}
                      />
                      {errors.ref && (
                        <p className='text-sm text-red-500'>
                          {t(errors.ref.message as string)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* State */}
                  <div className='space-y-2'>
                    <Label htmlFor='state'>
                      {t('createProduct.specifications.city.label')}{' '}
                      <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='state'
                      {...register('state')}
                      placeholder={t(
                        'createProduct.specifications.city.placeholder'
                      )}
                    />
                    {errors.state && (
                      <p className='text-sm text-red-500'>
                        {t(errors.state.message as string)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='space-y-4'>
                  <div className='flex items-center space-x-2 pt-2'>
                    <Checkbox
                      id='terms'
                      {...register('terms')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setValue('terms', true);
                        } else {
                          setValue('terms', false);
                        }
                      }}
                    />
                    <Label htmlFor='terms' className='text-sm'>
                      {t('createProduct.terms.agree')}{' '}
                      <Link href='#' className='text-gold hover:underline'>
                        {t('createProduct.terms.terms')}
                      </Link>{' '}
                      <Link href='#' className='text-gold hover:underline'>
                        {t('createProduct.terms.privacy')}
                      </Link>
                    </Label>
                  </div>
                  {errors.terms && (
                    <p className='text-sm text-red-500'>
                      {t(errors.terms.message as string)}
                    </p>
                  )}
                </CardContent>
                <CardFooter className='flex justify-between'>
                  <Button
                    variant='outline'
                    type='button'
                    onClick={() => router.back()}
                  >
                    {t('createProduct.actions.cancel')}
                  </Button>
                  <Button
                    type='submit'
                    className='bg-black hover:bg-black/90 text-white'
                    disabled={isSubmitting}
                  >
                    <Upload className='h-4 w-4 mr-2' />
                    {isSubmitting
                      ? 'Uploading...'
                      : t('createProduct.actions.publish')}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
