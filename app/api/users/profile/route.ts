import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// GET /api/users/profile - Get current user profile
export async function GET(request: Request) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            carts: true,
          },
        },
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userProfile);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT /api/users/profile - Update current user profile
export async function PUT(request: Request) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, password } = body;

    // Prepare update data
    const updateData: Record<string, string> = {};
    if (name) updateData.name = name;

    if (email && email !== user.email) {
      // Check if email is already taken
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
      updateData.email = email;
    }

    if (password) {
      const { hashPassword } = await import('@/lib/auth');
      updateData.password = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
