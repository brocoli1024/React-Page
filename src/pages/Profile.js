import React from 'react';

function Profile() {
  const orders = [
    { id: 23, total: 199, items: '巧克力吐司 - 數量: 1 件 - 價格: 40 元' },
    { id: 24, total: 589, items: '大冰紅 - 數量: 1 件 - 價格: 30 元' },
    { id: 25, total: 160, items: '雞塊 - 數量: 1 件 - 價格: 30 元' },
  ];

  return (
    <div>
      <h1>歷史訂單</h1>
      {orders.map(order => (
        <div key={order.id} style={{ margin: '30px 0', borderLeft: '4px solid #ffd6e8', paddingLeft: '15px' }}>
          <h2 style={{ margin: 0 }}>訂單編號: {order.id}</h2>
          <p style={{ color: '#888', margin: '5px 0' }}>總價: {order.total.toFixed(2)} 元</p>
          <ul style={{ color: '#555' }}>
            <li>{order.items}</li>
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Profile;