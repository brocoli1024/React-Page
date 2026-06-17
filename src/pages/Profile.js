import React, { useMemo, useState } from 'react';
import { spendUserPoints } from '../services/localDatabase';
import { submitReview } from '../services/api';

function Profile({ orders, points, setPoints, currentUser, onReviewSaved }) {
  const [message, setMessage] = useState('');
  const [reviewingOrderId, setReviewingOrderId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const rewards = useMemo(() => [
    { id: 'coffee', name: '冰咖啡', cost: 2 },
    { id: 'toast', name: '薯餅蛋吐司', cost: 5 },
    { id: 'sandwich', name: '鮪魚三明治', cost: 5 },
    { id: 'egg', name: '蛋餅', cost: 3 },
    { id: 'tea', name: '紅茶', cost: 2 },
    { id: 'hotdog', name: '熱狗', cost: 1 },
    { id: 'noodle', name: '鐵板麵', cost: 6 },
    { id: 'burger', name: '卡啦雞腿堡', cost: 6 },
  ], []);

  const handleRedeem = reward => {
    if (!currentUser) {
      setMessage('請先登入後再兌換點數。');
      return;
    }

    const result = spendUserPoints(currentUser.username, reward.cost);
    if (!result.success) {
      setMessage(result.message || '兌換失敗。');
      return;
    }

    setPoints(result.points);
    setMessage(`已兌換 ${reward.name}，剩餘 ${result.points} 點。`);
  };

  const startReview = order => {
    setReviewingOrderId(order.id);
    setReviewData({
      rating: order.review?.rating || 5,
      comment: order.review?.comment || '',
    });
    setMessage('');
  };

  const cancelReview = () => {
    setReviewingOrderId(null);
    setReviewData({ rating: 5, comment: '' });
  };

  const handleSubmitReview = async orderId => {
    const rating = Number(reviewData.rating);
    const comment = reviewData.comment.trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setMessage('請選擇 1 到 5 顆星。');
      return;
    }
    if (comment.length > 500) {
      setMessage('評論請勿超過 500 字。');
      return;
    }

    setSubmittingReview(true);
    setMessage('');
    try {
      const response = await submitReview({ orderId, rating, comment });

      if (response.success) {
        onReviewSaved(orderId, response.review);
        setMessage(response.message || '評價已送出。');
        cancelReview();
      } else {
        setMessage(response.message || '提交評價失敗。');
      }
    } catch (err) {
      setMessage(err.message || '提交評價失敗，請稍後再試。');
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => (
    <div style={starRowStyle} aria-label={`${rating} 顆星`}>
      {[1, 2, 3, 4, 5].map(value => {
        const star = value <= rating ? '★' : '☆';
        if (!interactive) {
          return (
            <span key={value} style={{ ...starStyle, color: value <= rating ? '#f5a623' : '#c9c9c9' }}>
              {star}
            </span>
          );
        }

        return (
          <button
            key={value}
            type="button"
            onClick={() => onRatingChange(value)}
            aria-label={`評 ${value} 顆星`}
            style={{
              ...starButtonStyle,
              color: value <= rating ? '#f5a623' : '#c9c9c9',
            }}
          >
            {star}
          </button>
        );
      })}
    </div>
  );

  return (
    <div>
      <h1>會員中心</h1>
      <section style={pointsPanelStyle}>
        <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>目前集點：{points} 點</p>
        <p style={{ margin: '6px 0 0', color: '#8a6d3b' }}>每消費 100 元可累積 1 點，可用點數兌換餐點。</p>
      </section>

      <h2>點數兌換</h2>
      <div style={rewardGridStyle}>
        {rewards.map(reward => {
          const canRedeem = points >= reward.cost;
          return (
            <div key={reward.id} style={rewardCardStyle}>
              <h3 style={{ margin: '0 0 10px' }}>{reward.name}</h3>
              <p style={{ margin: '0 0 12px', color: '#666' }}>需要 {reward.cost} 點</p>
              <button
                onClick={() => handleRedeem(reward)}
                style={{ ...buttonStyle, backgroundColor: canRedeem ? '#ff7f50' : '#adb5bd' }}
                disabled={!canRedeem}
              >
                {canRedeem ? '兌換' : '點數不足'}
              </button>
            </div>
          );
        })}
      </div>

      {message ? <p style={messageStyle}>{message}</p> : null}

      <h2>歷史訂單</h2>
      {orders.length === 0 ? (
        <p style={{ color: '#666', marginTop: '20px' }}>尚無歷史訂單，先去產品頁面下單吧！</p>
      ) : (
        orders.map(order => (
          <article key={order.id} style={orderCardStyle}>
            <h2 style={{ margin: 0 }}>訂單編號：{order.id}</h2>
            <p style={mutedTextStyle}>訂單日期：{order.date}</p>
            <p style={mutedTextStyle}>總價：{Number(order.total).toFixed(2)} 元</p>
            <ul style={{ color: '#555', paddingLeft: '18px' }}>
              {order.items.map(item => (
                <li key={`${order.id}-${item.id}`}>
                  {item.name} - 數量：{item.quantity}，單價：{Number(item.price).toFixed(2)} 元
                </li>
              ))}
            </ul>

            <section style={reviewSectionStyle}>
              <div style={reviewHeaderStyle}>
                <h3 style={{ margin: 0, color: '#333' }}>訂單評價</h3>
                {order.review ? (
                  <button type="button" onClick={() => startReview(order)} style={secondaryButtonStyle}>
                    編輯評價
                  </button>
                ) : null}
              </div>

              {order.review ? (
                <div style={reviewDisplayStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <strong>評分：</strong>
                    {renderStars(order.review.rating)}
                  </div>
                  {order.review.comment ? (
                    <p style={{ color: '#555', margin: '10px 0 0', whiteSpace: 'pre-wrap' }}>
                      <strong>評論：</strong>{order.review.comment}
                    </p>
                  ) : (
                    <p style={{ color: '#777', margin: '10px 0 0' }}>未留下文字評論。</p>
                  )}
                  <p style={{ color: '#999', fontSize: '12px', margin: '8px 0 0' }}>
                    評價時間：{order.review.created_at}
                  </p>
                </div>
              ) : reviewingOrderId !== order.id ? (
                <div>
                  <p style={{ color: '#777', fontSize: '14px' }}>尚未評價這筆訂單。</p>
                  <button type="button" onClick={() => startReview(order)} style={buttonStyle}>
                    新增評價
                  </button>
                </div>
              ) : null}

              {reviewingOrderId === order.id ? (
                <div style={reviewFormStyle}>
                  <label style={labelStyle}>評分</label>
                  {renderStars(reviewData.rating, true, rating => setReviewData(prev => ({ ...prev, rating })))}

                  <label style={{ ...labelStyle, marginTop: '14px' }}>評論</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={event => setReviewData(prev => ({ ...prev, comment: event.target.value }))}
                    placeholder="分享餐點、出餐速度或整體體驗..."
                    maxLength={500}
                    style={textareaStyle}
                  />
                  <p style={counterStyle}>{reviewData.comment.length}/500</p>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleSubmitReview(order.id)}
                      disabled={submittingReview}
                      style={{
                        ...buttonStyle,
                        backgroundColor: submittingReview ? '#adb5bd' : '#ff7f50',
                        cursor: submittingReview ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {submittingReview ? '提交中...' : order.review ? '更新評價' : '提交評價'}
                    </button>
                    <button type="button" onClick={cancelReview} style={secondaryButtonStyle}>
                      取消
                    </button>
                  </div>
                </div>
              ) : null}
            </section>
          </article>
        ))
      )}
    </div>
  );
}

const pointsPanelStyle = {
  backgroundColor: '#fff8e1',
  border: '1px solid #ffe082',
  borderRadius: '8px',
  padding: '16px 20px',
  marginBottom: '24px',
};
const rewardGridStyle = { display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '30px' };
const rewardCardStyle = { border: '1px solid #eee', borderRadius: '8px', padding: '16px', minWidth: '180px' };
const orderCardStyle = {
  margin: '30px 0',
  borderLeft: '4px solid #ffd6e8',
  padding: '15px',
  backgroundColor: '#fff9fb',
  borderRadius: '4px',
};
const reviewSectionStyle = { marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e0e0e0' };
const reviewHeaderStyle = { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' };
const reviewDisplayStyle = { backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px', marginBottom: '10px' };
const reviewFormStyle = { backgroundColor: '#fffaed', padding: '15px', borderRadius: '4px', marginTop: '10px', border: '1px solid #ffe082' };
const mutedTextStyle = { color: '#888', margin: '5px 0' };
const messageStyle = { color: '#d6336c', marginBottom: '20px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold' };
const textareaStyle = {
  width: '100%',
  minHeight: '90px',
  padding: '8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontFamily: 'inherit',
  resize: 'vertical',
  boxSizing: 'border-box',
};
const counterStyle = { margin: '6px 0 12px', color: '#777', fontSize: '12px', textAlign: 'right' };
const buttonStyle = { padding: '8px 16px', backgroundColor: '#ff7f50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const secondaryButtonStyle = { ...buttonStyle, backgroundColor: '#6c757d' };
const starRowStyle = { display: 'inline-flex', gap: '4px', alignItems: 'center' };
const starStyle = { fontSize: '26px', lineHeight: 1 };
const starButtonStyle = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '30px',
  lineHeight: 1,
  padding: '2px',
};

export default Profile;
