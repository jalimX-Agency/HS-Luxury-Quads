import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, jsonError, jsonSuccess } from '@/lib/api-response';
import {
  adminCookieOptions,
  ADMIN_COOKIE,
  createAdminSessionToken,
} from '@/lib/admin-auth';
import { verifyPassword } from '@/lib/password';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return jsonError('Invalid email or password', 401);
    }

    const response = jsonSuccess({
      message: 'Logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    response.cookies.set(
      ADMIN_COOKIE,
      await createAdminSessionToken({ userId: user.id, email: user.email }),
      adminCookieOptions(),
    );

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, data: { message: 'Logged out' } });
  response.cookies.set(ADMIN_COOKIE, '', { ...adminCookieOptions(0), maxAge: 0 });
  return response;
}
