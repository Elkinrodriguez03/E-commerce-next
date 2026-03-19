import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/products — Public: list all active seller products
export async function GET() {
  try {
    const sellerProducts = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      include: {
        seller: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map to a consistent format compatible with the frontend Product type
    const products = sellerProducts.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
      stock: p.stock,
      sellerId: p.sellerId,
      sellerName: p.seller.name,
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
