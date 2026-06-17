import React from 'react';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, updateCartQuantity, removeFromCart, createOrder, clearCart, currentUser }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id, value) => {
    const quantity = Math.max(1, Number(value) || 1);
    updateCartQuantity(id, quantity);
  };

  const handleCheckout = async () => {
    if (!cart.length) {
      window.alert('購物車目前沒有商品，無法下單。');
      return;
    }
    if (!currentUser) {
      window.alert('請先登入後再進行結帳。');
      navigate('/login');
      return;
    }

    const result = await createOrder(cart);
    if (!result.success) {
      window.alert(result.message || '建立訂單失敗，請稍後再試。');
      return;
    }

    clearCart();
    const earnedPoints = result.earnedPoints || 0;
    window.alert(`感謝您的訂單！總計 ${result.order.total.toFixed(2)} 元，已送出。\n訂單編號：${result.order.id}\n本次獲得 ${earnedPoints} 點集點。`);
    navigate('/profile');
  };

  const handleUpdate = () => {
    window.alert('購物車已更新。');
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1>購物車</h1>
      {cart.length === 0 ? (
        <p style={{ color: '#666', marginTop: '20px' }}>目前購物車沒有任何商品，請先到產品頁面加入。</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '10px' }}>產品名稱</th>
                <th>數量</th>
                <th>單價</th>
                <th>小計</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px 10px' }}>{item.name}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={e => handleQuantityChange(item.id, e.target.value)}
                      style={{ width: '60px', padding: '5px' }}
                    />
                  </td>
                  <td>{item.price.toFixed(2)} 元</td>
                  <td>{(item.price * item.quantity).toFixed(2)} 元</td>
                  <td>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ ...actionBtn, backgroundColor: '#dc3545' }}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'right' }}>總計: {total.toFixed(2)} 元</p>
            <div style={{ textAlign: 'right', marginTop: '10px' }}>
              <button style={actionBtn} onClick={handleUpdate}>更新數量</button>
              <button style={{ ...actionBtn, backgroundColor: '#007bff', marginLeft: '10px' }} onClick={handleCheckout}>確認下單</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const actionBtn = { padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#6c757d', color: 'white', cursor: 'pointer' };

export default Cart;