import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { handleApiError, jsonError, jsonSuccess } from '@/lib/api-response';
import { deleteR2Object } from '@/lib/r2';
import { prisma } from '@/lib/prisma';
import { blogUpdateSchema } from '@/lib/validations/admin';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!post) return jsonError('Post not found', 404);
    return jsonSuccess({ post });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!existing) return jsonError('Post not found', 404);

    const body = await request.json();
    const data = blogUpdateSchema.parse(body);

    // Delete old R2 object if image is being replaced
    if (data.imageKey !== undefined && existing.imageKey && data.imageKey !== existing.imageKey) {
      await deleteR2Object(existing.imageKey).catch(() => {});
    }

    // Set publishedAt when transitioning to published
    const publishedAt =
      data.isPublished && !existing.isPublished
        ? new Date()
        : data.isPublished === false
        ? null
        : existing.publishedAt;

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: { ...data, publishedAt },
    });

    return jsonSuccess({ post });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!post) return jsonError('Post not found', 404);

    if (post.imageKey) {
      await deleteR2Object(post.imageKey).catch(() => {});
    }

    await prisma.blogPost.delete({ where: { id: params.id } });
    return jsonSuccess({ message: 'Post deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
