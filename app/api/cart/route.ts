import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Get user's active cart
export async function GET(request: Request) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await prisma.cart.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(cart || { items: [] });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// Add item to cart
export async function POST(request: Request) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity, price, title, image, category } = body;

    // Get or create active cart
    let cart = await prisma.cart.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          status: 'ACTIVE',
        },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
      return NextResponse.json(updatedItem);
    }

    // Add new item
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        price,
        title,
        image,
        category,
      },
    });

    return NextResponse.json(cartItem);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}
