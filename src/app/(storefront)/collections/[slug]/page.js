import { notFound } from "next/navigation";
import Image from "next/image";
import { getCollectionBySlug } from "@/lib/queries/storefront/collections";
import { getCategories } from "@/lib/queries/storefront/categories";
import { getBrands } from "@/lib/queries/storefront/brands";
import { getProducts } from "@/lib/queries/storefront/products";
import { validateCatalogParams } from "@/lib/validation/storefrontCatalog";

import ProductGrid from "@/components/storefront/catalog/ProductGrid";
import ProductFilters from "@/components/storefront/catalog/ProductFilters";
import ActiveFilters from "@/components/storefront/catalog/ActiveFilters";
import CatalogToolbar from "@/components/storefront/catalog/CatalogToolbar";
import MobileFilterWrapper from "@/components/storefront/catalog/MobileFilterWrapper";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) return { title: "Collection Not Found | LUXE" };

  return {
    title: `${collection.name} | LUXE`,
    description: collection.description || `Shop the ${collection.name} collection at LUXE.`,
  };
}

export default async function CollectionPage({ params, searchParams }) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;

  const collection = await getCollectionBySlug(slug);
  
  if (!collection) {
    notFound();
  }

  // Force the collection into the search params so validation and querying respect the route scope
  const scopedSearchParams = { ...rawSearchParams, collection: slug };
  const validParams = validateCatalogParams(scopedSearchParams);

  const [categories, brands, { products, pagination }] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(validParams),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Entity Header */}
      <div className="mb-12">
        {collection.image && collection.image.url ? (
          <div className="relative w-full h-64 md:h-96 mb-8 bg-neutral-100 overflow-hidden">
            <Image 
              src={collection.image.url} 
              alt={collection.name} 
              fill 
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center p-6 text-white">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4 drop-shadow-md">{collection.name}</h1>
              {collection.description && (
                <p className="max-w-2xl text-lg text-white/90 drop-shadow-sm leading-relaxed">{collection.description}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-light tracking-tight text-neutral-900 mb-4">{collection.name}</h1>
            {collection.description && (
              <p className="text-neutral-600 leading-relaxed">{collection.description}</p>
            )}
          </div>
        )}
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
              <h2 className="text-lg font-medium text-neutral-900 mb-2">No products found</h2>
              <p className="text-neutral-500">
                This collection currently has no available products matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
