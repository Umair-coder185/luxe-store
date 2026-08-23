import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdminSC } from '@/lib/auth/guards';
import { getOrderById } from '@/lib/queries/admin/orders';
import OrderDetail from '@/components/admin/orders/OrderDetail';

export const metadata = {
  title: 'Order Details | Admin',
};

export default async function OrderDetailPage({ params }) {
  await requireAdminSC();

  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/orders"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back to Orders
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mt-4">Order {order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <OrderDetail order={order} />
    </div>
  );
}
