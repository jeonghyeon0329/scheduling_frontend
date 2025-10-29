import React, { useState, useEffect } from 'react';
import { login } from '../../api/authApis';
import { FaSpinner } from 'react-icons/fa';
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
  // 범진 인사
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login(usrname, password);
      console.log("로그인 성공")
      console.log(data)
      
      // const { userName, accessToken, refreshToken } = data;
      
      // localStorage.setItem('refreshToken', refreshToken);
      // localStorage.setItem('userName', userName);
      // setUser({userName})
      onClose();
    } catch (error) {
      if (error.status === 401) {
        alert(error.data?.detail || '이메일 또는 비밀번호가 잘못되었습니다.');
      } else if (error.status >= 500) {
        alert('서버 접속이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
      } else {
        alert('로그인 요청 중 오류가 발생했습니다.');
      }
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
          {/* <button type="submit" disabled={isLoading}>
            {isLoading ? '진행중...' : '로그인'}
          </button> */}
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <FaSpinner className="spinner-icon" />
            ) : (
              '로그인'
            )}
          </button>
          <div className="user-action-row">
            <button className="user-action" disabled={isLoading} onClick={() => alert("회원가입")}> 회원가입 </button>
            <button className="user-action" disabled={isLoading} onClick={() => alert("비밀번호 찾기")}> 비밀번호 찾기 </button>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default LoginPopup;
