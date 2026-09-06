"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CartWishlistNav from "./CartWishlistNav";

export default function MobileMenu({ navLinks = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (name) => {
    setExpandedItems(prev => ({ ...prev, [name]: !prev[name] }));
  };

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
            
            <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col h-full">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <div key={link.id || link.name} className="flex flex-col border-b border-neutral-100 pb-2">
                    {link.hasDropdown ? (
                      <div>
                        <button 
                          onClick={() => toggleExpand(link.name)}
                          className="flex justify-between items-center w-full text-lg font-medium text-neutral-900 py-2 text-left"
                        >
                          {link.name}
                          <svg 
                            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            className={`transform transition-transform ${expandedItems[link.name] ? 'rotate-180' : ''}`}
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                        {expandedItems[link.name] && (
                          <div className="flex flex-col pl-4 mt-2 space-y-4 mb-2">
                            {link.megaMenu?.map((column, idx) => (
                              <div key={idx} className="flex flex-col space-y-2">
                                <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                                  {column.title}
                                </span>
                                {column.items.map((item, itemIdx) => (
                                  <Link 
                                    key={itemIdx} 
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-sm text-neutral-600 py-1 ${item.name.includes('>') ? 'font-medium text-neutral-900' : ''}`}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link 
                        href={link.href} 
                        onClick={() => setIsOpen(false)} 
                        className="text-lg font-medium text-neutral-900 py-2 hover:text-neutral-600"
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-neutral-100 flex flex-col space-y-4">
                <CartWishlistNav isMobile={true} onClick={() => setIsOpen(false)} />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
