import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { handleApiError, jsonError, jsonSuccess } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { galleryUpdateSchema } from '@/lib/validations/admin';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const item = await prisma.gallery.findUnique({ where: { id: params.id } });

    if (!item) {
      return jsonError('Gallery item not found', 404);
    }

    return jsonSuccess({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const body = await request.json();
    const data = galleryUpdateSchema.parse(body);

    const item = await prisma.gallery.update({
      where: { id: params.id },
      data,
    });

    return jsonSuccess({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    await prisma.gallery.delete({ where: { id: params.id } });
    return jsonSuccess({ message: 'Gallery item deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
