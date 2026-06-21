import AdminShell from '@/components/admin/AdminShell';
import TourWizardForm from '@/components/admin/tour/TourWizardForm';

export default function AdminNewTourPage() {
  return (
    <AdminShell title="New tour" description="Create a new luxury quad experience step by step.">
      <TourWizardForm />
    </AdminShell>
  );
}
