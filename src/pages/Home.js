import React from 'react';

function Home() {
  // 定義早餐店的專屬暖色系
  const primaryColor = '#FF7A45'; // 溫暖的橘紅色，像太陽或荷包蛋
  const textColor = '#4A4A4A';    // 柔和的深灰色，比純黑更好閱讀
  const bgColor = '#FFF9F5';      // 帶有一點點暖色的背景

  return (
    <div style={{ padding: '40px 20px', backgroundColor: bgColor, minHeight: '100vh', fontFamily: '"Nunito", "Noto Sans TC", sans-serif' }}>
      
      {/* 為了實現卡片浮動的 hover 效果，在此寫入一點原生 CSS */}
      <style>
        {`
          .news-card {
            border: 1px solid #FFE4D6;
            padding: 24px;
            border-radius: 16px;
            flex: 1;
            background-color: #fff;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            box-shadow: 0 4px 15px rgba(255, 122, 69, 0.05);
            cursor: pointer;
            min-width: 250px; /* 避免螢幕縮小時卡片擠在一起 */
          }
          /* 滑鼠游標移過去的動態效果 */
          .news-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(255, 122, 69, 0.15);
            border-color: #FF7A45;
          }
          .news-icon {
            font-size: 28px;
            margin-right: 10px;
          }
        `}
      </style>

      {/* 將內容置中並限制最大寬度，讓大螢幕閱讀起來更舒適 */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* 標題加上小圖示，並使用 flex 置中對齊 */}
        <h1 style={{ color: primaryColor, fontSize: '36px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '40px', marginRight: '12px' }}>☀️</span> 早安！最新消息
        </h1>
        
        {/* 副標題加上一點虛線底線，增加設計細節 */}
        <h2 style={{ color: '#888', marginTop: '10px', fontSize: '18px', borderBottom: '2px dashed #FFE4D6', paddingBottom: '15px' }}>
          店內大小事，報給你知
        </h2>
        
        <div style={{ display: 'flex', gap: '24px', marginTop: '30px', flexWrap: 'wrap' }}>
          
          <div className="news-card">
            <h3 style={{ color: primaryColor, display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span className="news-icon">🍳</span> 新年特別活動
            </h3>
            <p style={{ color: textColor, lineHeight: '1.6', margin: 0 }}>
              超值早餐套餐全新上市！數量有限！內容物採驚喜模式，保證物超所值！
            </p>
          </div>

          <div className="news-card">
            <h3 style={{ color: primaryColor, display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span className="news-icon">🏮</span> 春節營業公告
            </h3>
            <p style={{ color: textColor, lineHeight: '1.6', margin: 0 }}>
              除夕至初三正常營業，開放訂位！歡迎來店享受溫馨早餐時光。
            </p>
          </div>

          <div className="news-card">
            <h3 style={{ color: primaryColor, display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span className="news-icon">🤝</span> 誠徵夥伴
            </h3>
            <p style={{ color: textColor, lineHeight: '1.6', margin: 0 }}>
              我們需要具備良好工作態度與學習心的你，時薪 210 起，意者請洽店長。
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;