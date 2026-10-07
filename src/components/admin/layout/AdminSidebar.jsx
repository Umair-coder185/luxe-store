'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: DashboardIcon, color: 'text-blue-600', bg: 'bg-blue-500/10', activeBg: 'bg-blue-500/20 border-blue-500/30' },
  { href: '/admin/navigation', label: 'Navigation', icon: MapIcon, color: 'text-emerald-600', bg: 'bg-emerald-500/10', activeBg: 'bg-emerald-500/20 border-emerald-500/30' },
  { href: '/admin/promotions', label: 'Promotions', icon: TicketIcon, color: 'text-rose-600', bg: 'bg-rose-500/10', activeBg: 'bg-rose-500/20 border-rose-500/30' },
  { href: '/admin/products', label: 'Products', icon: PackageIcon, color: 'text-violet-600', bg: 'bg-violet-500/10', activeBg: 'bg-violet-500/20 border-violet-500/30' },
  { href: '/admin/categories', label: 'Categories', icon: FolderIcon, color: 'text-amber-600', bg: 'bg-amber-500/10', activeBg: 'bg-amber-500/20 border-amber-500/30' },
  { href: '/admin/brands', label: 'Brands', icon: TagIcon, color: 'text-cyan-600', bg: 'bg-cyan-500/10', activeBg: 'bg-cyan-500/20 border-cyan-500/30' },
  { href: '/admin/collections', label: 'Collections', icon: LayersIcon, color: 'text-fuchsia-600', bg: 'bg-fuchsia-500/10', activeBg: 'bg-fuchsia-500/20 border-fuchsia-500/30' },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCartIcon, color: 'text-orange-600', bg: 'bg-orange-500/10', activeBg: 'bg-orange-500/20 border-orange-500/30' },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-slate-50 shadow-2xl border-r border-gray-200
          transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center h-20 px-6 border-b border-gray-200 bg-white">
          <Link href="/admin" onClick={onClose} className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 tracking-wider">
            LUXE ADMIN
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon, color, bg, activeBg }) => {
            const isActive =
              href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                  transition-all duration-300 group ${color}
                  ${isActive
                    ? `${activeBg} shadow-sm border`
                    : `${bg} hover:opacity-80 hover:-translate-y-0.5 border border-transparent`}
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

// ── Inline icons (zero dependencies) ─────────────────────────

function DashboardIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function MapIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
      <line x1="9" y1="3" x2="9" y2="18"></line>
      <line x1="15" y1="6" x2="15" y2="21"></line>
    </svg>
  );
}

function PackageIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function FolderIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function TagIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function LayersIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function ShoppingCartIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function TicketIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}