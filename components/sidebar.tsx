'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, QrCode, BarChart3, Settings, Plus, HelpCircle, LogOut, UtensilsCrossed, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useMenu } from '@/lib/menu-context';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Menu', href: '/menu-builder', icon: UtensilsCrossed },
  { label: 'QR Codes', href: '/generator', icon: QrCode },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { restaurant } = useMenu();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full z-40 py-6 bg-surface-container border-r border-outline-variant w-[280px]">
      <Link href="/" className="px-6 mb-8 flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white shadow-md">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-[#3525cd]">ShopQR</h1>
          <p className="text-xs text-on-surface-variant">Business QR Platform</p>
        </div>
      </Link>

      {/* Restaurant info pill */}
      <Link href="/menu-builder" className="mx-4 mb-5 px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:border-[#3525cd]/40 transition-all group flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3525cd] to-[#006c49] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {restaurant.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-on-surface truncate">{restaurant.name}</p>
          <p className="text-[11px] text-on-surface-variant">/{restaurant.slug}</p>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-[#3525cd] transition-colors" />
      </Link>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                active
                  ? 'bg-[#3525cd] text-white shadow-sm shadow-[#3525cd]/30'
                  : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.label === 'My Menu' && restaurant.published && (
                <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#006c49]/20 text-[#006c49]">
                  Live
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto space-y-1">
        <Link
          href="/menu-builder/items"
          className="w-full bg-[#3525cd] text-white py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mb-6 hover:opacity-90 transition-opacity shadow-lg shadow-[#3525cd]/25"
        >
          <Plus className="w-4 h-4" />
          Add Menu Item
        </Link>
        <button
          onClick={() => toast.info('Help Center coming soon!', { description: 'Check our FAQ on the homepage for now.' })}
          className="flex items-center gap-3 py-3 px-4 text-on-surface-variant font-medium text-sm rounded-xl hover:bg-surface-variant transition-colors w-full"
        >
          <HelpCircle className="w-5 h-5" />
          Help Center
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 py-3 px-4 text-on-surface-variant font-medium text-sm rounded-xl hover:bg-surface-variant transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
