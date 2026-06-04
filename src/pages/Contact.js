import React from 'react';

function Contact() {
  return (
    <div>
      <h1 style={{ fontSize: '36px' }}>聯絡我們</h1>
      <h2 style={{ marginTop: '30px', color: '#444' }}>聯絡資訊</h2>
      <p style={{ color: '#666' }}><strong style={{ color: '#d2b48c' }}>地址：</strong>高雄科技大學燕巢校區</p>
      <p style={{ color: '#666' }}>高雄市燕巢區深中路415號</p>
      
      <h2 style={{ marginTop: '40px', color: '#444' }}>地圖位置</h2>
      <div style={{ width: '100%', maxWidth: '600px', height: '350px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#999' }}>[ 此處放置 Google Map 嵌入代碼 ]</p>
      </div>
    </div>
  );
}

export default Contact;