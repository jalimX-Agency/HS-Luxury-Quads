import AdminShell from '@/components/admin/AdminShell';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';
import { getAdminSession } from '@/lib/admin-auth';

export default async function AdminSettingsPage() {
  const session = await getAdminSession();

  return (
    <AdminShell
      title="Account settings"
      description="Manage your admin account and security."
    >
      <div className="space-y-8">
        <div className="border border-rule/30 bg-bg-subtle p-6 max-w-lg">
          <p className="font-syne text-[10px] uppercase tracking-widest text-ink-faint">Signed in as</p>
          <p className="text-ink mt-2">{session?.email}</p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-ink mb-4">Change password</h3>
          <ChangePasswordForm />
        </div>
      </div>
    </AdminShell>
  );
}
