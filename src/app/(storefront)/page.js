import Link from "next/link";
import Image from "next/image";
import { getHomepageData } from "@/lib/queries/storefront/home";
import ProductGrid from "@/components/storefront/catalog/ProductGrid";

export default async function StorefrontHomepage() {
  const { newArrivals, categories, collections } = await getHomepageData();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-neutral-100">
        <div className="text-center space-y-4 z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-neutral-900">
            Luxe Edit
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-lg mx-auto">
            Discover the new season collection. Refined, effortless, and premium.
          </p>
          <div className="pt-4">
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors duration-200 text-sm font-medium tracking-wide"
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      {categories && categories.length > 0 && (
        <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl font-light mb-12 text-center tracking-wide">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link 
                href={`/categories/${cat.slug}`} 
                key={cat.id} 
                className="group block relative aspect-[3/4] bg-neutral-50 flex items-center justify-center overflow-hidden"
              >
                {cat.image && cat.image.url ? (
                  <Image 
                    src={cat.image.url} 
                    alt={cat.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
                    <span className="text-neutral-300">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/0" />
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  <span className="inline-block bg-white/90 backdrop-blur-sm px-6 py-2 text-neutral-900 tracking-wider text-sm font-medium">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Current Collections */}
      {collections && collections.length > 0 && (
        <section className="py-24 px-4 md:px-8 bg-neutral-50">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-2xl font-light mb-12 text-center tracking-wide">
              Current Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map((collection) => (
                <Link 
                  href={`/collections/${collection.slug}`} 
                  key={collection.id} 
                  className="group block relative aspect-[16/9] bg-neutral-100 overflow-hidden"
                >
                  {collection.image && collection.image.url && (
                    <Image 
                      src={collection.image.url} 
                      alt={collection.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
                    <h3 className="text-3xl font-light tracking-tight mb-2">{collection.name}</h3>
                    {collection.description && (
                      <p className="max-w-md text-white/90 text-sm hidden md:block">
                        {collection.description}
                      </p>
                    )}
                    <span className="mt-6 border-b border-white pb-1 text-sm tracking-wider uppercase">
                      Explore Collection
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-light tracking-wide">New Arrivals</h2>
            <Link href="/new-arrivals" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 border-b border-transparent hover:border-neutral-900 transition-all">
              View All
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </section>
      )}
    </div>
  );
}
