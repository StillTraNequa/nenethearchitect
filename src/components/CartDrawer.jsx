import React from 'react';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose, cartItems }) => {
  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item, idx) => (
              <li key={idx} className="cart-item">
                <p><strong>{item.name}</strong></p>
                <p>{item.price}</p>
                <p>Color: {item.color?.name}</p>
                <p>Shape: {item.shape}</p>
                <p>Length: {item.length}</p>
              </li>
            ))}
          </ul>
        )}
        <button className="checkout-btn">Checkout</button>
      </div>
    </>
  );
};

export default CartDrawer;
