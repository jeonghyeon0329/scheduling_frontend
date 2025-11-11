import React, { useState, useEffect  } from "react";
import { signup } from "../../api/authApis";
import { FaSpinner } from "react-icons/fa";
import "./SignupPopup.css";
import { IMAGE_PATHS } from "../../constants/constants";

const SignupPopup = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateUsername = (v) => {
    if (v.length < 4) return "아이디는 4자 이상이어야 합니다.";
    if (!/^[A-Za-z0-9_]+$/.test(v))
      return "영문, 숫자, 언더스코어(_)만 가능합니다.";
    return "";
  };
  const validateEmail = (v) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return "이메일 형식이 올바르지 않습니다.";
    return "";
  };
  const validatePassword = (v) => {
    if (v.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    if (/^\d+$/.test(v)) return "숫자만으로 구성할 수 없습니다.";
    return "";
  };

  // 브라우저의 자동 포커스 동작을 살짝 기다렸다가 끊어주는 코드
  useEffect(() => {
    setTimeout(() => {
      if (document.activeElement && document.activeElement.tagName === "INPUT") {
        document.activeElement.blur();
      }
    }, 100);
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const uErr = validateUsername(username);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    if (uErr || eErr || pErr) {
      setUsernameError(uErr);
      setEmailError(eErr);
      setPasswordError(pErr);
      return;
    }
    setIsLoading(true);
    try {
      const data = await signup(username, name, email, password);
      console.log("data", data)
      alert(`회원가입이 완료되었습니다`);
      onClose();
    } catch (error) { 
      console.log(error.data)     
      if (error.status === 500) {
        alert('서버 접속이 지연되고 있습니다. 관리자에게 문의바랍니다.');
      } else if (error.status === 502) {
        alert('서버 접속이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
      } else {
        alert(error.data.detail);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="signup-layout" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn-right" onClick={onClose}>
          ×
        </button>

        {/* 왼쪽 캐릭터 이미지 */}
        <div className="character-area">
          <img
            src={IMAGE_PATHS.SIGNUP_ICON}
            alt="회원가입 캐릭터"
            className="character-rect-img"
          />
        </div>

        {/* 오른쪽 폼 */}
        <div className="form-area">
          <h2>회원가입</h2>
          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            <label>아이디</label>
            <input
              type="text"
              placeholder="영문/숫자/언더스코어(_)"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError(validateUsername(e.target.value));
              }}
            />
            {usernameError && <p className="error-message">{usernameError}</p>}

            <label>이름</label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>이메일</label>
            <input
              type="text"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(validateEmail(e.target.value));
              }}
            />
            {emailError && <p className="error-message">{emailError}</p>}

            <label>비밀번호</label>
            <input
              type="text"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value));
              }}
            />
            {passwordError && (
              <p className="error-message">{passwordError}</p>
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? <FaSpinner className="spinner-icon" /> : "가입하기"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPopup;
