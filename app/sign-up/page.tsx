'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context';
import { registerSchema, type RegisterFormData } from '@/validation/auth';

function SignUp() {
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthContext();
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (isAuthenticated) {
    router.push('/');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0];
        if (typeof field === 'string') {
          errors[field] = issue.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    const response = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (response.success) {
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-6">Create Account</h1>
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black ${
              validationErrors.name ? 'border-red-500' : ''
            }`}
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleInputChange}
            autoComplete="name"
          />
          {validationErrors.name && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black ${
              validationErrors.email ? 'border-red-500' : ''
            }`}
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="email"
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black ${
              validationErrors.password ? 'border-red-500' : ''
            }`}
            placeholder="Create a password"
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="new-password"
          />
          {validationErrors.password && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black ${
              validationErrors.confirmPassword ? 'border-red-500' : ''
            }`}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            autoComplete="new-password"
          />
          {validationErrors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-black disabled:bg-gray-400 text-white w-full rounded-lg py-3 mb-4 hover:bg-gray-800 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
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
