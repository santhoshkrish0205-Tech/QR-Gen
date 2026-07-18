'use client';

import Sidebar from '@/components/sidebar';
import Link from 'next/link';
import { useMenu, MENU_THEMES } from '@/lib/menu-context';
import { ChevronRight, Check, Layers } from 'lucide-react';
import { toast } from 'sonner';

export default function TemplatesPage() {
  const { restaurant, updateRestaurant } = useMenu();

  const handleSelect = (themeId: string) => {
    updateRestaurant({ themeId });
    toast.success('Template applied! Preview updated.', { description: 'You can change it anytime.' });
  };

  return (
    <div className="min-h-screen bg-shopbg">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen flex flex-col">
        <header className="h-16 px-8 flex items-center justify-between bg-surface shadow-sm sticky top-0 z-30 border-b border-outline-variant">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/menu-builder" className="hover:text-[#3525cd] transition-colors">Menu Builder</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-on-surface font-semibold">Templates</span>
          </div>
          <Link href="/menu-builder/items" className="px-5 py-2 bg-[#3525cd] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            Next: Edit Items →
          </Link>
        </header>

        <div className="p-8 flex-1">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3525cd]/10 text-[#3525cd] text-sm font-semibold mb-4">
                <Layers className="w-4 h-4" /> 8 Templates
              </div>
              <h1 className="font-jakarta text-3xl font-bold text-on-surface mb-2">Choose Your Menu Style</h1>
              <p className="text-on-surface-variant">Pick a template that matches your brand. All templates are fully customizable.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {MENU_THEMES.map((theme) => {
                const isActive = restaurant.themeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => handleSelect(theme.id)}
                    className={`rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl ${
                      isActive ? 'ring-2 ring-[#3525cd] ring-offset-2 shadow-lg' : 'border border-outline-variant'
                    }`}
                  >
                    {/* Mini preview */}
                    <div className="h-48 relative overflow-hidden" style={{ background: theme.bgColor }}>
                      {/* Header bar */}
                      <div
                        className="h-16 flex flex-col justify-center px-4"
                        style={{
                          background: theme.headerStyle === 'gradient'
                            ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`
                            : theme.primaryColor,
                        }}
                      >
                        <div className="w-6 h-6 rounded-full bg-white/20 mb-1 flex items-center justify-center text-xs">🍃</div>
                        <p className="text-white font-bold text-xs" style={{ fontFamily: theme.font }}>Restaurant Name</p>
                      </div>
                      {/* Category pills */}
                      <div className="flex gap-1 px-3 py-2" style={{ background: theme.cardBg }}>
                        {['Pizza', 'Burgers', 'Drinks'].map((c, i) => (
                          <span
                            key={c}
                            className="text-[8px] font-bold px-2 py-0.5 rounded-full"
                            style={i === 0 ? { background: theme.accentColor, color: '#fff' } : { background: theme.bgColor, color: theme.textColor }}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                      {/* Item rows */}
                      <div className="px-3 space-y-1.5 mt-1">
                        {['Margherita', 'Veg Supreme'].map((name, i) => (
                          <div
                            key={name}
                            className="flex items-center gap-2 p-1.5"
                            style={{ background: theme.cardBg, borderRadius: `${theme.cardRadius / 3}px` }}
                          >
                            <div className="w-6 h-6 rounded flex-shrink-0" style={{ background: theme.accentColor + '30' }} />
                            <div className="flex-1">
                              <div className="h-1.5 rounded-full w-16 mb-1" style={{ background: theme.textColor + '40' }} />
                              <div className="h-1 rounded-full w-10" style={{ background: theme.textColor + '20' }} />
                            </div>
                            <div className="text-[8px] font-bold" style={{ color: theme.accentColor }}>₹{i === 0 ? 249 : 349}</div>
                          </div>
                        ))}
                      </div>
                      {/* Selected badge */}
                      {isActive && (
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#3525cd] flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-jakarta font-bold text-sm text-on-surface">{theme.name}</h3>
                        {isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3525cd]/10 text-[#3525cd]">Active</span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant mb-3">{theme.description}</p>
                      <div className="flex items-center gap-1.5">
                        {[theme.primaryColor, theme.accentColor, theme.bgColor].map((c, i) => (
                          <div key={i} className="w-4 h-4 rounded-full border border-outline-variant/50 shadow-sm" style={{ background: c }} />
                        ))}
                        <span className="text-[10px] text-on-surface-variant ml-1">{theme.font}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/menu-builder" className="px-5 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-variant transition-colors">
                ← Back to Builder
              </Link>
              <Link href="/menu-builder/items" className="px-6 py-2.5 bg-[#3525cd] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                Continue: Edit Menu Items →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
