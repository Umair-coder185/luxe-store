import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries/storefront/products";

import ProductGallery from "@/components/storefront/product/ProductGallery";
import ProductPrice from "@/components/storefront/product/ProductPrice";
import ProductVariants from "@/components/storefront/product/ProductVariants";
import ProductAttributes from "@/components/storefront/product/ProductAttributes";
import RelatedProducts from "@/components/storefront/product/RelatedProducts";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | LUXE" };
  }

  return {
    title: `${product.name} | LUXE`,
    description: product.description || `Buy ${product.name} at LUXE.`,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isSoldOut = product.availability === "out-of-stock";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:w-3/5">
          <ProductGallery images={product.images} productName={product.name} />
        </div>
        
        {/* Right Column: Product Information */}
        <div className="lg:w-2/5 flex flex-col">
          <div className="mb-6">
            {product.brand && (
              <div className="mb-2">
                <span className="text-sm font-medium text-neutral-500 tracking-wider uppercase">
                  {product.brand.name}
                </span>
              </div>
            )}
            <h1 className="text-3xl font-light tracking-tight text-neutral-900">{product.name}</h1>
            
            <ProductPrice price={product.price} compareAtPrice={product.compareAtPrice} />
          </div>

          <div className="mb-8">
            {isSoldOut ? (
              <span className="inline-block px-3 py-1 bg-neutral-100 text-sm font-medium text-neutral-900">
                Sold Out
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-green-50 text-green-800 text-sm font-medium">
                In Stock
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-10 text-neutral-600 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </div>
          )}

          {/* Variants (Day 5 scope: Presentation only) */}
          <ProductVariants variants={product.variants} />

          {/* Detailed Attributes */}
          <ProductAttributes attributes={product.attributes} />

        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
    </div>
  );
}
