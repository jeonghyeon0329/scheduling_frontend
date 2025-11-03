import React from 'react';
import './ProfilePopup.css';

function ProfilePopup({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>내 정보</h2>
        <p><strong>이메일:</strong> {user.userName}</p>
        <p><strong>상태:</strong> 로그인 중</p>
      </div>
    </div>
  );
}

export default ProfilePopup;
