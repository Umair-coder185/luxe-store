import { notFound } from "next/navigation";
import Image from "next/image";
import { getBrandBySlug, getBrands } from "@/lib/queries/storefront/brands";
import { getCategories } from "@/lib/queries/storefront/categories";
import { getProducts } from "@/lib/queries/storefront/products";
import { validateCatalogParams } from "@/lib/validation/storefrontCatalog";

import ProductGrid from "@/components/storefront/catalog/ProductGrid";
import ProductFilters from "@/components/storefront/catalog/ProductFilters";
import ActiveFilters from "@/components/storefront/catalog/ActiveFilters";
import CatalogToolbar from "@/components/storefront/catalog/CatalogToolbar";
import MobileFilterWrapper from "@/components/storefront/catalog/MobileFilterWrapper";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) return { title: "Brand Not Found | LUXE" };

  return {
    title: `${brand.name} | LUXE`,
    description: brand.description || `Shop ${brand.name} at LUXE.`,
  };
}

export default async function BrandPage({ params, searchParams }) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;

  const brand = await getBrandBySlug(slug);
  
  if (!brand) {
    notFound();
  }

  // Force the brand into the search params so validation and querying respect the route scope
  const scopedSearchParams = { ...rawSearchParams, brand: slug };
  const validParams = validateCatalogParams(scopedSearchParams);

  const [categories, brandsList, { products, pagination }] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(validParams),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Entity Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        {brand.logo && brand.logo.url && (
          <div className="relative w-32 h-16 mx-auto mb-6">
            <Image 
              src={brand.logo.url} 
              alt={`${brand.name} logo`} 
              fill 
              className="object-contain"
              sizes="128px"
            />
          </div>
        )}
        <h1 className="text-4xl font-light tracking-tight text-neutral-900 mb-4">{brand.name}</h1>
        {brand.description && (
          <p className="text-neutral-600 leading-relaxed">{brand.description}</p>
        )}
      </div>

      {/* Catalog Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <ProductFilters 
            categories={categories} 
            brands={brandsList} 
            currentParams={validParams} 
            hideBrand={true}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <CatalogToolbar currentParams={validParams} totalItems={pagination.totalItems} />
          
          <ActiveFilters 
            currentParams={validParams} 
            categories={categories} 
            brands={brandsList} 
            hideBrand={true}
          />

          <MobileFilterWrapper>
            <ProductFilters 
              categories={categories} 
              brands={brandsList} 
              currentParams={validParams} 
              hideBrand={true}
            />
          </MobileFilterWrapper>

          {products.length > 0 ? (
            <ProductGrid products={products} pagination={pagination} />
          ) : (
            <div className="py-24 text-center">
              <h2 className="text-lg font-medium text-neutral-900 mb-2">No products found</h2>
              <p className="text-neutral-500">
                No products are currently available from this brand matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
