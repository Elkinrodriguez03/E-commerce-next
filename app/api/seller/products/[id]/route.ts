import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { withRole } from '@/lib/middleware';

// GET /api/seller/products/[id] — Get a single product
export const GET = withRole(['SELLER'], async (_request, user, params) => {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  const product = await prisma.product.findFirst({
    where: { id, sellerId: user.id },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
});

// PUT /api/seller/products/[id] — Update a product
export const PUT = withRole(['SELLER'], async (request, user, params) => {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  // Verify ownership
  const existing = await prisma.product.findFirst({
    where: { id, sellerId: user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const body = await request.json();
  const { title, description, price, image, category, stock, status } = body;

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = Number(price);
  if (image !== undefined) updateData.image = image;
  if (category !== undefined) updateData.category = category;
  if (stock !== undefined) updateData.stock = Number(stock);
  if (status !== undefined) updateData.status = status;

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(product);
});

// DELETE /api/seller/products/[id] — Delete a product
export const DELETE = withRole(['SELLER'], async (_request, user, params) => {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  // Verify ownership
  const existing = await prisma.product.findFirst({
    where: { id, sellerId: user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
});
