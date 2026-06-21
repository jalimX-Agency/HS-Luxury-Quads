import { handleApiError, jsonSuccess } from '@/lib/api-response';
import { fetchActiveGallery } from '@/lib/queries';

export async function GET() {
  try {
    const gallery = await fetchActiveGallery();
    return jsonSuccess({ gallery });
  } catch (error) {
    return handleApiError(error);
  }
}
