import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(
  request: Request
): Promise<{ id: string; email: string; role: string } | null> {
  return new Promise(resolve => {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      resolve(null);
      return;
    }

    const token = authHeader.substring(7);

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err || !decoded) {
        resolve(null);
        return;
      }

      const { userId } = decoded as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true },
      });

      resolve(user);
    });
  });
}

export async function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true },
    });
  } catch {
    return null;
  }
}
