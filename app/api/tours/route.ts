import { handleApiError, jsonSuccess } from '@/lib/api-response';
import { fetchActiveTours } from '@/lib/queries';

export async function GET() {
  try {
    const tours = await fetchActiveTours();
    return jsonSuccess({ tours });
  } catch (error) {
    return handleApiError(error);
  }
}
