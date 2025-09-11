import React, { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

interface InputType extends React.ComponentPropsWithoutRef<"input"> {
  label: string
  type: string
  required: boolean
  name: string
  id: string
  disabled?: boolean
  multiLine?: boolean 
}
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  multiLine?: boolean 
}


const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { name, error, label, required, className,onChange,multiLine, ...rest },
  ref
) {
  return (
    <fieldset className={`flex flex-col ${className ? className : ''}`}>
      {label && 
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900 mb-2">
        {label}
      </label>
      
      }
      <div>
        {
          multiLine ? 
          <textarea
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={name}
            name={name}
            required={required}
            rows={4}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          />
          :
          <input
            ref={ref}
            {...rest}
            id={name}
            name={name}
            autoComplete="email"
            required={required}
            onChange={onChange}
            className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
  
          />

        }
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </fieldset>
  )
})

export default Input