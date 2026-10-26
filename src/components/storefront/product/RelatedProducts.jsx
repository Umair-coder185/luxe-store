import { getRelatedProducts } from "@/lib/queries/storefront/products";
import ProductGrid from "@/components/storefront/catalog/ProductGrid";

export default async function RelatedProducts({ productId, categorySlug }) {
  const products = await getRelatedProducts({ currentProductId: productId, categorySlug });

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-24 pt-16 border-t border-neutral-200">
      <h2 className="text-2xl font-light text-neutral-900 mb-8 text-center">You May Also Like</h2>
      <ProductGrid products={products} />
    </div>
  );
}
