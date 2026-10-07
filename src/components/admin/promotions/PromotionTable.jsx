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
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm border bg-blue-500/10 text-blue-600 border-blue-500/20">Scheduled</span>;
    }
    if (end && end < now) {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm border bg-rose-500/10 text-rose-600 border-rose-500/20">Expired</span>;
    }
    
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</span>;
  };

  const formatDiscount = (type, value) => {
    return type === 'PERCENTAGE' ? `${value}%` : `$${value}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-200">
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
            className="w-full sm:max-w-xs pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase">Discount</th>
              <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase">Target</th>
              <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium">
                  No promotions found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{item.name}</div>
                    {item.description && <div className="text-[11px] font-medium text-slate-500 truncate max-w-[200px] mt-0.5">{item.description}</div>}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {formatDiscount(item.discountType, item.discountValue)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500">{item.targetType}</div>
                    <div className="text-sm font-medium text-slate-800 mt-0.5">{item.targetId ? item.targetId.name : 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item)}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/promotions/${item._id}/edit`}
                        className="text-indigo-500 font-semibold hover:text-indigo-700 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-rose-500 font-semibold hover:text-rose-700 transition-colors"
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
