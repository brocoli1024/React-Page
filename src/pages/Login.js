import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ login, register, currentUser, logout }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();
    setMessage('');

    if (mode === 'login') {
      const result = await login({ username: username.trim(), password });
      if (result.success) {
        setMessage('登入成功，歡迎回來！');
        navigate('/');
      } else {
        setMessage(result.message);
      }
      return;
    }

    if (password !== confirmPassword) {
      setMessage('兩次密碼不一致，請重新輸入。');
      return;
    }

    const result = await register({ username: username.trim(), password });
    if (result.success) {
      setMessage('註冊成功，已自動登入！');
      navigate('/');
    } else {
      setMessage(result.message);
    }
  };

  const resetForm = newMode => {
    setMode(newMode);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setMessage('');
  };

  const handleLogout = () => {
    logout();
    setMessage('已成功登出。');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <div style={{ width: '360px', padding: '40px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        {currentUser ? (
          <>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>歡迎回來，{currentUser.username}</h1>
            <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center' }}>您已登入，若要切換帳號請先登出。</p>
            <button style={loginBtn} onClick={handleLogout}>登出</button>
          </>
        ) : (
          <>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>{mode === 'login' ? '會員登入' : '會員註冊'}</h1>
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>使用者名稱</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={inputStyle}
                autoComplete="username"
              />
              <label style={labelStyle}>密碼</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              {mode === 'register' && (
                <>
                  <label style={labelStyle}>確認密碼</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={inputStyle}
                    autoComplete="new-password"
                  />
                </>
              )}
              {message && (
                <p style={{ color: '#d6336c', marginBottom: '16px', minHeight: '22px' }}>{message}</p>
              )}
              <button type="submit" style={loginBtn}>{mode === 'login' ? '登入' : '註冊'}</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', color: '#3b82f6', fontSize: '14px' }}>
              {mode === 'login' ? '尚未註冊？' : '已有帳號？'}
              <span style={{ fontWeight: 'bold', cursor: 'pointer', marginLeft: '4px' }} onClick={() => resetForm(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? '點此註冊' : '點此登入'}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' };
const loginBtn = { width: '100%', padding: '12px', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' };

export default Login;