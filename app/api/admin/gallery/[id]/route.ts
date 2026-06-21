import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { handleApiError, jsonError, jsonSuccess } from '@/lib/api-response';
import { deleteR2Object } from '@/lib/r2';
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
    const existing = await prisma.gallery.findUnique({ where: { id: params.id } });

    if (!existing) {
      return jsonError('Gallery item not found', 404);
    }

    const body = await request.json();
    const data = galleryUpdateSchema.parse(body);

    // Delete old R2 object when the image is being replaced
    if (
      data.imageKey !== undefined &&
      existing.imageKey &&
      data.imageKey !== existing.imageKey
    ) {
      await deleteR2Object(existing.imageKey).catch(() => {});
    }

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
    const item = await prisma.gallery.findUnique({ where: { id: params.id } });

    if (!item) {
      return jsonError('Gallery item not found', 404);
    }

    // Delete from R2 if it was uploaded there
    if (item.imageKey) {
      try {
        await deleteR2Object(item.imageKey);
      } catch {
        // log but don't block deletion
        console.error('[Gallery DELETE] Failed to delete R2 object:', item.imageKey);
      }
    }

    await prisma.gallery.delete({ where: { id: params.id } });
    return jsonSuccess({ message: 'Gallery item deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
