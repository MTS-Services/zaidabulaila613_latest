// components/forms.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, SubmitHandler, DefaultValues } from 'react-hook-form';
import { z } from 'zod';
import Input from '@/components/input';
import Select from '@/components/select';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import countries from 'react-phone-number-input/locale/en.json';
import { Button } from './ui/button';

type InputField = {
  type: 'Input';
  name: string;
  label: string;
  inputType: string;
  multiLine?: boolean
};

type SelectField = {
  type: 'Select';
  name: string;
  label: string;
  options: { label: string; value: string }[];
  defaultValue?: string
};
type IconSelectorField = {
  type: 'IconSelector';
  name: string;
  label: string;
};
type PhoneField = {
  type: 'Phone';
  name: string;
  label: string;
  defaultCountry?: string;
};
type CountryField = {
  type: 'Country';
  name: string;
  label: string;
  defaultValue?: string;
};

export type Field = InputField | SelectField | IconSelectorField | PhoneField | CountryField;

interface FormProps<T extends z.ZodType<any, any>> {
  schema: T;
  formFields: Field[];
  onSubmit: (values: z.infer<T>) => void;
  isPending: boolean;
  buttonTitle: string;
  defaultValues?: DefaultValues<z.infer<T>>;
  fieldDir?: 'row' | 'column'
}

// const countryOptions = Object.entries(countries).map(([value, label]) => ({
//   value,
//   label
// }));

const countryOptions = Object.entries(countries)
  .filter(([code, label]) => {
    // Exclude specific unwanted entries
    const unwantedLabels = [
      'ext.', 
      'Phone number country',
      'Phone'
    ];
    return !unwantedLabels.includes(label);
  })
  .map(([value, label]) => ({
    value,
    label
  }));

export default function Form<T extends z.ZodType<any, any>>({
  schema,
  formFields,
  onSubmit,
  isPending,
  defaultValues,
  fieldDir,
  buttonTitle
}: FormProps<T>) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className={`grid grid-cols-1 md:grid-cols-${fieldDir === "column" ? '1' : '2'} gap-4`}>

        {formFields.map((field: Field) => (
          <Controller
            key={field.name}
            name={field.name as any}
            control={control}
            render={({ field: controllerField }) => {

              if (field.type === 'Input') {
                return (
                  <div className=''>
                    <Input
                      label={field.label}
                      type={field.inputType || 'text'}
                      {...controllerField}
                      error={errors?.[field.name as keyof typeof errors]?.message as string}
                      multiLine={field.multiLine}

                    />
                  </div>
                );
              }

              if (field.type === 'Select') {
                return (
                  <div className=''>
                    <Select
                      label={field.label}
                      options={field.options || []}
                      onSelect={controllerField.onChange}
                      error={errors?.[field.name as keyof typeof errors]?.message as string}
                      defaultValue={field.defaultValue}
                    />

                  </div>
                );
              }

              if (field.type === 'Phone') {
                return (
                  <div className=''>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <PhoneInput
                      {...controllerField}
                      international
                      defaultCountry={'JO'}
                      className="border rounded-md p-2 w-full"
                      onChange={controllerField.onChange}
                      value={controllerField.value}
                    />
                    {errors?.[field.name as keyof typeof errors]?.message && (
                      // <p className="mt-1 text-sm text-red-600">
                      //   {errors[field.name as keyof typeof errors]?.message as string}
                      // </p>
                      <span className="text-xs text-red-600">{errors[field.name as keyof typeof errors]?.message as string}</span>
                    )}
                  </div>
                );
              }

              if (field.type === 'Country') {
                return (
                  <div className=''>
                    <Select
                      label={field.label}
                      options={countryOptions}
                      onSelect={controllerField.onChange}
                      error={errors?.[field.name as keyof typeof errors]?.message as string}
                      defaultValue={field.defaultValue || 'JO'}
                    />
                  </div>
                );
              }


              return <></>;
            }}
          />
        ))}
      </div>

      <Button type="submit" disabled={isPending}>{buttonTitle}</Button>
    </form>
  );
}
