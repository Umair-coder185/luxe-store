'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PromotionTable({ data, meta, search }) {
  const router = useRouter();

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this promotion? This action is permanent.')) return;

    try {
      const res = await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete promotion');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting promotion');
    }
  }

  const getStatusBadge = (item) => {
    if (!item.isActive) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Disabled</span>;
    }
    const now = new Date();
    const start = item.startsAt ? new Date(item.startsAt) : null;
    const end = item.endsAt ? new Date(item.endsAt) : null;

    if (start && start > now) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">Scheduled</span>;
    }
    if (end && end < now) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">Expired</span>;
    }
    
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Active</span>;
  };

  const formatDiscount = (type, value) => {
    return type === 'PERCENTAGE' ? `${value}%` : `$${value}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <form className="relative" onSubmit={(e) => {
          e.preventDefault();
          const query = e.target.search.value;
          router.push(`/admin/promotions?search=${encodeURIComponent(query)}`);
        }}>
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search promotions..."
            className="w-full sm:max-w-xs pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Target</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No promotions found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.description && <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.description}</div>}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatDiscount(item.discountType, item.discountValue)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 font-medium">{item.targetType}</div>
                    <div className="text-gray-900">{item.targetId ? item.targetId.name : 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/promotions/${item._id}/edit`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
