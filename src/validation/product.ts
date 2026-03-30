import { z } from 'zod';

export const createProductSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  price: z.coerce
    .number({ message: 'Price must be a valid number' })
    .positive('Price must be greater than 0')
    .max(999999, 'Price must be less than $999,999'),
  image: z
    .string()
    .min(1, 'Image is required')
    .refine(val => val.startsWith('http') || val.startsWith('/uploads/'), {
      message: 'Must be a valid URL or uploaded image',
    }),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
  stock: z.coerce
    .number({ message: 'Stock must be a valid number' })
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
