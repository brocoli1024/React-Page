import React from 'react';

function Login() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <div style={{ width: '350px', padding: '40px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>會員登入</h1>
        <label style={labelStyle}>使用者名稱</label>
        <input type="text" style={inputStyle} defaultValue="C113156209" />
        <label style={labelStyle}>密碼</label>
        <input type="password" style={inputStyle} />
        <button style={loginBtn}>登入</button>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#3b82f6', fontSize: '14px', cursor: 'pointer' }}>
          尚未註冊？點此註冊
        </p>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' };
const loginBtn = { width: '100%', padding: '12px', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' };

export default Login;