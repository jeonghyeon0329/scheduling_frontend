import React, { useState, useEffect } from "react";
import { signup } from "../../api/authApis";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import "./SignupPopup.css";
import { IMAGE_PATHS } from "../../constants/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupPopup = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      console.log("data", data);

      // 입력값 초기화
      setUsername("");
      setName("");
      setEmail("");
      setPassword("");

      // 성공 화면 표시
      setIsSuccess(true);
    } catch (error) {
      console.log(error.data);
      if (error.status > 500) {
        toast.error("서버 접속이 지연되고 있습니다. 잠시 후 다시 시도해주세요.", {
          position: "top-center",
        });
      } else {
        toast.error(error.data?.detail || "요청 중 오류가 발생했습니다.", {
          position: "top-center",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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

          {/* 오른쪽 폼 or 성공 화면 */}
          <div className="form-area">
            <h2>회원가입</h2>
            {!isSuccess ? (
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
                {usernameError && (
                  <p className="error-message">{usernameError}</p>
                )}

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
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(validatePassword(e.target.value));
                    }}
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {passwordError && (
                  <p className="error-message">{passwordError}</p>
                )}

                <button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <FaSpinner className="spinner-icon" />
                  ) : (
                    "가입하기"
                  )}
                </button>
              </form>
            ) : (
              <div className="success-screen">
                {/* <img
                  src={IMAGE_PATHS.SUCCESS_ICON}
                  alt="회원가입 완료"
                  className="success-img"
                /> */}
                <h3>🎉 회원가입이 완료되었습니다!</h3>
                <p>이제 로그인 후 서비스를 이용해보세요.</p>
                <button onClick={onClose} className="success-btn">
                  로그인하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default SignupPopup;
