'use client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Error – HS Luxury Quads',
  description: 'An unexpected error occurred.',
};

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  // Log the error for debugging
  console.error(error);
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-subtle p-8">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-display font-bold text-ink mb-4">Oops! Something went wrong.</h1>
        <p className="text-ink-muted mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="bg-gold text-background font-syne font-semibold text-sm uppercase px-5 py-3 rounded hover:bg-gold-light transition"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
