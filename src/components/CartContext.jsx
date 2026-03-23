import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart:v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart:v1', JSON.stringify(cart));
    } catch {
      // Silent fail for localStorage errors
    }
  }, [cart]);

  function addToCart(product) {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx === -1) {
        return [...prev, { 
          id: product.id, 
          name: product.name, 
          price: Number(product.price), 
          quantity: 1,
          image: product.images ? product.images[0] : product.image,
          category: product.category
        }];
      }
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
      return next;
    });
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function updateQuantity(id, quantity) {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: Number(quantity) } : p)));
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export { useCart };
export default CartContext;
