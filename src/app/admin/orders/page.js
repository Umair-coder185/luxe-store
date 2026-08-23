import { requireAdminSC } from '@/lib/auth/guards';
import { getOrders } from '@/lib/queries/admin/orders';
import OrderTable from '@/components/admin/orders/OrderTable';
import Link from 'next/link';

export const metadata = {
  title: 'Orders | Admin',
};

// Next.js SearchParams are passed to page components
export default async function OrdersPage({ searchParams }) {
  await requireAdminSC();

  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search || '';
  const status = resolvedSearchParams?.status || '';
  const paymentStatus = resolvedSearchParams?.paymentStatus || '';
  const page = parseInt(resolvedSearchParams?.page, 10) || 1;

  const ordersResult = await getOrders({ search, status, paymentStatus, page, limit: 20 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your store&apos;s orders and fulfillment.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <form method="GET" action="/admin/orders" className="flex flex-1 flex-col sm:flex-row gap-4 w-full">
          <div className="flex-1">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by order number..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              name="status"
              defaultValue={status}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              name="paymentStatus"
              defaultValue={paymentStatus}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Filter
            </button>
            
            {(search || status || paymentStatus) && (
              <Link 
                href="/admin/orders"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors flex items-center"
              >
                Clear
              </Link>
            )}
          </div>
        </form>
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        Showing {ordersResult.data.length} of {ordersResult.total} result(s)
      </div>

      <OrderTable orders={ordersResult.data} />
      
      {ordersResult.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{ordersResult.page}</span> of{' '}
                <span className="font-medium">{ordersResult.totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <Link
                  href={`/admin/orders?page=${Math.max(1, ordersResult.page - 1)}${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}${paymentStatus ? `&paymentStatus=${paymentStatus}` : ''}`}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${ordersResult.page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                >
                  Previous
                </Link>
                <Link
                  href={`/admin/orders?page=${Math.min(ordersResult.totalPages, ordersResult.page + 1)}${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}${paymentStatus ? `&paymentStatus=${paymentStatus}` : ''}`}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${ordersResult.page >= ordersResult.totalPages ? 'pointer-events-none opacity-50' : ''}`}
                >
                  Next
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
