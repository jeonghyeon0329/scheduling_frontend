import React, { useState, useEffect } from 'react';
import { login } from '../../api/authApis';
import { FaSpinner } from 'react-icons/fa';
import './LoginPopup.css';
import SignupPopup from "./SignupPopup";
import { IMAGE_PATHS } from "../../constants/constants";

const LoginPopup = ({ onClose, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      const data = await login(email, password);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
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
    <div className="popup-overlay">
      <div className="signup-layout" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn-right" onClick={onClose}>×</button>

        {/* 왼쪽 캐릭터 이미지 */}
        <div className="character-area-login">
          <img
            src={IMAGE_PATHS.LOGIN_ICON}
            alt="로그인 캐릭터"
            className="character-rect-img"
          />
        </div>

        {/* 오른쪽 로그인 폼 */}
        <div className="form-area">
          <h2>로그인</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <label>이메일</label>
            <input
              type="text"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? <FaSpinner className="spinner-icon" /> : '로그인'}
            </button>

            <div className="user-action-row">
              <button
                type="button"
                className="user-action"
                disabled={isLoading}
                onClick={() => setShowSignup(true)}
              >
                회원가입
              </button>
              <button
                type="button"
                className="user-action"
                disabled={isLoading}
                onClick={() => alert("비밀번호 찾기 기능은 준비 중입니다.")}
              >
                비밀번호 찾기
              </button>
            </div>
          </form>
        </div>

        {showSignup && <SignupPopup onClose={() => setShowSignup(false)} />}
      </div>
    </div>
  );
};

export default LoginPopup;
