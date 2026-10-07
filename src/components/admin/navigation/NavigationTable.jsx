'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavigationTable({ data }) {
  const router = useRouter();

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this navigation item?')) return;

    try {
      const res = await fetch(`/api/admin/navigation/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete navigation item');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting item');
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-slate-200">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-slate-50/80 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase">Order</th>
            <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase">Label</th>
            <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase">Type</th>
            <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase">Status</th>
            <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium">
                No navigation items found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                <td className="px-6 py-4 text-slate-500 font-medium">{item.order}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{item.label}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm border ${item.isVisible ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {item.isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/navigation/${item._id}/edit`}
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
  );
}
