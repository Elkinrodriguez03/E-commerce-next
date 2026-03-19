'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context';
import { loginSchema } from '@/validation/auth';
import { useFormValidation } from '@/hooks/useFormValidation';
import FormField from '@/components/formField';
import { ShoppingBagIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

type LoginTab = 'customer' | 'seller';

const tabConfig = {
  customer: {
    icon: ShoppingBagIcon,
    label: 'Customer',
    subtitle: 'Browse and buy products',
    demoEmail: 'demo@ecommerce.com',
    demoHint: 'Demo: demo@ecommerce.com / password123',
    buttonLabel: 'Sign In as Customer',
    loadingLabel: 'Signing in...',
    accentBorder: 'border-black',
    accentBg: 'bg-black',
    accentText: 'text-black',
  },
  seller: {
    icon: BuildingStorefrontIcon,
    label: 'Seller',
    subtitle: 'Manage your store',
    demoEmail: 'seller@ecommerce.com',
    demoHint: 'Demo: seller@ecommerce.com / password123',
    buttonLabel: 'Sign In as Seller',
    loadingLabel: 'Signing in...',
    accentBorder: 'border-emerald-600',
    accentBg: 'bg-emerald-600 hover:bg-emerald-700',
    accentText: 'text-emerald-600',
  },
};

function SignIn() {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const redirecting = useRef(false);
  const [activeTab, setActiveTab] = useState<LoginTab>('customer');

  const form = useFormValidation({
    schema: loginSchema,
    initialValues: { email: '', password: '' },
  });

  if (isAuthenticated && !redirecting.current) {
    router.push('/');
    return null;
  }

  const config = tabConfig[activeTab];

  const handleTabSwitch = (tab: LoginTab) => {
    setActiveTab(tab);
    if (error) clearError();
  };

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
      const isSeller = response.user?.role === 'SELLER';
      const redirect = isSeller ? '/seller/dashboard?welcome=login' : '/?welcome=login';
      router.push(redirect);
    }
  };

  const emailState = form.getFieldState('email');
  const passwordState = form.getFieldState('password');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-6">Welcome Back</h1>

      {/* Role tabs */}
      <div className="flex w-full max-w-md mb-0">
        {(Object.entries(tabConfig) as [LoginTab, typeof tabConfig.customer][]).map(
          ([tab, cfg]) => {
            const Icon = cfg.icon;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabSwitch(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all border-b-2 ${
                  isActive
                    ? `${cfg.accentBorder} ${cfg.accentText}`
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                {cfg.label}
              </button>
            );
          }
        )}
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 pt-6 rounded-b-lg rounded-t-none shadow-md w-full max-w-md border-t border-gray-100"
        noValidate
      >
        {/* Tab subtitle */}
        <p className="text-center text-sm text-gray-500 mb-5">{config.subtitle}</p>

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
          className={`${config.accentBg} disabled:bg-gray-400 text-white w-full rounded-lg py-3 mb-3 transition-colors`}
          disabled={isLoading}
        >
          {isLoading ? config.loadingLabel : config.buttonLabel}
        </button>

        <p className="text-center text-xs text-gray-400">{config.demoHint}</p>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default SignIn;
