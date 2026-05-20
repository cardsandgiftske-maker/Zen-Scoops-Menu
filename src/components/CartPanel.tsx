import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Check, 
  X, 
  MessageSquare,
  FileText,
  Copy,
  User,
  MapPin,
  Utensils,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { CartItem, Topping } from '../types';
import { EXTRA_TOPPINGS, BUSINESS_INFO } from '../data/menu';

interface CartPanelProps {
  cart: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  onAddToppingToCartItem: (cartId: string, topping: Topping) => void;
  onRemoveToppingFromCartItem: (cartId: string, toppingName: string) => void;
}

export default function CartPanel({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddToppingToCartItem,
  onRemoveToppingFromCartItem,
}: CartPanelProps) {
  const [userName, setUserName] = useState('');
  const [preference, setPreference] = useState<'pickup' | 'delivery'>('pickup');
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Subtotal calculations
  const subtotal = cart.reduce((acc, curr) => {
    const itemBasePrice = curr.selectedSize && curr.item.pricesBySize
      ? curr.item.pricesBySize[curr.selectedSize]
      : curr.item.price;
    const toppingsSum = curr.addedToppings.reduce((tAcc, tCurr) => tAcc + tCurr.price, 0);
    return acc + (itemBasePrice + toppingsSum) * curr.quantity;
  }, 0);

  const totalItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  // Build the gorgeous WhatsApp message representing real-time orders
  const compileOrderText = () => {
    if (cart.length === 0) return '';

    let text = `🍦 *ZEN SCOOPS - PRE-ORDER PREPARATION* 🍦\n`;
    text += `=================================\n\n`;
    text += `Hi Zen Scoops! I would like to place a fresh order:\n\n`;

    cart.forEach((item, index) => {
      const price = item.selectedSize && item.item.pricesBySize
        ? item.item.pricesBySize[item.selectedSize]
        : item.item.price;
      const tPrice = item.addedToppings.reduce((acc, curr) => acc + curr.price, 0);
      const totalSingle = price + tPrice;

      text += `${index + 1}. *${item.item.name}* x${item.quantity}\n`;
      if (item.selectedSize) {
        text += `   • Size: _${item.selectedSize}_\n`;
      }
      if (item.selectedOption) {
        text += `   • Option: _${item.selectedOption}_\n`;
      }
      if (item.addedToppings.length > 0) {
        text += `   • Toppings: ${item.addedToppings.map((t) => `${t.name} (+${t.price} KES)`).join(', ')}\n`;
      }
      text += `   • Price: _${totalSingle * item.quantity} KES_\n\n`;
    });

    text += `=================================\n`;
    text += `💰 *TOTAL AMOUNT:* ${subtotal} KES\n`;
    text += `=================================\n\n`;
    
    // User details addition
    text += `👤 *Customer Details:*\n`;
    text += `   • Name: ${userName.trim() || 'Guest Customer'}\n`;
    text += `   • Order Method: ${preference === 'pickup' ? 'Self Pickup at Parlor' : 'Nairobi Delivery Requested'}\n\n`;
    text += `📍 Sent instantly from Zen Scoops Interactive Menu!`;

    return text;
  };

  const getWhatsAppLink = () => {
    const rawText = compileOrderText();
    return `https://wa.me/254706148182?text=${encodeURIComponent(rawText)}`;
  };

  const copyToClipboard = () => {
    const rawText = compileOrderText();
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-brand-peach border-l-2 border-brand-pink/20 shadow-2xl flex flex-col justify-between">
      {/* Drawer Header */}
      <div className="bg-brand-choco p-5 text-white flex items-center justify-between border-b-2 border-brand-pink/20">
        <div className="flex items-center gap-2.5">
          <ShoppingBag className="text-brand-pink shrink-0" size={22} />
          <div>
            <h4 className="font-display text-lg font-black uppercase tracking-wide">My Order Tray</h4>
            <p className="text-[10px] text-brand-peach/60 font-medium">({totalItemsCount} treats selected)</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          aria-label="Collapse Tray"
        >
          <X size={18} />
        </button>
      </div>

      {/* Drawer Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {/* Cart Contents */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
            <div className="h-20 w-20 rounded-full bg-brand-cream border border-brand-choco/10 flex items-center justify-center text-4xl select-none">
              🧁
            </div>
            <div>
              <p className="font-display font-black text-brand-choco uppercase tracking-tight">Your Tray is Empty</p>
              <p className="font-sans text-xs text-brand-choco/50 mt-1 max-w-[220px]">
                Browse the chapters on the left, tap items to add them, or construct a customized masterpiece!
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-brand-pink px-4 py-2 text-xs font-black text-white hover:bg-brand-pink-dark uppercase tracking-wider shadow-xs"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#2e1d1a]/55 font-display">
                Selection Details
              </span>
              <button
                onClick={onClearCart}
                className="text-[10px] uppercase font-bold text-red-500 hover:underline flex items-center gap-1"
              >
                <Trash2 size={10} /> Clear all
              </button>
            </div>

            {/* List Of Added Items */}
            <div className="space-y-3">
              {cart.map((cartItem) => {
                const isCustom = cartItem.item.id.startsWith('custom_');
                const baseItemPrice = cartItem.selectedSize && cartItem.item.pricesBySize
                  ? cartItem.item.pricesBySize[cartItem.selectedSize]
                  : cartItem.item.price;
                const toppingsTotal = cartItem.addedToppings.reduce((acc, curr) => acc + curr.price, 0);
                const singleItemTotal = baseItemPrice + toppingsTotal;

                return (
                  <div
                    key={cartItem.cartId}
                    className="rounded-2xl bg-white p-3.5 border border-brand-choco/5 hover:border-brand-pink/20 transition-all shadow-3xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Title & Size details */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isCustom && <span className="bg-brand-yellow/20 text-[#a85908] text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm shrink-0">Custom</span>}
                          <h5 className="font-playful text-sm font-bold text-brand-choco tracking-tight truncate">
                            {cartItem.item.name}
                          </h5>
                        </div>

                        {/* Description slice */}
                        <p className="text-[10px] text-brand-choco/50 mt-0.5 line-clamp-1">
                          {cartItem.item.description || 'Gourmet dessert recipe'}
                        </p>

                        {/* Indicators (Size, selectedOption) */}
                        {(cartItem.selectedSize || cartItem.selectedOption) && (
                          <div className="flex gap-1.5 items-center flex-wrap mt-1">
                            {cartItem.selectedSize && (
                              <span className="bg-brand-peach text-brand-pink-dark text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                                {cartItem.selectedSize}
                              </span>
                            )}
                            {cartItem.selectedOption && (
                              <span className="bg-brand-cream text-brand-choco/70 text-[9px] font-semibold px-2 py-0.5 rounded-full max-w-[150px] truncate">
                                {cartItem.selectedOption}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Top level Delete */}
                      <button
                        onClick={() => onRemoveItem(cartItem.cartId)}
                        className="text-brand-choco/30 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* TOPPING LIST FOR THIS SPECIFIC ITEM */}
                    <div className="mt-2.5 pt-2 border-t border-brand-choco/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#2e1d1a]/45">
                          Toppings:
                        </span>
                        
                        {/* Inline Topping Add popover/toggle layout */}
                        <div className="relative group/toggle">
                          <button className="text-[9px] font-bold text-brand-pink hover:underline">
                            + Add Topping
                          </button>
                          
                          {/* Rich dropdown on hover/focus */}
                          <div className="absolute right-0 top-3 z-30 hidden group-hover/toggle:block hover:block bg-brand-choco text-white rounded-xl shadow-lg p-2 min-w-[170px] border border-white/10 mt-1">
                            <p className="text-[9px] font-black uppercase tracking-wider text-rose-300 border-b border-white/5 pb-1 mb-1">Extras (+ KES)</p>
                            <div className="space-y-1 max-h-[160px] overflow-y-auto">
                              {EXTRA_TOPPINGS.map((top) => {
                                const hasIt = cartItem.addedToppings.some((at) => at.name === top.name);
                                return (
                                  <button
                                    key={top.name}
                                    onClick={() => {
                                      if (hasIt) {
                                        onRemoveToppingFromCartItem(cartItem.cartId, top.name);
                                      } else {
                                        onAddToppingToCartItem(cartItem.cartId, top);
                                      }
                                    }}
                                    className="w-full text-left flex items-center justify-between text-[10px] font-medium p-1 hover:bg-white/10 rounded-sm"
                                  >
                                    <span className="flex items-center gap-1">
                                      {hasIt ? '⭐' : '➕'} {top.name}
                                    </span>
                                    <span className="text-brand-yellow font-bold">+{top.price}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Render active toppings */}
                      {cartItem.addedToppings.length === 0 ? (
                        <p className="text-[9px] text-[#2e1d1a]/30 italic font-medium">No custom toppings added.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {cartItem.addedToppings.map((top) => (
                            <span
                              key={top.name}
                              className="inline-flex items-center gap-1 bg-[#1e6157]/10 text-[#0d4a3e] rounded-full px-2 py-0.5 text-[9px] font-bold border border-[#1e6157]/10"
                            >
                              <span>{top.name}</span>
                              <button 
                                onClick={() => onRemoveToppingFromCartItem(cartItem.cartId, top.name)}
                                className="hover:text-red-500 font-extrabold text-[9px] ml-0.5"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom strip: quantity controls & item pricing */}
                    <div className="mt-3.5 pt-2 flex items-center justify-between border-t border-brand-choco/5">
                      {/* Controller */}
                      <div className="flex items-center bg-brand-cream rounded-xl p-1 shadow-inner/10 border border-brand-choco/10">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.cartId, -1)}
                          className="h-6 w-6 rounded-lg bg-white hover:bg-neutral-100 flex items-center justify-center text-brand-choco hover:text-red-500 transition-colors cursor-pointer shadow-3xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        
                        <span className="text-xs font-black px-3.5 text-brand-choco select-none">
                          {cartItem.quantity}
                        </span>

                        <button
                          onClick={() => onUpdateQuantity(cartItem.cartId, 1)}
                          className="h-6 w-6 rounded-lg bg-white hover:bg-neutral-100 flex items-center justify-center text-brand-choco hover:text-brand-pink transition-colors cursor-pointer shadow-3xs"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      {/* Pricing sum */}
                      <span className="font-playful text-xs font-black text-brand-pink-dark">
                        {singleItemTotal * cartItem.quantity} KES
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section: Client pre-order variables (Only active if items exist) */}
        {cart.length > 0 && (
          <div className="rounded-2xl border border-brand-choco/5 bg-white p-4 space-y-3.5 shadow-3xs">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#2e1d1a]/55 font-display block">
              👤 Pickup / Prep Preferences
            </span>

            {/* Client Name Input */}
            <div className="space-y-1">
              <label className="text-[10px] text-brand-choco/60 font-black uppercase tracking-wider flex items-center gap-1">
                <User size={10} className="text-brand-pink" /> 
                Customer Name
              </label>
              <input
                type="text"
                placeholder="Type your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full text-xs font-semibold text-brand-choco placeholder:text-brand-choco/30 bg-brand-peach/30 border border-brand-choco/10 focus:border-brand-pink focus:outline-hidden rounded-xl p-2.5 transition-colors"
              />
            </div>

            {/* Pickup preference switches */}
            <div className="space-y-1">
              <label className="text-[10px] text-brand-choco/60 font-black uppercase tracking-wider flex items-center gap-1 mb-1">
                <MapPin size={10} className="text-brand-pink" />
                Preparation Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPreference('pickup')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-extrabold transition-all cursor-pointer ${
                    preference === 'pickup'
                      ? 'border-brand-pink bg-brand-pink/5 text-brand-pink-dark'
                      : 'border-brand-choco/10 bg-white text-brand-choco/60 hover:bg-brand-peach/10'
                  }`}
                >
                  🏫 Self-Pickup
                </button>
                <button
                  onClick={() => setPreference('delivery')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-extrabold transition-all cursor-pointer ${
                    preference === 'delivery'
                      ? 'border-brand-mint bg-[#3ebd83]/5 text-brand-mint'
                      : 'border-brand-choco/10 bg-white text-brand-choco/60 hover:bg-brand-peach/10'
                  }`}
                >
                  🛵 City Delivery
                </button>
              </div>
              <p className="text-[9px] text-[#2e1d1a]/40 italic pl-1 leading-normal">
                {preference === 'pickup' 
                  ? 'We will wrap, cold-pack, and set your tubs aside at the scoop parlor.'
                  : 'Nairobi delivery will be calculated and coordinated via GPS pins over WhatsApp.'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Sticky Footer with Subtotals & Order dispatch */}
      {cart.length > 0 && (
        <div className="p-5 bg-white border-t-2 border-brand-pink/15 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-brand-choco/55">Total Cost:</span>
            <span className="font-playful text-2xl font-black text-brand-pink-dark">
              {subtotal} <span className="text-sm font-bold text-brand-choco/60">KES</span>
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* COPY TEXT CLIPBOARD BUTTON (FALLBACK FOR IFRAME POPUP CONSTRAINTS!) */}
            <button
              onClick={copyToClipboard}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold transition-all ${
                copied 
                  ? 'bg-brand-mint text-white' 
                  : 'bg-brand-cream hover:bg-brand-cream/80 text-brand-choco border border-brand-choco/15'
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Order Text Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Pre-Formatted Order Text</span>
                </>
              )}
            </button>

            {/* MAIN DIRECT LINK TO WHATSAPP DISPATCH */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#25d366] hover:bg-[#128c7e] text-white py-3.5 px-4 text-xs font-extrabold uppercase tracking-widest shadow-lg transition-all text-center"
            >
              <MessageSquare size={16} />
              <span>Send Quick Order via WhatsApp</span>
            </a>
          </div>

          <p className="text-[9px] text-brand-choco/40 text-center leading-normal">
            Pre-orders are instant! This connects you directly with the Zen Scoops Hotline: <span className="font-bold text-brand-choco/70">{BUSINESS_INFO.formattedPhone}</span>
          </p>
        </div>
      )}
    </div>
  );
}
