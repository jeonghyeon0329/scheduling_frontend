import React, { useState } from 'react';
import languagePack from '../../language';
import ReactCalendar from 'react-calendar';
import moment from 'moment';
import './Calendar.css';

function Calendar({lang, onDateChange}) {
  const texts = languagePack[lang];
  const [date, setDate] = useState(null);

  const onChange = (newDate) => {
    setDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };
  
  const handleTodayClick = () => {
    const today = new Date();
    setDate(today); 
    onChange(today);
  };

  return (
    <section className="circle-scheduler">
      <div className="grid-item Calendar">
        <div className="calendar-header">
          <div className="scheduler-subtitle">
            {texts.calendar_title}
            <button className="today-link" onClick={handleTodayClick}> {texts.today} </button>
          </div>
        </div>
        <ReactCalendar
          key={date?.toString()} 
          onChange={onChange}
          value={date}
          formatDay={(local, date) => moment(date).format("D")}
          showNeighboringMonth={false}
          view="month"
          locale="ko-KR"
          tileClassName="react-calendar__tile"
          calendarType="gregory"        
        />
      </div>
    </section>
  );
}

export default Calendar;
