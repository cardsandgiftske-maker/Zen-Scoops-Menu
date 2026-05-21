export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number; // Base price
  pricesBySize?: {
    [size: string]: number; // e.g., 'S': 200, 'L': 280, or 'Single': 250, 'Double': 300
  };
  hasSizes?: boolean;
  category: MenuCategoryKey;
  tags?: string[];
  optionsPrompt?: string; // e.g. "Choose high-quality toppings"
  options?: string[]; // Multiple choice options
}

export type MenuCategoryKey =
  | 'breakfast'
  | 'icecream'
  | 'waffles_rolls'
  | 'beverages'
  | 'shakes'
  | 'cocktails'
  | 'extra_toppings';

export interface MenuCategory {
  key: MenuCategoryKey;
  label: string;
  description: string;
  icon: string; // Lucide icon name string
  bgColor: string; // Tailind class for category tags
  image?: string; // Realistic visual category photo URL
}

export interface Topping {
  name: string;
  price: number;
}

export interface CustomScoopBuild {
  container: 'cup' | 'cone' | 'cupcake_waffle' | 'bubble_waffle';
  scoops: Array<{
    flavor: string;
    color: string;
  }>;
  toppings: string[];
}

export interface CartItem {
  cartId: string; // Unique ID for this entry
  item: MenuItem;
  selectedSize?: string; // 'S' / 'L' or 'Single' / 'Double'
  selectedOption?: string; // e.g. for "Cone with Toppings (choose one)"
  addedToppings: Topping[];
  quantity: number;
}

export interface BusinessInfo {
  phone: string;
  formattedPhone: string; // e.g., "0706 148 182"
  address: string;
  instagram: string;
  tiktok: string;
  businessHours: string;
}
