// components/forms.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, DefaultValues } from 'react-hook-form';
import { z } from 'zod';
import Input from '@/components/input';
import Select from '@/components/select';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import countriesEn from 'react-phone-number-input/locale/en.json';
import { Button } from './ui/button';
import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

// --- START: Password Strength Meter Component ---
const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const rules = [
    { text: 'Minimum 8 characters', test: (p: string) => p.length >= 8 },
    { text: 'At least 1 uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { text: 'At least 1 lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { text: 'At least 1 number', test: (p: string) => /[0-9]/.test(p) },
    { text: 'At least 1 special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  const passedRulesCount = rules.filter(rule => rule.test(password)).length;
  let strengthText = 'Weak';
  let strengthColorClass = 'text-red-500';

  if (passedRulesCount === 5) {
    strengthText = 'Strong';
    strengthColorClass = 'text-green-500';
  } else if (passedRulesCount >= 3) {
    strengthText = 'Medium';
    strengthColorClass = 'text-yellow-500';
  }

  const ValidationItem = ({ isPassed, text }: { isPassed: boolean; text: string; }) => (
    <li className={`flex items-center text-sm transition-colors ${isPassed ? 'text-green-600' : 'text-gray-500'}`}>
      {isPassed ? <FiCheckCircle className="mr-2" /> : <FiXCircle className="mr-2" />}
      {text}
    </li>
  );

  return (
    <div className='mt-2 text-left'>
      <p className={`text-sm font-semibold mb-2 ${strengthColorClass}`}>Password strength: {strengthText}</p>
      <ul className="space-y-1">
        {rules.map(rule => <ValidationItem key={rule.text} isPassed={rule.test(password)} text={rule.text} />)}
      </ul>
    </div>
  );
};
// --- END: Password Strength Meter Component ---

type InputField = { type: 'Input'; name: string; label: string; inputType: string; multiLine?: boolean };
type SelectField = { type: 'Select'; name: string; label: string; options: { label: string; value: string }[]; defaultValue?: string };
type IconSelectorField = { type: 'IconSelector'; name: string; label: string; };
type PhoneField = { type: 'Phone'; name: string; label: string; defaultCountry?: string; };
type CountryField = { type: 'Country'; name: string; label: string; defaultValue?: string; };
export type Field = InputField | SelectField | IconSelectorField | PhoneField | CountryField;

interface FormProps<T extends z.ZodType<any, any>> {
  schema: T;
  formFields: Field[];
  onSubmit: (values: z.infer<T>) => void;
  isPending: boolean;
  buttonTitle: string;
  defaultValues?: DefaultValues<z.infer<T>>;
  fieldDir?: 'row' | 'column';
  showPasswordStrength?: boolean;
}

export default function Form<T extends z.ZodType<any, any>>({
  schema,
  formFields,
  onSubmit,
  isPending,
  defaultValues,
  fieldDir,
  buttonTitle,
  showPasswordStrength,
}: FormProps<T>) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
  });
  
  const passwordValue = watch('password' as any);

  const countryOptions = Object.entries(countriesEn)
    .filter(([code, label]) => !['ext.', 'Phone number country', 'Phone'].includes(label))
    .map(([value, label]) => ({ value, label }));

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
                  <div>
                    <Input
                      label={field.label}
                      type={field.inputType || 'text'}
                      {...controllerField}
                      error={errors?.[field.name as keyof typeof errors]?.message as string}
                      multiLine={field.multiLine}
                    />
                    {field.name === 'password' && showPasswordStrength && passwordValue && (
                      <PasswordStrengthMeter password={passwordValue} />
                    )}
                  </div>
                );
              }
              if (field.type === 'Select') {
                return <Select label={field.label} options={field.options || []} onSelect={controllerField.onChange} error={errors?.[field.name as keyof typeof errors]?.message as string} defaultValue={field.defaultValue} />;
              }
              if (field.type === 'Phone') {
                return (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <PhoneInput {...controllerField} international defaultCountry={'JO'} className="border rounded-md p-2 w-full" onChange={controllerField.onChange} value={controllerField.value} />
                    {errors?.[field.name as keyof typeof errors]?.message && <span className="text-xs text-red-600">{errors[field.name as keyof typeof errors]?.message as string}</span>}
                  </div>
                );
              }
              if (field.type === 'Country') {
                return <Select label={field.label} options={countryOptions} onSelect={controllerField.onChange} error={errors?.[field.name as keyof typeof errors]?.message as string} defaultValue={field.defaultValue || 'JO'} />;
              }
              return null;
            }}
          />
        ))}
      </div>
      <Button type="submit" disabled={isPending}>{buttonTitle}</Button>
    </form>
  );
}