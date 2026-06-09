import { prisma } from '@/lib/prisma';
import { handleApiError, jsonSuccess } from '@/lib/api-response';
import { serializeTour } from '@/lib/tours';

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      where: { isActive: true },
      orderBy: { priceAmount: 'asc' },
    });

    return jsonSuccess({
      tours: tours.map(serializeTour),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
