import { handleApiError, jsonSuccess } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.gallery.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return jsonSuccess({
      gallery: items.map((item) => ({
        id: item.id,
        url: item.url,
        alt: item.alt,
        sortOrder: item.sortOrder,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
