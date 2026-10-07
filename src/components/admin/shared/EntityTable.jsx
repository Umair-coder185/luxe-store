'use client';

import { useState } from 'react';
import Link from 'next/link';

// ── Reusable status badge (used in column configs) ───────────
// Called as a render helper:  render: (val) => <StatusBadge value={val} />
// or directly:  render: StatusBadge  (receives positional arg from EntityTable)
export function StatusBadge(value) {
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
        value
          ? 'bg-emerald-500/10 text-emerald-600 shadow-sm border border-emerald-500/20'
          : 'bg-slate-100 text-slate-500 shadow-sm border border-slate-200'
      }`}
    >
      {value ? 'Active' : 'Inactive'}
    </span>
  );
}

// ── Main component ───────────────────────────────────────────
export default function EntityTable({
  columns,
  data = [],
  editBasePath,
  deleteEndpoint,
  onAfterDelete,
}) {
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete(id) {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`${deleteEndpoint}/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        let message = 'Delete failed';
        try {
          const body = await res.json();
          message = body.error || message;
        } catch {
          // response wasn't valid JSON — keep generic message
        }
        setError(message);
        return;
      }

      setConfirmId(null);
      onAfterDelete?.();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  if (!data.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
        <p className="text-sm text-gray-500">No items found.</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-medium hover:underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-slate-200">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.map(item => (
              <tr key={item._id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                {columns.map(col => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-slate-700 font-medium whitespace-nowrap"
                  >
                    {col.render
                      ? col.render(item[col.key], item)
                      : item[col.key]}
                  </td>
                ))}

                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {confirmId === item._id ? (
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="text-red-600">Delete?</span>
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={deleting}
                        className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {deleting ? '...' : 'Yes'}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        disabled={deleting}
                        className="px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition-colors"
                      >
                        No
                      </button>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-4">
                      {editBasePath && (
                        <Link
                          href={`${editBasePath}/${item._id}/edit`}
                          className={`text-indigo-500 font-semibold hover:text-indigo-700 transition-colors ${
                            deleting ? 'pointer-events-none opacity-40' : ''
                          }`}
                        >
                          Edit
                        </Link>
                      )}
                      {deleteEndpoint && (
                        <button
                          onClick={() => setConfirmId(item._id)}
                          disabled={deleting}
                          className="text-rose-500 font-semibold hover:text-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      )}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}