"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 rounded-sm"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Drawer */}
          <div 
            className="relative flex flex-col w-full max-w-xs bg-white shadow-xl h-full"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <span className="text-lg font-light tracking-widest text-neutral-900">LUXE</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-neutral-500 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 rounded-sm"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
              <div className="flex flex-col space-y-4">
                <Link href="/new-arrivals" onClick={() => setIsOpen(false)} className="text-lg font-medium text-neutral-900 hover:text-neutral-600">
                  New Arrivals
                </Link>
                <Link href="/products" onClick={() => setIsOpen(false)} className="text-lg font-medium text-neutral-900 hover:text-neutral-600">
                  Products
                </Link>
                <Link href="/search" onClick={() => setIsOpen(false)} className="text-lg font-medium text-neutral-900 hover:text-neutral-600">
                  Search
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
