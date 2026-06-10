import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = await getAdminSession();

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  return children;
}
