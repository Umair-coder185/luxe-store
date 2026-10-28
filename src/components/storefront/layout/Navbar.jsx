import Link from "next/link";
import MobileMenu from "./MobileMenu";
import CartWishlistNav from "./CartWishlistNav";
import DesktopNav from "./DesktopNav";
import { getStorefrontNavigation } from "@/lib/queries/storefront/navigation";

export default async function Navbar() {
  // Gracefully fallback to empty array if database fails to connect/query during setup
  let navLinks = [];
  try {
    navLinks = await getStorefrontNavigation();
  } catch (error) {
    console.error("Failed to load storefront navigation:", error);
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f5efe2] border-b border-[#d4af37]/55 shadow-[0_6px_20px_rgba(140,105,32,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 relative">
          {/* Mobile Menu */}
          <div className="flex-1 flex items-center lg:hidden">
            <MobileMenu navLinks={navLinks} />
          </div>

          {/* Luxury Brand Logo */}
          <div className="flex-shrink-0 flex items-center justify-center lg:justify-start lg:w-56">
            <Link href="/" className="group flex flex-col items-center lg:items-start">
              <span className="text-3xl sm:text-[32px] font-serif tracking-[0.18em] bg-gradient-to-r from-[#7a5a18] via-[#b38b36] to-[#6b4e12] text-transparent bg-clip-text">
                Depra Shop
              </span>
              <span className="text-[9px] font-semibold tracking-[0.38em] uppercase text-[#8c6920] -mt-1 group-hover:text-neutral-900 transition-colors">
                Maison de Luxe
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center h-full">
            <DesktopNav navLinks={navLinks} />
          </div>

          {/* Actions */}
          <div className="flex-1 flex items-center justify-end space-x-4 lg:space-x-6">
            <Link
              href="/search"
              className="w-9 h-9 rounded-full border border-[#b38b36]/45 bg-white/60 hover:bg-neutral-900 text-neutral-900 hover:text-[#f3dc99] transition-all flex items-center justify-center"
              aria-label="Search"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </Link>

            <div className="hidden lg:flex items-center space-x-5 lg:space-x-6 border-l border-[#b38b36]/35 pl-5 lg:pl-6">
              <CartWishlistNav isMobile={false} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
