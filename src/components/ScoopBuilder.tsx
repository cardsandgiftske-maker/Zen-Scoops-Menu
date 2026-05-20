import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, Check, ShoppingBag, Grid, RefreshCw, MessageSquare } from 'lucide-react';
import { MenuItem, Topping, CartItem } from '../types';
import { EXTRA_TOPPINGS } from '../data/menu';

const SCOOP_FLAVORS = [
  { name: 'Vanilla Bean', color: '#fef3c7', textColor: '#b45309', id: 'vanilla' },
  { name: 'Strawberry Blush', color: '#fda4af', textColor: '#be123c', id: 'strawberry' },
  { name: 'Rich Cocoa Chocolate', color: '#5c4033', textColor: '#ffffff', id: 'chocolate' },
  { name: 'Pistachio Mint', color: '#a7f3d0', textColor: '#047857', id: 'pistachio' },
  { name: 'Salted Caramel', color: '#fdba74', textColor: '#c2410c', id: 'caramel' },
  { name: 'Wild Blueberry', color: '#c7d2fe', textColor: '#4338ca', id: 'blueberry' },
];

const CONTAINERS = [
  { id: 'cone', label: 'Waffle Cone', price: 150, emoji: '📐' },
  { id: 'cup', label: 'Waffle Cup', price: 100, emoji: '🍨' },
  { id: 'cupcake_waffle', label: 'Cupcake Waffle Base', price: 300, emoji: '🧁' },
  { id: 'bubble_waffle', label: 'Bubble Waffle Warm', price: 500, emoji: '🧇' },
];

interface ScoopBuilderProps {
  onAddCustomItemToCart: (customItem: MenuItem, toppings: Topping[]) => void;
}

export default function ScoopBuilder({ onAddCustomItemToCart }: ScoopBuilderProps) {
  const [selectedContainer, setSelectedContainer] = useState('cone');
  const [scoops, setScoops] = useState<Array<{ name: string; color: string; id: string }>>([
    { name: 'Vanilla Bean', color: '#fef3c7', id: 'vanilla' },
  ]);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [justAdded, setJustAdded] = useState(false);

  const containerObj = CONTAINERS.find((c) => c.id === selectedContainer) || CONTAINERS[0];
  
  // Base price includes first scoop. Additional scoops are 200 each.
  const scoopsPrice = scoops.length > 0 ? (scoops.length - 1) * 200 : 0;
  const toppingsPrice = selectedToppings.reduce((acc, curr) => acc + curr.price, 0);
  const totalPrice = containerObj.price + 200 + scoopsPrice + toppingsPrice; // base container + initial scoop (200) + extras

  // Dynamic geometry for the topmost scoop to layer and position toppings and cherries perfectly
  const getTopScoopGeometry = () => {
    if (scoops.length === 0) return { y: 175, r: 48 };
    const idx = scoops.length - 1;
    if (idx === 1) return { y: 130, r: 45 };
    if (idx === 2) return { y: 85, r: 42 };
    return { y: 175, r: 48 };
  };
  const { y: topScoopY, r: topScoopR } = getTopScoopGeometry();
  const cherryCy = topScoopY - topScoopR - 8;
  const cherryStemStart = cherryCy - 15;
  const cherryStemCpY = cherryCy - 30;
  const cherryStemEndY = cherryCy - 23;

  const addScoop = (flavorId: string) => {
    if (scoops.length >= 3) return; // Max 3 scoops
    const flav = SCOOP_FLAVORS.find((f) => f.id === flavorId);
    if (flav) {
      setScoops([...scoops, { name: flav.name, color: flav.color, id: flav.id }]);
    }
  };

  const removeScoop = (index: number) => {
    const updated = [...scoops];
    updated.splice(index, 1);
    setScoops(updated);
  };

  const toggleTopping = (toppingName: string, price: number) => {
    const exists = selectedToppings.find((t) => t.name === toppingName);
    if (exists) {
      setSelectedToppings(selectedToppings.filter((t) => t.name !== toppingName));
    } else {
      setSelectedToppings([...selectedToppings, { name: toppingName, price }]);
    }
  };

  const resetBuilder = () => {
    setSelectedContainer('cone');
    setScoops([{ name: 'Vanilla Bean', color: '#fef3c7', id: 'vanilla' }]);
    setSelectedToppings([]);
  };

  const getWhatsAppLink = () => {
    if (scoops.length === 0) return '';
    
    let text = `🍦 *ZEN SCOOPS - CUSTOM HYPER-TREAT* 🍦\n`;
    text += `=================================\n\n`;
    text += `Hi Zen Scoops! I designed a custom treat on your website and would love to order it directly:\n\n`;
    text += `• *Container:* ${containerObj.label}\n`;
    text += `• *Scoop Stack:* \n`;
    scoops.forEach((s, idx) => {
      text += `   - Scoop ${idx + 1}: _${s.name}_\n`;
    });
    if (selectedToppings.length > 0) {
      text += `• *Toppings Selected:* \n`;
      selectedToppings.forEach((t) => {
        text += `   - _${t.name}_ (+${t.price} KES)\n`;
      });
    }
    text += `\n💰 *Total Value:* ${totalPrice} KES\n`;
    text += `=================================\n`;
    text += `📍 Created & simulated with Zen Scoops Interactive Builder!`;
    return `https://wa.me/254706148182?text=${encodeURIComponent(text)}`;
  };

  const handleAddToCart = () => {
    if (scoops.length === 0) return;
    
    // Construct a custom MenuItem representable in the cart
    const desc = `Custom scoop masterpiece featuring a ${containerObj.label} layered with scoops of: ${scoops.map((s) => s.name).join(', ')}.`;
    const customItem: MenuItem = {
      id: `custom_${Date.now()}`,
      name: `Custom Creamy Wonder (${containerObj.label})`,
      description: desc,
      price: containerObj.price + 200 + scoopsPrice, // Base custom price
      category: 'icecream_cone',
      tags: ['custom-creation', ...scoops.map((s) => s.id)],
    };

    onAddCustomItemToCart(customItem, selectedToppings);
    
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div id="scoop-builder" className="overflow-hidden rounded-3xl border border-brand-pink/20 bg-white/70 shadow-md backdrop-blur-md">
      {/* Builder Title Header */}
      <div className="bg-gradient-to-r from-brand-pink to-brand-pink-dark p-5 text-white">
        <h3 className="font-display text-xl font-extrabold flex items-center gap-2 uppercase tracking-wide">
          <Sparkles className="animate-pulse text-brand-yellow shrink-0" />
          Interactive Custom Cup & Cone Builder
        </h3>
        <p className="font-sans text-xs text-rose-100/90 mt-1 font-medium">
          Create, layer, and customize your dream Zen Scoops masterpiece in real-time!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* LEFT COLUMN: Visual Live SVG Rendering */}
        <div className="col-span-12 md:col-span-5 flex flex-col items-center justify-center bg-radial from-brand-peach/10 to-brand-pink/10 p-6 border-b md:border-b-0 md:border-r border-brand-pink/10">
          <div className="relative w-full max-w-[240px] h-[340px] flex items-end justify-center">
            
            {/* STACKED SCOOPS DYNAMIC SVG BUILDER */}
            <svg 
              viewBox="0 0 200 320" 
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0px 8px 12px rgba(46, 29, 26, 0.15))' }}
            >
              <defs>
                {/* Patterns/filters */}
                <pattern id="waffle-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 0,0 l 10,10 M 10,0 l -10,10" stroke="#78350f" strokeWidth="0.8" opacity="0.15" />
                </pattern>
                
                {/* Sprinkles overlays */}
                <radialGradient id="scoop-shading" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
                </radialGradient>
              </defs>

              {/* DRAW CONDITIONAL CONTAINERS IN PLACE AT BOTTOM (Y: 200-300) */}
              {selectedContainer === 'cone' && (
                <g id="visual-cone">
                  {/* Classic ice cream cone waffle triangle */}
                  <polygon points="65,200 135,200 100,310" fill="#d97706" />
                  <polygon points="65,200 135,200 100,310" fill="url(#waffle-pattern)" />
                  {/* Outer lip shadow rim */}
                  <ellipse cx="100" cy="200" rx="35" ry="6" fill="#b45309" opacity="0.4" />
                </g>
              )}

              {selectedContainer === 'cup' && (
                <g id="visual-cup">
                  {/* Classic paper custom sundae cup */}
                  <path d="M 55,200 L 145,200 L 135,280 L 65,280 Z" fill="#f5557f" />
                  {/* Branded decoration */}
                  <rect x="70" y="215" width="60" height="40" rx="6" fill="#faf0e0" opacity="0.9" />
                  <text x="100" y="235" fontSize="10" fontWeight="bold" fill="#f5557f" textAnchor="middle" fontFamily="sans-serif">ZEN</text>
                  <text x="100" y="247" fontSize="8" fontWeight="bold" fill="#2e1d1a" textAnchor="middle" fontFamily="sans-serif">SCOOPS</text>
                  {/* Rim */}
                  <ellipse cx="100" cy="200" rx="45" ry="8" fill="#d83a64" />
                </g>
              )}

              {selectedContainer === 'cupcake_waffle' && (
                <g id="visual-cupcake-waffle">
                  {/* Little scalloped cupcake waffle shape */}
                  <path d="M 50,210 C 65,190 135,190 150,210 L 132,275 C 130,280 120,282 100,282 C 80,282 70,280 68,275 Z" fill="#e28743" />
                  <path d="M 50,210 C 65,190 135,190 150,210 L 132,275 C 130,280 120,282 100,282 C 80,282 70,280 68,275 Z" fill="url(#waffle-pattern)" />
                  {/* Top wavy brim */}
                  <path d="M 45,210 C 55,205 60,215 70,210 C 80,205 90,215 100,210 C 110,205 120,215 130,210 C 140,205 145,215 155,210" stroke="#b45309" strokeWidth="4" fill="none" />
                </g>
              )}

              {selectedContainer === 'bubble_waffle' && (
                <g id="visual-bubble-waffle">
                  {/* Back flap of bubbly waffle wrapping around scoops */}
                  <path d="M 40,150 C 35,120 70,80 100,90 C 130,80 165,120 160,150" fill="#e28743" opacity="0.5" />
                  {/* Bubble dots in background */}
                  <circle cx="65" cy="115" r="12" fill="#d97706" opacity="0.6" />
                  <circle cx="100" cy="100" r="14" fill="#d97706" opacity="0.6" />
                  <circle cx="135" cy="115" r="12" fill="#d97706" opacity="0.6" />
                  {/* Main front cone wrap */}
                  <path d="M 40,165 C 40,165 70,285 100,310 C 130,285 160,165 160,165 Z" fill="#e28743" />
                  <path d="M 40,165 C 40,165 70,285 100,310 C 130,285 160,165 160,165 Z" fill="url(#waffle-pattern)" />
                  {/* Decorative Front bubbly waffle texture spheres */}
                  <circle cx="65" cy="180" r="10" fill="#f59e0b" />
                  <circle cx="85" cy="210" r="11" fill="#f59e0b" />
                  <circle cx="115" cy="210" r="11" fill="#f59e0b" />
                  <circle cx="135" cy="180" r="10" fill="#f59e0b" />
                  <circle cx="100" cy="240" r="12" fill="#f59e0b" />
                  <circle cx="100" cy="180" r="12" fill="#f59e0b" />
                </g>
              )}

              {/* RENDER DYNAMIC SCOOPS */}
              {scoops.map((scoop, index) => {
                // Determine heights. As you stack, scoops sit higher.
                // Scoop 0: Bottom-most. sits centered around Y = 175
                // Scoop 1: Middle. Sits around Y = 135
                // Scoop 2: Top. Sits around Y = 95
                let scoopY = 175;
                let scoopX = 100;
                let scoopR = 48;

                if (index === 1) {
                  scoopY = 130;
                  scoopR = 45;
                } else if (index === 2) {
                  scoopY = 85;
                  scoopR = 42;
                }

                return (
                  <g key={index} id={`visual-scoop-${index}`}>
                    {/* Fluff base drips */}
                    <ellipse cx={scoopX} cy={scoopY + scoopR - 10} rx={scoopR + 6} ry="14" fill={scoop.color} />
                    <circle cx={scoopX - scoopR + 10} cy={scoopY + scoopR - 5} r="10" fill={scoop.color} />
                    <circle cx={scoopX + scoopR - 10} cy={scoopY + scoopR - 5} r="10" fill={scoop.color} />
                    <circle cx={scoopX} cy={scoopY + scoopR - 4} r="12" fill={scoop.color} />

                    {/* Main Scoop sphere */}
                    <circle cx={scoopX} cy={scoopY} r={scoopR} fill={scoop.color} />

                    {/* Flavor-specific textured specks or markings */}
                    {scoop.id === 'vanilla' && (
                      <g opacity="0.45" id="vanilla-specks">
                        {/* Tiny vanilla bean specks */}
                        <circle cx={scoopX - 15} cy={scoopY - 15} r="1" fill="#451a03" />
                        <circle cx={scoopX + 10} cy={scoopY - 20} r="1" fill="#451a03" />
                        <circle cx={scoopX - 5} cy={scoopY - 5} r="1" fill="#451a03" />
                        <circle cx={scoopX + 22} cy={scoopY + 12} r="1" fill="#451a03" />
                        <circle cx={scoopX - 25} cy={scoopY + 8} r="1" fill="#451a03" />
                        <circle cx={scoopX + 5} cy={scoopY + 20} r="1" fill="#451a03" />
                        <circle cx={scoopX - 12} cy={scoopY + 25} r="1" fill="#451a03" />
                      </g>
                    )}

                    {scoop.id === 'strawberry' && (
                      <g opacity="0.65" id="strawberry-seeds">
                        {/* Little strawberry seed specks */}
                        <line x1={scoopX - 18} y1={scoopY - 12} x2={scoopX - 16} y2={scoopY - 8} stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1={scoopX + 12} y1={scoopY - 18} x2={scoopX + 14} y2={scoopY - 14} stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1={scoopX - 4} y1={scoopY - 2} x2={scoopX - 2} y2={scoopY + 2} stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1={scoopX + 20} y1={scoopY + 10} x2={scoopX + 22} y2={scoopY + 14} stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1={scoopX - 22} y1={scoopY + 12} x2={scoopX - 20} y2={scoopY + 16} stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" />
                      </g>
                    )}

                    {scoop.id === 'chocolate' && (
                      <g opacity="0.7" id="chocolate-chunks">
                        {/* Chocolate chunks/flakes */}
                        <rect x={scoopX - 18} y={scoopY - 18} width="4" height="4" rx="1" fill="#1e1b4b" transform={`rotate(15 ${scoopX - 18} ${scoopY - 18})`} />
                        <rect x={scoopX + 12} y={scoopY - 12} width="5" height="3" rx="1" fill="#1e1b4b" transform={`rotate(-25 ${scoopX + 12} ${scoopY - 12})`} />
                        <rect x={scoopX - 8} y={scoopY + 14} width="4" height="4" rx="1" fill="#1e1b4b" transform={`rotate(45 ${scoopX - 8} ${scoopY + 14})`} />
                        <rect x={scoopX + 18} y={scoopY + 8} width="3" height="5" rx="1" fill="#1e1b4b" transform={`rotate(10 ${scoopX + 18} ${scoopY + 8})`} />
                      </g>
                    )}

                    {scoop.id === 'pistachio' && (
                      <g opacity="0.65" id="pistachio-nuts">
                        {/* Little pistachio nut flecks of darker forest green */}
                        <circle cx={scoopX - 14} cy={scoopY - 22} r="2.5" fill="#065f46" />
                        <circle cx={scoopX + 18} cy={scoopY - 8} r="2" fill="#065f46" />
                        <circle cx={scoopX - 6} cy={scoopY + 10} r="2.5" fill="#065f46" />
                        <circle cx={scoopX + 15} cy={scoopY + 18} r="2" fill="#065f46" />
                        {/* Light cream flecks */}
                        <circle cx={scoopX - 22} cy={scoopY - 4} r="1.5" fill="#fef08a" />
                        <circle cx={scoopX + 6} cy={scoopY - 24} r="2.2" fill="#fef08a" />
                      </g>
                    )}

                    {scoop.id === 'caramel' && (
                      <g opacity="0.8" id="caramel-creasy-swirls">
                        {/* Elegantly styled caramel wave swirls */}
                        <path d={`M ${scoopX - 35} ${scoopY - 15} C ${scoopX - 15} ${scoopY - 30}, ${scoopX + 15} ${scoopY - 10}, ${scoopX + 35} ${scoopY - 22}`} stroke="#b45309" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d={`M ${scoopX - 28} ${scoopY + 8} C ${scoopX - 10} ${scoopY - 4}, ${scoopX + 10} ${scoopY + 18}, ${scoopX + 28} ${scoopY + 5}`} stroke="#9a3412" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      </g>
                    )}

                    {scoop.id === 'blueberry' && (
                      <g opacity="0.7" id="blueberry-marblings">
                        {/* Beautiful deep indigo blueberry spots and swirls */}
                        <circle cx={scoopX - 12} cy={scoopY - 14} r="4" fill="#1e1b4b" />
                        <circle cx={scoopX + 20} cy={scoopY - 10} r="3.5" fill="#1e1b4b" />
                        <circle cx={scoopX - 2} cy={scoopY + 12} r="4.5" fill="#1e1b4b" />
                        <path d={`M ${scoopX - 30} ${scoopY - 5} Q ${scoopX - 10} ${scoopY - 20} ${scoopX + 15} ${scoopY - 15} T ${scoopX + 30} ${scoopY + 12}`} stroke="#312e81" strokeWidth="2" fill="none" strokeLinecap="round" />
                      </g>
                    )}

                    {/* Ambient shadow gradient */}
                    <circle cx={scoopX} cy={scoopY} r={scoopR} fill="url(#scoop-shading)" />

                    {/* RENDER KITKAT STICK SLANTED IN TOP SCOOP (Backend layer of toppings) */}
                    {index === scoops.length - 1 && selectedToppings.some((t) => t.name === 'KitKat') && (
                      <g id="kitkat-stick">
                        {/* Dark chocolate stick */}
                        <line x1={scoopX - 45} y1={scoopY - 42} x2={scoopX - 12} y2={scoopY - 12} stroke="#3b1d11" strokeWidth="12" strokeLinecap="round" />
                        {/* Lighter stripes for texture */}
                        <line x1={scoopX - 42} y1={scoopY - 39} x2={scoopX - 15} y2={scoopY - 15} stroke="#7c2d12" strokeWidth="6" strokeLinecap="round" />
                        <line x1={scoopX - 40} y1={scoopY - 37} x2={scoopX - 18} y2={scoopY - 18} stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />
                      </g>
                    )}

                    {/* RENDER SPRINKLES ON TOP OF THE HIGH-LEVEL SCOOP ONLY */}
                    {index === scoops.length - 1 && selectedToppings.some((t) => t.name === 'Sprinkles') && (
                      <g id="sprinkle-spritzers">
                        <line x1={scoopX - 25} y1={scoopY - 20} x2={scoopX - 15} y2={scoopY - 18} stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
                        <line x1={scoopX + 15} y1={scoopY - 22} x2={scoopX + 25} y2={scoopY - 17} stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
                        <line x1={scoopX} y1={scoopY - 32} x2={scoopX + 10} y2={scoopY - 28} stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
                        <line x1={scoopX - 10} y1={scoopY - 10} x2={scoopX} y2={scoopY - 12} stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                        <line x1={scoopX + 5} y1={scoopY - 12} x2={scoopX + 15} y2={scoopY - 10} stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
                        <line x1={scoopX - 18} y1={scoopY + 2} x2={scoopX - 8} y2={scoopY + 5} stroke="#ec4899" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1={scoopX + 18} y1={scoopY + 2} x2={scoopX + 26} y2={scoopY - 4} stroke="#14b8a6" strokeWidth="3.5" strokeLinecap="round" />
                      </g>
                    )}

                    {/* RENDER M&Ms ON TOP OF THE HIGH-LEVEL SCOOP */}
                    {index === scoops.length - 1 && selectedToppings.some((t) => t.name === 'M&Ms') && (
                      <g id="m-and-m-candies">
                        <g>
                          <circle cx={scoopX - 22} cy={scoopY - 14} r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                          <text x={scoopX - 22} y={scoopY - 11.5} fontSize="7" fill="#ffffff" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">m</text>
                        </g>
                        <g>
                          <circle cx={scoopX + 18} cy={scoopY - 18} r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="0.5" />
                          <text x={scoopX + 18} y={scoopY - 15.5} fontSize="7" fill="#ffffff" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">m</text>
                        </g>
                        <g>
                          <circle cx={scoopX - 2} cy={scoopY - 26} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="0.5" />
                          <text x={scoopX - 2} y={scoopY - 23.5} fontSize="7" fill="#ffffff" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">m</text>
                        </g>
                        <g>
                          <circle cx={scoopX + 8} cy={scoopY - 8} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.5" />
                          <text x={scoopX + 8} y={scoopY - 5.5} fontSize="7" fill="#ffffff" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">m</text>
                        </g>
                      </g>
                    )}

                    {/* RENDER SMARTIES ON TOP OF THE HIGH-LEVEL SCOOP */}
                    {index === scoops.length - 1 && selectedToppings.some((t) => t.name === 'Smarties') && (
                      <g id="smarties-candies">
                        <ellipse cx={scoopX - 16} cy={scoopY - 20} rx="6" ry="4.5" fill="#ec4899" stroke="#ffffff" strokeWidth="0.5" />
                        <ellipse cx={scoopX + 14} cy={scoopY - 14} rx="6" ry="4.5" fill="#14b8a6" stroke="#ffffff" strokeWidth="0.5" />
                        <ellipse cx={scoopX - 5} cy={scoopY - 10} rx="6" ry="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="0.5" />
                        <ellipse cx={scoopX + 22} cy={scoopY - 22} rx="6" ry="4.5" fill="#a855f7" stroke="#ffffff" strokeWidth="0.5" />
                      </g>
                    )}

                    {/* RENDER SALTED CARAMEL SAUCE DRIP OVER TOP SCOOP */}
                    {index === scoops.length - 1 && selectedToppings.some((t) => t.name === 'Salted Caramel') && (
                      <g id="gold-caramel-sauce">
                        <path 
                          d={`M ${scoopX - 38} ${scoopY - 15} 
                              Q ${scoopX - 20} ${scoopY - 32} ${scoopX} ${scoopY - 30} 
                              T ${scoopX + 38} ${scoopY - 15}
                              Q ${scoopX + 25} ${scoopY - 2} ${scoopX + 15} ${scoopY + 4}
                              T ${scoopX - 15} ${scoopY + 8}
                              Z`} 
                          fill="#ca8a04" 
                          opacity="0.9" 
                        />
                        <circle cx={scoopX - 25} cy={scoopY + 12} r="3" fill="#ca8a04" />
                        <circle cx={scoopX + 15} cy={scoopY + 16} r="3.5" fill="#ca8a04" />
                        <circle cx={scoopX - 2} cy={scoopY + 19} r="2.5" fill="#ca8a04" />
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Cherry of custom completion always on top, dynamically positioned at the scoop stack's crest */}
              {scoops.length > 0 && (
                <g id="cherrys-glory">
                  <path d={`M 100,${cherryStemStart} Q 105,${cherryStemCpY} 118,${cherryStemEndY}`} stroke="#991b1b" strokeWidth="2.5" fill="none" />
                  <circle cx="100" cy={cherryCy} r="10" fill="#dc2626" />
                  <circle cx="97" cy={cherryCy - 3} r="3" fill="#ffffff" opacity="0.7" />
                </g>
              )}
            </svg>

            {/* Float Badge */}
            <div className="absolute left-1/2 bottom-4 -translate-x-1/2 bg-brand-choco text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md shrink-0 flex items-center gap-1.5 border border-white/20">
              <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
              <span>{scoops.length} Scoop{scoops.length !== 1 ? 's' : ''} Stacked</span>
            </div>
          </div>

          <div className="w-full text-center mt-4">
            <span className="font-playful text-2xl font-black text-brand-pink-dark">
              {totalPrice} <span className="text-sm font-bold text-brand-choco/60">KES</span>
            </span>
            <p className="text-[10px] text-brand-choco/50 tracking-wide uppercase font-semibold mt-0.5">Custom Order Value</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Configuration Interface Controls */}
        <div className="col-span-12 md:col-span-7 p-6 flex flex-col justify-between space-y-5">
          {/* Section 1: Choose Container */}
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#2e1d1a]/55 font-display block mb-2.5">
              1. Choose Crust / Container
            </span>
            <div className="grid grid-cols-2 gap-2">
              {CONTAINERS.map((cont) => (
                <button
                  key={cont.id}
                  onClick={() => setSelectedContainer(cont.id)}
                  className={`flex items-center gap-2.5 rounded-xl border-2 p-3 text-left transition-all ${
                    selectedContainer === cont.id
                      ? 'border-brand-pink bg-brand-pink/5 text-brand-choco scale-102'
                      : 'border-brand-choco/5 bg-white hover:bg-brand-peach/30'
                  }`}
                >
                  <span className="text-2xl">{cont.emoji}</span>
                  <div>
                    <p className="text-xs font-extrabold tracking-tight text-brand-choco">{cont.label}</p>
                    <p className="font-sans text-[10px] text-brand-pink-dark font-bold mt-0.5">+{cont.price} KES</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Choose Scoops */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#2e1d1a]/55 font-display block">
                2. Stack Scoops (Max 3)
              </span>
              {scoops.length > 0 && (
                <button
                  onClick={() => setScoops([])}
                  className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1"
                >
                  Clear all scoops
                </button>
              )}
            </div>

            {/* Current scoops queue */}
            <div className="flex gap-2 mb-3 min-h-[48px] p-2 rounded-xl bg-brand-cream border border-brand-choco/5 overflow-x-auto items-center">
              {scoops.length === 0 ? (
                <p className="text-xs text-brand-choco/40 italic pl-1 font-medium">No scoops layered. Tap flavors below to stack!</p>
              ) : (
                scoops.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 shadow-2xs text-xs font-semibold shrink-0 cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors border border-brand-choco/10 bg-white"
                    title="Click to remove"
                    onClick={() => removeScoop(idx)}
                  >
                    <span className="h-3.5 w-3.5 rounded-full border border-brand-choco/10 shadow-3xs" style={{ backgroundColor: s.color }} />
                    <span className="font-playful text-brand-choco text-[11px] font-bold">{s.name}</span>
                    <span className="text-[10px] text-brand-choco/40 font-extrabold hover:text-red-500 ml-1">×</span>
                  </div>
                ))
              )}
            </div>

            {/* Selection grid for scoops */}
            <div className="grid grid-cols-3 gap-2">
              {SCOOP_FLAVORS.map((flav) => {
                const isMax = scoops.length >= 3;
                return (
                  <button
                    key={flav.id}
                    disabled={isMax}
                    onClick={() => addScoop(flav.id)}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                      isMax
                        ? 'opacity-40 cursor-not-allowed bg-brand-peach/10 border-transparent'
                        : 'bg-white border-brand-choco/5 hover:border-brand-pink/30 hover:shadow-2xs cursor-pointer active:scale-95'
                    }`}
                  >
                    <span 
                      className="h-7 w-7 rounded-full border border-brand-choco/10 shadow-3xs mb-1" 
                      style={{ backgroundColor: flav.color }}
                    />
                    <span className="font-playful text-[10px] font-black text-brand-choco leading-tight">
                      {flav.name.replace(' Bean', '').replace(' Blush', '').replace(' Mint', '')}
                    </span>
                    <Plus size={10} className="absolute top-1 right-1 text-brand-choco/30" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Extra Toppings */}
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#2e1d1a]/55 font-display block mb-2">
              3. Custom Toppings (Add-ons)
            </span>

            <div className="flex flex-wrap gap-1.5">
              {EXTRA_TOPPINGS.map((topping) => {
                const isSelected = selectedToppings.some((t) => t.name === topping.name);
                return (
                  <button
                    key={topping.name}
                    onClick={() => toggleTopping(topping.name, topping.price)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-brand-pink text-white border-brand-pink shadow-2xs'
                        : 'bg-white text-brand-choco/80 border-brand-choco/5 hover:border-brand-pink/30'
                    }`}
                  >
                    {isSelected && <Check size={12} className="shrink-0" />}
                    <span className="font-playful text-[11px] font-bold">{topping.name}</span>
                    <span className={`text-[9px] font-bold ${isSelected ? 'text-white' : 'text-brand-pink-dark'}`}>
                      +{topping.price} KES
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Blocks */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={resetBuilder}
              className="flex items-center gap-2 rounded-xl bg-brand-cream/60 hover:bg-brand-cream border border-brand-choco/10 px-4 py-3 text-xs font-extrabold text-brand-choco transition-all hover:scale-102"
              title="Reset configuration"
            >
              <RefreshCw size={14} />
              <span>Reset</span>
            </button>

            <a
              href={scoops.length > 0 ? getWhatsAppLink() : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-2.5 rounded-2xl py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition-all text-center select-none ${
                scoops.length === 0
                  ? 'bg-brand-choco/20 text-brand-choco/40 cursor-not-allowed shadow-none pointer-events-none'
                  : 'bg-[#25d366] hover:bg-[#128c7e] hover:scale-102 cursor-pointer active:scale-98'
              }`}
            >
              <MessageSquare size={16} className="animate-pulse" />
              <span>Order Masterpiece via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
