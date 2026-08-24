import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu */}
          <div className="flex-1 flex items-center lg:hidden">
            <MobileMenu />
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center lg:justify-start lg:flex-1">
            <Link href="/" className="text-2xl font-light tracking-widest text-neutral-900">
              LUXE
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link href="/new-arrivals" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              New Arrivals
            </Link>
            <Link href="/products" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Products
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex-1 flex items-center justify-end space-x-4 lg:space-x-6">
            <Link href="/search" className="text-neutral-600 hover:text-neutral-900 transition-colors" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
