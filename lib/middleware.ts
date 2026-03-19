import { NextResponse } from 'next/server';
import { verifyToken } from './auth';

type AuthUser = { id: string; email: string; role: string };

type AuthHandler = (
  request: Request,
  user: AuthUser,
  params?: Record<string, string>
) => Promise<NextResponse>;

/**
 * Wraps an API route handler with JWT authentication.
 * Returns 401 if token is missing/invalid.
 */
export function withAuth(handler: AuthHandler) {
  return async (
    request: Request,
    context?: { params?: Promise<Record<string, string>> | Record<string, string> }
  ) => {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const params = context?.params ? await context.params : undefined;
    return handler(request, user, params);
  };
}

/**
 * Wraps an API route handler with JWT authentication + role check.
 * Returns 401 if not authenticated, 403 if wrong role.
 */
export function withRole(roles: string[], handler: AuthHandler) {
  return withAuth(async (request, user, params) => {
    if (!roles.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
    }
    return handler(request, user, params);
  });
}
