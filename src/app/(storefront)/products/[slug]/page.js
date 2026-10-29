import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "@/lib/queries/storefront/products";

import ProductGallery from "@/components/storefront/product/ProductGallery";
import ProductPrice from "@/components/storefront/product/ProductPrice";
import ProductPurchaseActions from "@/components/storefront/product/ProductPurchaseActions";
import ProductTabs from "@/components/storefront/product/ProductTabs";
import RelatedProducts from "@/components/storefront/product/RelatedProducts";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | LUXE" };
  }

  return {
    title: `${product.name} | LUXE`,
    description: product.description ? product.description.slice(0, 160) : `Buy ${product.name} at LUXE.`,
  };
}

function extractShortHighlights(description) {
  if (!description) return [];
  const lines = description.split("\n");
  const highlights = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("✨ Pro Tip") || trimmed.startsWith("💼 Please note")) {
      continue;
    }
    const match = trimmed.match(/^([✅✓✔🧵🎯🌿🌟✨•\-*▪◆]|\d+[.)])\s+(.+)$/);
    if (match && match[2]) {
      const marker = match[1];
      const icon =
        marker === "-" ||
        marker === "•" ||
        marker === "*" ||
        marker === "▪" ||
        marker === "◆" ||
        /^\d+[.)]$/.test(marker)
          ? "✦"
          : marker;
      const cleanText = match[2].replace(/\*\*([^*]+)\*\*/g, "$1").trim();
      highlights.push({ icon, text: cleanText });
      if (highlights.length >= 5) break;
    }
  }
  return highlights;
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isSoldOut = product.availability === "out-of-stock";
  const shortHighlights = extractShortHighlights(product.description);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 md:mb-10 text-xs md:text-sm text-neutral-500">
        <ol className="flex items-center flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
          </li>
          <li className="text-neutral-300">/</li>
          {product.brand && (
            <>
              <li>
                <Link
                  href={`/brands/${product.brand.slug || ""}`}
                  className="hover:text-neutral-900 transition-colors capitalize"
                >
                  {product.brand.name}
                </Link>
              </li>
              <li className="text-neutral-300">/</li>
            </>
          )}
          {product.category && (
            <>
              <li>
                <Link
                  href={`/categories/${product.category.slug || ""}`}
                  className="hover:text-neutral-900 transition-colors capitalize"
                >
                  {product.category.name}
                </Link>
              </li>
              <li className="text-neutral-300">/</li>
            </>
          )}
          <li className="text-neutral-900 font-medium truncate max-w-xs md:max-w-md" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Two-Column Product Presentation */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="w-full lg:w-7/12 shrink-0">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Product Purchasing & Summary */}
        <div className="w-full lg:w-5/12 flex flex-col">
          {/* Brand & Stock Status Badge */}
          <div className="flex items-center justify-between mb-3">
            {product.brand ? (
              <span className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
                {product.brand.name}
              </span>
            ) : <span />}

            <div>
              {isSoldOut ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                  Sold Out
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/50">
                  ● In Stock
                </span>
              )}
            </div>
          </div>

          {/* Product Title */}
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900 leading-snug">
            {product.name}
          </h1>

          {/* Price Component */}
          <div className="my-2">
            <ProductPrice
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              pricing={product.pricing}
            />
          </div>

          {/* Quick Key Highlights (Fancy Luxury Feature Bullet Points) */}
          {shortHighlights.length > 0 && (
            <div className="my-5 p-4 md:p-5 bg-gradient-to-br from-[#faf6ee] via-[#fcfaf5] to-[#f3ead8]/70 rounded-xl border border-[#e5d8be] shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 border-b border-[#e8dec8] pb-2">
                <span className="text-[#b89348] text-xs">✦</span>
                <h2 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#5a4622]">
                  Key Luxury Highlights
                </h2>
              </div>
              <ul className="space-y-2 text-xs md:text-[13px] text-[#2b261e] leading-relaxed pt-0.5">
                {shortHighlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="shrink-0 w-5 h-5 rounded-md bg-[#f2e8d5] border border-[#dccaa6] text-[#8c6928] flex items-center justify-center text-[11px] font-semibold mt-0.5">
                      {hl.icon}
                    </span>
                    <span className="font-medium text-neutral-800">{hl.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Purchase Actions (Variants, Quantity Stepper, Add to Cart, Wishlist, Delivery link, Share) */}
          <ProductPurchaseActions
            product={{
              id: String(product.id),
              slug: product.slug,
              name: product.name,
              price: product.price,
              pricing: product.pricing,
              availability: product.availability,
              images: product.images?.length > 0 ? [{ url: product.images[0].url }] : [],
              variants: (product.variants || []).map((v) => ({
                id: String(v.id),
                sku: v.sku || null,
                size: v.size || null,
                color: v.color || null,
                stock: v.stock || 0,
              })),
            }}
          />
        </div>
      </div>

      {/* Full-Width Tabbed Section (Description, Additional Info, Delivery & Shipping, Reviews) */}
      <ProductTabs
        description={product.description}
        attributes={product.attributes}
        variants={product.variants}
      />

      {/* Related Products Carousel / Grid */}
      <RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
    </div>
  );
}
