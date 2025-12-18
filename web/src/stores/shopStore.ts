import { create } from 'zustand';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  icon: string;
  category: string;
  isFavorite?: boolean;
}

export interface CartItem {
  item: ShopItem;
  quantity: number;
}

export type PaymentMethod = 'cash' | 'bank';

interface ShopState {
  items: ShopItem[];
  categories: string[];
  cart: CartItem[];
  searchQuery: string;
  sortBy: 'name' | 'price' | 'price-high';
  categoryFilter: string;
  viewMode: 'grid' | 'list';
  paymentMethod: PaymentMethod;
  cashBalance: number;
  bankBalance: number;
  shopName: string | null;
  
  // Actions
  setShopData: (data: { items: ShopItem[], categories: string[], cashBalance: number, bankBalance: number, shopName?: string }) => void;
  addToCart: (item: ShopItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'name' | 'price' | 'price-high') => void;
  setCategoryFilter: (category: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  toggleFavorite: (itemId: string) => void;
  
  // Computed values
  getFilteredItems: () => ShopItem[];
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const mockItems: ShopItem[] = [
  {
    id: '1',
    name: 'Bandage',
    description: 'Basic medical bandage for treating minor wounds and cuts',
    price: 15,
    stock: 10,
    icon: '🩹',
    category: 'Misc',
  },
  {
    id: '2',
    name: 'Burger',
    description: 'Delicious burger with fresh ingredients to satisfy your hunger',
    price: 12,
    stock: 25,
    icon: '🍔',
    category: 'Food',
  },
  {
    id: '3',
    name: 'Coffee',
    description: 'Hot coffee to keep you energized throughout the day',
    price: 6,
    stock: 50,
    icon: '☕',
    category: 'Drinks',
  },
  {
    id: '4',
    name: 'E-Cola',
    description: 'Classic carbonated soft drink with refreshing taste',
    price: 4,
    stock: 100,
    icon: '🥤',
    category: 'Drinks',
  },
  {
    id: '5',
    name: 'Flashlight',
    description: 'Compact LED flashlight for emergency situations',
    price: 20,
    stock: 15,
    icon: '🔦',
    category: 'Misc',
  },
  {
    id: '6',
    name: 'Water Bottle',
    description: 'Refreshing water to stay hydrated during your adventures',
    price: 3,
    stock: 75,
    icon: '💧',
    category: 'Drinks',
  },
  {
    id: '7',
    name: 'Sandwich',
    description: 'Fresh sandwich with premium ingredients and delicious fillings',
    price: 8,
    stock: 30,
    icon: '🥪',
    category: 'Food',
  },
  {
    id: '8',
    name: 'First Aid Kit',
    description: 'Complete medical kit for emergency situations and injuries',
    price: 50,
    stock: 5,
    icon: '🏥',
    category: 'Misc',
  },
  {
    id: '9',
    name: 'Parachute',
    description: 'Emergency parachute for high-altitude situations and safety',
    price: 500,
    stock: 10,
    icon: '🪂',
    category: 'Misc',
  },
  {
    id: '10',
    name: 'Lockpick',
    description: 'A tool for opening locked doors and containers',
    price: 50,
    stock: 15,
    icon: '🔓',
    category: 'Misc',
  },
];

export const useShopStore = create<ShopState>((set, get) => ({
  items: [],
  categories: [],
  cart: [],
  searchQuery: '',
  sortBy: 'name',
  categoryFilter: 'All Items',
  viewMode: 'list',
  paymentMethod: 'cash',
  cashBalance: 0,
  bankBalance: 0,
  shopName: null,
  
  setShopData: (data) => {
    set({
      items: data.items,
      categories: data.categories,
      cashBalance: data.cashBalance,
      bankBalance: data.bankBalance,
      shopName: data.shopName || null,
      categoryFilter: 'All Items', // Reset filter when shop data changes
    });
  },

  addToCart: (item) => {
    const { cart } = get();
    const existingItem = cart.find(cartItem => cartItem.item.id === item.id);
    
    if (existingItem) {
      set({
        cart: cart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      });
    } else {
      set({ cart: [...cart, { item, quantity: 1 }] });
    }
  },

  removeFromCart: (itemId) => {
    set({ cart: get().cart.filter(cartItem => cartItem.item.id !== itemId) });
  },

  updateCartQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(itemId);
      return;
    }
    
    set({
      cart: get().cart.map(cartItem =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity }
          : cartItem
      )
    });
  },

  clearCart: () => set({ cart: [] }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sortBy) => set({ sortBy }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  toggleFavorite: (itemId) => {
    set({
      items: get().items.map(item =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    });
  },

  getFilteredItems: () => {
    const { items, searchQuery, sortBy, categoryFilter } = get();
    
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All Items' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price-high') {
        return b.price - a.price; // High to low
      } else {
        return a.price - b.price; // Low to high
      }
    });

    return filtered;
  },

  getCartTotal: () => {
    return get().cart.reduce((total, cartItem) => 
      total + (cartItem.item.price * cartItem.quantity), 0
    );
  },

  getCartItemCount: () => {
    return get().cart.reduce((count, cartItem) => count + cartItem.quantity, 0);
  },
}));
