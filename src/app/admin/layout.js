import { redirect } from 'next/navigation';
import { requireAdminSC } from '@/lib/auth/guards';
import AdminNavigation from '@/components/admin/layout/AdminNavigation';
import '../globals.css';

export const metadata = {
  title: {
    default: 'Admin',
    template: '%s | Admin',
  },
};

export default async function AdminLayout({ children }) {
  const { user, error, status } = await requireAdminSC();

  if (error) {
    redirect(status === 403 ? '/' : '/sign-in');
  }

  return <AdminNavigation user={user}>{children}</AdminNavigation>;
}