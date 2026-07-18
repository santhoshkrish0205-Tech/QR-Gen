'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import { useMenu, MENU_THEMES } from '@/lib/menu-context';
import {
  UtensilsCrossed, Palette, Eye, ChevronRight, Settings2,
  PenLine, List, Layers, ExternalLink, Rocket, Check,
} from 'lucide-react';

function PhonePreview() {
  const { restaurant, categories, menuItems, getTheme } = useMenu();
  const theme = getTheme(restaurant.themeId);
  const visibleCats = categories.slice(0, 4);

  return (
    <div
      className="w-[280px] h-[560px] rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-800 flex flex-col"
      style={{ background: theme.bgColor, color: theme.textColor, fontFamily: theme.font }}
    >
      {/* Header */}
      <div
        className="px-4 pt-6 pb-4 flex-shrink-0"
        style={{ background: theme.headerStyle === 'gradient' ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})` : theme.primaryColor }}
      >
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl mb-2">🍃</div>
        <p className="text-white font-bold text-base leading-tight">{restaurant.name}</p>
        <p className="text-white/70 text-xs">{restaurant.tagline}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-300 text-xs">★★★★★</span>
          <span className="text-white/60 text-[10px]">({restaurant.totalReviews})</span>
          <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${restaurant.isOpen ? 'bg-green-400/30 text-green-200' : 'bg-red-400/30 text-red-200'}`}>
            {restaurant.isOpen ? '● Open' : '● Closed'}
          </span>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 px-3 py-2 overflow-x-auto flex-shrink-0" style={{ background: theme.cardBg }}>
        {visibleCats.map((cat, i) => (
          <span
            key={cat.id}
            className="text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0"
            style={i === 0 ? { background: theme.accentColor, color: '#fff' } : { background: theme.bgColor, color: theme.textColor }}
          >
            {cat.emoji} {cat.name}
          </span>
        ))}
      </div>

      {/* Menu items */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {categories.slice(0, 2).map((cat) => {
          const items = menuItems.filter((m) => m.categoryId === cat.id).slice(0, 2);
          return (
            <div key={cat.id}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-60">{cat.emoji} {cat.name}</p>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 mb-1.5 rounded-xl"
                  style={{ background: theme.cardBg, borderRadius: `${theme.cardRadius / 2}px` }}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold truncate">{item.name}</p>
                    <p className="text-[10px] opacity-60 truncate">{item.description}</p>
                  </div>
                  <p className="text-[11px] font-bold flex-shrink-0" style={{ color: theme.accentColor }}>
                    {restaurant.currency}{item.price}
                  </p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MenuBuilderPage() {
  const { restaurant, updateRestaurant, getTheme } = useMenu();
  const router = useRouter();
  const theme = getTheme(restaurant.themeId);
  const [activeTab, setActiveTab] = useState<'info' | 'theme' | 'settings'>('info');

  const steps = [
    { label: 'Restaurant Info', href: '/menu-builder', icon: PenLine, done: true },
    { label: 'Menu Items', href: '/menu-builder/items', icon: List, done: true },
    { label: 'Choose Template', href: '/menu-builder/templates', icon: Layers, done: false },
    { label: 'Publish & QR', href: '/menu-builder/publish', icon: Rocket, done: restaurant.published },
  ];

  return (
    <div className="min-h-screen bg-shopbg">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 px-4 md:px-8 flex items-center justify-between bg-surface shadow-sm sticky top-0 z-30 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <UtensilsCrossed className="w-5 h-5 text-[#3525cd]" />
            <h2 className="font-jakarta text-xl font-semibold text-on-surface">Menu Builder</h2>
          </div>
          <div className="flex items-center gap-3">
            {restaurant.published && (
              <Link
                href={`/menu/${restaurant.slug}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-variant transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Preview Live
              </Link>
            )}
            <Link
              href="/menu-builder/publish"
              className="flex items-center gap-2 px-4 py-2 bg-[#3525cd] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Rocket className="w-4 h-4" /> Publish & Get QR
            </Link>
          </div>
        </header>

        <div className="p-6 flex-1">
          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={step.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    step.href === '/menu-builder'
                      ? 'bg-[#3525cd] text-white'
                      : step.done
                      ? 'bg-[#006c49]/10 text-[#006c49] border border-[#006c49]/30'
                      : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  {step.done && step.href !== '/menu-builder' ? <Check className="w-3.5 h-3.5" /> : <step.icon className="w-3.5 h-3.5" />}
                  {step.label}
                </Link>
                {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-outline flex-shrink-0" />}
              </div>
            ))}
          </div>

          {/* 3-column layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left: Restaurant Info Editor */}
            <div className="xl:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
                <div className="flex border-b border-outline-variant">
                  {(['info', 'theme', 'settings'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'text-[#3525cd] border-b-2 border-[#3525cd] bg-[#3525cd]/5' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                    >
                      {tab === 'info' ? 'Info' : tab === 'theme' ? 'Theme' : 'Settings'}
                    </button>
                  ))}
                </div>

                <div className="p-5 space-y-4">
                  {activeTab === 'info' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Restaurant Name</label>
                        <input
                          value={restaurant.name}
                          onChange={(e) => updateRestaurant({ name: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Tagline</label>
                        <input
                          value={restaurant.tagline}
                          onChange={(e) => updateRestaurant({ tagline: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                          placeholder="Fresh. Local. Delicious."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Menu URL Slug</label>
                        <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm">
                          <span className="text-on-surface-variant text-xs">shopqr.in/menu/</span>
                          <input
                            value={restaurant.slug}
                            onChange={(e) => updateRestaurant({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                            className="flex-1 outline-none bg-transparent font-medium text-[#3525cd]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Phone</label>
                        <input
                          value={restaurant.phone}
                          onChange={(e) => updateRestaurant({ phone: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Address</label>
                        <textarea
                          value={restaurant.address}
                          onChange={(e) => updateRestaurant({ address: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low resize-none"
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
                        <div>
                          <p className="text-sm font-medium text-on-surface">Open Now</p>
                          <p className="text-xs text-on-surface-variant">Customers see live status</p>
                        </div>
                        <button
                          onClick={() => updateRestaurant({ isOpen: !restaurant.isOpen })}
                          className={`relative w-11 h-6 rounded-full transition-colors ${restaurant.isOpen ? 'bg-[#006c49]' : 'bg-outline-variant'}`}
                        >
                          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${restaurant.isOpen ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">WhatsApp (for orders)</label>
                        <input
                          value={restaurant.socialLinks.whatsapp || ''}
                          onChange={(e) => updateRestaurant({ socialLinks: { ...restaurant.socialLinks, whatsapp: e.target.value } })}
                          className="w-full px-3 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                          placeholder="+919876543210"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Instagram</label>
                        <input
                          value={restaurant.socialLinks.instagram || ''}
                          onChange={(e) => updateRestaurant({ socialLinks: { ...restaurant.socialLinks, instagram: e.target.value } })}
                          className="w-full px-3 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Google Review URL</label>
                        <input
                          value={restaurant.googleReviewUrl}
                          onChange={(e) => updateRestaurant({ googleReviewUrl: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                          placeholder="https://g.page/r/.../review"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'theme' && (
                    <div className="space-y-4">
                      <p className="text-sm text-on-surface-variant">Quick-pick a template or go to the full gallery.</p>
                      <div className="grid grid-cols-2 gap-2">
                        {MENU_THEMES.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => updateRestaurant({ themeId: t.id })}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${restaurant.themeId === t.id ? 'border-[#3525cd]' : 'border-outline-variant hover:border-[#3525cd]/40'}`}
                            style={{ background: t.bgColor }}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className="w-3 h-3 rounded-full" style={{ background: t.primaryColor }} />
                              <div className="w-3 h-3 rounded-full" style={{ background: t.accentColor }} />
                            </div>
                            <p className="text-xs font-semibold" style={{ color: t.textColor }}>{t.name}</p>
                          </button>
                        ))}
                      </div>
                      <Link href="/menu-builder/templates" className="w-full py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-center block hover:bg-surface-variant transition-colors text-on-surface-variant">
                        View Full Template Gallery →
                      </Link>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Currency Symbol</label>
                        <select
                          value={restaurant.currency}
                          onChange={(e) => updateRestaurant({ currency: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                        >
                          <option value="₹">₹ Indian Rupee</option>
                          <option value="$">$ US Dollar</option>
                          <option value="€">€ Euro</option>
                          <option value="£">£ British Pound</option>
                          <option value="AED">AED Dirham</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">UPI ID (for pay at table)</label>
                        <input
                          value={restaurant.upiId || ''}
                          onChange={(e) => updateRestaurant({ upiId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                          placeholder="restaurant@upi"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Facebook</label>
                        <input
                          value={restaurant.socialLinks.facebook || ''}
                          onChange={(e) => updateRestaurant({ socialLinks: { ...restaurant.socialLinks, facebook: e.target.value } })}
                          className="w-full px-3 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                          placeholder="https://facebook.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Website</label>
                        <input
                          value={restaurant.socialLinks.website || ''}
                          onChange={(e) => updateRestaurant({ socialLinks: { ...restaurant.socialLinks, website: e.target.value } })}
                          className="w-full px-3 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Center: Phone Preview */}
            <div className="xl:col-span-4 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Eye className="w-4 h-4" />
                <span>Live Preview</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3525cd]/10 text-[#3525cd] font-semibold">REAL-TIME</span>
              </div>
              <PhonePreview />
              <p className="text-xs text-on-surface-variant text-center max-w-[220px]">
                This is exactly what your customers see when they scan the QR code.
              </p>
            </div>

            {/* Right: Quick Actions */}
            <div className="xl:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-5">
                <h3 className="font-jakarta font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-[#3525cd]" /> Next Steps
                </h3>
                <div className="space-y-3">
                  <Link href="/menu-builder/items" className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant hover:border-[#3525cd]/40 hover:bg-[#3525cd]/5 transition-all group">
                    <div className="w-9 h-9 rounded-lg bg-[#3525cd]/10 flex items-center justify-center group-hover:bg-[#3525cd] transition-colors">
                      <List className="w-4 h-4 text-[#3525cd] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">Edit Menu Items</p>
                      <p className="text-xs text-on-surface-variant">Add / edit categories & dishes</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant ml-auto" />
                  </Link>
                  <Link href="/menu-builder/templates" className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant hover:border-[#3525cd]/40 hover:bg-[#3525cd]/5 transition-all group">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                      <Layers className="w-4 h-4 text-purple-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">Choose Template</p>
                      <p className="text-xs text-on-surface-variant">8 professionally designed themes</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant ml-auto" />
                  </Link>
                  <Link href="/menu-builder/publish" className="flex items-center gap-3 p-3 rounded-xl border border-[#3525cd]/30 bg-[#3525cd]/5 hover:bg-[#3525cd]/10 transition-all group">
                    <div className="w-9 h-9 rounded-lg bg-[#3525cd] flex items-center justify-center">
                      <Rocket className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#3525cd]">Publish & Get QR</p>
                      <p className="text-xs text-on-surface-variant">Go live in one click</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#3525cd] ml-auto" />
                  </Link>
                </div>
              </div>

              {/* Stats */}
              {restaurant.published && (
                <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-5">
                  <h3 className="font-jakarta font-semibold text-on-surface mb-4">📊 Menu Analytics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-surface-container-low text-center">
                      <p className="text-2xl font-bold font-jakarta text-[#3525cd]">{restaurant.totalViews.toLocaleString()}</p>
                      <p className="text-xs text-on-surface-variant">Total Views</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-container-low text-center">
                      <p className="text-2xl font-bold font-jakarta text-[#006c49]">{restaurant.totalScans.toLocaleString()}</p>
                      <p className="text-xs text-on-surface-variant">QR Scans</p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 rounded-xl bg-[#3525cd]/5 border border-[#3525cd]/10">
                    <p className="text-xs font-semibold text-[#3525cd]">🔗 Live URL</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">shopqr.in/menu/{restaurant.slug}</p>
                  </div>
                </div>
              )}

              {/* Current theme */}
              <div className="rounded-2xl overflow-hidden border border-outline-variant">
                <div className="p-4" style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})` }}>
                  <p className="text-white text-xs font-semibold uppercase tracking-wider opacity-70">Active Template</p>
                  <p className="text-white font-jakarta text-lg font-bold mt-1">{theme.name}</p>
                  <p className="text-white/70 text-xs mt-0.5">{theme.description}</p>
                </div>
                <div className="p-3 bg-white flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background: theme.primaryColor }} />
                    <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background: theme.accentColor }} />
                    <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background: theme.bgColor }} />
                  </div>
                  <Link href="/menu-builder/templates" className="text-xs font-semibold text-[#3525cd] hover:underline">
                    Change →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
