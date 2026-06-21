'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { AdminAlert, AdminButton, labelClass } from '@/components/admin/AdminForm';
import { useAdminMutation } from '@/components/admin/AdminForm';

interface MediaSettings {
  hero_image_url?: string;
  hero_image_key?: string;
  hero_video_url?: string;
  hero_video_key?: string;
}

interface MediaManagerProps {
  settings: MediaSettings;
}

type UploadSlot = 'hero_image' | 'hero_video';

export default function MediaManager({ settings: initial }: MediaManagerProps) {
  const [settings, setSettings] = useState(initial);
  const { loading, error, success, run } = useAdminMutation();
  const [uploading, setUploading] = useState<UploadSlot | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File, slot: UploadSlot) => {
    setUploading(slot);
    setUploadError(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'hero' }),
      });
      if (!res.ok) throw new Error('Failed to get upload URL');
      const { data } = await res.json();

      const put = await fetch(data.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      if (!put.ok) throw new Error('Upload to R2 failed');

      // Save the new URL + key to DB
      await run(
        '/api/admin/media',
        {
          method: 'PATCH',
          body: JSON.stringify({
            [`${slot}_url`]: data.publicUrl,
            [`${slot}_key`]: data.key,
          }),
        },
        `${slot === 'hero_image' ? 'Hero image' : 'Hero video'} updated`,
      );

      setSettings((s) => ({
        ...s,
        [`${slot}_url`]: data.publicUrl,
        [`${slot}_key`]: data.key,
      }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(null);
      if (imageRef.current) imageRef.current.value = '';
      if (videoRef.current) videoRef.current.value = '';
    }
  };

  return (
    <div className="max-w-3xl space-y-10">
      {error && <AdminAlert message={error} />}
      {uploadError && <AdminAlert message={uploadError} />}
      {success && <AdminAlert message={success} type="success" />}

      {/* ── Hero Image ── */}
      <section className="border border-rule/30 bg-bg-subtle p-6 space-y-5">
        <div>
          <p className="font-syne text-[10px] uppercase tracking-widest text-gold mb-1">Hero Image</p>
          <p className="text-xs text-ink-faint">Used as the homepage hero background and video poster fallback.</p>
        </div>

        {settings.hero_image_url ? (
          <div className="relative h-48 w-full overflow-hidden border border-rule/20">
            <Image src={settings.hero_image_url} alt="Hero image" fill className="object-cover" />
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] px-2 py-1 font-syne tracking-wider uppercase">
              Current
            </span>
          </div>
        ) : (
          <div className="h-48 w-full border-2 border-dashed border-rule/30 flex items-center justify-center">
            <p className="text-xs text-ink-faint">No hero image set</p>
          </div>
        )}

        <div className="border-2 border-dashed border-rule/40 p-4 text-center">
          <input
            ref={imageRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, 'hero_image'); }}
            disabled={!!uploading}
          />
          <AdminButton
            type="button"
            variant="secondary"
            onClick={() => imageRef.current?.click()}
            disabled={!!uploading}
          >
            {uploading === 'hero_image' ? 'Uploading...' : settings.hero_image_url ? 'Replace image' : 'Upload image'}
          </AdminButton>
          <p className="text-xs text-ink-faint mt-2">JPEG, PNG, or WebP</p>
        </div>
      </section>

      {/* ── Hero Video ── */}
      <section className="border border-rule/30 bg-bg-subtle p-6 space-y-5">
        <div>
          <p className="font-syne text-[10px] uppercase tracking-widest text-gold mb-1">Hero Video</p>
          <p className="text-xs text-ink-faint">Autoplay muted loop shown on the homepage hero. MP4 only.</p>
        </div>

        {settings.hero_video_url ? (
          <div className="border border-rule/20 p-3 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0 text-gold" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            <p className="text-sm text-ink truncate">{settings.hero_video_url.split('/').pop()}</p>
            <span className="ml-auto text-[9px] font-syne uppercase tracking-wider text-green-400 flex-shrink-0">Uploaded</span>
          </div>
        ) : (
          <div className="h-20 w-full border-2 border-dashed border-rule/30 flex items-center justify-center">
            <p className="text-xs text-ink-faint">No hero video set</p>
          </div>
        )}

        <div className="border-2 border-dashed border-rule/40 p-4 text-center">
          <input
            ref={videoRef}
            type="file"
            accept="video/mp4"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, 'hero_video'); }}
            disabled={!!uploading}
          />
          <AdminButton
            type="button"
            variant="secondary"
            onClick={() => videoRef.current?.click()}
            disabled={!!uploading}
          >
            {uploading === 'hero_video' ? 'Uploading...' : settings.hero_video_url ? 'Replace video' : 'Upload video'}
          </AdminButton>
          <p className="text-xs text-ink-faint mt-2">MP4 · recommended 1920×1080, under 30 MB</p>
        </div>
      </section>
    </div>
  );
}
