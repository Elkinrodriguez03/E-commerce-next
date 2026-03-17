'use client';

import { useState } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  value: string;
  error: string;
  hasError: boolean;
  isValid: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  value,
  error,
  hasError,
  isValid,
  onChange,
  onBlur,
  children,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const borderClass = hasError
    ? 'border-red-500 focus:ring-red-500'
    : isValid
      ? 'border-green-500 focus:ring-green-500'
      : 'border-gray-300 focus:ring-black';

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={name}
          name={name}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 transition-colors ${borderClass} ${isPassword ? 'pr-20' : 'pr-10'}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
        />
        <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
          {hasError && <ExclamationCircleIcon className="h-5 w-5 text-red-500" />}
          {isValid && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
          {isPassword && (
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(prev => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>
      {hasError && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">{error}</p>}
      {children}
    </div>
  );
}

export default FormField;
