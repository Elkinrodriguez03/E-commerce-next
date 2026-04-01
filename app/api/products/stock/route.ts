import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// POST /api/products/stock — Decrement stock for seller products after purchase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body as { items: { productId: string; quantity: number }[] };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    await prisma.$transaction(async tx => {
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { id: true, stock: true },
        });

        if (product) {
          const qty = item.quantity || 1;
          if (product.stock < qty) {
            throw new Error(`Insufficient stock for product ${product.id}`);
          }
          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: qty } },
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stock update failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
