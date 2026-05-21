import React from 'react';
import { 
  Clock, 
  Phone, 
  Sparkles
} from 'lucide-react';
import { BUSINESS_INFO, CATEGORIES } from '../data/menu';
import { MenuCategoryKey } from '../types';

interface SocialsHeaderProps {
  selectedCategory: MenuCategoryKey | 'all';
  setSelectedCategory: (cat: MenuCategoryKey | 'all') => void;
}

export default function SocialsHeader({
  selectedCategory,
  setSelectedCategory,
}: SocialsHeaderProps) {
  return (
    <header className="relative w-full overflow-hidden bg-gradient-to-b from-[#f9cbd6] to-brand-peach pb-4 pt-6">
      {/* Decorative Floating Sweet Sprinkles */}
      <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-pink-100 opacity-30 blur-2xl" />
      <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-yellow-100 opacity-40 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main Brand Hub (Logo & Info Card) */}
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/65 bg-white/45 p-6 backdrop-blur-md md:flex-row shadow-xs">
          {/* Brand/Logo Column */}
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl overflow-hidden border-2 border-brand-pink/30 bg-white shadow-md animate-bounce-slow shrink-0">
              <img 
                src="/src/assets/images/scoop logo.png" 
                alt="Zen Scoops Logo" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div>
              <h1 className="font-display text-4xl font-black tracking-tight text-brand-choco uppercase md:text-5xl">
                Zen <span className="text-brand-pink">Scoops</span>
              </h1>
              <p className="font-playful text-sm text-brand-pink-dark font-medium tracking-wide mt-1 flex items-center justify-center gap-1.5 md:justify-start">
                <Sparkles size={14} className="animate-spin-slow" /> GOURMET ICE CREAM & CAFÉ PARLOR
              </p>
            </div>
          </div>

          {/* Business & Location Info Pill */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-end items-center">
            {/* Hours */}
            <div className="flex items-center gap-2.5 rounded-2xl bg-white/80 px-4 py-2.5 text-xs font-semibold text-brand-choco shadow-xs border border-white/40">
              <Clock size={16} className="text-brand-pink shrink-0" />
              <div>
                <p className="text-[10px] text-brand-choco/60 font-medium uppercase tracking-wider">Business Hours</p>
                <p className="font-sans">{BUSINESS_INFO.businessHours}</p>
              </div>
            </div>

            {/* Quick Contact Line */}
            <a 
              href={`tel:${BUSINESS_INFO.phone}`}
              className="group flex items-center gap-2.5 rounded-2xl bg-[#3ebd83]/10 hover:bg-[#3ebd83]/15 transition-colors px-4 py-2.5 text-xs font-semibold text-[#1e6a47] border border-[#3ebd83]/20"
            >
              <Phone size={16} className="text-brand-mint shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-[10px] text-[#1e6a47]/70 font-medium uppercase tracking-wider">Order Hotline</p>
                <p className="font-sans font-extrabold">{BUSINESS_INFO.formattedPhone}</p>
              </div>
            </a>
          </div>
        </div>

        {/* Dynamic Categories Grid Selector */}
        <div className="mt-6 flex flex-col gap-4">
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#2e1d1a]/55 font-display flex items-center gap-1">
                🧁 Browse Menu Chapters
              </span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs font-bold text-brand-pink-dark hover:underline flex items-center gap-1"
                >
                  Show All Chapters
                </button>
              )}
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
              {/* "All Chapters" Option */}
              <button
                onClick={() => setSelectedCategory('all')}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl text-center cursor-pointer transition-all hover:scale-105 shrink-0 w-[100px] border-2 ${
                  selectedCategory === 'all'
                    ? 'bg-brand-pink text-white border-brand-pink/50 shadow-md translate-y-[-2px]'
                    : 'bg-white border-transparent text-brand-choco/80 shadow-3xs hover:border-brand-pink/20 hover:bg-brand-cream/40'
                }`}
              >
                <span className="text-2xl mb-1">🌠</span>
                <span className="text-[11px] font-extrabold tracking-tight uppercase line-clamp-1">All Items</span>
              </button>

              {/* Categoric Iteration */}
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                let catIcon = '🍦';
                if (cat.key === 'breakfast') catIcon = '🍳';
                if (cat.key === 'icecream') catIcon = '🍦';
                if (cat.key === 'waffles_rolls') catIcon = '🧇';
                if (cat.key === 'beverages') catIcon = '☕';
                if (cat.key === 'shakes') catIcon = '🥤';
                if (cat.key === 'cocktails') catIcon = '🍹';

                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl text-center cursor-pointer transition-all hover:scale-105 shrink-0 w-[115px] border-2 ${
                      isSelected
                        ? 'bg-brand-pink text-white border-brand-pink/90 shadow-md translate-y-[-2px]'
                        : 'bg-white border-transparent text-brand-choco/80 shadow-3xs hover:border-brand-pink/20 hover:bg-brand-cream/40'
                    }`}
                  >
                    <span className="text-2xl mb-1">{catIcon}</span>
                    <span className="text-[11px] font-extrabold tracking-tight uppercase line-clamp-1">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
