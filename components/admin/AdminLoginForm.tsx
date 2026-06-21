'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AdminAlert, AdminButton, inputClass, labelClass } from '@/components/admin/AdminForm';

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Login failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md border border-rule/30 bg-bg-subtle p-8 space-y-6">
      <div>
        <p className="font-syne text-[10px] font-semibold tracking-[0.22em] uppercase text-gold">
          HS Luxury Quads
        </p>
        <h1 className="font-display text-3xl text-ink mt-2">Admin login</h1>
        <p className="text-sm text-ink-muted mt-3">
          Sign in with your admin email and password.
        </p>
      </div>

      {error ? <AdminAlert message={error} /> : null}

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoComplete="email"
        />
      </div>

      <div>
        <label className={labelClass}>Password</label>
        <input
          type="password"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <AdminButton type="submit" disabled={loading} className="w-full">
        {loading ? 'Signing in...' : 'Sign in'}
      </AdminButton>
    </form>
  );
}
