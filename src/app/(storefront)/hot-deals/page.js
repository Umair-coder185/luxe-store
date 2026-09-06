import { getHotDeals } from "@/lib/queries/storefront/promotions";
import ProductGrid from "@/components/storefront/catalog/ProductGrid";
import Pagination from "@/components/storefront/catalog/Pagination";
import ProductSort from "@/components/storefront/catalog/ProductSort";

export const metadata = {
  title: "Hot Deals | LUXE",
  description: "Discover the latest promotional offers on premium luxury items at LUXE.",
};

export const dynamic = 'force-dynamic';

export default async function HotDealsPage({ searchParams }) {
  const { page, sort } = await searchParams;
  
  const currentPage = parseInt(page || "1");
  const currentSort = sort || "newest";

  const { products, pagination } = await getHotDeals({
    page: currentPage,
    limit: 24,
    sort: currentSort,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900 mb-4">
          Hot Deals
        </h1>
        <p className="text-neutral-500 max-w-2xl">
          Discover our active promotional offers on premium collections and luxury essentials. 
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-neutral-200">
        <div className="text-sm text-neutral-500 mb-4 md:mb-0">
          Showing <span className="font-medium text-neutral-900">{products.length}</span> of <span className="font-medium text-neutral-900">{pagination.totalItems}</span> offers
        </div>
        
        <div className="flex items-center space-x-4">
          <ProductSort currentSort={currentSort} />
        </div>
      </div>

      {products.length > 0 ? (
        <>
          <ProductGrid products={products} />
          {pagination.totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <Pagination pagination={pagination} />
            </div>
          )}
        </>
      ) : (
        <div className="py-20 text-center">
          <h3 className="text-xl font-light text-neutral-900 mb-2">No current offers are available.</h3>
          <p className="text-neutral-500 mb-8">
            Our promotions are updated regularly. Please check back later or explore our newest collections.
          </p>
          <a
            href="/new-arrivals"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-sm font-medium text-white bg-neutral-900 hover:bg-black transition-colors"
          >
            Explore New Arrivals
          </a>
        </div>
      )}
    </div>
  );
}
