import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1c1c1c] border-t border-[#333] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-serif tracking-widest bg-gradient-to-r from-[#e6c875] via-[#f9e596] to-[#b38b36] text-transparent bg-clip-text block mb-6 w-fit">
              Depra Shop
            </Link>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Premium apparel and lifestyle goods curated for the modern individual. Designed with restraint and intention.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-neutral-100 tracking-wider uppercase mb-6">
              Shop
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/new-arrivals" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-100 tracking-wider uppercase mb-6">
              Support
            </h3>
            <ul className="space-y-4">
              {/* These are just placeholders for the foundation. No real routes required yet. */}
              <li>
                <span className="text-sm text-neutral-400 cursor-default">
                  Contact Us
                </span>
              </li>
              <li>
                <span className="text-sm text-neutral-400 cursor-default">
                  Shipping & Returns
                </span>
              </li>
              <li>
                <span className="text-sm text-neutral-400 cursor-default">
                  FAQ
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#333] flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-neutral-500 mb-4 md:mb-0">
            &copy; {year} Depra Shop. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <span className="text-xs text-neutral-500 cursor-default">Privacy Policy</span>
            <span className="text-xs text-neutral-500 cursor-default">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
