import { handleApiError, jsonError, jsonSuccess } from '@/lib/api-response';
import { fetchTourBySlug } from '@/lib/queries';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const slug = params.slug?.trim();

    if (!slug) {
      return jsonError('Tour slug is required', 400);
    }

    const result = await fetchTourBySlug(slug);

    if (!result) {
      return jsonError('Tour not found', 404);
    }

    return jsonSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
