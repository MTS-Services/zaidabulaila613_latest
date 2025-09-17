// import React, {
//   InputHTMLAttributes,
//   TextareaHTMLAttributes,
//   forwardRef,
// } from 'react';

// interface InputType extends React.ComponentPropsWithoutRef<'input'> {
//   label: string;
//   type: string;
//   required: boolean;
//   name: string;
//   id: string;
//   disabled?: boolean;
//   multiLine?: boolean;
// }
// interface Props extends InputHTMLAttributes<HTMLInputElement> {
//   error?: string;
//   label?: string;
//   multiLine?: boolean;
// }

// const Input = forwardRef<HTMLInputElement, Props>(function Input(
//   { name, error, label, required, className, onChange, multiLine, ...rest },
//   ref
// ) {
//   return (
//     <fieldset className={`flex flex-col ${className ? className : ''}`}>
//       {label && (
//         <label
//           htmlFor={name}
//           className='block text-sm font-medium leading-6 text-gray-900 mb-2'
//         >
//           {label}
//         </label>
//       )}
//       <div>
//         {multiLine ? (
//           <textarea
//             {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
//             ref={ref as React.Ref<HTMLTextAreaElement>}
//             id={name}
//             name={name}
//             required={required}
//             rows={4}
//             className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6'
//           />
//         ) : (
//           <input
//             ref={ref}
//             {...rest}
//             id={name}
//             name={name}
//             autoComplete='email'
//             required={required}
//             onChange={onChange}
//             className='block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6'
//           />
//         )}
//         {error && <span className='text-xs text-red-600'>{error}</span>}
//       </div>
//     </fieldset>
//   );
// });

// export default Input;

//==================================================// 9-13-2025

import React, {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  useState,
} from 'react';

interface InputType extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
  type: string;
  required: boolean;
  name: string;
  id: string;
  disabled?: boolean;
  multiLine?: boolean;
}
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  multiLine?: boolean;
}

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    name,
    error,
    label,
    required,
    className,
    onChange,
    multiLine,
    type,
    ...rest
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <fieldset className={`flex flex-col ${className ? className : ''}`}>
      {label && (
        <label
          htmlFor={name}
          className='block text-sm font-medium leading-6 text-gray-900 mb-2'
        >
          {label}
        </label>
      )}
      <div className='relative'>
        {multiLine ? (
          <textarea
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={name}
            name={name}
            required={required}
            rows={4}
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6'
          />
        ) : (
          <input
            ref={ref}
            {...rest}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            id={name}
            name={name}
            required={required}
            onChange={onChange}
            className='block w-full rounded-md border-0 py-1.5 px-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6'
          />
        )}
        {isPassword && (
          <button
            type='button'
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-2.117-2.117'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className='text-xs text-red-600'>{error}</span>}
    </fieldset>
  );
});

export default Input;
