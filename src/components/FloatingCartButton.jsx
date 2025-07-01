import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './FloatingCartButton.css'; // Optional styling

const FloatingCartButton = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <button className="floating-cart-btn" onClick={() => navigate('/nails/cart')}>
      🛒
      {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
    </button>
  );
};

export default FloatingCartButton;
