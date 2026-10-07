import Link from "next/link";
import Image from "next/image";
import { getHomepageData } from "@/lib/queries/storefront/home";
import ProductGrid from "@/components/storefront/catalog/ProductGrid";
import { mockHandbags } from "@/lib/mockData";

export default async function StorefrontHomepage() {
  const { newArrivals, categories, collections } = await getHomepageData();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-neutral-900 overflow-hidden">
        {/* Background Image (User must place hero-interior.jpg in public/ folder) */}
        <Image 
          src="/hero-interior.jpg" 
          alt="Luxury Store Interior" 
          fill 
          priority
          className="object-cover object-center opacity-70"
          sizes="100vw"
        />
        
        {/* Content */}
        <div className="text-center space-y-4 z-10 px-4 relative">
          <h1 className="text-7xl md:text-9xl font-logo tracking-wide text-[#d4af37] drop-shadow-2xl">
            Luxe Edit
          </h1>
          <p className="text-lg md:text-xl font-light text-white/90 max-w-lg mx-auto drop-shadow-md">
            Discover the new season collection. Refined, effortless, and premium.
          </p>
          <div className="pt-6">
            <Link
              href="/products"
              className="inline-block px-10 py-3.5 bg-white text-neutral-900 hover:bg-neutral-100 transition-colors duration-200 text-sm font-medium tracking-wide shadow-lg"
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      {categories && categories.length > 0 && (
        <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-12 text-center tracking-widest uppercase">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, index) => {
              const fallbackImages = [
                "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000",
                "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000",
                "https://images.unsplash.com/photo-1608228079968-c7681eaef81a?q=80&w=1000",
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000",
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000",
                "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000"
              ];
              const imageUrl = (cat.image && cat.image.url) ? cat.image.url : fallbackImages[index % fallbackImages.length];

              return (
                <Link 
                  href={`/categories/${cat.slug}`} 
                  key={cat.id} 
                  className="group block relative aspect-[3/4] bg-neutral-50 flex items-center justify-center overflow-hidden"
                >
                  <Image 
                    src={imageUrl} 
                    alt={cat.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/30" />
                  <div className="absolute bottom-8 left-0 right-0 text-center">
                    <span className="inline-block bg-white/90 backdrop-blur-sm px-8 py-3 text-neutral-900 tracking-widest text-xs uppercase font-semibold shadow-xl group-hover:bg-white transition-colors">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Current Collections */}
      {collections && collections.length > 0 && (
        <section className="py-24 px-4 md:px-8 bg-neutral-50">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-12 text-center tracking-widest uppercase">
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
                    <h3 className="text-5xl font-logo tracking-normal mb-2 drop-shadow-md">{collection.name}</h3>
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
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 tracking-widest uppercase">New Arrivals</h2>
            <Link href="/new-arrivals" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 border-b border-transparent hover:border-neutral-900 transition-all">
              View All
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </section>
      )}

      {/* Handbags */}
      <section className="pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 tracking-widest uppercase">Handbags</h2>
          <Link href="/categories/handbags" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 border-b border-transparent hover:border-neutral-900 transition-all">
            Shop Handbags
          </Link>
        </div>
        <ProductGrid products={mockHandbags} />
      </section>
    </div>
  );
}
