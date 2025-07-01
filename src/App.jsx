import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import NailShop from "./pages/NailShop";
import ProductDetail from "./pages/ProductDetail";
import Styling from "./pages/Styling";
import Cart from "./pages/Cart"
import TechRedirect from "./pages/TechRedirect";
import ThankYou from './pages/ThankYou';
import { initGA } from './utils/analytics';
import RouteTracker from './components/RouteTracker';
import FloatingCartButton from "./components/FloatingCartButton";

function App() {
  useEffect(() => {
    initGA();
  }, []);

  const location = useLocation();
  const showCart = location.pathname.startsWith('/nails') && !location.pathname.includes('/cart');


  return (
    <div>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nails" element={<NailShop />} />
        <Route path="/tech" element={<TechRedirect />} />
        <Route path="/nails/:slug" element={<ProductDetail />} />
        <Route path="/styling" element={<Styling />} />
        <Route path="/nails/cart" element={<Cart />} />
        <Route path="/nails/thank-you" element={<ThankYou />} />
      </Routes>
      {showCart && <FloatingCartButton />}
    </div>
  );
}

export default App;
