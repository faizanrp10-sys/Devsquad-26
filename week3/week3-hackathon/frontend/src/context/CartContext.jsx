import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, variantId, quantity) => {
    try {
      const { data } = await api.post('/cart', { productId, variantId, quantity });
      setCart(data);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add to cart';
    }
  };

  const updateQuantity = async (productId, variantId, quantity) => {
    try {
      const { data } = await api.put('/cart', { productId, variantId, quantity });
      setCart(data);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update quantity';
    }
  };

  const removeFromCart = async (productId, variantId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}/${variantId}`);
      setCart(data);
    } catch (error) {
      console.error('Failed to remove from cart', error);
    }
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
