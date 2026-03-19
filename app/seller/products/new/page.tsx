'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/context';
import { AuthService } from '@/services/auth';
import { createProductSchema } from '@/validation/product';
import { useFormValidation } from '@/hooks/useFormValidation';
import FormField from '@/components/formField';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function NewProduct() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthContext();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE'>('DRAFT');

  const form = useFormValidation({
    schema: createProductSchema,
    initialValues: {
      title: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      stock: 0,
    },
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'SELLER')) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, user, authLoading, router]);

  if (authLoading || !isAuthenticated || user?.role !== 'SELLER') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateAll()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token = AuthService.getToken();
      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form.values,
          price: Number(form.values.price),
          stock: Number(form.values.stock),
          status,
        }),
      });

      if (res.ok) {
        router.push('/seller/dashboard');
      } else {
        const data = await res.json();
        setSubmitError(data.error || 'Failed to create product');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleState = form.getFieldState('title');
  const descriptionState = form.getFieldState('description');
  const priceState = form.getFieldState('price');
  const imageState = form.getFieldState('image');
  const categoryState = form.getFieldState('category');
  const stockState = form.getFieldState('stock');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/seller/dashboard"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md" noValidate>
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{submitError}</div>
        )}

        <FormField
          label="Title"
          type="text"
          placeholder="Product name"
          {...form.getFieldProps('title')}
          error={titleState.error}
          hasError={titleState.hasError}
          isValid={titleState.isValid}
        />

        {/* Description textarea (manual since FormField is for inputs) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 transition-colors ${
              descriptionState.hasError
                ? 'border-red-500 focus:ring-red-500'
                : descriptionState.isValid
                  ? 'border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-black'
            }`}
            placeholder="Describe your product (min 10 characters)"
            value={form.values.description as string}
            onChange={e => {
              const syntheticEvent = {
                target: { name: 'description', value: e.target.value },
              } as React.ChangeEvent<HTMLInputElement>;
              form.handleChange(syntheticEvent);
            }}
            onBlur={() => {
              const syntheticEvent = {
                target: { name: 'description' },
              } as React.FocusEvent<HTMLInputElement>;
              form.handleBlur(syntheticEvent);
            }}
          />
          {descriptionState.hasError && (
            <p className="text-red-500 text-xs mt-1">{descriptionState.error}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Price ($)"
            type="number"
            placeholder="0.00"
            {...form.getFieldProps('price')}
            error={priceState.error}
            hasError={priceState.hasError}
            isValid={priceState.isValid}
          />
          <FormField
            label="Stock"
            type="number"
            placeholder="0"
            {...form.getFieldProps('stock')}
            error={stockState.error}
            hasError={stockState.hasError}
            isValid={stockState.isValid}
          />
        </div>

        <FormField
          label="Image URL"
          type="url"
          placeholder="https://example.com/image.jpg"
          {...form.getFieldProps('image')}
          error={imageState.error}
          hasError={imageState.hasError}
          isValid={imageState.isValid}
        />

        <FormField
          label="Category"
          type="text"
          placeholder="e.g. electronics, clothing"
          {...form.getFieldProps('category')}
          error={categoryState.error}
          hasError={categoryState.hasError}
          isValid={categoryState.isValid}
        />

        {/* Status selector */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Publish Status</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`py-2 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                status === 'DRAFT'
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setStatus('DRAFT')}
            >
              Save as Draft
            </button>
            <button
              type="button"
              className={`py-2 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                status === 'ACTIVE'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setStatus('ACTIVE')}
            >
              Publish Now
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-black disabled:bg-gray-400 text-white w-full rounded-lg py-3 hover:bg-gray-800 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

export default NewProduct;
