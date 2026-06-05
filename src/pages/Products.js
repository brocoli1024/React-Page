import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';

const productCard = { border: '1px solid #f0f0f0', padding: '15px', borderRadius: '8px', width: '230px', textAlign: 'center' };
const btnStyle = { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' };

function Products({ addToCart }) {
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getImageUrl = image => {
    if (!image) return '';
    const normalized = image.startsWith('/') ? image : `/${image}`;
    if (process.env.NODE_ENV === 'development') {
      return `http://localhost:5000${encodeURI(normalized)}`;
    }
    const publicUrl = process.env.PUBLIC_URL || '';
    return `${publicUrl}${encodeURI(normalized)}`;
  };

  useEffect(() => {
    fetchProducts()
      .then(products => {
        setItems(products);
        setQuantities(products.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {}));
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleQuantityChange = (id, value) => {
    const quantity = Math.max(1, Number(value) || 1);
    setQuantities(prev => ({ ...prev, [id]: quantity }));
  };

  const handleAddToCart = item => {
    const quantity = quantities[item.id] || 1;
    addToCart(item, quantity);
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  if (loading) {
    return <p>正在載入商品，請稍候...</p>;
  }

  if (error) {
    return <p style={{ color: '#d6336c' }}>載入商品失敗：{error}</p>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>美味菜單</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px' }}>
        {items.map(item => (
          <div key={item.id} style={productCard}>
            <div style={{ width: '100%', height: '150px', overflow: 'hidden', borderRadius: '8px', marginBottom: '10px' }}>
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <h3 style={{ margin: '10px 0' }}>{item.name}</h3>
            <p style={{ color: '#888', fontSize: '14px', height: '40px' }}>{item.desc}</p>
            <p style={{ color: '#555', fontWeight: 'bold' }}>價格: {item.price.toFixed(2)} 元</p>
            <input
              type="number"
              value={quantities[item.id] || 1}
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