'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  salePrice: number;
  isOnSale: boolean;
  image: string;
  quantity: number;
  paymentType: string;
  pointsPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalAmount: 0,
  totalItems: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i._id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setItems(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const totalAmount = items.reduce((sum, item) => {
    const price = item.isOnSale ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
