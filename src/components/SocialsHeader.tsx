import React from 'react';
import { 
  Instagram, 
  Clock, 
  MapPin, 
  Phone, 
  Search, 
  X, 
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import { BUSINESS_INFO, CATEGORIES, INSTAGRAM_URL, TIKTOK_URL } from '../data/menu';
import { MenuCategoryKey } from '../types';

interface SocialsHeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: MenuCategoryKey | 'all';
  setSelectedCategory: (cat: MenuCategoryKey | 'all') => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  allAvailableTags: string[];
}

export default function SocialsHeader({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
  allAvailableTags,
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
                src="/src/assets/images/scooplogo.png" 
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
            {/* Hours */}
            <div className="flex items-center gap-2.5 rounded-2xl bg-white/80 px-4 py-2.5 text-xs font-semibold text-brand-choco shadow-xs border border-white/40">
              <Clock size={16} className="text-brand-pink shrink-0" />
              <div>
                <p className="text-[10px] text-brand-choco/60 font-medium uppercase tracking-wider">Business Hours</p>
                <p className="font-sans">{BUSINESS_INFO.businessHours}</p>
              </div>
            </div>

            {/* Locate */}
            <div className="flex items-start gap-2.5 rounded-2xl bg-white/80 px-4 py-2.5 text-xs font-semibold text-brand-choco shadow-xs border border-white/40 max-w-[240px]">
              <MapPin size={16} className="text-brand-pink shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-[10px] text-brand-choco/60 font-medium uppercase tracking-wider mb-0.5">Address Details</p>
                <p className="font-sans text-[11px] leading-tight text-brand-choco/85 whitespace-pre-line">{BUSINESS_INFO.address}</p>
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

        {/* Dynamic Navigation Social Channels */}
        <div className="mt-4 flex flex-wrap justify-between items-center gap-3">
          {/* Secondary Title Hint */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-brand-choco/70 uppercase tracking-widest bg-brand-cream px-3 py-1.5 rounded-lg border border-brand-choco/5">
            <UtensilsCrossed size={12} className="text-brand-yellow animate-pulse" />
            <span>Cold-plate & Bubble Shakes Hub</span>
          </div>

          {/* Social Badges */}
          <div className="flex items-center gap-2.5 ml-auto">
            <a 
              href={INSTAGRAM_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-[#f3f0ec] px-3.5 py-1.5 text-xs font-bold text-[#b93a8d] shadow-2xs border border-[#b93a8d]/15 transition-all hover:-translate-y-0.5"
            >
              <Instagram size={14} />
              <span>@zenscoops</span>
            </a>
            
            <a 
              href={TIKTOK_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-brand-choco text-white hover:bg-brand-choco/90 px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-all hover:-translate-y-0.5"
            >
              <span className="font-bold text-brand-pink">🎵</span>
              <span>TikTok</span>
            </a>
          </div>
        </div>

        {/* Dynamic Search, filters panel */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search Input bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-choco/40" />
              <input
                type="text"
                placeholder="Craving something? Search (e.g., Oreo Rolls, Kitkat, Nutty, Mojitos)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-brand-choco placeholder:text-brand-choco/40 bg-white/90 border-2 border-brand-choco/10 focus:border-brand-pink focus:outline-hidden hover:border-brand-choco/20 rounded-2xl py-3 pl-12 pr-10 font-sans font-medium text-sm transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-brand-pink transition-colors text-brand-choco/40"
                  aria-label="Clear Search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Quick Tag Badges Slider */}
            <div className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin md:max-w-md">
              <span className="text-[11px] font-bold text-brand-choco/50 tracking-wide uppercase mr-1 shrink-0">Tags:</span>
              <button
                onClick={() => setSelectedTag(null)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  !selectedTag 
                    ? 'bg-brand-choco text-white' 
                    : 'bg-white text-brand-choco/70 hover:bg-[#eae6e0]'
                }`}
              >
                All Tags
              </button>
              {allAvailableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize transition-all ${
                    tag === selectedTag
                      ? 'bg-brand-pink text-white shadow-2xs'
                      : 'bg-white text-brand-choco/70 hover:bg-[#eae6e0]'
                  }`}
                >
                  {tag.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Grid Selector */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#2e1d1a]/55 font-display flex items-center gap-1">
                🧁 Browse Menu Chapters
              </span>
              {(selectedCategory !== 'all' || selectedTag || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedTag(null);
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-brand-pink-dark hover:underline flex items-center gap-1"
                >
                  Clear all filters
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
                if (cat.key === 'beverages') catIcon = '☕';
                if (cat.key === 'shakes') catIcon = '🥤';
                if (cat.key === 'cocktails') catIcon = '🍹';
                if (cat.key === 'mocktails') catIcon = '🍋';
                if (cat.key === 'rolls') catIcon = '🍥';
                if (cat.key === 'bubble_waffle') catIcon = '🧇';
                if (cat.key === 'icecream_sticks') catIcon = '🍭';
                if (cat.key === 'cupcake_waffle') catIcon = '🧁';
                if (cat.key === 'platters') catIcon = '🏔️';
                if (cat.key === 'fruity_icecream') catIcon = '🍓';
                if (cat.key === 'icecream_cone') catIcon = '📐';

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
                      {cat.label.replace('Icecream', '')}
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
