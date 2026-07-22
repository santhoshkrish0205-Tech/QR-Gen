'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  website?: string;
  whatsapp?: string;
}

export interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo: string;
  banner: string;
  phone: string;
  address: string;
  themeId: string;
  isOpen: boolean;
  rating: number;
  totalReviews: number;
  googleReviewUrl: string;
  socialLinks: SocialLinks;
  openingHours: OpeningHours;
  published: boolean;
  currency: string;
  upiId?: string;
  totalViews: number;
  totalScans: number;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  emoji: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isPopular: boolean;
  isAvailable: boolean;
  isSpicy: boolean;
  isNew: boolean;
  isChefSpecial: boolean;
}

export interface MenuTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  font: string;
  cardRadius: number;
  buttonStyle: 'rounded' | 'pill' | 'square';
  headerStyle: 'gradient' | 'image' | 'solid';
  accentColor: string;
  description: string;
}

// ── Themes ────────────────────────────────────────────────────────────────────

export const MENU_THEMES: MenuTheme[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    primaryColor: '#1a1a2e',
    secondaryColor: '#e94560',
    bgColor: '#f8f8f8',
    cardBg: '#ffffff',
    textColor: '#1a1a2e',
    font: 'Inter',
    cardRadius: 12,
    buttonStyle: 'rounded',
    headerStyle: 'solid',
    accentColor: '#e94560',
    description: 'Clean and modern, perfect for any restaurant',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    primaryColor: '#ffffff',
    secondaryColor: '#6c63ff',
    bgColor: '#0f0f0f',
    cardBg: '#1a1a1a',
    textColor: '#ffffff',
    font: 'Inter',
    cardRadius: 16,
    buttonStyle: 'pill',
    headerStyle: 'gradient',
    accentColor: '#6c63ff',
    description: 'Sleek dark theme for a premium look',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    primaryColor: '#1c1208',
    secondaryColor: '#c9a84c',
    bgColor: '#0d0d0d',
    cardBg: '#1a1408',
    textColor: '#f0e6c8',
    font: 'Playfair Display',
    cardRadius: 8,
    buttonStyle: 'square',
    headerStyle: 'image',
    accentColor: '#c9a84c',
    description: 'Elegant gold accents for fine dining',
  },
  {
    id: 'cafe',
    name: 'Café',
    primaryColor: '#3c2a21',
    secondaryColor: '#a0522d',
    bgColor: '#fdf6ec',
    cardBg: '#fff9f0',
    textColor: '#3c2a21',
    font: 'Georgia',
    cardRadius: 20,
    buttonStyle: 'pill',
    headerStyle: 'gradient',
    accentColor: '#a0522d',
    description: 'Warm tones for coffee shops & cafés',
  },
  {
    id: 'indian',
    name: 'Indian Restaurant',
    primaryColor: '#8b0000',
    secondaryColor: '#ff6b00',
    bgColor: '#fff8f0',
    cardBg: '#ffffff',
    textColor: '#2d1506',
    font: 'Inter',
    cardRadius: 12,
    buttonStyle: 'rounded',
    headerStyle: 'gradient',
    accentColor: '#ff6b00',
    description: 'Vibrant spices-inspired design',
  },
  {
    id: 'street',
    name: 'Street Food',
    primaryColor: '#1a1a1a',
    secondaryColor: '#ffca28',
    bgColor: '#f5f5f5',
    cardBg: '#ffffff',
    textColor: '#1a1a1a',
    font: 'Inter',
    cardRadius: 6,
    buttonStyle: 'square',
    headerStyle: 'solid',
    accentColor: '#ffca28',
    description: 'Bold and energetic for street food stalls',
  },
  {
    id: 'fastfood',
    name: 'Fast Food',
    primaryColor: '#d32f2f',
    secondaryColor: '#ff5722',
    bgColor: '#fff3e0',
    cardBg: '#ffffff',
    textColor: '#1a1a1a',
    font: 'Inter',
    cardRadius: 10,
    buttonStyle: 'rounded',
    headerStyle: 'gradient',
    accentColor: '#ff5722',
    description: 'High energy design for quick service',
  },
  {
    id: 'bakery',
    name: 'Bakery',
    primaryColor: '#5d4037',
    secondaryColor: '#f8a5c2',
    bgColor: '#fce4ec',
    cardBg: '#ffffff',
    textColor: '#4a148c',
    font: 'Georgia',
    cardRadius: 24,
    buttonStyle: 'pill',
    headerStyle: 'image',
    accentColor: '#f06292',
    description: 'Soft pastels for bakeries & dessert shops',
  },
];

// ── Seed Data ─────────────────────────────────────────────────────────────────

const seedRestaurant: Restaurant = {
  id: 'rest-1',
  name: '',
  slug: '',
  tagline: '',
  logo: '',
  banner: '',
  phone: '',
  address: '',
  themeId: 'minimal',
  isOpen: false,
  rating: 0,
  totalReviews: 0,
  googleReviewUrl: '',
  socialLinks: {},
  openingHours: {
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  },
  published: false,
  currency: '$',
  totalViews: 0,
  totalScans: 0,
};

const seedCategories: Category[] = [];

const seedMenuItems: MenuItem[] = [];

// ── Context Types ─────────────────────────────────────────────────────────────

interface MenuContextType {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
  themes: MenuTheme[];
  updateRestaurant: (updates: Partial<Restaurant>) => void;
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (cats: Category[]) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  getItemsByCategory: (categoryId: string) => MenuItem[];
  getTheme: (themeId: string) => MenuTheme;
  publishMenu: () => string;
}

// ── Context ───────────────────────────────────────────────────────────────────

const MenuContext = createContext<MenuContextType | null>(null);

const MENU_STORAGE_KEY = 'shopqr_menu_data';

function loadMenu() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveMenu(data: { restaurant: Restaurant; categories: Category[]; menuItems: MenuItem[] }) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(data));
  } catch { /* storage full */ }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function MenuProvider({ children }: { children: ReactNode }) {
  const [restaurant, setRestaurant] = useState<Restaurant>(seedRestaurant);
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(seedMenuItems);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadMenu();
    if (stored) {
      if (stored.restaurant) setRestaurant(stored.restaurant);
      if (stored.categories) setCategories(stored.categories);
      if (stored.menuItems) setMenuItems(stored.menuItems);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveMenu({ restaurant, categories, menuItems });
  }, [restaurant, categories, menuItems, hydrated]);

  const updateRestaurant = useCallback((updates: Partial<Restaurant>) => {
    setRestaurant((prev) => ({ ...prev, ...updates }));
  }, []);

  const addCategory = useCallback((cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: `cat-${Date.now()}` };
    setCategories((prev) => [...prev, newCat]);
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setMenuItems((prev) => prev.filter((m) => m.categoryId !== id));
  }, []);

  const reorderCategories = useCallback((cats: Category[]) => {
    setCategories(cats.map((c, i) => ({ ...c, sortOrder: i })));
  }, []);

  const addMenuItem = useCallback((item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { ...item, id: `item-${Date.now()}` };
    setMenuItems((prev) => [...prev, newItem]);
  }, []);

  const updateMenuItem = useCallback((id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const getItemsByCategory = useCallback(
    (categoryId: string) => menuItems.filter((m) => m.categoryId === categoryId),
    [menuItems]
  );

  const getTheme = useCallback(
    (themeId: string) => MENU_THEMES.find((t) => t.id === themeId) || MENU_THEMES[0],
    []
  );

  const publishMenu = useCallback(() => {
    const slug = restaurant.slug || `menu-${Date.now()}`;
    updateRestaurant({ published: true, slug });
    return `/menu/${slug}`;
  }, [restaurant.slug, updateRestaurant]);

  return (
    <MenuContext.Provider
      value={{
        restaurant,
        categories,
        menuItems,
        themes: MENU_THEMES,
        updateRestaurant,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        getItemsByCategory,
        getTheme,
        publishMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
}
