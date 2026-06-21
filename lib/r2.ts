import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_URL!

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

export function generateKey(folder: string, filename: string): string {
  const sanitized = filename
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-')
  return `${folder}/${Date.now()}-${sanitized}`
}

export async function generatePresignedUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(r2Client, command, { expiresIn: 60 })
}

export function getPublicUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`
}

export async function deleteR2Object(key: string): Promise<void> {
  await r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }))
}

export const ALLOWED_FOLDERS = ['tours', 'gallery', 'hero', 'team'] as const
export const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
] as const

export type R2Folder = (typeof ALLOWED_FOLDERS)[number]
