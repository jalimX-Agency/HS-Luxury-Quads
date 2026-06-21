import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import BlogForm from '@/components/admin/BlogForm';
import { getAdminSession } from '@/lib/admin-auth';

export default async function NewBlogPostPage() {
  if (!(await getAdminSession())) redirect('/admin/login');

  return (
    <AdminShell title="New Post" description="Write a new blog article.">
      <BlogForm mode="create" />
    </AdminShell>
  );
}
