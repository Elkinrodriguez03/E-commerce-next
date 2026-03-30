'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/context';
import { AuthService } from '@/services/auth';
import { createProductSchema } from '@/validation/product';
import { useFormValidation } from '@/hooks/useFormValidation';
import FormField from '@/components/formField';
import LoadingSpinner from '@/components/loadingSpinner';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import ImageUpload from '@/components/imageUpload';

function EditProduct() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthContext();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE' | 'ARCHIVED'>('DRAFT');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'SELLER')) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    const fetchProduct = async () => {
      const token = AuthService.getToken();
      if (!token || !productId) return;

      try {
        const res = await fetch(`/api/seller/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const product = await res.json();
          // Populate form with existing data
          form.getFieldProps('title').onChange({
            target: { name: 'title', value: product.title },
          } as React.ChangeEvent<HTMLInputElement>);
          form.getFieldProps('description').onChange({
            target: { name: 'description', value: product.description },
          } as React.ChangeEvent<HTMLInputElement>);
          form.getFieldProps('price').onChange({
            target: { name: 'price', value: String(product.price) },
          } as React.ChangeEvent<HTMLInputElement>);
          form.getFieldProps('image').onChange({
            target: { name: 'image', value: product.image },
          } as React.ChangeEvent<HTMLInputElement>);
          form.getFieldProps('category').onChange({
            target: { name: 'category', value: product.category },
          } as React.ChangeEvent<HTMLInputElement>);
          form.getFieldProps('stock').onChange({
            target: { name: 'stock', value: String(product.stock) },
          } as React.ChangeEvent<HTMLInputElement>);
          setStatus(product.status);
        } else {
          setSubmitError('Product not found');
        }
      } catch {
        setSubmitError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'SELLER') {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, productId]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'SELLER') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateAll()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token = AuthService.getToken();
      const res = await fetch(`/api/seller/products/${productId}`, {
        method: 'PUT',
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
        setSubmitError(data.error || 'Failed to update product');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const token = AuthService.getToken();
    try {
      const res = await fetch(`/api/seller/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        router.push('/seller/dashboard');
      } else {
        setSubmitError('Failed to delete product');
      }
    } catch {
      setSubmitError('Network error');
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
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-6 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm transition-colors"
        >
          <TrashIcon className="h-4 w-4" />
          Delete
        </button>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 mb-3">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-transparent text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
            placeholder="Describe your product"
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

        <ImageUpload
          value={form.values.image as string}
          onChange={url => {
            const syntheticEvent = {
              target: { name: 'image', value: url },
            } as React.ChangeEvent<HTMLInputElement>;
            form.handleChange(syntheticEvent);
          }}
          error={imageState.error}
          hasError={imageState.hasError}
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
          <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
          <div className="grid grid-cols-3 gap-3">
            {(['DRAFT', 'ACTIVE', 'ARCHIVED'] as const).map(s => {
              const styles: Record<string, string> = {
                DRAFT: status === 'DRAFT' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : '',
                ACTIVE: status === 'ACTIVE' ? 'border-green-500 bg-green-50 text-green-700' : '',
                ARCHIVED: status === 'ARCHIVED' ? 'border-gray-500 bg-gray-50 text-gray-700' : '',
              };
              return (
                <button
                  key={s}
                  type="button"
                  className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    styles[s] || 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                  onClick={() => setStatus(s)}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="bg-emerald-600 disabled:bg-gray-400 text-white w-full rounded-lg py-3 hover:bg-emerald-700 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
