import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/lib/auth';

// POST /api/auth/register
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // Validate role
    const validRoles = ['CUSTOMER', 'SELLER'];
    const userRole = validRoles.includes(role) ? role : 'CUSTOMER';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name,
        role: userRole,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    return NextResponse.json({
      success: true,
      user,
      token,
    });
  } catch (_error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
