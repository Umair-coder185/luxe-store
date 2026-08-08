import Link from 'next/link';

// Expected product shape (from getDashboardStats):
// { _id, name, stock: number }
export default function LowStockProducts({ products = [] }) {
  if (!products.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-8 text-center">
        <p className="text-sm text-gray-500">All products are well-stocked.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
      {products.map(product => (
        <Link
          key={product._id}
          href={`/admin/products/${product._id}/edit`}
          className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {product.name}
            </p>
          </div>

          {product.stock === 0 ? (
            <span className="shrink-0 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
              Out of stock
            </span>
          ) : (
            <span className="shrink-0 text-sm font-medium text-amber-600">
              {product.stock} left
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}