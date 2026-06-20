'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';
import MediaManager from '@/components/admin/MediaManager';

const tabs = [
  { id: 'account', label: 'Account' },
  { id: 'media', label: 'Media' },
] as const;

type TabId = (typeof tabs)[number]['id'];

interface SettingsTabsProps {
  email: string;
  mediaSettings: Record<string, string>;
}

export default function SettingsTabs({ email, mediaSettings }: SettingsTabsProps) {
  const [active, setActive] = useState<TabId>('account');

  return (
    <div className="max-w-4xl">
      {/* Tab bar */}
      <div className="flex border-b border-rule/30 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              'px-5 py-3 font-syne text-[11px] tracking-[0.14em] uppercase transition-colors border-b-2 -mb-px',
              active === tab.id
                ? 'border-gold text-gold'
                : 'border-transparent text-ink-muted hover:text-gold',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Account tab */}
      {active === 'account' && (
        <div className="space-y-8">
          <div className="border border-rule/30 bg-bg-subtle p-6 max-w-lg">
            <p className="font-syne text-[10px] uppercase tracking-widest text-ink-faint">Signed in as</p>
            <p className="text-ink mt-2">{email}</p>
          </div>
          <div>
            <h3 className="font-display text-2xl text-ink mb-4">Change password</h3>
            <ChangePasswordForm />
          </div>
        </div>
      )}

      {/* Media tab */}
      {active === 'media' && (
        <MediaManager settings={mediaSettings} />
      )}
    </div>
  );
}
