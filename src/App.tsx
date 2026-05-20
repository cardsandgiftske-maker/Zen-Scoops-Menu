/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Trash2, 
  ShoppingBag, 
  ExternalLink,
  Info,
  ChevronDown,
  Gift,
  Heart,
  Smartphone,
  CheckCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { MenuItem, MenuCategoryKey, Topping, CartItem } from './types';
import { MENU_ITEMS, CATEGORIES, BUSINESS_INFO } from './data/menu';

// Custom subcomponents
import SocialsHeader from './components/SocialsHeader';
import ScoopBuilder from './components/ScoopBuilder';
import MenuItemCard from './components/MenuItemCard';
import CartPanel from './components/CartPanel';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryKey | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Derive all unique tags from MENU_ITEMS to populate tag sliders
  const allAvailableTags = useMemo(() => {
    const rawTags = MENU_ITEMS.flatMap((item) => item.tags || []);
    // Normalize and remove custom builder metadata tags
    const normalized = rawTags.filter((t) => t !== 'custom-creation' && t !== 'classic');
    return Array.from(new Set(normalized)).slice(0, 10); // Limit to top 10 tags for premium visual aesthetics
  }, []);

  // Filter items in real-time
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchTag = !selectedTag || (item.tags && item.tags.includes(selectedTag));
      
      const query = searchQuery.trim().toLowerCase();
      const matchQuery = !query || 
        item.name.toLowerCase().includes(query) || 
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(query)));

      return matchCategory && matchTag && matchQuery;
    });
  }, [selectedCategory, selectedTag, searchQuery]);

  // CATEGORY HEADING HELPERS FOR NESTED "ALL" VIEWS
  const groupedItemsByCategory = useMemo(() => {
    const groups: { [key in MenuCategoryKey]?: MenuItem[] } = {};
    CATEGORIES.forEach((cat) => {
      const items = filteredItems.filter((i) => i.category === cat.key);
      if (items.length > 0) {
        groups[cat.key] = items;
      }
    });
    return groups;
  }, [filteredItems]);

  // CART STATE HANDLERS
  const handleAddToCart = (
    item: MenuItem,
    selectedSize?: string,
    selectedOption?: string,
    addedToppings: Topping[] = []
  ) => {
    setCart((prevCart) => {
      // Group together if item, size, option, and toppings matches perfectly
      const existingIdx = prevCart.findIndex((curr) => {
        const matchesItem = curr.item.id === item.id;
        const matchesSize = curr.selectedSize === selectedSize;
        const matchesOpt = curr.selectedOption === selectedOption;
        
        // Match exact toppings lengths and names
        const matchesToppings = curr.addedToppings.length === addedToppings.length &&
          curr.addedToppings.every((t) => addedToppings.some((at) => at.name === t.name));

        return matchesItem && matchesSize && matchesOpt && matchesToppings;
      });

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartId: `${item.id}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            item,
            selectedSize,
            selectedOption,
            addedToppings,
            quantity: 1,
          },
        ];
      }
    });
  };

  const handleAddCustomItemToCart = (customItem: MenuItem, toppings: Topping[]) => {
    setCart((prevCart) => [
      ...prevCart,
      {
        cartId: `custom_${customItem.id}_${Date.now()}`,
        item: customItem,
        addedToppings: toppings,
        quantity: 1,
      },
    ]);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((curr) => {
          if (curr.cartId === cartId) {
            const nextQty = curr.quantity + delta;
            return nextQty > 0 ? { ...curr, quantity: nextQty } : null;
          }
          return curr;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (cartId: string) => {
    setCart((prevCart) => prevCart.filter((curr) => curr.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAddToppingToCartItem = (cartId: string, topping: Topping) => {
    setCart((prevCart) => {
      return prevCart.map((curr) => {
        if (curr.cartId === cartId) {
          // Check if topping already sits on item
          const exists = curr.addedToppings.some((t) => t.name === topping.name);
          if (!exists) {
            return {
              ...curr,
              addedToppings: [...curr.addedToppings, topping],
            };
          }
        }
        return curr;
      });
    });
  };

  const handleRemoveToppingFromCartItem = (cartId: string, toppingName: string) => {
    setCart((prevCart) => {
      return prevCart.map((curr) => {
        if (curr.cartId === cartId) {
          return {
            ...curr,
            addedToppings: curr.addedToppings.filter((t) => t.name !== toppingName),
          };
        }
        return curr;
      });
    });
  };

  // Quick navigation utility to jump down to custom creation panel
  const jumpToBuilder = () => {
    document.getElementById('scoop-builder')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-brand-peach text-brand-choco selection:bg-brand-pink selection:text-white pb-12">
      
      {/* Dynamic Header Section */}
      <SocialsHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        allAvailableTags={allAvailableTags}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        
        {/* Dynamic Highlight Promo Banner / Hero Block */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-pink-dark to-brand-choco text-white p-6 sm:p-8 mb-8 shadow-sm">
          {/* Decorative shapes */}
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-brand-pink/20 blur-2xl" />
          <div className="absolute left-1/3 bottom-0 h-36 w-36 rounded-full bg-brand-yellow/10 blur-xl" />
          
          <div className="relative max-w-2xl space-y-3">
            <span className="bg-brand-yellow text-brand-choco text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full inline-block">
              🔥 Parlor Highlight
            </span>
            <h2 className="font-display text-2xl sm:text-4.5xl font-black tracking-tight leading-tight uppercase">
              Craving custom luxury scoops?
            </h2>
            <p className="font-sans text-xs sm:text-sm text-pink-100/90 leading-relaxed font-medium">
              We whip, blend, and press artisanal ice creams on sub-zero cold-plates right in Nairobi! Custom cupcakes, bubble waffles, milk tea boba infusions, or cheeky evening cocktails — Zen Scoops has your day sorted.
            </p>
            <div className="pt-2 flex flex-wrap gap-2.5">
              <button 
                onClick={jumpToBuilder}
                className="rounded-xl bg-brand-yellow text-brand-choco hover:bg-white text-xs font-black uppercase tracking-wide px-5 py-3 transition-all hover:scale-102 cursor-pointer shadow-xs"
              >
                🍦 Build a Custom Scoop
              </button>
              <a 
                href={`tel:${BUSINESS_INFO.phone}`}
                className="rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-xs font-semibold px-4 py-3 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Call Hotline</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Dynamic Multi-Section Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA: Interactive customizer and menu columns */}
          <div className="col-span-12 lg:col-span-8 space-y-12">
            
            {/* Interactive Builder Module */}
            <ScoopBuilder onAddCustomItemToCart={handleAddCustomItemToCart} />

            {/* Menu List Hub */}
            <div className="space-y-10">
              
              {/* If "all" is selected, group elements elegantly by chapter section */}
              {selectedCategory === 'all' ? (
                Object.keys(groupedItemsByCategory).length === 0 ? (
                  <div className="text-center py-16 bg-white/40 rounded-3xl border border-brand-choco/5">
                    <p className="font-display text-lg font-black text-brand-choco/60 uppercase">No matching treats found</p>
                    <p className="font-sans text-xs text-brand-choco/40 mt-1">Try resetting your search filters or tags!</p>
                  </div>
                ) : (
                  CATEGORIES.map((cat) => {
                    const items = groupedItemsByCategory[cat.key];
                    if (!items || items.length === 0) return null;

                    return (
                      <section key={cat.key} className="space-y-4 animate-fade-in">
                        {/* Section Header */}
                        <div className="flex items-center gap-3 border-b border-brand-choco/10 pb-2">
                          <span className="text-2xl" id={`category-anchor-${cat.key}`}>
                            {cat.key === 'breakfast' ? '🍳' :
                             cat.key === 'beverages' ? '☕' : 
                             cat.key === 'shakes' ? '🥤' : 
                             cat.key === 'cocktails' ? '🍹' : 
                             cat.key === 'mocktails' ? '🍋' : 
                             cat.key === 'rolls' ? '🍥' : 
                             cat.key === 'bubble_waffle' ? '🧇' : 
                             cat.key === 'icecream_sticks' ? '🍭' : 
                             cat.key === 'cupcake_waffle' ? '🧁' : 
                             cat.key === 'platters' ? '🏔️' : 
                             cat.key === 'fruity_icecream' ? '🍓' : 
                             cat.key === 'icecream_cone' ? '📐' : '🍦'}
                          </span>
                          <div>
                            <h3 className="font-display text-xl font-extrabold text-brand-choco uppercase tracking-wide">
                              {cat.label}
                            </h3>
                            <p className="font-sans text-xs text-brand-choco/50 mt-0.5 leading-relaxed font-semibold">
                              {cat.description}
                            </p>
                          </div>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {items.map((treat) => (
                            <MenuItemCard 
                              key={treat.id} 
                              item={treat} 
                              onAddToCart={handleAddToCart} 
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })
                )
              ) : (
                /* Else, if single category view is filtered */
                <section className="space-y-5">
                  {/* Active single category banner */}
                  {(() => {
                    const cat = CATEGORIES.find((c) => c.key === selectedCategory);
                    if (!cat) return null;

                    return (
                      <div className="rounded-2xl border border-brand-pink/20 bg-brand-pink/5 p-5">
                        <h3 className="font-display text-xl font-black text-brand-choco uppercase tracking-wide">
                          🧁 Viewing Chapter: <span className="text-brand-pink">{cat.label}</span>
                        </h3>
                        <p className="font-sans text-xs text-brand-choco/60 mt-1 max-w-xl leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    );
                  })()}

                  {filteredItems.length === 0 ? (
                    <div className="text-center py-16 bg-white/40 rounded-3xl border border-brand-choco/5">
                      <p className="font-display text-lg font-black text-brand-choco/60 uppercase">No matching treats found</p>
                      <p className="font-sans text-xs text-brand-choco/40 mt-1">Try resetting your search tags or inputs inside this chapter.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-in">
                      {filteredItems.map((treat) => (
                        <MenuItemCard 
                          key={treat.id} 
                          item={treat} 
                          onAddToCart={handleAddToCart} 
                        />
                      ))}
                    </div>
                  )}
                </section>
              )}

            </div>
          </div>

          {/* RIGHT AREA: Helpful Informative Sidebar Guide  */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Guide Card: How it Works */}
            <div className="rounded-3xl border border-brand-choco/5 bg-white p-5.5 space-y-4 shadow-3xs">
              <h4 className="font-display text-base font-black uppercase tracking-wide border-b border-brand-choco/5 pb-2 flex items-center gap-1.5">
                <Info size={16} className="text-brand-pink" /> 
                Cold-Plate Experience
              </h4>
              
              <ul className="space-y-3.5 text-xs text-brand-choco/70 font-medium">
                <li className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-pink/15 font-sans text-[10px] font-black text-brand-pink-dark">1</span>
                  <p className="leading-normal">
                    <strong className="text-brand-choco">Build Your Masterpiece:</strong> Use our 3D-mock customizer to stack up to 3 scoops and load dynamic toppings.
                  </p>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-pink/15 font-sans text-[10px] font-black text-brand-pink-dark">2</span>
                  <p className="leading-normal">
                    <strong className="text-brand-choco">Add Menu Favorites:</strong> Browse and slap on preset rolls, boba milk teas, gourmet coffees, and zesty cocktails straight to your order tray.
                  </p>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-pink/15 font-sans text-[10px] font-black text-brand-pink-dark">3</span>
                  <p className="leading-normal">
                    <strong className="text-brand-choco">Review & Dispatch:</strong> Enter your name, tap WhatsApp Checkout, and preview your instant pre-formatted order template sent to the parlor hotline!
                  </p>
                </li>
              </ul>
            </div>

            {/* Informative Promo Card */}
            <div className="rounded-3xl bg-[#3ebd83]/5 border border-[#3ebd83]/15 p-5.5 space-y-3">
              <span className="h-6 w-6 rounded-lg bg-brand-mint text-white flex items-center justify-center text-xs font-bold">📢</span>
              <h5 className="font-display text-sm font-black uppercase text-[#195e40] tracking-wide mt-1">Special Delivery Note</h5>
              <p className="font-sans text-[11.5px] text-[#246b4c] leading-relaxed font-semibold">
                Nairobi express courier services are structured individually. Tap "City Delivery" in the tray drawer and our operator will coordinate the dispatch pinning via Google Maps.
              </p>
            </div>
          </div>

        </div>

        {/* CART FLOATING / FIXED PANE DRAWER */}
        <CartPanel 
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onAddToppingToCartItem={handleAddToppingToCartItem}
          onRemoveToppingFromCartItem={handleRemoveToppingFromCartItem}
        />

      </main>

      {/* Footer Branding Area */}
      <footer className="mt-16 border-t border-brand-choco/10 pt-10 pb-8 text-center text-xs text-brand-choco/50 font-semibold space-y-4 max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-1 text-sm font-bold text-brand-choco/70 uppercase font-display tracking-widest">
          <div className="flex items-center gap-1.5">
            <span>🍦 Zen Scoops Parlor</span>
            <span className="text-brand-yellow animate-bounce-slow">★</span>
            <span>Nairobi CBD</span>
          </div>
          <div className="text-[10px] text-brand-choco/50 tracking-wider font-semibold font-sans normal-case">
            Hazina Trade Centre · Floor M1 (Near Jeevanjee Gardens)
          </div>
        </div>
        
        <p className="font-sans max-w-md mx-auto text-[11px] leading-relaxed">
          Crafted professionally by matching attached physical menu cards. All trademarked titles (Adios MF, Toxic Bitch, Nutty Cups) are verified authentic menu offerings of Zen Scoops.
        </p>

        <div className="flex justify-center gap-6 text-brand-choco/40 text-[10px] uppercase font-bold tracking-wider">
          <a href={BUSINESS_INFO.formattedPhone} className="hover:text-brand-pink">Call Support ({BUSINESS_INFO.formattedPhone})</a>
          <span>•</span>
          <p>© 2026 Zen Scoops Inc.</p>
        </div>
      </footer>
    </div>
  );
}

