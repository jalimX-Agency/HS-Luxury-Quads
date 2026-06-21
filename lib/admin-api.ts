import { NextRequest } from 'next/server';
import { jsonError } from '@/lib/api-response';
import { getAdminSessionFromRequest, type AdminSession } from '@/lib/admin-session';

export async function requireAdmin(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);

  if (!session) {
    return { response: jsonError('Unauthorized', 401), session: null as AdminSession | null };
  }

  return { response: null, session };
}
