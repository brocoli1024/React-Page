import React from 'react';

function Profile({ orders }) {
  return (
    <div>
      <h1>歷史訂單</h1>
      {orders.length === 0 ? (
        <p style={{ color: '#666', marginTop: '20px' }}>尚無歷史訂單，先去產品頁面下單吧！</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{ margin: '30px 0', borderLeft: '4px solid #ffd6e8', paddingLeft: '15px' }}>
            <h2 style={{ margin: 0 }}>訂單編號: {order.id}</h2>
            <p style={{ color: '#888', margin: '5px 0' }}>訂單日期: {order.date}</p>
            <p style={{ color: '#888', margin: '5px 0' }}>總價: {order.total.toFixed(2)} 元</p>
            <ul style={{ color: '#555', paddingLeft: '18px' }}>
              {order.items.map(item => (
                <li key={item.id}>
                  {item.name} - 數量: {item.quantity} 件 - 單價: {item.price.toFixed(2)} 元
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;