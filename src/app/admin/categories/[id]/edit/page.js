import { requireAdminSC } from '@/lib/auth/guards';
import { getCategoryById, getCategoryParentCandidates } from '@/lib/queries/admin/categories';
import { redirect, notFound } from 'next/navigation';
import EditCategoryClient from './EditCategoryClient';

export default async function EditCategoryPage({ params }) {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) notFound();

  // Get parent candidates (excluding self to prevent basic circular reference)
  const parents = await getCategoryParentCandidates(id);

  const initialValues = {
    ...category,
    parent: category.parent || '',
  };

  return <EditCategoryClient category={initialValues} parents={parents} />;
}
