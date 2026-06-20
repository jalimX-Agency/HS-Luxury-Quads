import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-api'
import { jsonSuccess, handleApiError } from '@/lib/api-response'
import { generateKey, generatePresignedUrl, getPublicUrl, ALLOWED_FOLDERS, ALLOWED_TYPES } from '@/lib/r2'

const uploadSchema = z.object({
  filename: z.string().min(1).max(200),
  contentType: z.enum(ALLOWED_TYPES),
  folder: z.enum(ALLOWED_FOLDERS),
})

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin(request)
  if (response) return response

  try {
    const body = await request.json()
    const { filename, contentType, folder } = uploadSchema.parse(body)

    const key = generateKey(folder, filename)
    const presignedUrl = await generatePresignedUrl(key, contentType)
    const publicUrl = getPublicUrl(key)

    return jsonSuccess({ presignedUrl, publicUrl, key })
  } catch (error) {
    return handleApiError(error)
  }
}
