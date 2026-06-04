import React from 'react';

function Cart() {
  return (
    <div style={{ maxWidth: '800px' }}>
      <h1>購物車</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
          <tr>
            <th style={{ padding: '10px' }}>產品名稱</th>
            <th>數量</th>
            <th>單價</th>
            <th>小計</th>
          </tr>
        </thead>
        <tbody>
          {/* 第一項商品 */}
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '15px 10px' }}>牽絲起司蛋餅</td>
            <td><input type="number" defaultValue="2" style={{ width: '60px', padding: '5px' }} /></td>
            <td>45.00 元</td>
            <td>90 元</td>
          </tr>
          {/* 第二項商品 (順手幫你多加一杯飲料，讓購物車看起來更豐富！) */}
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '15px 10px' }}>招牌大冰奶</td>
            <td><input type="number" defaultValue="2" style={{ width: '60px', padding: '5px' }} /></td>
            <td>25.00 元</td>
            <td>50 元</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: '20px' }}>
        {/* 總計金額 (90 + 50 = 140) */}
        <p style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'right' }}>總計: 140 元</p>
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <button style={actionBtn}>更新數量</button>
          <button style={{ ...actionBtn, backgroundColor: '#007bff', marginLeft: '10px' }}>確認下單</button>
        </div>
      </div>
    </div>
  );
}

const actionBtn = { padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#6c757d', color: 'white', cursor: 'pointer' };

export default Cart;