import AdminShell from '@/components/admin/AdminShell';
import GalleryManager from '@/components/admin/GalleryManager';
import { prisma } from '@/lib/prisma';

export default async function AdminGalleryPage() {
  const items = await prisma.gallery.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return (
    <AdminShell
      title="Gallery"
      description="Manage gallery images, alt text, and display order."
    >
      <GalleryManager
        items={items.map((item) => ({
          id: item.id,
          url: item.url,
          alt: item.alt as { en: string; fr: string },
          sortOrder: item.sortOrder,
          isActive: item.isActive,
        }))}
      />
    </AdminShell>
  );
}
