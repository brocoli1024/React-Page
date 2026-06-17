import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  login as apiLogin,
  register as apiRegister,
  fetchOrders as apiFetchOrders,
  createOrder as apiCreateOrder,
} from './services/api';
import { addUserPoints, getUserPoints } from './services/localDatabase';

import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Contact from './pages/Contact';

function App() {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [points, setPoints] = useState(0);
  const [user, setUser] = useState(() => {
    const savedUser = window.localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setPoints(0);
      return;
    }

    apiFetchOrders(user.username).then(setOrders).catch(err => {
      console.error(err);
    });
    setPoints(getUserPoints(user.username));
  }, [user]);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('user');
    }
  }, [user]);

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

  const clearCart = () => setCart([]);

  const createOrder = async cartItems => {
    if (!user) {
      return { success: false, message: '請先登入後再送出訂單。' };
    }
    if (!cartItems.length) {
      return { success: false, message: '購物車是空的。' };
    }

    try {
      const result = await apiCreateOrder({ username: user.username, items: cartItems });
      const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const earnedPoints = Math.floor(totalAmount / 100);
      if (earnedPoints > 0) {
        addUserPoints(user.username, earnedPoints);
        setPoints(prev => prev + earnedPoints);
      }
      setOrders(prevOrders => [result.order, ...prevOrders]);
      return { success: true, order: result.order, earnedPoints };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  const handleReviewSaved = (orderId, review) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, review } : order
      )
    );
  };

  const login = async ({ username, password }) => {
    try {
      const result = await apiLogin({ username, password });
      const normalizedUsername = result.username;
      setUser({ username: normalizedUsername });
      setPoints(getUserPoints(normalizedUsername));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async ({ username, password }) => {
    try {
      const result = await apiRegister({ username, password });
      const normalizedUsername = result.username || username;
      setUser({ username: normalizedUsername });
      setPoints(getUserPoints(normalizedUsername));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <nav style={navStyle}>
        <div style={navContainer}>
          <Link to="/" style={logoLinkStyle}>
            <img src="/images/logo.jpg" alt="早餐店 Logo" style={logoStyle} />
          </Link>
          <Link to="/" style={linkStyle}>首頁</Link>
          <Link to="/products" style={linkStyle}>產品列表</Link>
          <Link to="/cart" style={linkStyle}>購物車{cartCount > 0 ? `(${cartCount})` : ''}</Link>
          <Link to="/profile" style={linkStyle}>歷史訂單</Link>
          <Link to="/login" style={linkStyle}>{user ? '會員中心' : '登入'}</Link>
          {user ? <span style={pointsBadge}>集點 {points} 點</span> : null}
          {user ? (
            <button onClick={logout} style={logoutBtn}>登出</button>
          ) : null}
          <Link to="/contact" style={linkStyle}>聯絡我們</Link>
        </div>
      </nav>

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
                createOrder={createOrder}
                clearCart={clearCart}
                currentUser={user}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                orders={orders}
                points={points}
                setPoints={setPoints}
                currentUser={user}
                onReviewSaved={handleReviewSaved}
              />
            }
          />
          <Route path="/login" element={<Login login={login} register={register} currentUser={user} logout={logout} />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      <footer style={footerStyle}>
        © 早餐店訂餐系統
      </footer>
    </div>
  );
}

const navStyle = { backgroundColor: '#ffd6e8', padding: '15px 0', borderBottom: '1px solid #ffb6c1' };
const navContainer = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '25px', flexWrap: 'wrap' };
const logoLinkStyle = { display: 'flex', alignItems: 'center', marginRight: '10px' };
const logoStyle = { width: '48px', height: '48px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #fff' };
const linkStyle = { textDecoration: 'none', color: '#3b82f6', fontWeight: 'bold', fontSize: '16px' };
const logoutBtn = { backgroundColor: '#ff6b6b', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const pointsBadge = { backgroundColor: '#fff3cd', color: '#856404', padding: '6px 10px', borderRadius: '999px', fontSize: '14px', fontWeight: 'bold' };
const footerStyle = { textAlign: 'center', padding: '30px', color: '#888', borderTop: '1px solid #eee', fontSize: '14px' };

export default App;
