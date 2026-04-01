import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// POST /api/checkout - Convert cart to order
export async function POST(request: Request) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's active cart with items
    const cart = await prisma.cart.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
      include: {
        items: true,
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total
    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order and decrement stock for seller products
    const order = await prisma.$transaction(async tx => {
      // Decrement stock for seller products
      for (const item of cart.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { id: true, stock: true },
        });
        if (product) {
          if (product.stock < (item.quantity || 1)) {
            throw new Error(`Insufficient stock for "${item.title}"`);
          }
          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: item.quantity || 1 } },
          });
        }
      }

      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          cartId: cart.id,
          totalAmount,
          status: 'COMPLETED',
        },
      });

      // Mark cart as converted
      await tx.cart.update({
        where: { id: cart.id },
        data: { status: 'CONVERTED' },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        items: cart.items,
      },
    });
  } catch (_error) {
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
