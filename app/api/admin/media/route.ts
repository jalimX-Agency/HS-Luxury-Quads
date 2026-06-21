import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-api'
import { handleApiError, jsonSuccess } from '@/lib/api-response'
import { deleteR2Object } from '@/lib/r2'
import { prisma } from '@/lib/prisma'

const MEDIA_KEYS = [
  'hero_image_url',
  'hero_image_key',
  'hero_video_url',
  'hero_video_key',
] as const

const updateSchema = z.object({
  hero_image_url: z.string().url().optional().or(z.literal('')),
  hero_image_key: z.string().optional().or(z.literal('')),
  hero_video_url: z.string().url().optional().or(z.literal('')),
  hero_video_key: z.string().optional().or(z.literal('')),
})

async function getSettings() {
  const rows = await prisma.siteSettings.findMany({
    where: { key: { in: [...MEDIA_KEYS] } },
  })
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>
}

export async function GET(request: NextRequest) {
  const { response } = await requireAdmin(request)
  if (response) return response

  try {
    return jsonSuccess(await getSettings())
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest) {
  const { response } = await requireAdmin(request)
  if (response) return response

  try {
    const body = await request.json()
    const data = updateSchema.parse(body)

    const current = await getSettings()

    // Delete old R2 objects if being replaced
    if (data.hero_image_key !== undefined && current.hero_image_key && data.hero_image_key !== current.hero_image_key) {
      await deleteR2Object(current.hero_image_key).catch(() => {})
    }
    if (data.hero_video_key !== undefined && current.hero_video_key && data.hero_video_key !== current.hero_video_key) {
      await deleteR2Object(current.hero_video_key).catch(() => {})
    }

    // Upsert each provided key
    await Promise.all(
      Object.entries(data)
        .filter(([, v]) => v !== undefined)
        .map(([key, value]) =>
          prisma.siteSettings.upsert({
            where: { key },
            update: { value: value as string },
            create: { key, value: value as string },
          }),
        ),
    )

    return jsonSuccess(await getSettings())
  } catch (error) {
    return handleApiError(error)
  }
}
