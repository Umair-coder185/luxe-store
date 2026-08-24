import { getProducts } from "@/lib/queries/storefront/products";
import { getCategories } from "@/lib/queries/storefront/categories";
import { getBrands } from "@/lib/queries/storefront/brands";
import { validateCatalogParams } from "@/lib/validation/storefrontCatalog";

import ProductGrid from "@/components/storefront/catalog/ProductGrid";
import ProductFilters from "@/components/storefront/catalog/ProductFilters";
import CatalogToolbar from "@/components/storefront/catalog/CatalogToolbar";
import Pagination from "@/components/storefront/catalog/Pagination";
import CatalogEmptyState from "@/components/storefront/catalog/CatalogEmptyState";
import ActiveFilters from "@/components/storefront/catalog/ActiveFilters";

export const metadata = {
  title: "Products | LUXE",
  description: "Shop our complete collection of premium luxury goods.",
};

export default async function ProductsPage({ searchParams }) {
  const rawParams = await searchParams;
  const validatedParams = validateCatalogParams(rawParams);
  
  const [productsData, categories, brands] = await Promise.all([
    getProducts(validatedParams),
    getCategories(),
    getBrands()
  ]);
  
  const { products, pagination } = productsData;

  const filtersUI = (
    <ProductFilters 
      categories={categories} 
      brands={brands} 
      currentParams={validatedParams}
    />
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Shop All</h1>
        <p className="text-neutral-500">Discover our curated collection of premium essentials.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          {filtersUI}
        </aside>

        <div className="flex-1 min-w-0">
          <CatalogToolbar 
            totalItems={pagination.totalItems} 
            currentParams={validatedParams}
            filterChildren={filtersUI}
          />
          <ActiveFilters currentParams={validatedParams} categories={categories} brands={brands} />

          {products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              <div className="mt-16 flex justify-center border-t border-neutral-200 pt-8">
                <Pagination pagination={pagination} />
              </div>
            </>
          ) : (
            <CatalogEmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
