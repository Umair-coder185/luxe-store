'use client';

import EntityTable, { StatusBadge } from '@/components/admin/shared/EntityTable';

export default function CategoryTable({ data }) {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    {
      key: 'parent',
      label: 'Parent',
      render: (v) => v ? v.name : '—'
    },
    { key: 'isActive', label: 'Status', render: StatusBadge },
  ];

  return (
    <EntityTable
      columns={columns}
      data={data}
      editBasePath="/admin/categories"
      deleteEndpoint="/api/admin/categories"
    />
  );
}
