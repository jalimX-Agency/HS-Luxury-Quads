import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminShellProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminShell({ title, description, actions, children }: AdminShellProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 min-w-0">
        <header className="border-b border-rule/30 px-6 py-6 md:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-ink">{title}</h2>
            {description ? (
              <p className="text-sm text-ink-muted mt-2 max-w-2xl">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </header>
        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}
