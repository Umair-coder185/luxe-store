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
    <nav className="hidden lg:flex space-x-8 h-full" onMouseLeave={handleMouseLeave}>
      {navLinks.map((link) => {
        const isOpen = activeMenu === link.name;
        return (
          <div
            key={link.id || link.name}
            className="flex h-full"
            onMouseEnter={() => handleMouseEnter(link.name)}
          >
            <Link
              href={link.href}
              className={`relative flex items-center text-xs font-bold tracking-[0.22em] uppercase h-full py-5 transition-colors ${
                isOpen
                  ? "text-[#8c6920]"
                  : "text-neutral-900 hover:text-[#8c6920]"
              }`}
            >
              <span>{link.name}</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#8c6920] to-[#d4af37] transition-transform duration-300 origin-center ${
                  isOpen ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>

            {/* Translucent Frosted-Glass Mega Menu Dropdown */}
            {link.hasDropdown && isOpen && (
              <div className="absolute top-full left-0 w-full bg-[#faf6ee]/90 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.16)] border-t-2 border-[#b38b36] border-b border-[#d4af37]/40 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <div className="grid grid-cols-4 gap-10">
                    {link.megaMenu?.map((column, idx) => (
                      <div key={idx} className="flex flex-col space-y-4">
                        <h3 className="text-xs font-bold tracking-[0.25em] text-[#8c6920] uppercase border-b border-[#d4af37]/35 pb-2.5">
                          {column.title}
                        </h3>
                        <div className="flex flex-col space-y-2.5">
                          {column.items.map((item, itemIdx) => (
                            <Link
                              key={itemIdx}
                              href={item.href}
                              className={`group flex items-center justify-between text-sm text-neutral-800 hover:text-[#8c6920] transition-colors ${
                                item.name.includes(">") ? "font-semibold text-neutral-950" : "font-medium"
                              }`}
                            >
                              <span>{item.name}</span>
                              <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-xs text-[#8c6920]">
                                &rarr;
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}

                    {link.megaMenu?.length < 4 &&
                      Array.from({ length: 4 - link.megaMenu.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="hidden lg:block" />
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
