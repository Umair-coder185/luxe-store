import Link from 'next/link';

// Expected product shape:
// { _id, name, stock, isActive, image, brand }
export default function LowStockProducts({ products = [] }) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-500">All products are well-stocked.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
      {products.map(product => (
        <Link
          key={product._id}
          href={`/admin/products/${product._id}/edit`}
          className="group flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-all duration-200"
        >
          <div className="flex items-center gap-4 min-w-0">
            {product.image ? (
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ) : (
              <div className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center">
                <span className="text-slate-400 text-xs font-medium">No img</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                {product.name}
                {!product.isActive && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-slate-200">
                    Draft
                  </span>
                )}
              </p>
              <p className="text-xs font-medium text-slate-500 truncate">{product.brand}</p>
            </div>
          </div>

          {product.stock === 0 ? (
            <span className="shrink-0 text-[10px] uppercase tracking-wider font-bold text-rose-600 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full shadow-sm">
              Out of stock
            </span>
          ) : (
            <span className="shrink-0 text-xs font-bold text-amber-600">
              {product.stock} left
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}