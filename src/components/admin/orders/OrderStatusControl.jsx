'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { capitalize } from './OrderTable';

const ALLOWED_TRANSITIONS = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  processing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  shipped: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  delivered: 'bg-green-50 text-green-700 ring-green-600/20',
  cancelled: 'bg-gray-100 text-gray-500 ring-gray-500/10',
};

export default function OrderStatusControl({ orderId, currentStatus }) {
  const router = useRouter();
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  
  const [selectedStatus, setSelectedStatus] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Terminal state display
  if (allowedNext.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Update Order Status</h3>
        <p className="text-sm text-gray-500 mb-4">No further status changes are allowed.</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Current Status:</span>
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${STATUS_STYLES[currentStatus] || ''}`}>
            {capitalize(currentStatus)}
          </span>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedStatus) return;

    if (selectedStatus === 'cancelled') {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order? Cancelling changes fulfillment status only. Inventory and payment refunds are not automatically modified."
      );
      if (!confirmed) return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus, note }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update order status');
      } else {
        setSelectedStatus('');
        setNote('');
        router.refresh();
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Update Order Status</h3>
      
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-gray-600">Current Status:</span>
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${STATUS_STYLES[currentStatus] || ''}`}>
          {capitalize(currentStatus)}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            New Status
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            disabled={submitting}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          >
            <option value="">Select a status...</option>
            {allowedNext.map(status => (
              <option key={status} value={status}>
                {capitalize(status)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            Note (optional)
          </label>
          <textarea
            id="note"
            rows="2"
            value={note}
            onChange={e => setNote(e.target.value)}
            disabled={submitting}
            placeholder="Add an optional note to the timeline"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={!selectedStatus || submitting}
          className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Updating...' : 'Update Status'}
        </button>
      </form>
    </div>
  );
}
