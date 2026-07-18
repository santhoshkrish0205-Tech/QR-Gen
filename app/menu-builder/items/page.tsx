'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Link from 'next/link';
import { useMenu, Category, MenuItem } from '@/lib/menu-context';
import {
  Plus, Trash2, ChevronRight, X, Edit2, Check, GripVertical,
  Leaf, Flame, Star, Sparkles, BadgeCheck, Eye, EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';

const EMOJI_OPTIONS = ['🍕','🍔','🌮','🍜','🍱','🍣','🥗','🥪','🍝','🥘','🍛','🍗','🥩','🍖','🦐','🦑','🍦','🍰','🎂','🧁','☕','🥤','🍹','🍺','🧃','🥛','🍵','🧋'];

function ItemCard({ item, onEdit, onDelete, onToggle }: {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (field: 'isAvailable' | 'isPopular' | 'isChefSpecial') => void;
}) {
  const { restaurant } = useMenu();
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md ${item.isAvailable ? 'border-outline-variant' : 'border-outline-variant/50 opacity-60'}`}>
      <div className="flex">
        {item.image && (
          <div className="w-20 h-20 flex-shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className={`w-2.5 h-2.5 rounded-full border ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full m-[1px] ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                </div>
                <p className="font-semibold text-sm text-on-surface truncate">{item.name}</p>
              </div>
              <p className="text-xs text-on-surface-variant truncate">{item.description}</p>
              <p className="font-bold text-sm text-[#3525cd] mt-1">{restaurant.currency}{item.price}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={onEdit} className="p-1.5 text-on-surface-variant hover:text-[#3525cd] hover:bg-[#3525cd]/10 rounded-lg transition-all">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={onDelete} className="p-1.5 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            {item.isSpicy && <Flame className="w-3 h-3 text-orange-500" />}
            {item.isNew && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600">NEW</span>}
            {item.isChefSpecial && <Star className="w-3 h-3 text-yellow-500" />}
            <div className="ml-auto flex items-center gap-1.5">
              <button onClick={() => onToggle('isPopular')} title="Toggle Popular" className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${item.isPopular ? 'bg-yellow-100 text-yellow-700' : 'bg-surface-container-low text-on-surface-variant'}`}>
                Popular
              </button>
              <button onClick={() => onToggle('isAvailable')} title="Toggle Available" className={`p-1 rounded-lg transition-colors ${item.isAvailable ? 'text-[#006c49] bg-[#006c49]/10' : 'text-on-surface-variant bg-surface-container-low'}`}>
                {item.isAvailable ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ItemFormData {
  name: string; description: string; price: string; image: string;
  isVeg: boolean; isPopular: boolean; isAvailable: boolean;
  isSpicy: boolean; isNew: boolean; isChefSpecial: boolean;
}

const defaultForm: ItemFormData = {
  name: '', description: '', price: '', image: '', isVeg: true,
  isPopular: false, isAvailable: true, isSpicy: false, isNew: false, isChefSpecial: false,
};

export default function MenuItemsPage() {
  const { restaurant, categories, menuItems, addCategory, deleteCategory, addMenuItem, updateMenuItem, deleteMenuItem, getItemsByCategory } = useMenu();

  const [activeCatId, setActiveCatId] = useState<string>(categories[0]?.id || '');
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [form, setForm] = useState<ItemFormData>(defaultForm);

  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('🍕');

  const activeItems = getItemsByCategory(activeCatId);
  const activeCategory = categories.find((c) => c.id === activeCatId);

  const openAdd = () => { setForm(defaultForm); setEditingItemId(null); setShowItemModal(true); };
  const openEdit = (item: MenuItem) => {
    setForm({ name: item.name, description: item.description, price: String(item.price), image: item.image, isVeg: item.isVeg, isPopular: item.isPopular, isAvailable: item.isAvailable, isSpicy: item.isSpicy, isNew: item.isNew, isChefSpecial: item.isChefSpecial });
    setEditingItemId(item.id);
    setShowItemModal(true);
  };

  const handleSaveItem = () => {
    if (!form.name.trim() || !form.price) { toast.error('Name and price are required'); return; }
    const price = parseFloat(form.price);
    if (isNaN(price)) { toast.error('Price must be a number'); return; }
    if (editingItemId) {
      updateMenuItem(editingItemId, { ...form, price });
      toast.success('Item updated!');
    } else {
      addMenuItem({ categoryId: activeCatId, ...form, price });
      toast.success(`"${form.name}" added to ${activeCategory?.name}!`);
    }
    setShowItemModal(false);
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) { toast.error('Enter a category name'); return; }
    addCategory({ restaurantId: restaurant.id, name: newCatName, emoji: newCatEmoji, sortOrder: categories.length });
    toast.success(`"${newCatName}" category added!`);
    setNewCatName(''); setNewCatEmoji('🍕'); setShowCatModal(false);
  };

  const f = (key: keyof ItemFormData, val: unknown) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="min-h-screen bg-shopbg">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen flex flex-col">
        <header className="h-16 px-8 flex items-center justify-between bg-surface shadow-sm sticky top-0 z-30 border-b border-outline-variant">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/menu-builder" className="hover:text-[#3525cd] transition-colors">Menu Builder</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-on-surface font-semibold">Menu Items</span>
          </div>
          <Link href="/menu-builder/publish" className="px-5 py-2 bg-[#3525cd] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            Next: Publish & QR →
          </Link>
        </header>

        <div className="p-6 flex-1">
          {/* Category tabs */}
          <div className="bg-white rounded-2xl border border-outline-variant mb-6 overflow-hidden">
            <div className="flex items-center gap-0 overflow-x-auto border-b border-outline-variant">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCatId(cat.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${activeCatId === cat.id ? 'border-[#3525cd] text-[#3525cd] bg-[#3525cd]/5' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-bold">
                    {getItemsByCategory(cat.id).length}
                  </span>
                </button>
              ))}
              <button
                onClick={() => setShowCatModal(true)}
                className="flex items-center gap-1.5 px-4 py-4 text-sm text-[#3525cd] hover:bg-[#3525cd]/5 transition-colors border-b-2 border-transparent whitespace-nowrap flex-shrink-0 font-medium"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            {/* Items header */}
            <div className="p-5 flex items-center justify-between">
              <div>
                <h2 className="font-jakarta font-bold text-on-surface text-lg">
                  {activeCategory?.emoji} {activeCategory?.name}
                </h2>
                <p className="text-sm text-on-surface-variant">{activeItems.length} items in this category</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { if (categories.length > 1 && window.confirm(`Delete "${activeCategory?.name}" and all its items?`)) { deleteCategory(activeCatId); setActiveCatId(categories[0]?.id || ''); toast.success('Category deleted'); } }}
                  className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={openAdd}
                  className="flex items-center gap-2 px-4 py-2 bg-[#3525cd] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
            </div>

            {/* Items grid */}
            <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {activeItems.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <p className="text-4xl mb-3">🍽️</p>
                  <p className="font-semibold text-on-surface mb-1">No items in {activeCategory?.name} yet</p>
                  <p className="text-sm text-on-surface-variant mb-4">Add your first dish to this category</p>
                  <button onClick={openAdd} className="px-5 py-2.5 bg-[#3525cd] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                    + Add First Item
                  </button>
                </div>
              )}
              {activeItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit={() => openEdit(item)}
                  onDelete={() => { deleteMenuItem(item.id); toast.success(`"${item.name}" removed`); }}
                  onToggle={(field) => { updateMenuItem(item.id, { [field]: !item[field] }); }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowItemModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-outline-variant">
              <h3 className="font-jakarta font-bold text-lg text-on-surface">{editingItemId ? 'Edit Item' : 'Add New Item'}</h3>
              <button onClick={() => setShowItemModal(false)} className="p-2 text-on-surface-variant hover:text-on-surface rounded-xl hover:bg-surface-container-low transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Item Name *</label>
                  <input value={form.name} onChange={(e) => f('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm" placeholder="e.g. Margherita Pizza" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">{restaurant.currency}</span>
                    <input value={form.price} onChange={(e) => f('price', e.target.value)} className="w-full pl-8 pr-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm" placeholder="249" type="number" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Type</label>
                  <div className="flex gap-2 h-[46px]">
                    <button onClick={() => f('isVeg', true)} className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border text-sm font-semibold transition-all ${form.isVeg ? 'border-green-500 bg-green-50 text-green-700' : 'border-outline-variant text-on-surface-variant'}`}>
                      <Leaf className="w-3.5 h-3.5" /> Veg
                    </button>
                    <button onClick={() => f('isVeg', false)} className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border text-sm font-semibold transition-all ${!form.isVeg ? 'border-red-500 bg-red-50 text-red-700' : 'border-outline-variant text-on-surface-variant'}`}>
                      Non-Veg
                    </button>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Description</label>
                  <textarea value={form.description} onChange={(e) => f('description', e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm resize-none" placeholder="Brief description of the dish..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Image URL</label>
                  <input value={form.image} onChange={(e) => f('image', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm" placeholder="https://images.unsplash.com/..." />
                  {form.image && <img src={form.image} alt="preview" className="mt-2 w-full h-24 object-cover rounded-xl" />}
                </div>
              </div>

              {/* Badges */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Badges & Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { key: 'isAvailable', label: 'Available', icon: Eye, activeClass: 'border-green-500 bg-green-50 text-green-700' },
                    { key: 'isPopular', label: 'Popular', icon: Star, activeClass: 'border-yellow-500 bg-yellow-50 text-yellow-700' },
                    { key: 'isSpicy', label: 'Spicy 🌶️', icon: Flame, activeClass: 'border-orange-500 bg-orange-50 text-orange-700' },
                    { key: 'isNew', label: 'New', icon: Sparkles, activeClass: 'border-blue-500 bg-blue-50 text-blue-700' },
                    { key: 'isChefSpecial', label: 'Chef Special', icon: BadgeCheck, activeClass: 'border-purple-500 bg-purple-50 text-purple-700' },
                  ] as const).map(({ key, label, activeClass }) => (
                    <button
                      key={key}
                      onClick={() => f(key, !form[key])}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${form[key] ? activeClass : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'}`}
                    >
                      {label}
                      {form[key] && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-outline-variant flex gap-3">
              <button onClick={() => setShowItemModal(false)} className="flex-1 py-3 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancel</button>
              <button onClick={handleSaveItem} className="flex-1 py-3 bg-[#3525cd] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                {editingItemId ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCatModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-jakarta font-bold text-lg text-on-surface mb-4">New Category</h3>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Category Name</label>
              <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm" placeholder="e.g. Starters" autoFocus />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Pick Emoji</label>
              <div className="grid grid-cols-7 gap-1">
                {EMOJI_OPTIONS.map((em) => (
                  <button key={em} onClick={() => setNewCatEmoji(em)} className={`text-xl p-1.5 rounded-lg transition-all ${newCatEmoji === em ? 'bg-[#3525cd]/10 ring-2 ring-[#3525cd]/30' : 'hover:bg-surface-container-low'}`}>
                    {em}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCatModal(false)} className="flex-1 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant">Cancel</button>
              <button onClick={handleAddCategory} className="flex-1 py-2.5 bg-[#3525cd] text-white rounded-xl text-sm font-semibold hover:opacity-90">Add Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
