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
  name: 'Green Leaf Café',
  slug: 'greenleaf',
  tagline: 'Fresh. Local. Delicious.',
  logo: '',
  banner: '',
  phone: '+91 98765 43210',
  address: '42, MG Road, Bangalore, Karnataka 560001',
  themeId: 'cafe',
  isOpen: true,
  rating: 4.5,
  totalReviews: 248,
  googleReviewUrl: 'https://g.page/r/greenleafcafe/review',
  socialLinks: {
    instagram: 'https://instagram.com/greenleafcafe',
    facebook: 'https://facebook.com/greenleafcafe',
    website: 'https://greenleafcafe.in',
    whatsapp: '+919876543210',
  },
  openingHours: {
    monday: '8:00 AM – 10:00 PM',
    tuesday: '8:00 AM – 10:00 PM',
    wednesday: '8:00 AM – 10:00 PM',
    thursday: '8:00 AM – 10:00 PM',
    friday: '8:00 AM – 11:00 PM',
    saturday: '9:00 AM – 11:00 PM',
    sunday: '9:00 AM – 9:00 PM',
  },
  published: true,
  currency: '₹',
  totalViews: 1284,
  totalScans: 342,
};

const seedCategories: Category[] = [
  { id: 'cat-1', restaurantId: 'rest-1', name: 'Pizza', emoji: '🍕', sortOrder: 0 },
  { id: 'cat-2', restaurantId: 'rest-1', name: 'Burgers', emoji: '🍔', sortOrder: 1 },
  { id: 'cat-3', restaurantId: 'rest-1', name: 'Sandwiches', emoji: '🥪', sortOrder: 2 },
  { id: 'cat-4', restaurantId: 'rest-1', name: 'Salads', emoji: '🥗', sortOrder: 3 },
  { id: 'cat-5', restaurantId: 'rest-1', name: 'Pasta', emoji: '🍝', sortOrder: 4 },
  { id: 'cat-6', restaurantId: 'rest-1', name: 'Drinks', emoji: '🥤', sortOrder: 5 },
  { id: 'cat-7', restaurantId: 'rest-1', name: 'Desserts', emoji: '🍰', sortOrder: 6 },
];

const seedMenuItems: MenuItem[] = [
  // Pizza
  { id: 'item-1', categoryId: 'cat-1', name: 'Margherita', description: 'Classic tomato sauce, fresh mozzarella, basil', price: 249, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', isVeg: true, isPopular: true, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: false },
  { id: 'item-2', categoryId: 'cat-1', name: 'Veg Supreme', description: 'Bell peppers, mushrooms, olives, corn, onions', price: 349, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', isVeg: true, isPopular: false, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: true },
  { id: 'item-3', categoryId: 'cat-1', name: 'Spicy BBQ Chicken', description: 'Grilled chicken, BBQ sauce, jalapeños, red onions', price: 399, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80', isVeg: false, isPopular: true, isAvailable: true, isSpicy: true, isNew: false, isChefSpecial: false },
  { id: 'item-4', categoryId: 'cat-1', name: 'Farmhouse', description: 'Fresh veggies on a herb-seasoned base', price: 299, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80', isVeg: true, isPopular: false, isAvailable: true, isSpicy: false, isNew: true, isChefSpecial: false },
  // Burgers
  { id: 'item-5', categoryId: 'cat-2', name: 'Classic Veg Burger', description: 'Potato patty, lettuce, tomato, pickles', price: 179, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', isVeg: true, isPopular: true, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: false },
  { id: 'item-6', categoryId: 'cat-2', name: 'Cheese Burst', description: 'Double cheese, crispy onions, special sauce', price: 229, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80', isVeg: true, isPopular: true, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: false },
  { id: 'item-7', categoryId: 'cat-2', name: 'Chicken Crunch', description: 'Crispy fried chicken, coleslaw, sriracha mayo', price: 279, image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=400&q=80', isVeg: false, isPopular: false, isAvailable: true, isSpicy: true, isNew: true, isChefSpecial: true },
  // Sandwiches
  { id: 'item-8', categoryId: 'cat-3', name: 'Club Sandwich', description: 'Triple-decker with grilled chicken, bacon, veggies', price: 199, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&q=80', isVeg: false, isPopular: true, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: false },
  { id: 'item-9', categoryId: 'cat-3', name: 'Grilled Paneer', description: 'Marinated paneer, mint chutney, veggies', price: 159, image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&q=80', isVeg: true, isPopular: false, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: false },
  // Salads
  { id: 'item-10', categoryId: 'cat-4', name: 'Garden Fresh', description: 'Mixed greens, cherry tomatoes, cucumber, vinaigrette', price: 149, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', isVeg: true, isPopular: false, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: false },
  { id: 'item-11', categoryId: 'cat-4', name: 'Caesar Salad', description: 'Romaine, croutons, parmesan, Caesar dressing', price: 189, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80', isVeg: true, isPopular: true, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: true },
  // Pasta
  { id: 'item-12', categoryId: 'cat-5', name: 'Arrabiata', description: 'Penne in spicy tomato sauce, fresh herbs', price: 219, image: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=400&q=80', isVeg: true, isPopular: false, isAvailable: true, isSpicy: true, isNew: false, isChefSpecial: false },
  { id: 'item-13', categoryId: 'cat-5', name: 'Pesto Pasta', description: 'Basil pesto, cherry tomatoes, parmesan', price: 239, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80', isVeg: true, isPopular: true, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: false },
  // Drinks
  { id: 'item-14', categoryId: 'cat-6', name: 'Cold Coffee', description: 'Chilled brewed coffee with cream', price: 89, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80', isVeg: true, isPopular: true, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: false },
  { id: 'item-15', categoryId: 'cat-6', name: 'Fresh Lime Soda', description: 'Sweet, salty or mixed, your choice', price: 59, image: 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=400&q=80', isVeg: true, isPopular: false, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: false },
  { id: 'item-16', categoryId: 'cat-6', name: 'Mango Smoothie', description: 'Fresh Alphonso mango, chilled', price: 99, image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=400&q=80', isVeg: true, isPopular: false, isAvailable: true, isSpicy: false, isNew: true, isChefSpecial: false },
  // Desserts
  { id: 'item-17', categoryId: 'cat-7', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center & vanilla ice cream', price: 149, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80', isVeg: true, isPopular: true, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: true },
  { id: 'item-18', categoryId: 'cat-7', name: 'Tiramisu', description: 'Classic Italian dessert with espresso-soaked ladyfingers', price: 169, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', isVeg: true, isPopular: false, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: false },
];

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
