import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminBreadcrumb from '@/components/admin/AdminBreadcrumb';
import AdminThemeToggle from '@/components/admin/AdminThemeToggle';

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

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Breadcrumb */}
        <AdminBreadcrumb />

        {/* Page header */}
        <header className="border-b border-rule/30 px-6 py-5 md:px-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-ink leading-tight">{title}</h2>
            {description ? (
              <p className="text-sm text-ink-muted mt-1.5 max-w-2xl">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-3 flex-shrink-0">{actions}</div> : null}
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-auto">{children}</div>

        {/* Footer: theme toggle */}
        <footer className="border-t border-rule/20 px-6 md:px-10 py-4 flex items-center justify-between">
          <p className="font-syne text-[9px] uppercase tracking-widest text-ink-faint">
            HS Luxury Quads Admin
          </p>
          <AdminThemeToggle />
        </footer>
      </main>
    </div>
  );
}
