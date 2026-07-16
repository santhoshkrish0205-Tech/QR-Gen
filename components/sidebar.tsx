'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, QrCode, BarChart3, Settings, Plus, HelpCircle, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Generator', href: '/generator', icon: QrCode },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full z-40 py-6 bg-surface-container border-r border-outline-variant w-[280px]">
      <Link href="/" className="px-6 mb-8 flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-primary">ShopQR Pro</h1>
          <p className="text-xs text-on-surface-variant">Local Bakery Store</p>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 py-3 px-4 mx-2 rounded-lg font-medium text-sm transition-colors ${
                active
                  ? 'bg-secondary-container text-on-secondary-container opacity-80'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 mt-auto space-y-1">
        <button
          onClick={() => router.push('/generator')}
          className="w-full bg-primary-container text-white py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 mb-6 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Create New QR
        </button>
        <button
          onClick={() => toast.info('Help Center coming soon!', { description: 'Check our FAQ on the homepage for now.' })}
          className="flex items-center gap-3 py-3 px-4 mx-2 text-on-surface-variant font-medium text-sm rounded-lg hover:bg-surface-variant transition-colors w-full"
        >
          <HelpCircle className="w-5 h-5" />
          Help Center
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 py-3 px-4 mx-2 text-on-surface-variant font-medium text-sm rounded-lg hover:bg-surface-variant transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
