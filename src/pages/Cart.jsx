import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'
import Footer from '../components/Footer'
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(true);

  const handleCheckout = async () => {
    try {
      const response = await fetch('https://nenethearchitect.onrender.com/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          email,
          optedIn: optIn,
        }),
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Something went wrong during checkout.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Error starting checkout. See console.');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const priceNumber = parseFloat(item.price.replace('$', '').replace('+', ''));
      return total + priceNumber * item.quantity;
    }, 0).toFixed(2);
  };

  return (
    <>
      <Helmet>
        <title>Your Cart | NeNeNail’dIt</title>
        <meta name="description" content="Review your selected custom press-on nail sets. Add, remove, or adjust your order before checkout." />
        <meta name="keywords" content="press-on nails cart, NeNe nails order, checkout nails, handmade nails" />
        <meta property="og:title" content="Your Cart | NeNeNail’dIt" />
        <meta property="og:description" content="Review and finalize your custom press-on nail set order." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nenethearchitect.com/nails/cart" />
        <meta property="og:image" content="https://nenethearchitect.com/preview.png" />
      </Helmet>
      <div className="cart-wrapper">
        <div className="cart-page">
          <Link to="/nails" className="back-button">← Back to Shop</Link>
          <h1>Your Cart</h1>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <div className="cart-table-wrapper">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Set</th>
                      <th>Options</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, index) => (
                      <tr key={index}>
                        <td><strong>{item.title}</strong></td>
                        <td>
                          {item.color?.name && <div>Color: {item.color.name}</div>}
                          {item.shape && <div>Shape: {item.shape}</div>}
                          {item.length && <div>Length: {item.length}</div>}
                        </td>
                        <td>
                          <div className="qty-controls">
                            <button onClick={() => updateQuantity(index, item.quantity - 1)} disabled={item.quantity === 1}>−</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                          </div>
                        </td>
                        <td>${(parseFloat(item.price.replace('$', '').replace('+', '')) * item.quantity).toFixed(2)}</td>
                        <td><button onClick={() => removeFromCart(index)}>Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="cart-total">
                <h2>Total: ${calculateTotal()}</h2>
              </div>

              <div className="actions">
                <button onClick={clearCart}>Clear Cart</button>
                <button onClick={handleCheckout}>Checkout</button>
              </div>
            </>
          )}
          <div className="checkout-email-form">

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={optIn}
                onChange={(e) => setOptIn(e.target.checked)}
              />
              I'd like to receive updates, nail drops, and discounts.
            </label>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
