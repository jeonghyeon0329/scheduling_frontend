import React, { useState, useEffect } from 'react';
import languagePack from '../../language';
import './ClockScheduler.css';
import moment from 'moment';
import 'moment/locale/ko';
import 'moment/locale/en-gb';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClockScheduler = ({ lang, selectedDate, schedules, setSchedules }) => {
  /** =====================
   *  🧠 상태 변수 선언
   * ====================== */

  // 드래그 관련 상태
  const [startAngle, setStartAngle] = useState(null);
  const [endAngle, setEndAngle] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOverlappingNow, setIsOverlappingNow] = useState(false);

  // 시계 각도
  const [clockAngle, setClockAngle] = useState(0);
  const [minuteAngle, setMinuteAngle] = useState(0);
  const [secondAngle, setSecondAngle] = useState(0);

  // 수정 모드
  const [editingIndex, setEditingIndex] = useState(null);
  const [displayStartAngle, setDisplayStartAngle] = useState(null);
  const [displayEndAngle, setDisplayEndAngle] = useState(null);

  // 입력 텍스트
  const [inputText, setInputText] = useState('');

  /** =====================
   *  🌍 언어 및 날짜 포맷
   * ====================== */
  useEffect(() => {
    moment.locale(lang);
  }, [lang]);
  moment.locale(lang);
  const texts = languagePack[lang];

  const formatMap = {
    ko: 'YYYY년 M월 D일 (ddd)',
    en: 'MMMM Do, YYYY (ddd)',
  };
  const formattedDate = selectedDate
    ? moment(selectedDate).format(formatMap[lang] || formatMap['en'])
    : '';
  const todayDateKey = moment(selectedDate).format('YYYY-MM-DD');

  const filteredSchedules = schedules.filter(s => s.date === todayDateKey);
  // useEffect(() => {
  //   const todayKey = moment(selectedDate).format('YYYY-MM-DD');
  //   const filtered = schedules.filter(s => s.date === todayKey);
  //   console.log('📅 전체 일정:', schedules);
  //   console.log('✅ 필터링된 일정:', filtered);
  // }, [selectedDate, schedules]);


  /** =====================
   *  ⏱ 시계 시간 갱신
   * ====================== */
  useEffect(() => {
    const updateClockAngle = () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const totalHour = hour + minutes / 60;
      setClockAngle((totalHour / 24) * 360);
      setMinuteAngle((minutes / 60) * 360);
      setSecondAngle((seconds / 60) * 360);
    };

    updateClockAngle();
    const interval = setInterval(updateClockAngle, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateSecond = () => {
      const now = new Date();
      const totalSeconds = now.getSeconds() + now.getMilliseconds() / 1000;
      setSecondAngle((totalSeconds / 60) * 360);
    };

    const interval = setInterval(updateSecond, 100);
    return () => clearInterval(interval);
  }, []);

  /** =====================
   *  ⏱ 달력 날짜 갱신
   * ====================== */
  useEffect(() => {
    // 날짜가 바뀌면 드래그 중 상태나 임시 편집 상태 초기화
    setStartAngle(null);
    setEndAngle(null);
    setDisplayStartAngle(null);
    setDisplayEndAngle(null);
    setEditingIndex(null);
    setInputText('');
    setIsDragging(false);
  }, [selectedDate]);

  /** =====================
   *  🧮 계산 및 유틸리티
   * ====================== */
  const calculateAngleFromMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    return (angle + 450) % 360;
  };

  const snapToHalfHour = (angle) => Math.round(angle / 7.5) * 7.5;

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const describeSector = (x, y, radius, startAngle, endAngle) => {
    const adjustedEnd = (endAngle < startAngle) ? endAngle + 360 : endAngle;
    const arcSweep = adjustedEnd - startAngle;
    const largeArcFlag = arcSweep > 180 ? '1' : '0';
    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, adjustedEnd);
    return [
      `M ${x} ${y}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      'Z'
    ].join(' ');
  };

  const calculateTimeLabel = (angle) => {
    if (angle === null) return '--:--';
    if (angle >= 360) return '24:00';
    const totalHours = (angle % 360) / 15;
    const hour = Math.floor(totalHours);
    const minute = Math.round((totalHours - hour) * 60);
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  const isOverlapping = (newStart, newEnd) => {
    const todayKey = moment(selectedDate).format('YYYY-MM-DD');
    return schedules.some(sched => {
      if (sched.date !== todayKey) return false;
      const newEndNorm = newEnd < newStart ? newEnd + 360 : newEnd;
      const existEndNorm = sched.end < sched.start ? sched.end + 360 : sched.end;
      return !(newEndNorm <= sched.start || newStart >= existEndNorm);
    });
  };

  const getNextAvailableColor = (usedColors) => {
    const palette = [
      '#93c5fd', '#a5f3fc', '#fcd34d', '#fca5a5',
      '#c4b5fd', '#6ee7b7', '#f9a8d4', '#fdba74',
      '#a78bfa', '#7dd3fc', '#86efac', '#fde68a',
    ];
    return palette.find(color => !usedColors.includes(color)) || '#d1d5db';
  };

  /** =====================
   *  🖱 인터랙션 핸들러
   * ====================== */
  const handleMouseDown = (e) => {

    // 시계 중심 좌표 계산
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    //클릭 가능한 반지름 범위 지정
    if (distance > 150) return;

    // 시계 원판을 마우스로 클릭했을때 호출
    const angle = snapToHalfHour(calculateAngleFromMouse(e));

    if (editingIndex !== null) {
      // 수정 중인 일정 롤백 (복원)
      const prevSchedule = schedules[editingIndex];
      const updated = [...schedules];
      updated[editingIndex] = {
        ...prevSchedule,
        text: prevSchedule.text
      };
      setSchedules(updated);
    }

    setEditingIndex(null);
    setDisplayStartAngle(null);
    setDisplayEndAngle(null);
    setStartAngle(angle);
    setEndAngle(null);
    setIsDragging(true);
    setInputText('');
  };

  const handleMouseMove = (e) => {
    // 드래그 중일 때 마우스를 움직이면
    if (!isDragging || editingIndex !== null) return;
    const angle = snapToHalfHour(calculateAngleFromMouse(e));
    if (startAngle !== null) {
      const normalizedEnd = angle < startAngle ? angle + 360 : angle;
      const cappedEnd = normalizedEnd > 360 ? 360 : angle;
      if (isOverlapping(startAngle, cappedEnd)) return;
      setEndAngle(cappedEnd);
      setIsOverlappingNow(false);
    }
  };

  const handleMouseUp = () => {
    // 시계 원판에서 마우스를 땠을 때
    if (editingIndex !== null) return;
    setIsDragging(false);
  };

  /** =====================
   *  💾 일정 저장/수정/삭제
   * ====================== */
  const handleSave = () => {
    const effectiveStart = displayStartAngle ?? startAngle;
    const effectiveEnd = displayEndAngle ?? endAngle;

    if (effectiveStart === null || effectiveEnd === null || inputText.trim() === '') return;
    if (Math.abs(effectiveEnd - effectiveStart) < 7.5) {
      toast.error("30분 이상의 스케줄만 저장할 수 있습니다.", {
        position: "top-center",
      });
      
      resetInput();
      return;
    }

    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    const trimmed = inputText.trim();

    if (editingIndex !== null) {
      const updated = [...schedules];
      updated[editingIndex] = { ...updated[editingIndex], text: trimmed };
      setSchedules(updated);
    } else {
      if (isOverlapping(effectiveStart, effectiveEnd)) {
        alert('이미 등록된 일정과 시간이 겹칩니다.');
        return;
      }
      const usedColors = schedules.map(s => s.color);
      setSchedules([
        ...schedules,
        {
          start: effectiveStart,
          end: effectiveEnd,
          text: trimmed,
          color: getNextAvailableColor(usedColors),
          date: formattedDate,
        }
      ]);
    }
    resetInput();
  };

  const handleEditDelete = () => {
    setSchedules(schedules.filter((_, i) => i !== editingIndex));
    resetInput();
  };

  //일정을 클릭했을때 
  const handleScheduleClick = (schedule) => {
    const index = schedules.findIndex(s =>
      s.date === schedule.date &&
      s.start === schedule.start &&
      s.end === schedule.end
    );
    if (index === -1) return;
    setEditingIndex(index);
    setDisplayStartAngle(schedule.start);
    setDisplayEndAngle(schedule.end);
    setInputText(schedule.text);
  };

  const resetInput = () => {
    setInputText('');
    setStartAngle(null);
    setEndAngle(null);
    setDisplayStartAngle(null);
    setDisplayEndAngle(null);
    setEditingIndex(null);
  };

  /** =====================
   *  📦 return (JSX)
   * ====================== */

  return (
    <section className="circle-scheduler">
      <div className="scheduler-subtitle">
        🕒 {formattedDate ? formattedDate : texts.calendar_title}
      </div>
      <div
        className="clock-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="clock">
          <svg className="sector-svg" width="300" height="300">
            {filteredSchedules.map((sched, idx) => {
              const start = sched.start;
              const end = sched.end;

              
              const visibleRadius = 100; // 중심에서부터 그려질 반지름 설정
              const bufferRadius = 150; // 클릭 버퍼용
              const middleAngle = start <= end
                ? (start + end) / 2
                : ((start + end + 360) / 2) % 360;

              return (
                <React.Fragment key={idx}>
                  {/* 클릭 가능한 투명한 경계 path 추가 */}
                  <path
                    d={describeSector(150, 150, bufferRadius, start, end)}
                    fill="transparent"
                    stroke="transparent"
                    // stroke="black"
                    // strokeWidth="30"
                    onClick={() => handleScheduleClick(sched)}
                    style={{ cursor: 'pointer', pointerEvents: 'visibleStroke' }}
                  />

                  {/* 실제 보이는 일정 path */}
                  <path
                    d={describeSector(150, 150, visibleRadius, start, end)}
                    fill={sched.color || '#c7d2fe'}
                    opacity="0.5"
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    onClick={() => handleScheduleClick(sched)}
                  />

                  {/* 일정 레이블 */}
                  <foreignObject
                    x={polarToCartesian(150, 150, 70, middleAngle).x - 30}
                    y={polarToCartesian(150, 150, 70, middleAngle).y - 15}
                    width={60}
                    height={30}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <div
                      className="schedule-label-box"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScheduleClick(sched);
                      }}
                      style={{
                        pointerEvents: 'none',
                        width: 'auto',
                        height: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        cursor: 'pointer',
                        userSelect: 'none',
                        touchAction: 'none', // 모바일 터치 대응
                      }}
                    >
                      {sched.text.slice(0, 4)}
                    </div>
                  </foreignObject>
                </React.Fragment>
              );
            })}

            {(startAngle !== null && endAngle !== null) && (
              <path
                className="sector-path"
                d={describeSector(150, 150, 130, startAngle, endAngle)}
                fill={isOverlappingNow ? '#fca5a5' : 'url(#sectorGradient)'}
              />
            )}
            <defs>
              <linearGradient id="sectorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a5b4fc" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
            <line
              x1="150"
              y1="150"
              x2={150 + 40 * Math.cos(((clockAngle - 90) * Math.PI) / 180)}
              y2={150 + 40 * Math.sin(((clockAngle - 90) * Math.PI) / 180)}
              stroke="red"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="150"
              y1="150"
              x2={150 + 55 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)}
              y2={150 + 55 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)}
              stroke="#ff7f50"
              strokeWidth="2"
            />
            <line
              x1="150"
              y1="150"
              x2={150 + 70 * Math.cos(((secondAngle - 90) * Math.PI) / 180)}
              y2={150 + 70 * Math.sin(((secondAngle - 90) * Math.PI) / 180)}
              stroke="#ffa500"
              strokeWidth="1"
            />
          </svg>

          {[...Array(24)].map((_, i) => {
            const angle = (i / 24) * 360 - 90;
            const radius = 130;
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);
            return (
              <div
                key={i}
                className="clock-number"
                onMouseDown={(e) => e.stopPropagation()} 
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                  userSelect: 'none'
                }}
              >
                {String(i).padStart(2, '0')}
              </div>
            );
          })}
          <div className="center-dot" />
        </div>
      </div>

      <div className="schedule-input beautiful">
        {/* <h3 className="schedule-title">📌 나의 일정 작성하기</h3> */}
        <div className="time-display improved-time">
          <span className="time-label">{texts.clock_start}</span>
          <span className="time-value">{calculateTimeLabel(displayStartAngle ?? startAngle)}</span>
          <span className="time-label">{texts.clock_end}</span>
          <span className="time-value">{calculateTimeLabel(displayEndAngle ?? endAngle)}</span>
        </div>
        <div className="input-row">
          <textarea
            className="input-box"
            placeholder={texts.clock_placeholder}
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          {/* 버튼 묶음 래퍼 */}
          <div className="button-column">
            <button
              className="save-button"
              onClick={handleSave}
              aria-label={texts.save}
              title={texts.save}
            >
              <span className="sr-only">💾</span>
            </button>

            <button
              className="delete-button"
              onClick={() => {
                if (editingIndex !== null) {
                  handleEditDelete();
                } else {
                  setInputText('');
                  setStartAngle(null);
                  setEndAngle(null);
                  setDisplayStartAngle(null);
                  setDisplayEndAngle(null);
                }
              }}
              aria-label={texts.delete}
              title={texts.delete}
            >
              <span className="sr-only">❌</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClockScheduler;