import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  login as apiLogin,
  register as apiRegister,
  fetchOrders as apiFetchOrders,
  createOrder as apiCreateOrder,
} from './services/api';

// 匯入各個頁面元件
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Contact from './pages/Contact';

function App() {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(() => {
    const savedUser = window.localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    apiFetchOrders(user.username).then(setOrders).catch(err => {
      console.error(err);
    });
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
      return { success: false, message: '請先登入後再進行結帳。' };
    }
    if (!cartItems.length) {
      return { success: false, message: '購物車目前沒有商品。' };
    }

    try {
      const result = await apiCreateOrder({ username: user.username, items: cartItems });
      setOrders(prevOrders => [result.order, ...prevOrders]);
      return { success: true, order: result.order };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  const login = async ({ username, password }) => {
    try {
      const result = await apiLogin({ username, password });
      setUser({ username: result.username });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async ({ username, password }) => {
    try {
      await apiRegister({ username, password });
      setUser({ username });
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
      {/* 導覽列 */}
      <nav style={navStyle}>
        <div style={navContainer}>
          <Link to="/" style={linkStyle}>首頁</Link>
          <Link to="/products" style={linkStyle}>產品頁面</Link>
          <Link to="/cart" style={linkStyle}>購物車 {cartCount > 0 ? `(${cartCount})` : ''}</Link>
          <Link to="/profile" style={linkStyle}>歷史訂單</Link>
          <Link to="/login" style={linkStyle}>{user ? '會員專區' : '登入'}</Link>
          {user ? (
            <button onClick={logout} style={logoutBtn}>登出</button>
          ) : null}
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
                createOrder={createOrder}
                clearCart={clearCart}
                currentUser={user}
              />
            }
          />
          <Route path="/profile" element={<Profile orders={orders} />} />
          <Route path="/login" element={<Login login={login} register={register} currentUser={user} logout={logout} />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      {/* 頁尾 */}
      <footer style={footerStyle}>
        © 智商二甲
        活力早餐店 版權所有。
      </footer>
    </div>
  );
}

// 樣式設定
const navStyle = { backgroundColor: '#ffd6e8', padding: '15px 0', borderBottom: '1px solid #ffb6c1' };
const navContainer = { display: 'flex', justifyContent: 'center', gap: '25px' };
const linkStyle = { textDecoration: 'none', color: '#3b82f6', fontWeight: 'bold', fontSize: '16px' };
const logoutBtn = { backgroundColor: '#ff6b6b', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const footerStyle = { textAlign: 'center', padding: '30px', color: '#888', borderTop: '1px solid #eee', fontSize: '14px' };

export default App;