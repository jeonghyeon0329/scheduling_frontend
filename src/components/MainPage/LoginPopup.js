import React, { useState, useEffect } from 'react';
import { login } from '../../api/authApis';
import './LoginPopup.css';

const LoginPopup = ({ onClose, setUser }) => {
  const [usrname, setusrname] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login(usrname, password);
      const { userName, accessToken, refreshToken } = data;
      
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userName', userName);
      setUser({userName})
      onClose();
    } catch (error) {
      // console.error('로그인 에러:', error);
      alert('로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>스케줄 플래너</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="이메일 아이디"
            value={usrname}
            onChange={(e) => setusrname(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? '진행중...' : '로그인'}
          </button>
          <button className="passwordmissing" disabled={isLoading} onClick={() => alert("비밀번호 찾기")}> 비밀번호 찾기 </button>
        </form>
        
      </div>
    </div>
  );
};

export default LoginPopup;
