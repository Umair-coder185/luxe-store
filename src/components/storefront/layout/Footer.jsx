import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#f5efe2] text-neutral-900 border-t-2 border-[#d4af37]/60">
      {/* Top Privé Newsletter & VIP Banner */}
      <div className="border-b border-[#d4af37]/35 bg-[#ece2ce]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left space-y-2 max-w-xl">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#8c6920] font-bold">
              The Depra Privé Circle
            </p>
            <h3 className="text-2xl sm:text-3xl font-serif tracking-wide text-neutral-950">
              Unlock Private Access to Runway Editions &amp; VIP Offers
            </h3>
          </div>
          <div className="w-full max-w-md flex items-center border border-[#b38b36]/50 bg-white rounded-full p-1.5 shadow-sm">
            <input
              type="email"
              placeholder="Enter your email address..."
              aria-label="Email address"
              className="flex-1 bg-transparent px-4 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
            <Link
              href="/sign-up"
              className="px-6 py-2.5 rounded-full bg-neutral-900 text-[#f3dc99] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#8c6920] hover:text-white transition-all shrink-0"
            >
              Join Privé
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Maison Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-serif tracking-[0.18em] bg-gradient-to-r from-[#7a5a18] via-[#b38b36] to-[#6b4e12] text-transparent bg-clip-text block">
                Depra Shop
              </span>
              <span className="text-[9px] font-semibold tracking-[0.38em] uppercase text-[#8c6920] block mt-0.5">
                Maison de Haute Couture &amp; Horology
              </span>
            </Link>
            <p className="text-sm text-neutral-700 max-w-sm leading-relaxed">
              Curating iconic leather handbags, Swiss timepieces, and fine jewelry from the world&apos;s most celebrated luxury houses. Every piece is authenticated with uncompromising precision.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-[0.25em] uppercase text-[#8c6920]">
              <span>Paris</span>
              <span className="text-neutral-400">•</span>
              <span>Milan</span>
              <span className="text-neutral-400">•</span>
              <span>London</span>
              <span className="text-neutral-400">•</span>
              <span>Dubai</span>
            </div>
          </div>

          {/* The Boutique */}
          <div>
            <h4 className="text-xs font-bold text-[#8c6920] tracking-[0.25em] uppercase mb-6">
              The Boutique
            </h4>
            <ul className="space-y-3.5">
              <li>
                <Link href="/new-arrivals" className="text-sm font-medium text-neutral-800 hover:text-[#8c6920] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm font-medium text-neutral-800 hover:text-[#8c6920] transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/watches" className="text-sm font-medium text-neutral-800 hover:text-[#8c6920] transition-colors">
                  The Watch Boutique
                </Link>
              </li>
              <li>
                <Link href="/categories/handbags" className="text-sm font-medium text-neutral-800 hover:text-[#8c6920] transition-colors">
                  Luxury Handbags
                </Link>
              </li>
              <li>
                <Link href="/hot-deals" className="text-sm font-medium text-neutral-800 hover:text-[#8c6920] transition-colors">
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-xs font-bold text-[#8c6920] tracking-[0.25em] uppercase mb-6">
              Client Concierge
            </h4>
            <ul className="space-y-3.5">
              <li>
                <Link href="/wishlist" className="text-sm font-medium text-neutral-800 hover:text-[#8c6920] transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm font-medium text-neutral-800 hover:text-[#8c6920] transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <span className="text-sm text-neutral-700">
                  Authenticity Guarantee
                </span>
              </li>
              <li>
                <span className="text-sm text-neutral-700">
                  Insured Global Shipping
                </span>
              </li>
              <li>
                <span className="text-sm text-neutral-700">
                  White-Glove Returns
                </span>
              </li>
            </ul>
          </div>

          {/* Vip Assurance */}
          <div>
            <h4 className="text-xs font-bold text-[#8c6920] tracking-[0.25em] uppercase mb-6">
              Maison Hours
            </h4>
            <div className="space-y-4 text-sm text-neutral-700">
              <p className="leading-relaxed">
                Personal styling &amp; order assistance available 7 days a week.
              </p>
              <div className="p-4 rounded-xl border border-[#b38b36]/40 bg-white/80 space-y-1 shadow-xs">
                <p className="text-xs uppercase tracking-widest text-[#8c6920] font-bold">
                  VIP Client Line
                </p>
                <p className="text-xs font-medium text-neutral-900">
                  concierge@deprashop.luxury
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#d4af37]/35 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-neutral-700 tracking-wide">
            &copy; {year} Depra Shop — Maison de Luxe. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 border border-[#b38b36]/35 bg-white/75 rounded text-[10px] font-semibold tracking-widest text-neutral-800 uppercase">
              Visa
            </span>
            <span className="px-2.5 py-1 border border-[#b38b36]/35 bg-white/75 rounded text-[10px] font-semibold tracking-widest text-neutral-800 uppercase">
              Mastercard
            </span>
            <span className="px-2.5 py-1 border border-[#b38b36]/35 bg-white/75 rounded text-[10px] font-semibold tracking-widest text-neutral-800 uppercase">
              Amex
            </span>
            <span className="px-2.5 py-1 border border-[#8c6920] bg-neutral-900 rounded text-[10px] font-semibold tracking-widest text-[#f3dc99] uppercase">
              100% Verified
            </span>
          </div>
          <div className="flex space-x-6">
            <span className="text-xs font-medium text-neutral-700 hover:text-neutral-950 transition-colors cursor-default">
              Privacy Policy
            </span>
            <span className="text-xs font-medium text-neutral-700 hover:text-neutral-950 transition-colors cursor-default">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
