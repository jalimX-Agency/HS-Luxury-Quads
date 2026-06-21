import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { handleApiError, jsonError, jsonSuccess } from '@/lib/api-response';
import { hashPassword, verifyPassword } from '@/lib/password';
import { prisma } from '@/lib/prisma';
import { changePasswordSchema } from '@/lib/validations/admin';

export async function POST(request: NextRequest) {
  const { response, session } = await requireAdmin(request);
  if (response) return response;
  if (!session) return jsonError('Unauthorized', 401);

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = changePasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return jsonError('User not found', 404);
    }

    const isValid = await verifyPassword(currentPassword, user.passwordHash);

    if (!isValid) {
      return jsonError('Current password is incorrect', 400);
    }

    if (currentPassword === newPassword) {
      return jsonError('New password must be different from the current password', 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(newPassword),
      },
    });

    return jsonSuccess({ message: 'Password updated successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
