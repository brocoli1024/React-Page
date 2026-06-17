import React from 'react';

function Contact() {
  return (
    <div>
      <h1 style={{ fontSize: '36px' }}>聯絡我們</h1>
      <h2 style={{ marginTop: '30px', color: '#444' }}>聯絡資訊</h2>
      <p style={{ color: '#666' }}>
        <strong style={{ color: '#d2b48c' }}>地址：</strong>高雄科技大學燕巢校區
      </p>
      <p style={{ color: '#666' }}>高雄市燕巢區深中路415號</p>
      
      <h2 style={{ marginTop: '40px', color: '#444' }}>地圖位置</h2>
      {/* 外層保留您的樣式設定，確保排版一致 */}
      <div style={{ 
        width: '100%', 
        maxWidth: '600px', 
        height: '350px', 
        backgroundColor: '#f5f5f5', 
        border: '1px solid #ddd', 
        marginTop: '20px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        overflow: 'hidden' // 防止地圖超出邊界
      }}>
        {/* 這裡放入修改為 JSX 格式的 iframe */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3678.0772292376663!2d120.35824987600868!3d22.79956462460269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e10f135b0e8c7%3A0xc331165fc345e69f!2z5ZyL56uL6auY6ZuE56e85oqA5aSn5a24IOeHleSiouagoeWNgA!5e0!3m2!1szh-TW!2stw!4v1718550000000!5m2!1szh-TW!2stw" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
        ></iframe>
      </div>
    </div>
  );
}

export default Contact;