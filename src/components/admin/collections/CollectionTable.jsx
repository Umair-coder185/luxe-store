'use client';

import EntityTable, { StatusBadge } from '@/components/admin/shared/EntityTable';

export default function CollectionTable({ data }) {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (v) => v ? new Date(v).toLocaleDateString() : '—'
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (v) => v ? new Date(v).toLocaleDateString() : '—'
    },
    { key: 'isActive', label: 'Status', render: StatusBadge },
  ];

  return (
    <EntityTable
      columns={columns}
      data={data}
      editBasePath="/admin/collections"
      deleteEndpoint="/api/admin/collections"
    />
  );
}
