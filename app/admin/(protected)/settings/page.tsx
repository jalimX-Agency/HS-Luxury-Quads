import AdminShell from '@/components/admin/AdminShell';
import SettingsTabs from '@/components/admin/SettingsTabs';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export default async function AdminSettingsPage() {
  const session = await getAdminSession();

  const mediaRows = await prisma.siteSettings.findMany({
    where: { key: { in: ['hero_image_url', 'hero_image_key', 'hero_video_url', 'hero_video_key'] } },
  });
  const mediaSettings = Object.fromEntries(mediaRows.map((r) => [r.key, r.value]));

  return (
    <AdminShell
      title="Settings"
      description="Manage your account, security, and site media assets."
    >
      <SettingsTabs email={session?.email ?? ''} mediaSettings={mediaSettings} />
    </AdminShell>
  );
}
