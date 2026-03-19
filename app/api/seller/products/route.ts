import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { withRole } from '@/lib/middleware';

// GET /api/seller/products — List seller's own products
export const GET = withRole(['SELLER'], async (_request, user) => {
  const products = await prisma.product.findMany({
    where: { sellerId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(products);
});

// POST /api/seller/products — Create a new product
export const POST = withRole(['SELLER'], async (request, user) => {
  const body = await request.json();
  const { title, description, price, image, category, stock, status } = body;

  if (!title || !description || price == null || !image || !category) {
    return NextResponse.json(
      { error: 'Missing required fields: title, description, price, image, category' },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      sellerId: user.id,
      title,
      description,
      price: Number(price),
      image,
      category,
      stock: stock != null ? Number(stock) : 0,
      status: status || 'DRAFT',
    },
  });

  return NextResponse.json(product, { status: 201 });
});
