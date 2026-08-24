import Link from "next/link";
import MobileMenu from "./MobileMenu";
import CartWishlistNav from "./CartWishlistNav";
import DesktopNav from "./DesktopNav";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#1c1c1c] border-b border-[#333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Mobile Menu */}
          <div className="flex-1 flex items-center lg:hidden">
            <MobileMenu />
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center lg:justify-start lg:w-48">
            <Link href="/" className="text-2xl font-serif tracking-widest bg-gradient-to-r from-[#e6c875] via-[#f9e596] to-[#b38b36] text-transparent bg-clip-text">
              Depra Shop
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center h-full">
            <DesktopNav />
          </div>

          {/* Actions */}
          <div className="flex-1 flex items-center justify-end space-x-4 lg:space-x-6">
            <Link href="/search" className="text-neutral-300 hover:text-white transition-colors flex items-center" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </Link>

            <div className="hidden lg:flex items-center space-x-4 lg:space-x-6 border-l border-[#333] pl-4 lg:pl-6">
              <CartWishlistNav isMobile={false} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
