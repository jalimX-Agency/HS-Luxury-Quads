import { cookies } from 'next/headers';
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
  parseAdminSessionToken,
  type AdminSession,
} from '@/lib/admin-session';

export {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
  type AdminSession,
} from '@/lib/admin-session';

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return parseAdminSessionToken(token);
}
