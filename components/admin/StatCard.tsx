interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="bg-bg-subtle border border-rule/30 p-6">
      <p className="font-syne text-[10px] font-semibold tracking-[0.18em] uppercase text-ink-faint">
        {label}
      </p>
      <p className="font-display text-4xl text-gold mt-3">{value}</p>
      {hint ? <p className="text-xs text-ink-muted mt-2">{hint}</p> : null}
    </div>
  );
}
