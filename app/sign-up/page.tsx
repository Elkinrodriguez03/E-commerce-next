'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context';
import { registerSchema } from '@/validation/auth';
import { useFormValidation } from '@/hooks/useFormValidation';
import FormField from '@/components/formField';
import PasswordStrength from '@/components/passwordStrength';
import type { Role } from '@/types';

function SignUp() {
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const redirecting = useRef(false);
  const [role, setRole] = useState<Role>('CUSTOMER');

  const form = useFormValidation({
    schema: registerSchema,
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  if (isAuthenticated && !redirecting.current) {
    router.push('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.handleChange(e);
    if (error) clearError();
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.validateAll()) return;

    const response = await register({
      name: form.values.name,
      email: form.values.email,
      password: form.values.password,
      role,
    });

    if (response.success) {
      redirecting.current = true;
      const redirect = role === 'SELLER' ? '/admin?welcome=register' : '/?welcome=register';
      router.push(redirect);
    }
  };

  const nameState = form.getFieldState('name');
  const emailState = form.getFieldState('email');
  const passwordState = form.getFieldState('password');
  const confirmPasswordState = form.getFieldState('confirmPassword');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create Account</h1>
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        noValidate
      >
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
        )}

        {/* Role selector */}
        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-bold mb-2">I want to</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                role === 'CUSTOMER'
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setRole('CUSTOMER')}
            >
              Buy products
            </button>
            <button
              type="button"
              className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                role === 'SELLER'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setRole('SELLER')}
            >
              Sell products
            </button>
          </div>
        </div>

        <FormField
          label="Name"
          type="text"
          placeholder="Enter your name"
          autoComplete="name"
          {...form.getFieldProps('name')}
          onChange={handleChange}
          error={nameState.error}
          hasError={nameState.hasError}
          isValid={nameState.isValid}
        />

        <FormField
          label="Email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          {...form.getFieldProps('email')}
          onChange={handleChange}
          error={emailState.error}
          hasError={emailState.hasError}
          isValid={emailState.isValid}
        />

        <FormField
          label="Password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          {...form.getFieldProps('password')}
          onChange={handleChange}
          error={passwordState.error}
          hasError={passwordState.hasError}
          isValid={passwordState.isValid}
        >
          <PasswordStrength password={form.values.password} />
        </FormField>

        <FormField
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          {...form.getFieldProps('confirmPassword')}
          onChange={handleChange}
          error={confirmPasswordState.error}
          hasError={confirmPasswordState.hasError}
          isValid={confirmPasswordState.isValid}
        />

        <button
          type="submit"
          className={`${
            role === 'SELLER' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-black hover:bg-gray-800'
          } disabled:bg-gray-400 text-white w-full rounded-lg py-3 mb-4 transition-colors`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : role === 'SELLER' ? 'Sign Up as Seller' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
