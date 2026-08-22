import { requireAdminSC } from '@/lib/auth/guards';
import { getCategoryParentCandidates } from '@/lib/queries/admin/categories';
import { redirect } from 'next/navigation';
import NewCategoryClient from './NewCategoryClient';

export default async function NewCategoryPage() {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  const parents = await getCategoryParentCandidates();

  return <NewCategoryClient parents={parents} />;
}
