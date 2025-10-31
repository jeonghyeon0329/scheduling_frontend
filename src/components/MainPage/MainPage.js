import React, { useRef, useReducer, useEffect, useState} from 'react';
import languagePack from '../../language';
import { IMAGE_PATHS } from '../../constants/constants';
import LoginPopup from './LoginPopup';
import { logout } from '../../api/authApis';
import DetailScheduler from './DetailScheduler';
import ClockScheduler from './ClockScheduler';
import Calendar from './Calendar';
import './MainPage.css';

function MainPage() {
  
  const initialState = {
    lang: 'ko',
    showLangDropdown: false,
    showUserMenu: false,
  };
  
  // const dropdownRef = useRef();

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_LANG':
        return { ...state, lang: action.payload, showLangDropdown: false };
      case 'TOGGLE_LANG_DROPDOWN':
        return { ...state, showLangDropdown: !state.showLangDropdown, showUserMenu: false };
      case 'TOGGLE_USER_MENU':
        return { ...state, showUserMenu: !state.showUserMenu, showLangDropdown: false };
      case 'CLOSE_ALL_DROPDOWNS':
        return { ...state, showLangDropdown: false, showUserMenu: false };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { lang, showLangDropdown, showUserMenu } = state;
  const texts = languagePack[lang];
  const [selectedDate, setSelectedDate] = useState(new Date());
  // 로그인 팝업
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  // 로그인 정보 관리
  const [user, setUser] = useState(null);

  // 일정관리
  const [schedules, setSchedules] = useState([]);
  const userMenuRef = useRef();
  const langMenuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideUserMenu = userMenuRef.current && !userMenuRef.current.contains(event.target);
      const isOutsideLangMenu = langMenuRef.current && !langMenuRef.current.contains(event.target);

      if (isOutsideUserMenu && isOutsideLangMenu) {
        dispatch({ type: 'CLOSE_ALL_DROPDOWNS' });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUser({ userName: storedUserName });
    }
  }, []);

  return (
    <div className="Page-Container">
      <header className="header">
        <div className="header-inner">
          <div className="left">
            <div className="title-group">
              
              <h1
                onClick={() => window.location.href = '/'}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={IMAGE_PATHS.MAPIMAGE}
                  alt=""
                  style={{ width: '40px', height: '52px', verticalAlign: 'middle' }}
                />
                {texts.title}
              </h1>
              <div style={{ marginLeft: 40 }}>
                <p style={{ textAlign: 'center'}}>{texts.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="right">
            {user ? (
              <div className="user-dropdown" style={{ position: 'relative' }} ref={userMenuRef}>
                <span className="username" onClick={() => dispatch({ type: 'TOGGLE_USER_MENU' })}>
                  {/* {user.userName} ▾ */}
                  내정보 ▾
                </span>
                {showUserMenu && (
                  <ul className="dropdown">
                    {/* <li onClick={() => alert('회원정보 변경')}>회원정보 변경</li> */}
                    <li onClick={async () => {
                        try {
                          await logout();
                          localStorage.removeItem('userName');
                          setUser(null);
                        } catch (error) {
                          alert('로그아웃 중 오류가 발생했습니다.');
                        } finally {
                          dispatch({ type: 'CLOSE_ALL_DROPDOWNS' });
                        }
                      }}
                    >
                      로그아웃
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <button className="btn login" onClick={() => setShowLoginPopup(true)}>
                {texts.login}
              </button>
            )}

            <div className="lang-selector" ref={langMenuRef}>
              <button className="lang-button" onClick={() => dispatch({ type: 'TOGGLE_LANG_DROPDOWN' })}>
                language ▾
              </button>
              {showLangDropdown && (
                <ul className="dropdown">
                  <li onClick={() => dispatch({ type: 'SET_LANG', payload: 'ko' })}>한국어</li>
                  <li onClick={() => dispatch({ type: 'SET_LANG', payload: 'eng' })}>English</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="Main">
        <div className="scheduler-layout">
          <Calendar lang={lang} onDateChange={setSelectedDate} />
          <ClockScheduler
            lang={lang}
            selectedDate={selectedDate}
            schedules={schedules}
            setSchedules={setSchedules}
          />
          <DetailScheduler
            lang={lang}
            selectedDate={selectedDate}
            schedules={schedules}
          />
          {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} setUser={setUser} />}
        </div>
      </main>


    </div>
  );
}

export default MainPage;

