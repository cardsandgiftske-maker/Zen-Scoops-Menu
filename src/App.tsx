/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Trash2, 
  ShoppingBag, 
  ChevronDown,
  Gift,
  Heart,
  Smartphone,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Instagram,
  MapPin
} from 'lucide-react';
import { MenuItem, MenuCategoryKey, Topping, CartItem } from './types';
import { MENU_ITEMS, CATEGORIES, BUSINESS_INFO, INSTAGRAM_URL, TIKTOK_URL } from './data/menu';

// Custom subcomponents
import SocialsHeader from './components/SocialsHeader';
import ScoopBuilder from './components/ScoopBuilder';
import MenuItemCard from './components/MenuItemCard';
import CartPanel from './components/CartPanel';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryKey | 'all'>('all');

  // Filter items in real-time
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      return selectedCategory === 'all' || item.category === selectedCategory;
    });
  }, [selectedCategory]);

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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fdf5ea] via-[#faf0e0] to-[#f9cbd6]/40 text-brand-choco selection:bg-brand-pink selection:text-white pb-12">
      
      {/* Dynamic Header Section */}
      <SocialsHeader 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto space-y-12">
            
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
                        {/* Section Header with Photo and Pink Pattern Texture */}
                        <div className="relative overflow-hidden rounded-2xl border-y border-r border-brand-choco/10 border-l-5 border-l-brand-pink bg-white shadow-2xs group flex flex-col md:flex-row items-stretch">
                          {/* Aesthetic Pink Pattern Texture overlay */}
                          <div className="absolute inset-0 opacity-[0.14] pointer-events-none bg-[radial-gradient(#e36c96_1.5px,transparent_1.5px)] [background-size:12px_12px] bg-repeat z-0" />
                          <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/10 via-transparent to-brand-peach/25 pointer-events-none z-0" />
                          
                          {cat.image && (
                            <div className="md:w-1/3 relative h-36 md:h-auto overflow-hidden shrink-0 z-10">
                              <img 
                                src={cat.image} 
                                alt={cat.label} 
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-103" 
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />
                            </div>
                          )}
                          <div className="p-5 flex flex-col justify-center flex-1 relative z-10 bg-white/70 backdrop-blur-3xs md:bg-transparent">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl" id={`category-anchor-${cat.key}`}>
                                {cat.key === 'breakfast' ? '🍳' :
                                 cat.key === 'icecream' ? '🍦' : 
                                 cat.key === 'waffles_rolls' ? '🧇' : 
                                 cat.key === 'beverages' ? '☕' : 
                                 cat.key === 'shakes' ? '🥤' : 
                                 cat.key === 'cocktails' ? '🍹' : '🍦'}
                              </span>
                              <h3 className="font-display text-lg font-black text-brand-choco uppercase tracking-wide">
                                {cat.label}
                              </h3>
                            </div>
                            <p className="font-sans text-xs text-brand-choco/55 mt-1.5 leading-relaxed font-semibold">
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
                      <div className="relative overflow-hidden rounded-2xl border-y border-r border-brand-pink/20 border-l-5 border-l-brand-pink bg-white shadow-2xs flex flex-col md:flex-row items-stretch">
                        {/* Aesthetic Pink Pattern Texture overlay */}
                        <div className="absolute inset-0 opacity-[0.14] pointer-events-none bg-[radial-gradient(#e36c96_1.5px,transparent_1.5px)] [background-size:12px_12px] bg-repeat z-0" />
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/10 via-transparent to-brand-peach/25 pointer-events-none z-0" />

                        {cat.image && (
                          <div className="md:w-1/3 relative h-40 md:h-auto overflow-hidden shrink-0 z-10">
                            <img 
                              src={cat.image} 
                              alt={cat.label} 
                              className="object-cover w-full h-full text-brand-pink font-display font-medium text-xs flex items-center justify-center p-4 bg-brand-pink/5" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/15 via-transparent to-transparent pointer-events-none" />
                          </div>
                        )}
                        <div className="p-6 flex flex-col justify-center flex-1 relative z-10 bg-white/70 backdrop-blur-3xs md:bg-transparent">
                          <h3 className="font-display text-lg font-black text-brand-choco uppercase tracking-wide flex items-center gap-2">
                            <span>🧁</span> Viewing Chapter: <span className="text-brand-pink">{cat.label}</span>
                          </h3>
                          <p className="font-sans text-xs text-brand-choco/60 mt-2 max-w-xl leading-relaxed font-semibold">
                            {cat.description}
                          </p>
                        </div>
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
      <footer className="mt-16 border-t border-brand-choco/10 pt-12 pb-10 max-w-7xl mx-auto px-4 text-xs font-semibold text-brand-choco/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-brand-choco/10">
          
          {/* Col 1: Brand & Socials */}
          <div className="space-y-3.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-sm font-bold text-brand-choco/80 uppercase font-display tracking-widest">
              <span>🍦 Zen Scoops Parlor</span>
              <span className="text-brand-yellow animate-bounce-slow">★</span>
            </div>
            <p className="text-[11px] leading-relaxed text-brand-choco/50 italic max-w-sm mx-auto md:mx-0">
              Where premium sub-zero cold-plates meet artisanal gourmet scoops, boba teas, and cheeky evening spirits.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
              <a 
                href={INSTAGRAM_URL}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-[#f3f0ec] px-3.5 py-1.5 text-xs font-bold text-[#b93a8d] shadow-2xs border border-[#b93a8d]/15 transition-all hover:scale-102"
              >
                <Instagram size={13} />
                <span>Instagram</span>
              </a>
              <a 
                href={TIKTOK_URL}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-brand-choco text-white hover:bg-brand-choco/90 px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-all hover:scale-102"
              >
                <span className="text-brand-pink text-xs font-bold">🎵</span>
                <span>TikTok</span>
              </a>
            </div>
          </div>

          {/* Col 2: Find Us & Address */}
          <div className="space-y-2.5 text-center md:text-left flex flex-col items-center md:items-start">
            <h5 className="font-display text-[10px] font-black uppercase text-brand-choco/55 tracking-widest flex items-center gap-1">
              <MapPin size={12} className="text-brand-pink" /> ADDRESS & LOCATION
            </h5>
            <div className="text-[11px] leading-relaxed text-brand-choco/75 font-sans whitespace-pre-line text-center md:text-left font-medium">
              {BUSINESS_INFO.address}
            </div>
          </div>

          {/* Col 3: Support & Hours */}
          <div className="space-y-2.5 text-center md:text-right flex flex-col items-center md:items-end">
            <h5 className="font-display text-[10px] font-black uppercase text-brand-choco/55 tracking-widest">
              🕒 HOURS & SUPPORT
            </h5>
            <div className="text-[11px] text-brand-choco/75 space-y-1 font-medium text-center md:text-right">
              <p>Daily: {BUSINESS_INFO.businessHours}</p>
              <p>Call Support: <a href={`tel:${BUSINESS_INFO.phone}`} className="text-brand-pink hover:underline font-bold font-sans">{BUSINESS_INFO.formattedPhone}</a></p>
            </div>
          </div>

        </div>

        {/* Bottom copyright / legal footnote */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-brand-choco/40 text-center sm:text-left">
          <p className="max-w-md leading-relaxed">
            Crafted professionally targeting verified menu listings. All trademarked titles (Adios MF, Toxic Bitch, Nutty Cups) are verified authentic menu offerings of Zen Scoops.
          </p>
          <div className="flex items-center gap-4 uppercase tracking-wider font-bold shrink-0">
            <p>© 2026 Zen Scoops Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

