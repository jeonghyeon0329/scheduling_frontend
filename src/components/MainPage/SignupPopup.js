import React, { useState, useEffect } from "react";
import { signup } from "../../api/authApis";
import { FaSpinner } from "react-icons/fa";
import "./SignupPopup.css";

const SignupPopup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await signup(email, password, name);
      alert(`회원가입이 완료되었습니다: ${data.email}`);
      onClose();
    } catch (error) {
      if (error.status === 409) {
        alert("이미 사용중인 이메일입니다.");
      } else if (error.status === 400) {
        alert("접속이 제한된 이메일입니다. 다른 이메일을 사용해주세요.");
      } else if (error.status === 500) {
        alert('서버 접속이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
      } else {
        // error.status := undefined
        alert("회원가입 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>회원가입</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            {isLoading ? <FaSpinner className="spinner-icon" /> : "가입하기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPopup;
