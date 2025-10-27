import React, { useEffect, useRef } from 'react';
// import languagePack from '../../language';
import './DetailScheduler.css';
import moment from 'moment';
import 'moment/locale/ko';
import 'moment/locale/en-gb';

const DetailScheduler = ({ lang, selectedDate, schedules }) => {
  const listRef = useRef(null);
  // const nowMarkerRef = useRef(null);

  useEffect(() => {
    moment.locale(lang);
  }, [lang]);

  const angleToTime = (angle) => {
    if (angle >= 360) angle = 0;
    const totalHours = (angle % 360) / 15;
    const hour = Math.floor(totalHours);
    const minute = Math.round((totalHours - hour) * 60);
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  const getTimeRange = (start, end) => {
    const range = [];
    const startMoment = moment(angleToTime(start), 'HH:mm');
    const endMoment = moment(angleToTime(end), 'HH:mm');

    // 종료시각이 00:00로 되면 표현이 안되는 오류 해결
    if (endMoment.format('HH:mm') === '00:00') {
      endMoment.add(1, 'day');
    }

    while (startMoment.isBefore(endMoment)) {
      range.push(startMoment.format('HH:mm'));
      startMoment.add(30, 'minutes');
    }
    return range;
  };

  const filteredSchedules = schedules.filter(s =>
    selectedDate && s.date === moment(selectedDate).format('YYYY-MM-DD')
  );

  const timeToSchedule = {};
  filteredSchedules.forEach(s => {
    const times = getTimeRange(s.start, s.end);
    times.forEach(t => {
      timeToSchedule[t] = s;
    });
  });

  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${String(hour).padStart(2, '0')}:${minute}`;
  });

  const now = moment();
  const isToday = selectedDate && moment(selectedDate).isSame(now, 'day');
  const isFuture = selectedDate && moment(selectedDate).isAfter(now, 'day');
  const isPast = selectedDate && moment(selectedDate).isBefore(now, 'day');


  const getNextTimeSlot = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    const current = moment({ hour, minute }).add(30, 'minutes');
    return current.format('HH:mm');
  };


  useEffect(() => {
    if (listRef.current) {
      if (isToday) {
        const currentTimeIndex = times.findIndex(t => {
          const timeMoment = moment(t, 'HH:mm');
          return timeMoment.isAfter(now);
        });
        const targetIndex = currentTimeIndex > 0 ? currentTimeIndex - 1 : 0;
        const scrollTarget = listRef.current.children[targetIndex];
        if (scrollTarget) {
          scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (isFuture) {
        const scrollTarget = listRef.current.children[0];
        if (scrollTarget) {
          scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (isPast) {
        const lastIndex = listRef.current.children.length - 1;
        const scrollTarget = listRef.current.children[lastIndex];
        if (scrollTarget) {
          scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }
    }
  // eslint-disable-next-line
  }, [selectedDate]); 

  return (
    <div className="scheduler-container">
      <div className="scheduler-header">
        <div className="scheduler-title">
          <span role="img" aria-label="clipboard">📋</span>
          시간표 스케줄러
        </div>
        <span className="scheduler-count">{filteredSchedules.length}개 일정</span>
      </div>
      <div className="scheduler-list" ref={listRef}>
        {/* times : 00:00 ~ 23:30 표기 */}
        {times.map((time) => {
          const matched = timeToSchedule[time];
          const blockMoment = moment(`${moment(selectedDate).format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm');
          const isPastTime = selectedDate && blockMoment.isBefore(now); //선택한 시간이 현재보다 앞서는 경우(회색처리)
          const isCurrent = isToday && blockMoment.isSame(now, 'hour') && now.minutes() < 30 ? time.endsWith(':00') : time.endsWith(':30') && blockMoment.isSame(now, 'hour'); // 뱃지 표기
          return (
            <div
              key={time}
              className={`scheduler-item ${matched ? 'scheduler-colored' : ''} ${isPastTime ? 'scheduler-past' : ''}`}
            >
              <span className="scheduler-time">
                {time} ~ {getNextTimeSlot(time)}
                {isCurrent && <span className="scheduler-now-badge">● now</span>}
              </span>
              <span className={matched ? 'scheduler-text' : 'scheduler-empty'}>
                {matched ? matched.text : '비어있음'}
              </span>
              
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailScheduler;