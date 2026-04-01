'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/context';
import { AuthService } from '@/services/auth';
import { createProductSchema } from '@/validation/product';
import { useFormValidation } from '@/hooks/useFormValidation';
import FormField from '@/components/formField';
import ImageUpload from '@/components/imageUpload';
import SaveBar from '../../components/SaveBar';
import { ArrowLeft } from 'lucide-react';

export default function AdminNewProduct() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE'>('DRAFT');
  const [isDirty, setIsDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useFormValidation({
    schema: createProductSchema,
    initialValues: {
      title: '',
      description: '',
      price: '' as unknown as number,
      image: '',
      category: '',
      stock: '' as unknown as number,
    },
  });

  const trackDirty = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      form.handleChange(e);
      setIsDirty(true);
    },
    [form]
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        setIsDirty(false);
        router.push('/admin/products');
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

  const handleDiscard = () => {
    form.reset();
    setStatus('DRAFT');
    setIsDirty(false);
    setSubmitError(null);
  };

  if (!user || user.role !== 'SELLER') return null;

  const titleState = form.getFieldState('title');
  const descriptionState = form.getFieldState('description');
  const priceState = form.getFieldState('price');
  const imageState = form.getFieldState('image');
  const categoryState = form.getFieldState('category');
  const stockState = form.getFieldState('stock');

  return (
    <div className="pb-20">
      {/* Back link */}
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Products
      </Link>

      <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">Add product</h1>

      {submitError && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {submitError}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Title & Description section */}
        <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 space-y-4">
          <FormField
            label="Title"
            type="text"
            placeholder="Short sleeve t-shirt"
            {...form.getFieldProps('title')}
            onChange={trackDirty}
            error={titleState.error}
            hasError={titleState.hasError}
            isValid={titleState.isValid}
          />

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              className={`w-full text-sm border rounded-lg py-2.5 px-3 text-gray-700 focus:outline-none focus:ring-2 transition-colors resize-y ${
                descriptionState.hasError
                  ? 'border-red-400 focus:ring-red-200'
                  : descriptionState.isValid
                    ? 'border-emerald-400 focus:ring-emerald-200'
                    : 'border-gray-200 focus:ring-gray-200'
              }`}
              placeholder="Write a detailed product description..."
              value={form.values.description as string}
              onChange={e => {
                const syntheticEvent = {
                  target: { name: 'description', value: e.target.value },
                } as React.ChangeEvent<HTMLInputElement>;
                trackDirty(syntheticEvent);
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
        </section>

        {/* Media section */}
        <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Media</h2>
          <ImageUpload
            value={form.values.image as string}
            onChange={url => {
              const syntheticEvent = {
                target: { name: 'image', value: url },
              } as React.ChangeEvent<HTMLInputElement>;
              trackDirty(syntheticEvent);
            }}
            error={imageState.error}
            hasError={imageState.hasError}
          />
        </section>

        {/* Pricing section */}
        <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Pricing</h2>
          <div className="w-full sm:max-w-xs">
            <FormField
              label="Price"
              type="number"
              placeholder="0.00"
              {...form.getFieldProps('price')}
              onChange={trackDirty}
              error={priceState.error}
              hasError={priceState.hasError}
              isValid={priceState.isValid}
            />
          </div>
        </section>

        {/* Inventory section */}
        <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Inventory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Category"
              type="text"
              placeholder="e.g. electronics"
              {...form.getFieldProps('category')}
              onChange={trackDirty}
              error={categoryState.error}
              hasError={categoryState.hasError}
              isValid={categoryState.isValid}
            />
            <FormField
              label="Quantity"
              type="number"
              placeholder="0"
              {...form.getFieldProps('stock')}
              onChange={trackDirty}
              error={stockState.error}
              hasError={stockState.hasError}
              isValid={stockState.isValid}
            />
          </div>
        </section>

        {/* Status section */}
        <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Status</h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                status === 'DRAFT'
                  ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              }`}
              onClick={() => {
                setStatus('DRAFT');
                setIsDirty(true);
              }}
            >
              Draft
            </button>
            <button
              type="button"
              className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                status === 'ACTIVE'
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              }`}
              onClick={() => {
                setStatus('ACTIVE');
                setIsDirty(true);
              }}
            >
              Active
            </button>
          </div>
        </section>
      </form>

      <SaveBar
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onSave={() => handleSubmit()}
        onDiscard={handleDiscard}
      />
    </div>
  );
}
