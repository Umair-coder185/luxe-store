import { notFound } from "next/navigation";
import Image from "next/image";
import { getCategoryBySlug, getCategories } from "@/lib/queries/storefront/categories";
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
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: "Category Not Found | LUXE" };

  return {
    title: `${category.name} | LUXE`,
    description: category.description || `Shop ${category.name} at LUXE.`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;

  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }

  // Force the category into the search params so validation and querying respect the route scope
  const scopedSearchParams = { ...rawSearchParams, category: slug };
  const validParams = validateCatalogParams(scopedSearchParams);

  const [categories, brands, { products, pagination }] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(validParams),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Entity Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-light tracking-tight text-neutral-900 mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-neutral-600 leading-relaxed">{category.description}</p>
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
            hideCategory={true}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <CatalogToolbar currentParams={validParams} totalItems={pagination.totalItems} />
          
          <ActiveFilters 
            currentParams={validParams} 
            categories={categories} 
            brands={brands} 
            hideCategory={true}
          />

          <MobileFilterWrapper>
            <ProductFilters 
              categories={categories} 
              brands={brands} 
              currentParams={validParams} 
              hideCategory={true}
            />
          </MobileFilterWrapper>

          {products.length > 0 ? (
            <ProductGrid products={products} pagination={pagination} />
          ) : (
            <div className="py-24 text-center">
              <h2 className="text-lg font-medium text-neutral-900 mb-2">No products found</h2>
              <p className="text-neutral-500">
                No products are currently available in this category matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
