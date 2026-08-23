import Link from 'next/link';

// Expected product shape:
// { _id, name, stock, isActive, image, brand }
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
          <div className="flex items-center gap-4 min-w-0">
            {product.image ? (
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-10 w-10 shrink-0 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400 text-[10px]">No img</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate flex items-center gap-2">
                {product.name}
                {!product.isActive && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                    Draft
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 truncate">{product.brand}</p>
            </div>
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