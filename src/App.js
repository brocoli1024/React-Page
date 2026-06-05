import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// 匯入各個頁面元件
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Contact from './pages/Contact';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item, quantity) => {
    setCart(prevCart => {
      const existing = prevCart.find(entry => entry.id === item.id);
      if (existing) {
        return prevCart.map(entry =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [...prevCart, { ...item, quantity }];
    });
  };

  const updateCartQuantity = (id, quantity) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(entry => entry.id !== id);
      }
      return prevCart.map(entry =>
        entry.id === id ? { ...entry, quantity } : entry
      );
    });
  };

  const removeFromCart = id => {
    setCart(prevCart => prevCart.filter(entry => entry.id !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      {/* 導覽列 */}
      <nav style={navStyle}>
        <div style={navContainer}>
          <Link to="/" style={linkStyle}>首頁</Link>
          <Link to="/products" style={linkStyle}>產品頁面</Link>
          <Link to="/cart" style={linkStyle}>購物車 {cartCount > 0 ? `(${cartCount})` : ''}</Link>
          <Link to="/profile" style={linkStyle}>歷史訂單</Link>
          <Link to="/login" style={linkStyle}>登入</Link>
          <Link to="/contact" style={linkStyle}>聯絡我們</Link>
        </div>
      </nav>

      {/* 頁面內容區 */}
      <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto', minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products addToCart={addToCart} />} />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                updateCartQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      {/* 頁尾 */}
      <footer style={footerStyle}>
        © 智商二甲乙
        活力早餐店 版權所有。
      </footer>
    </div>
  );
}

// 樣式設定
const navStyle = { backgroundColor: '#ffd6e8', padding: '15px 0', borderBottom: '1px solid #ffb6c1' };
const navContainer = { display: 'flex', justifyContent: 'center', gap: '25px' };
const linkStyle = { textDecoration: 'none', color: '#3b82f6', fontWeight: 'bold', fontSize: '16px' };
const footerStyle = { textAlign: 'center', padding: '30px', color: '#888', borderTop: '1px solid #eee', fontSize: '14px' };

export default App;