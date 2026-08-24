import { getCategories } from "@/lib/queries/storefront/categories";
import { getBrands } from "@/lib/queries/storefront/brands";
import { getProducts } from "@/lib/queries/storefront/products";
import { validateCatalogParams } from "@/lib/validation/storefrontCatalog";

import ProductGrid from "@/components/storefront/catalog/ProductGrid";
import ProductFilters from "@/components/storefront/catalog/ProductFilters";
import ActiveFilters from "@/components/storefront/catalog/ActiveFilters";
import CatalogToolbar from "@/components/storefront/catalog/CatalogToolbar";
import MobileFilterWrapper from "@/components/storefront/catalog/MobileFilterWrapper";

export const metadata = {
  title: "New Arrivals | LUXE",
  description: "Shop the latest new arrivals at LUXE.",
};

export default async function NewArrivalsPage({ searchParams }) {
  const rawSearchParams = await searchParams;

  // Validate search params and enforce 'newest' as the default sort for this route
  const validParams = validateCatalogParams({
    ...rawSearchParams,
    sort: rawSearchParams.sort || "newest"
  });

  const [categories, brands, { products, pagination }] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(validParams),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Entity Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-light tracking-tight text-neutral-900 mb-4">New Arrivals</h1>
        <p className="text-neutral-600 leading-relaxed">
          Discover the latest additions to our collection.
        </p>
      </div>

      {/* Catalog Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <ProductFilters 
            categories={categories} 
            brands={brands} 
            currentParams={validParams} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <CatalogToolbar currentParams={validParams} totalItems={pagination.totalItems} />
          
          <ActiveFilters 
            currentParams={validParams} 
            categories={categories} 
            brands={brands} 
          />

          <MobileFilterWrapper>
            <ProductFilters 
              categories={categories} 
              brands={brands} 
              currentParams={validParams} 
            />
          </MobileFilterWrapper>

          {products.length > 0 ? (
            <ProductGrid products={products} pagination={pagination} />
          ) : (
            <div className="py-24 text-center">
              <h2 className="text-lg font-medium text-neutral-900 mb-2">No new arrivals found</h2>
              <p className="text-neutral-500">
                No new arrivals are available right now matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
