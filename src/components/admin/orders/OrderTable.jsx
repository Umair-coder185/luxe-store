'use client';

import Link from 'next/link';

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  processing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  shipped: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  delivered: 'bg-green-50 text-green-700 ring-green-600/20',
  cancelled: 'bg-gray-100 text-gray-500 ring-gray-500/10',
};

const PAYMENT_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  paid: 'bg-green-50 text-green-700 ring-green-600/20',
  failed: 'bg-red-50 text-red-700 ring-red-600/20',
  refunded: 'bg-gray-100 text-gray-500 ring-gray-500/10',
};

export default function OrderTable({ orders = [] }) {
  if (!orders.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
        <p className="text-sm text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Order</th>
            <th className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Customer</th>
            <th className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Date</th>
            <th className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Total</th>
            <th className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Payment</th>
            <th className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Status</th>
            <th className="px-4 py-3 font-medium text-gray-500 text-right whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {orders.map(order => {
            const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
            const paymentStyle = PAYMENT_STYLES[order.paymentStatus] || PAYMENT_STYLES.pending;
            const customerName = order.user 
              ? `${order.user.firstName} ${order.user.lastName}`.trim() 
              : order.shippingAddress?.fullName || 'Unknown';
            const dateStr = new Date(order.createdAt).toLocaleDateString();

            return (
              <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {customerName}
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {dateStr}
                </td>
                <td className="px-4 py-3 text-gray-900 whitespace-nowrap">
                  Rs {order.total.toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${paymentStyle}`}>
                    {capitalize(order.paymentStatus)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${statusStyle}`}>
                    {capitalize(order.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="text-indigo-600 hover:text-indigo-900 hover:underline transition-colors font-medium"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
