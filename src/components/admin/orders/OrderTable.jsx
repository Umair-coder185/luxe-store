'use client';

import Link from 'next/link';

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const STATUS_STYLES = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  processing: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
};

const PAYMENT_STYLES = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  failed: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  refunded: 'bg-slate-100 text-slate-500 border-slate-200',
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
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-slate-200">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-slate-50/80 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase whitespace-nowrap">Order</th>
            <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase whitespace-nowrap">Customer</th>
            <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase whitespace-nowrap">Date</th>
            <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase whitespace-nowrap">Total</th>
            <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase whitespace-nowrap">Payment</th>
            <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase whitespace-nowrap">Status</th>
            <th className="px-6 py-4 font-semibold text-slate-600 tracking-wider text-xs uppercase text-right whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {orders.map(order => {
            const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
            const paymentStyle = PAYMENT_STYLES[order.paymentStatus] || PAYMENT_STYLES.pending;
            const customerName = order.user 
              ? `${order.user.firstName} ${order.user.lastName}`.trim() 
              : order.shippingAddress?.fullName || 'Unknown';
            const dateStr = new Date(order.createdAt).toLocaleDateString();

            return (
              <tr key={order._id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">
                  {customerName}
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                  {dateStr}
                </td>
                <td className="px-6 py-4 text-slate-800 font-bold whitespace-nowrap">
                  Rs {order.total.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm border ${paymentStyle}`}>
                    {capitalize(order.paymentStatus)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm border ${statusStyle}`}>
                    {capitalize(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="text-indigo-500 hover:text-indigo-700 transition-colors font-semibold flex items-center justify-end gap-1 group-hover:translate-x-1 duration-200"
                  >
                    View Details <span aria-hidden="true">&rarr;</span>
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
