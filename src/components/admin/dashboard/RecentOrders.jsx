import Link from 'next/link';

const STATUS_STYLES = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  processing: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Expected order shape (page pre-formats before passing):
// { _id, orderNumber, customer: "John Doe", total: "Rs 12,345", status: "pending", date: "28 Jul" }
export default function RecentOrders({ orders = [] }) {
  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-500">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
      {orders.map(order => {
        const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;

        return (
          <Link
            key={order._id}
            href={`/admin/orders/${order._id}`}
            className="group flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-all duration-200"
          >
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                {order.orderNumber}
              </p>
              <p className="text-sm font-medium text-slate-500 truncate">
                {order.customer}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 text-sm">
              <span className="font-bold text-slate-800">
                {order.total}
              </span>

              <span
                className={`hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm border ${statusStyle}`}
              >
                {capitalize(order.status)}
              </span>

              <span className="hidden sm:inline font-medium text-slate-400 w-16 text-right">
                {order.date}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}