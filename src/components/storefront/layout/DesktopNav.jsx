"use client";

import { useState } from "react";
import Link from "next/link";

export default function DesktopNav({ navLinks = [] }) {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMouseEnter = (name) => {
    setActiveMenu(name);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <nav className="hidden lg:flex space-x-6 h-full" onMouseLeave={handleMouseLeave}>
      {navLinks.map((link) => (
        <div 
          key={link.id || link.name}
          className="flex h-full"
          onMouseEnter={() => handleMouseEnter(link.name)}
        >
          <Link
            href={link.href}
            className="flex items-center text-sm font-semibold tracking-widest text-white hover:text-gray-200 transition-colors uppercase h-full py-5"
          >
            {link.name}
          </Link>

          {/* Mega Menu Dropdown */}
          {link.hasDropdown && activeMenu === link.name && (
            <div className="absolute top-full left-0 w-full bg-[#1c1c1c] shadow-2xl border-t border-[#333] z-50 transition-all duration-300">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-4 gap-8">
                  {link.megaMenu?.map((column, idx) => (
                    <div key={idx} className="flex flex-col space-y-4">
                      <h3 className="text-sm font-bold tracking-widest text-neutral-100 uppercase">
                        {column.title}
                      </h3>
                      <div className="flex flex-col space-y-3">
                        {column.items.map((item, itemIdx) => (
                          <Link 
                            key={itemIdx} 
                            href={item.href}
                            className={`text-sm text-neutral-400 hover:text-white hover:underline underline-offset-4 ${item.name.includes('>') ? 'font-medium' : ''}`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Placeholder for future columns if the array is short */}
                  {link.megaMenu?.length < 4 && (
                     Array.from({ length: 4 - link.megaMenu.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="hidden lg:block"></div>
                     ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
