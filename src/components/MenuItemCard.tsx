import React, { useState } from 'react';
import { Plus, Check, ShoppingBag, Sparkles, AlertCircle, MessageSquare } from 'lucide-react';
import { MenuItem, Topping } from '../types';

interface MenuItemCardProps {
  key?: React.Key;
  item: MenuItem;
  onAddToCart: (item: MenuItem, selectedSize?: string, selectedOption?: string, addedToppings?: Topping[]) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  // Check if item has multiple sizes
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    item.hasSizes && item.pricesBySize ? Object.keys(item.pricesBySize)[0] : undefined
  );

  // Check if item has dynamic options (e.g. flavor selector)
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    item.options ? item.options[0] : undefined
  );

  const [added, setAdded] = useState(false);

  // Determine active price
  const activePrice = selectedSize && item.pricesBySize && item.pricesBySize[selectedSize]
    ? item.pricesBySize[selectedSize]
    : item.price;

  // Render a tag based on category
  const getCategoryColor = () => {
    switch (item.category) {
      case 'cocktails':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'mocktails':
        return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'shakes':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'beverages':
        return 'bg-amber-50 text-amber-700 border-amber-150';
      case 'rolls':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'platters':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      default:
        return 'bg-pink-50 text-brand-pink-dark border-pink-100';
    }
  };

  const handleQuickAdd = () => {
    // Fire the tray addition
    onAddToCart(item, selectedSize, selectedOption, []);
    
    // Quick success animation state
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-brand-choco/5 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-pink/30 hover:shadow-md">
      {/* Decorative Top-Right Spark for Best-Sellers */}
      {item.tags?.includes('best-seller') && (
        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-yellow text-brand-choco shadow-sm animate-pulse" title="Best Seller!">
          <Sparkles size={14} />
        </div>
      )}

      <div>
        {/* Title, tags and Price line */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Tags row */}
            <div className="flex flex-wrap gap-1 mb-1.5">
              {item.tags?.slice(0, 2).map((tg) => (
                <span key={tg} className="rounded-md bg-brand-peach/40 text-[9px] font-bold text-brand-choco/60 px-1.5 py-0.5 capitalize tracking-wide">
                  {tg.replace('-', ' ')}
                </span>
              ))}
            </div>

            <h4 className="font-playful text-base font-bold text-brand-choco tracking-tight group-hover:text-brand-pink duration-200">
              {item.name}
            </h4>
          </div>
          
          <div className="text-right shrink-0">
            <span className="font-playful text-base font-black text-brand-pink-dark">
              {activePrice} <span className="text-[10px] font-bold text-brand-choco/60">KES</span>
            </span>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="font-sans text-[11.5px] text-brand-choco/60 leading-relaxed mt-2 font-medium">
            {item.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3.5 border-t border-brand-choco/5 space-y-3">
        {/* SIZE SELECTOR COMPONENT (if matching) */}
        {item.hasSizes && item.pricesBySize && (
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-wider text-brand-choco/45 block">
              Choose Serving Portion:
            </span>
            <div className="grid grid-cols-2 gap-1.5 bg-brand-cream/40 p-1 rounded-lg border border-brand-choco/5">
              {Object.keys(item.pricesBySize).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-1 px-1.5 text-[10px] font-black rounded-md transition-all cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-brand-pink text-white shadow-3xs'
                      : 'bg-transparent text-brand-choco/60 hover:text-brand-choco'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* OPTIONS DROPDOWN COMPONENT (if matching, e.g. Boba choice, rolls base, Mojito flavors) */}
        {item.options && item.optionsPrompt && (
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-wider text-brand-choco/45 block">
              {item.optionsPrompt}:
            </span>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full text-[10.5px] font-semibold text-brand-choco bg-brand-cream/30 border border-brand-choco/10 focus:border-brand-pink focus:ring-0 focus:outline-hidden rounded-lg p-1.5"
            >
              {item.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Action Button: WhatsApp Pre-Order */}
        <a
          href={`https://wa.me/254706148182?text=${encodeURIComponent(
            `🍦 *ZEN SCOOPS - DIRECT ORDER* 🍦\n=================================\n\nHi Zen Scoops! I would like to order:\n• *${item.name}*` +
            (selectedSize ? `\n   - Portion: _${selectedSize}_` : '') +
            (selectedOption ? `\n   - Option: _${selectedOption}_` : '') +
            `\n   - Price: _${activePrice} KES_` +
            `\n\n=================================\n📍 Sent instantly from Zen Scoops Interactive Menu!`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-extrabold uppercase tracking-wide transition-all border duration-200 bg-[#25d366] hover:bg-[#128c7e] text-white border-transparent hover:scale-102 shadow-3xs active:scale-97 text-center cursor-pointer"
        >
          <MessageSquare size={14} className="animate-pulse" />
          <span>Order via WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
