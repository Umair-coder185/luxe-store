import Link from 'next/link';
import getDashboardStats from '@/lib/queries/admin/getDashboardStats';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import RecentOrders from '@/components/admin/dashboard/RecentOrders';
import LowStockProducts from '@/components/admin/dashboard/LowStockProducts';

// ── Formatting (page-layer concern) ──────────────────────────
// Summary cards use rounded integers; detail pages should show decimals.
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

// Defensive new Date() — unstable_cache may deserialize Date → string
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

// ── Inline icons (dashboard-only) ────────────────────────────
function RevenueIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function OrdersIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function ProductsIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function AlertIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const recentOrders = stats.recentOrders.map(order => ({
    ...order,
    total: formatCurrency(order.total),
    date: formatDate(order.createdAt),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={RevenueIcon} />
        <StatsCard label="Total Orders" value={stats.totalOrders.toLocaleString()} icon={OrdersIcon} />
        <StatsCard label="Products" value={stats.totalProducts.toLocaleString()} icon={ProductsIcon} />
        <StatsCard label="Low Stock" value={stats.lowStockProducts.length} icon={AlertIcon} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              View all
            </Link>
          </div>
          <RecentOrders orders={recentOrders} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock</h2>
            <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              View all
            </Link>
          </div>
          <LowStockProducts products={stats.lowStockProducts} />
        </section>
      </div>
    </div>
  );
}