'use client';

import { useState, useEffect, useRef } from 'react';
import { useMenu } from '@/lib/menu-context';
import { Search, Phone, MapPin, Star, Instagram, Globe, MessageCircle, X, ChevronUp, ExternalLink } from 'lucide-react';

type FilterType = 'all' | 'veg' | 'nonveg' | 'popular' | 'spicy' | 'chef';

export default function PublicMenuPage({ params }: { params: { slug: string } }) {
  const { restaurant, categories, menuItems, getTheme, updateRestaurant } = useMenu();
  const theme = getTheme(restaurant.themeId);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [activeCat, setActiveCat] = useState<string>(categories[0]?.id || '');
  const [showSearch, setShowSearch] = useState(false);
  const [lightboxImg, setLightboxImg] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const catRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Track views
  useEffect(() => {
    updateRestaurant({ totalViews: restaurant.totalViews + 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Slug mismatch check — show fallback if slugs differ
  if (restaurant.slug !== params.slug && !restaurant.published) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8 text-center">
        <div>
          <p className="text-6xl mb-4">🍽️</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Menu not found</h1>
          <p className="text-gray-500">This menu hasn't been published yet or the URL is incorrect.</p>
        </div>
      </div>
    );
  }

  const scrollToCategory = (catId: string) => {
    setActiveCat(catId);
    catRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Filter + search
  const getFilteredItems = (categoryId: string) => {
    return menuItems.filter((item) => {
      if (item.categoryId !== categoryId) return false;
      if (!item.isAvailable) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === 'veg' && !item.isVeg) return false;
      if (filter === 'nonveg' && item.isVeg) return false;
      if (filter === 'popular' && !item.isPopular) return false;
      if (filter === 'spicy' && !item.isSpicy) return false;
      if (filter === 'chef' && !item.isChefSpecial) return false;
      return true;
    });
  };

  const visibleCategories = categories.filter((cat) => getFilteredItems(cat.id).length > 0 || (!search && filter === 'all'));

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'all', label: '✨ All' },
    { key: 'veg', label: '🌿 Veg' },
    { key: 'nonveg', label: '🍗 Non-Veg' },
    { key: 'popular', label: '⭐ Popular' },
    { key: 'spicy', label: '🌶️ Spicy' },
    { key: 'chef', label: '👨‍🍳 Chef\'s Special' },
  ];

  const isDark = theme.bgColor === '#0f0f0f' || theme.bgColor === '#0d0d0d';

  return (
    <div className="min-h-screen" style={{ background: theme.bgColor, color: theme.textColor, fontFamily: theme.font }}>
      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightboxImg('')}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setLightboxImg('')}>
            <X className="w-8 h-8" />
          </button>
          <img src={lightboxImg} alt="Full view" className="max-w-full max-h-full rounded-xl" />
        </div>
      )}

      {/* Hero Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: theme.headerStyle === 'gradient'
            ? `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.accentColor} 100%)`
            : theme.primaryColor,
        }}
      >
        {/* Banner */}
        {restaurant.banner && (
          <div className="absolute inset-0 opacity-20">
            <img src={restaurant.banner} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative px-5 pt-8 pb-6">
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl mb-4 shadow-lg">
            {restaurant.logo ? <img src={restaurant.logo} alt="logo" className="w-full h-full rounded-2xl object-cover" /> : '🍃'}
          </div>
          <h1 className="text-white font-bold text-2xl leading-tight mb-1">{restaurant.name}</h1>
          <p className="text-white/70 text-sm mb-3">{restaurant.tagline}</p>
          {/* Rating & status */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full">
              <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span className="text-white text-sm font-semibold">{restaurant.rating}</span>
              <span className="text-white/60 text-xs">({restaurant.totalReviews} reviews)</span>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${restaurant.isOpen ? 'bg-green-400/25 text-green-200 border border-green-400/30' : 'bg-red-400/25 text-red-200 border border-red-400/30'}`}>
              {restaurant.isOpen ? '● Open Now' : '● Closed'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {restaurant.socialLinks.whatsapp && (
              <a
                href={`https://wa.me/${restaurant.socialLinks.whatsapp.replace(/[^0-9]/g, '')}?text=Hi! I'd like to order from your menu.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-white rounded-full text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Order on WhatsApp
              </a>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/15 text-white rounded-full text-xs font-semibold hover:bg-white/25 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
            )}
            {restaurant.googleReviewUrl && (
              <a
                href={restaurant.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-white/15 text-white rounded-full text-xs font-semibold hover:bg-white/25 transition-colors"
              >
                ⭐ Review
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Sticky category tabs + search */}
      <div
        className="sticky top-0 z-20 shadow-sm"
        style={{ background: theme.cardBg || theme.bgColor }}
      >
        {/* Search bar (collapsible) */}
        {showSearch && (
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border" style={{ borderColor: theme.accentColor + '40', background: theme.bgColor }}>
              <Search className="w-4 h-4" style={{ color: theme.accentColor }} />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: theme.textColor }}
              />
              {search && <button onClick={() => setSearch('')}><X className="w-4 h-4" style={{ color: theme.textColor }} /></button>}
            </div>
          </div>
        )}

        {/* Category pills */}
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
          <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-full flex-shrink-0" style={{ background: showSearch ? theme.accentColor : theme.bgColor, color: showSearch ? '#fff' : theme.textColor }}>
            <Search className="w-4 h-4" />
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all"
              style={activeCat === cat.id
                ? { background: theme.accentColor, color: '#fff' }
                : { background: theme.bgColor, color: theme.textColor, border: `1px solid ${theme.accentColor}30` }
              }
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 transition-all"
              style={filter === f.key
                ? { background: theme.primaryColor, color: '#fff' }
                : { background: theme.bgColor, color: theme.textColor, border: `1px solid ${theme.textColor}20` }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu sections */}
      <div className="px-4 py-4 space-y-6 pb-28">
        {visibleCategories.map((cat) => {
          const items = getFilteredItems(cat.id);
          if (items.length === 0) return null;
          return (
            <div key={cat.id} ref={(el) => { catRefs.current[cat.id] = el; }}>
              <h2 className="font-bold text-base uppercase tracking-wider mb-3 pb-2" style={{ borderBottom: `2px solid ${theme.accentColor}30` }}>
                {cat.emoji} {cat.name}
                <span className="ml-2 text-xs font-normal opacity-50">({items.length})</span>
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-2xl"
                    style={{ background: theme.cardBg, borderRadius: `${theme.cardRadius}px` }}
                  >
                    {/* Image */}
                    {item.image && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => setLightboxImg(item.image)}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {/* Veg indicator */}
                      <div className="flex items-start gap-1.5 mb-0.5">
                        <div className={`mt-0.5 w-4 h-4 border-2 rounded-sm flex items-center justify-center flex-shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                          <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                        </div>
                        <p className="font-semibold text-sm leading-snug" style={{ color: theme.textColor }}>{item.name}</p>
                      </div>
                      <p className="text-xs mb-2 line-clamp-2 opacity-60" style={{ color: theme.textColor }}>{item.description}</p>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.isPopular && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">⭐ Popular</span>}
                        {item.isChefSpecial && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">👨‍🍳 Chef's Special</span>}
                        {item.isSpicy && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">🌶️ Spicy</span>}
                        {item.isNew && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">🆕 New</span>}
                      </div>

                      <p className="font-bold text-base" style={{ color: theme.accentColor }}>
                        {restaurant.currency}{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* No results */}
        {visibleCategories.every((cat) => getFilteredItems(cat.id).length === 0) && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-lg" style={{ color: theme.textColor }}>No dishes found</p>
            <p className="text-sm opacity-60 mt-1" style={{ color: theme.textColor }}>Try a different search or filter</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 py-4 flex items-center justify-between"
        style={{ background: theme.cardBg, borderTop: `1px solid ${theme.textColor}15` }}
      >
        <div className="flex items-center gap-3">
          {restaurant.socialLinks.instagram && (
            <a href={restaurant.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
              <Instagram className="w-5 h-5" style={{ color: theme.textColor }} />
            </a>
          )}
          {restaurant.socialLinks.website && (
            <a href={restaurant.socialLinks.website} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
              <Globe className="w-5 h-5" style={{ color: theme.textColor }} />
            </a>
          )}
          {restaurant.address && (
            <a
              href={`https://maps.google.com?q=${encodeURIComponent(restaurant.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <MapPin className="w-5 h-5" style={{ color: theme.textColor }} />
            </a>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-40">
          <span className="text-[10px]" style={{ color: theme.textColor }}>Powered by</span>
          <span className="text-[10px] font-bold" style={{ color: theme.accentColor }}>ShopQR</span>
        </div>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 w-10 h-10 rounded-full shadow-xl flex items-center justify-center z-30 transition-all"
          style={{ background: theme.accentColor }}
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </button>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
      `}</style>
    </div>
  );
}
