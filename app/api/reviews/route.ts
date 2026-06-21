import { handleApiError, jsonSuccess } from '@/lib/api-response';
import { fetchPublishedReviews } from '@/lib/queries';

export async function GET() {
  try {
    const reviews = await fetchPublishedReviews();
    return jsonSuccess({ reviews });
  } catch (error) {
    return handleApiError(error);
  }
}
