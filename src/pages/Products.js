import React, { useState } from 'react';

const productCard = { border: '1px solid #f0f0f0', padding: '15px', borderRadius: '8px', width: '230px', textAlign: 'center' };
const btnStyle = { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' };

function Products({ addToCart }) {
  // 早餐店品項
  const items = [
    { id: 1, name: '蘿蔔糕', price: 35, desc: '金黃酥脆，外酥內嫩' },
    { id: 2, name: '蛋餅', price: 30, desc: '餅皮Q彈，香氣十足' },
    { id: 3, name: '起司蛋餅', price: 45, desc: '濃郁起司牽絲超滿足' },
    { id: 4, name: '火腿蛋吐司', price: 40, desc: '經典搭配，簡單美味' },
    { id: 5, name: '肉鬆吐司', price: 35, desc: ' 鹹香肉鬆，口感豐富' },
    { id: 6, name: '卡啦雞腿堡', price: 75, desc: '酥脆雞腿，大口過癮' },
    { id: 7, name: '豬排漢堡', price: 65, desc: '厚實豬排，香氣滿分' },
    { id: 8, name: '鮪魚三明治', price: 50, desc: '鮪魚濃郁，清爽不膩' },
    { id: 9, name: '培根蛋堡', price: 55, desc: '培根鹹香，早餐首選' },
    { id: 10, name: '薯餅蛋吐司', price: 50, desc: '酥脆薯餅超有飽足感' },
    { id: 11, name: '鐵板麵', price: 60, desc: '醬香濃郁，經典台味' },
    { id: 12, name: '黑胡椒鐵板麵', price: 65, desc: '黑胡椒香氣超開胃' },
    { id: 13, name: '雞塊', price: 45, desc: '外酥內嫩，一口接一口' },
    { id: 14, name: '熱狗', price: 25, desc: '香嫩多汁，小朋友最愛' },
    { id: 15, name: '炸薯條', price: 40, desc: '現炸酥脆，越吃越涮嘴' },
    { id: 16, name: '奶茶', price: 25, desc: '香濃順口，早餐必備' },
    { id: 17, name: '紅茶', price: 20, desc: '古早味紅茶，清爽回甘' },
    { id: 18, name: '豆漿', price: 25, desc: '香醇濃厚，傳統好滋味' },
    { id: 19, name: '冰咖啡', price: 40, desc: '提神首選，香氣濃郁' },
    { id: 20, name: '柳橙汁', price: 35, desc: '酸甜清爽，活力滿滿' },
  ];

  const defaultQuantities = items.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {});
  const [quantities, setQuantities] = useState(defaultQuantities);

  const handleQuantityChange = (id, value) => {
    const quantity = Math.max(1, Number(value) || 1);
    setQuantities(prev => ({ ...prev, [id]: quantity }));
  };

  const handleAddToCart = item => {
    const quantity = quantities[item.id] || 1;
    addToCart(item, quantity);
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>美味菜單</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px' }}>
        {items.map(item => (
          <div key={item.id} style={productCard}>
            {/* 這裡的 [圖片] 區塊之後可以換成真實的 <img> 標籤 */}
            <div style={{ width: '100%', height: '150px', backgroundColor: '#ffd6e8', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6fa5', fontWeight: 'bold' }}>
              [美味圖片]
            </div>
            <h3 style={{ margin: '10px 0' }}>{item.name}</h3>
            <p style={{ color: '#888', fontSize: '14px', height: '40px' }}>{item.desc}</p>
            <p style={{ color: '#555', fontWeight: 'bold' }}>價格: {item.price.toFixed(2)} 元</p>
            <input
              type="number"
              value={quantities[item.id]}
              min="1"
              onChange={e => handleQuantityChange(item.id, e.target.value)}
              style={{ width: '50px', marginBottom: '10px', padding: '5px', textAlign: 'center' }}
            />
            <br />
            <button style={btnStyle} onClick={() => handleAddToCart(item)}>
              加入購物車 🛒
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;