import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { adminButtonClass } from '@/lib/admin-styles';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export default async function AdminBlogPage() {
  if (!(await getAdminSession())) redirect('/admin/login');

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminShell
      title="Blog"
      description="Publish SEO articles to attract organic traffic."
      actions={
        <Link href="/admin/blog/new" className={adminButtonClass('primary')}>
          New post
        </Link>
      }
    >
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-display text-xl text-ink mb-2">No posts yet</p>
          <p className="text-sm text-ink-faint mb-6">Create your first blog post to start driving organic traffic.</p>
          <Link href="/admin/blog/new" className={adminButtonClass('primary')}>
            Write first post
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-rule/20">
          {posts.map((post) => {
            const title = post.title as { en: string; fr: string };
            const excerpt = post.excerpt as { en: string; fr: string };
            return (
              <div key={post.id} className="flex items-start gap-5 py-5">
                {/* Cover image */}
                <div className="w-24 h-16 flex-shrink-0 bg-bg-sunken overflow-hidden relative">
                  {post.image ? (
                    <Image src={post.image} alt={title.en} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18M9 21V9" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block font-syne text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 ${post.isPublished ? 'bg-green-900/30 text-green-400' : 'bg-bg-sunken text-ink-faint'}`}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                    {post.category && (
                      <span className="font-syne text-[9px] tracking-wider uppercase text-ink-faint">{post.category}</span>
                    )}
                  </div>
                  <p className="font-display text-base text-ink truncate">{title.en}</p>
                  <p className="font-sans text-xs text-ink-faint truncate mt-0.5">{excerpt.en}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {post.isPublished && (
                    <Link
                      href={`/en/blog/${post.slug}`}
                      target="_blank"
                      className="font-syne text-[10px] tracking-wider uppercase text-ink-faint hover:text-gold transition-colors"
                    >
                      View ↗
                    </Link>
                  )}
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className={adminButtonClass('secondary')}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
