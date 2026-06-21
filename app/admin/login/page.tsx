import { redirect } from 'next/navigation';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminThemeToggle from '@/components/admin/AdminThemeToggle';
import { getAdminSession } from '@/lib/admin-auth';

export default async function AdminLoginPage() {
  if (await getAdminSession()) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md flex justify-end mb-4">
        <AdminThemeToggle className="px-3 py-2 border border-rule/30 hover:border-gold" />
      </div>
      <AdminLoginForm />
    </div>
  );
}
