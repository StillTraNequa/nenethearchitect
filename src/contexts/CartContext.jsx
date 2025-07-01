import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load from localStorage on first render
    const storedCart = localStorage.getItem('nenenail_cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Sync to localStorage on cart change
  useEffect(() => {
    localStorage.setItem('neneCart', JSON.stringify(cart));
  }, [cart]);
  

  const addToCart = (newItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) =>
        item.slug === newItem.slug &&
        item.color?.name === newItem.color?.name &&
        item.shape === newItem.shape &&
        item.length === newItem.length &&
        item.notes === newItem.notes // Optional: only if notes matter
      );
  
      if (existingIndex !== -1) {
        // Update quantity if match found
        const updatedCart = [...prev];
        updatedCart[existingIndex].quantity += newItem.quantity || 1;
        return updatedCart;
      } else {
        return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
      }
    });
  }; 

  const updateQuantity = (index, newQty) => {
    setCart((prev) => {
      const updated = [...prev];
      if (newQty <= 0) return prev;
      updated[index].quantity = newQty;
      return updated;
    });
  };
  
  const removeFromCart = (index) =>
    setCart((prev) => prev.filter((_, i) => i !== index));

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
