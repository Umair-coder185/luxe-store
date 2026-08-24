import { searchProducts } from "@/lib/queries/storefront/search";
import { validateCatalogParams } from "@/lib/validation/storefrontCatalog";

import ProductGrid from "@/components/storefront/catalog/ProductGrid";
import CatalogToolbar from "@/components/storefront/catalog/CatalogToolbar";
import Pagination from "@/components/storefront/catalog/Pagination";
import CatalogEmptyState from "@/components/storefront/catalog/CatalogEmptyState";
import SearchForm from "@/components/storefront/catalog/SearchForm";

export const metadata = {
  title: "Search | LUXE",
};

export default async function SearchPage({ searchParams }) {
  const rawParams = await searchParams;
  const validatedParams = validateCatalogParams(rawParams);
  
  const { products, pagination } = await searchProducts(validatedParams);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col items-center">
      
      <SearchForm />

      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Search Results</h1>
          {validatedParams.q ? (
            <p className="text-neutral-500">Showing results for &quot;{validatedParams.q}&quot;</p>
          ) : (
            <p className="text-neutral-500">Enter a search term above to find products.</p>
          )}
        </div>

        {validatedParams.q && (
          <CatalogToolbar 
            totalItems={pagination.totalItems} 
            currentParams={validatedParams}
          />
        )}

        {products.length > 0 ? (
          <>
            <ProductGrid products={products} />
            <div className="mt-16 flex justify-center border-t border-neutral-200 pt-8">
              <Pagination pagination={pagination} />
            </div>
          </>
        ) : (
          <CatalogEmptyState isSearch={true} query={validatedParams.q} />
        )}
      </div>
    </div>
  );
}
