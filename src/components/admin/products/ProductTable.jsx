'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ProductTable({
  products = [],
  total = 0,
  page = 1,
  totalPages = 1,
  brands = [],
  categories = [],
  currentFilters = {},
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
  const [selectedBrand, setSelectedBrand] = useState(currentFilters.brand || '');
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.category || '');
  const [selectedStatus, setSelectedStatus] = useState(currentFilters.isActive || '');

  // Delete modal state
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isOrderConflict, setIsOrderConflict] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Sync filter changes to URL
  function applyFilters(newFilters = {}) {
    const params = new URLSearchParams(searchParams.toString());

    const merged = {
      search: searchTerm,
      brand: selectedBrand,
      category: selectedCategory,
      isActive: selectedStatus,
      ...newFilters,
    };

    if (merged.search) params.set('search', merged.search);
    else params.delete('search');

    if (merged.brand) params.set('brand', merged.brand);
    else params.delete('brand');

    if (merged.category) params.set('category', merged.category);
    else params.delete('category');

    if (merged.isActive !== undefined && merged.isActive !== '') params.set('isActive', merged.isActive);
    else params.delete('isActive');

    // Reset to page 1 on filter change
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    applyFilters({ search: searchTerm });
  }

  function handleResetFilters() {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedStatus('');
    router.push(pathname);
  }

  function handlePageChange(newPage) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  async function handleDeleteConfirm() {
    if (!deletingProduct) return;

    setIsDeleting(true);
    setDeleteError(null);
    setIsOrderConflict(false);

    try {
      const res = await fetch(`/api/admin/products/${deletingProduct._id}`, {
        method: 'DELETE',
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 409 || (data.error && data.error.includes('order'))) {
          setIsOrderConflict(true);
          setDeleteError(
            'Product cannot be permanently deleted because order history references it. Deactivate the Product instead.'
          );
        } else {
          setDeleteError(data.error || 'Failed to delete product.');
        }
        return;
      }

      // Success
      setDeletingProduct(null);
      router.refresh();
    } catch (err) {
      console.error('[ProductTable] Delete error:', err);
      setDeleteError('Network error. Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  }

  // Quick deactivation action when order conflict prevents deletion
  async function handleQuickDeactivate() {
    if (!deletingProduct) return;

    setIsDeactivating(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/admin/products/${deletingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...deletingProduct,
          category: deletingProduct.category?._id || deletingProduct.category,
          brand: deletingProduct.brand?._id || deletingProduct.brand,
          isActive: false,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDeleteError(data.error || 'Failed to deactivate product.');
        return;
      }

      // Deactivation succeeded
      setDeletingProduct(null);
      setIsOrderConflict(false);
      router.refresh();
    } catch (err) {
      console.error('[ProductTable] Deactivate error:', err);
      setDeleteError('Network error. Failed to deactivate product.');
    } finally {
      setIsDeactivating(false);
    }
  }

  const hasActiveFilters = Boolean(
    currentFilters.search ||
    currentFilters.brand ||
    currentFilters.category ||
    (currentFilters.isActive !== undefined && currentFilters.isActive !== '')
  );

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <SearchIcon className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search products by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-44">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                applyFilters({ category: e.target.value });
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Dropdown */}
          <div className="w-full md:w-44">
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                applyFilters({ brand: e.target.value });
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="w-full md:w-36">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                applyFilters({ isActive: e.target.value });
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Submit / Reset */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Search
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-medium rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product List Table */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center shadow-sm">
          <div className="inline-flex p-3 rounded-full bg-gray-100 text-gray-500 mb-3">
            <PackageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            {hasActiveFilters ? 'No products match your filters' : 'No products yet'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'Try resetting the search or adjusting your brand and category filters.'
              : 'Get started by creating your first product with imagery, pricing, and variants.'}
          </p>
          <div className="mt-5">
            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add First Product
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3.5">Product</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Brand</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5">Stock</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {products.map((product) => {
                  const primaryImg = product.images?.[0]?.url;
                  const isOutOfStock = product.stock <= 0;
                  const hasDiscount =
                    product.compareAtPrice && product.compareAtPrice > product.price;

                  return (
                    <tr key={product._id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg border border-gray-200 bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                            {primaryImg ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={primaryImg}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <PackageIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <Link
                              href={`/admin/products/${product._id}/edit`}
                              className="font-semibold text-gray-900 hover:underline truncate block"
                            >
                              {product.name}
                            </Link>
                            <p className="text-[11px] text-gray-400 font-mono truncate">
                              /{product.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">
                        {product.category?.name || '—'}
                      </td>

                      {/* Brand */}
                      <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">
                        {product.brand?.name || '—'}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-semibold text-gray-900">
                            ${Number(product.price).toFixed(2)}
                          </span>
                          {hasDiscount && (
                            <span className="text-[11px] text-gray-400 line-through">
                              ${Number(product.compareAtPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            isOutOfStock
                              ? 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                              : product.stock < 10
                              ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-600/20'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {isOutOfStock ? '0 (Out of stock)' : `${product.stock} in stock`}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            product.isActive
                              ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                              : 'bg-gray-100 text-gray-500 ring-1 ring-gray-500/10'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-3">
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingProduct(product);
                              setDeleteError(null);
                              setIsOrderConflict(false);
                            }}
                            className="text-red-500 hover:text-red-700 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3.5 bg-gray-50 border-t border-gray-200 gap-3 text-xs text-gray-600">
            <div>
              Showing <span className="font-semibold">{products.length}</span> of{' '}
              <span className="font-semibold">{total}</span> products
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="font-medium px-1">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation & Order Conflict Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-full bg-red-100 text-red-600 shrink-0">
                <AlertIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {isOrderConflict ? 'Cannot Delete Product' : 'Delete Product'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isOrderConflict
                    ? `"${deletingProduct.name}" is linked to existing customer orders.`
                    : `Are you sure you want to permanently delete "${deletingProduct.name}"? This action cannot be undone.`}
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                disabled={isDeleting || isDeactivating}
                onClick={() => {
                  setDeletingProduct(null);
                  setDeleteError(null);
                  setIsOrderConflict(false);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Close
              </button>

              {isOrderConflict ? (
                <button
                  type="button"
                  disabled={isDeactivating}
                  onClick={handleQuickDeactivate}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shadow disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isDeactivating ? 'Deactivating...' : 'Deactivate Product Instead'}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PackageIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function AlertIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
