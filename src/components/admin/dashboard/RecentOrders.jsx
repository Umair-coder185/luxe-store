import Link from 'next/link';

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  processing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  shipped: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  delivered: 'bg-green-50 text-green-700 ring-green-600/20',
  cancelled: 'bg-gray-100 text-gray-500 ring-gray-500/10',
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Expected order shape (page pre-formats before passing):
// { _id, orderNumber, customer: "John Doe", total: "Rs 12,345", status: "pending", date: "28 Jul" }
export default function RecentOrders({ orders = [] }) {
  if (!orders.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-8 text-center">
        <p className="text-sm text-gray-500">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
      {orders.map(order => {
        const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;

        return (
          <Link
            key={order._id}
            href={`/admin/orders/${order._id}`}
            className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {order.orderNumber}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {order.customer}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-sm">
              <span className="font-medium text-gray-900">
                {order.total}
              </span>

              <span
                className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${statusStyle}`}
              >
                {capitalize(order.status)}
              </span>

              <span className="hidden sm:inline text-gray-400 w-16 text-right">
                {order.date}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}