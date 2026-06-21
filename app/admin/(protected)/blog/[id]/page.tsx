import { notFound, redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import BlogForm from '@/components/admin/BlogForm';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: { id: string };
}

export default async function EditBlogPostPage({ params }: PageProps) {
  if (!(await getAdminSession())) redirect('/admin/login');

  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  const title = post.title as { en: string; fr: string };
  const excerpt = post.excerpt as { en: string; fr: string };
  const content = post.content as { en: string; fr: string };

  return (
    <AdminShell
      title={title.en || 'Edit Post'}
      description={`Last updated ${post.updatedAt.toLocaleDateString()}`}
    >
      <BlogForm
        mode="edit"
        postId={post.id}
        initial={{
          slug: post.slug,
          title,
          excerpt,
          content,
          image: post.image,
          imageKey: post.imageKey ?? '',
          category: post.category,
          author: post.author,
          featured: post.featured,
          isPublished: post.isPublished,
        }}
      />
    </AdminShell>
  );
}
