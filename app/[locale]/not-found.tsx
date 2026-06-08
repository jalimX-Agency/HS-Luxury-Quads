import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found – HS Luxury Quads',
  description: 'The page you are looking for does not exist.',
};

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-subtle p-8">
      <div className="max-w-lg text-center">
        <h1 className="text-5xl font-display font-bold text-ink mb-4">404</h1>
        <p className="text-ink-muted mb-6">Sorry, the page you are looking for could not be found.</p>
        <a
          href="/en"
          className="bg-gold text-background font-syne font-semibold text-sm uppercase px-5 py-3 rounded hover:bg-gold-light transition"
        >
          Return Home
        </a>
      </div>
    </main>
  );
}
