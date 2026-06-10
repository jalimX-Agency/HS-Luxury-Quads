import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { handleApiError, jsonSuccess } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { galleryWriteSchema } from '@/lib/validations/admin';

function serializeGallery(item: {
  id: string;
  url: string;
  alt: unknown;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: item.id,
    url: item.url,
    alt: item.alt,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const items = await prisma.gallery.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return jsonSuccess({
      gallery: items.map(serializeGallery),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const body = await request.json();
    const data = galleryWriteSchema.parse(body);

    const item = await prisma.gallery.create({
      data,
    });

    return jsonSuccess({ item: serializeGallery(item) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
