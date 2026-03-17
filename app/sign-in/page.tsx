'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context';
import { loginSchema } from '@/validation/auth';
import { useFormValidation } from '@/hooks/useFormValidation';
import FormField from '@/components/formField';

function SignIn() {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const redirecting = useRef(false);

  const form = useFormValidation({
    schema: loginSchema,
    initialValues: { email: '', password: '' },
  });

  if (isAuthenticated && !redirecting.current) {
    router.push('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.handleChange(e);
    if (error) clearError();
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.validateAll()) return;

    const response = await login(form.values);
    if (response.success) {
      redirecting.current = true;
      router.push('/?welcome=login');
    }
  };

  const emailState = form.getFieldState('email');
  const passwordState = form.getFieldState('password');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        noValidate
      >
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
        )}

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
          placeholder="Enter your password"
          autoComplete="current-password"
          {...form.getFieldProps('password')}
          onChange={handleChange}
          error={passwordState.error}
          hasError={passwordState.hasError}
          isValid={passwordState.isValid}
        />

        <button
          type="submit"
          className="bg-black disabled:bg-gray-400 text-white w-full rounded-lg py-3 mb-4 hover:bg-gray-800 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
      <p className="mt-2 text-xs text-gray-500">Demo: demo@ecommerce.com / password123</p>
    </div>
  );
}

export default SignIn;
