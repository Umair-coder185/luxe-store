import Link from "next/link";
import { getProducts } from "@/lib/queries/storefront/products";
import ProductGrid from "@/components/storefront/catalog/ProductGrid";

export const metadata = {
  title: "Top Luxury Watches | LUXE",
  description: "Discover the most popular luxury watch brands for men and women.",
};

export default async function WatchesPage() {
  const [mensData, womensData] = await Promise.all([
    getProducts({ category: 'mens-watches', limit: 8 }),
    getProducts({ category: 'womens-watches', limit: 8 })
  ]);

  const mensWatches = mensData.products || [];
  const womensWatches = womensData.products || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="bg-neutral-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
            The Watch Boutique
          </h1>
          <p className="text-lg text-white/80 font-light">
            Explore the most sought-after timepieces from legendary makers.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-16 space-y-24">
        {/* Men's Watches Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
                Top Men's Watches
              </h2>
              <p className="text-neutral-500 max-w-2xl">
                Featuring the highest transaction volumes and legendary models from 
                <span className="font-semibold text-neutral-900"> Rolex, Omega, and Tudor</span>.
              </p>
            </div>
            <Link 
              href="/categories/mens-watches" 
              className="text-sm font-medium border-b border-neutral-900 pb-1 hover:text-neutral-600 self-start md:self-auto"
            >
              Shop All Men's Watches
            </Link>
          </div>
          
          {mensWatches.length > 0 ? (
            <ProductGrid products={mensWatches} />
          ) : (
            <p className="text-neutral-500 py-10">No men's watches found.</p>
          )}
        </section>

        {/* Women's Watches Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
                Top Women's Watches
              </h2>
              <p className="text-neutral-500 max-w-2xl">
                Timeless gender-neutral appeal and classic elegance from 
                <span className="font-semibold text-neutral-900"> Cartier, Rolex, and Omega</span>.
              </p>
            </div>
            <Link 
              href="/categories/womens-watches" 
              className="text-sm font-medium border-b border-neutral-900 pb-1 hover:text-neutral-600 self-start md:self-auto"
            >
              Shop All Women's Watches
            </Link>
          </div>
          
          {womensWatches.length > 0 ? (
            <ProductGrid products={womensWatches} />
          ) : (
            <p className="text-neutral-500 py-10">No women's watches found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
