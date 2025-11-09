import React, {useEffect, useMemo, useState} from 'react';
import {fetchActivityHistoryEvents} from '../../../lib/api';
import type {HistoryEvent} from '../../../lib/types';
import {ArrowLeftIcon, CalendarEmptyIcon, ChevronRightIcon} from '../../../components/ui/icons';

const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const categoryColors: { [key: string]: string } = {
  'Спорт': 'bg-[#FF303C]',
  'Арт': 'bg-purple-500',
  'Экология': 'bg-[#1ABE43]',
  'Животные': 'bg-[#FF9315]',
  'Помощь старшим': 'bg-yellow-500',
  'Онлайн': 'bg-indigo-500',
  'default': 'bg-[#007AFF]'
};

const parseRuDate = (dateString: string): Date | null => {
  const monthMap: { [key: string]: number } = {
    'января': 0,
    'февраля': 1,
    'марта': 2,
    'апреля': 3,
    'мая': 4,
    'июня': 5,
    'июля': 6,
    'августа': 7,
    'сентября': 8,
    'октября': 9,
    'ноября': 10,
    'декабря': 11
  };
  const parts = dateString.replace(',', '').split(' ');
  if (parts.length < 3) return null;

  const day = parseInt(parts[0], 10);
  const month = monthMap[parts[1].toLowerCase()];
  const time = parts[2].split(':');
  const hour = parseInt(time[0], 10);
  const minute = parseInt(time[1], 10);

  if (isNaN(day) || month === undefined || isNaN(hour) || isNaN(minute)) return null;

  const year = new Date().getFullYear();
  return new Date(year, month, day, hour, minute);
};


const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<(HistoryEvent & { parsedDate: Date | null })[]>([]);

  const onBack = () => window.location.hash = '#/profile';
  const onFindEvent = () => window.location.hash = '#/home';
  const onSelectEvent = (id: number) => window.location.hash = `#/events/${id}`;

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const events = await fetchActivityHistoryEvents();
      const processedEvents = events
        .filter(e => e.status === 'upcoming')
        .map(e => ({...e, parsedDate: parseRuDate(e.date)}))
        .filter(e => e.parsedDate !== null);
      setUpcomingEvents(processedEvents);
      setLoading(false);
    };
    loadEvents();
  }, []);

  const eventDates = useMemo(() => {
    const dates = new Set<string>();
    upcomingEvents.forEach(event => {
      if (event.parsedDate) {
        dates.add(event.parsedDate.toDateString());
      }
    });
    return dates;
  }, [upcomingEvents]);

  const eventsForSelectedDay = useMemo(() => {
    return upcomingEvents
      .filter(event => event.parsedDate?.toDateString() === selectedDate.toDateString())
      .sort((a, b) => (a.parsedDate?.getTime() || 0) - (b.parsedDate?.getTime() || 0));
  }, [selectedDate, upcomingEvents]);

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const startOffset = (firstDay === 0) ? 6 : firstDay - 1;

    const grid: (Date | null)[] = Array(startOffset).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(new Date(year, month, day));
    }
    return grid;
  };

  const today = new Date();
  const calendarGrid = generateCalendarGrid();

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header className="flex-shrink-0 p-6 pb-4 bg-white flex items-center">
        <button onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
        </button>
      </header>

      <main className="flex-grow overflow-y-auto">
        <div className="bg-white p-6 rounded-b-2xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon
              className="w-6 h-6 text-gray-500 transform rotate-180"/></button>
            <h2
              className="text-xl font-bold text-[#0C0D0E]">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon
              className="w-6 h-6 text-gray-500"/></button>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center">
            {dayNames.map(day => <div key={day} className="text-sm font-semibold text-gray-400">{day}</div>)}
            {calendarGrid.map((day, index) => {
              if (!day) return <div key={`empty-${index}`}></div>;
              const isToday = day.toDateString() === today.toDateString();
              const isSelected = day.toDateString() === selectedDate.toDateString();
              const hasEvent = eventDates.has(day.toDateString());

              return (
                <div key={index} className="flex justify-center items-center py-1">
                  <button
                    onClick={() => setSelectedDate(day)}
                    className={`w-10 h-10 rounded-full flex flex-col items-center justify-center transition-colors duration-200
                                            ${isSelected ? 'bg-[#007AFF] text-white shadow-md' : 'hover:bg-blue-100'}
                                            ${!isSelected && isToday ? 'border-2 border-[#007AFF]' : ''}
                                            ${!isSelected ? 'text-[#0C0D0E]' : ''}
                                        `}>
                    <span className="font-semibold">{day.getDate()}</span>
                    {hasEvent && <div
                        className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-[#007AFF]'}`}></div>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {loading ? <p className="text-center text-gray-500">Загрузка событий...</p> : (
            upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <CalendarEmptyIcon className="w-24 h-24 text-gray-300 mb-4"/>
                <h3 className="font-bold text-xl text-[#0C0D0E]">Ваш календарь пока пуст</h3>
                <p className="text-[rgb(12,13,14,0.52)] max-w-xs mt-1 mb-6">Как только вы запишетесь на событие, оно
                  появится здесь.</p>
                <button
                  onClick={onFindEvent}
                  className="bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
                >
                  Найти доброе дело
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-[#0C0D0E] mb-4">События
                  на {selectedDate.toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'})}</h3>
                {eventsForSelectedDay.length > 0 ? (
                  <div className="space-y-3">
                    {eventsForSelectedDay.map(event => (
                      <button key={event.id} onClick={() => onSelectEvent(event.id)}
                              className="w-full bg-white rounded-2xl shadow-sm p-4 text-left flex items-start space-x-4 transition-transform active:scale-95">
                        <div className="flex-shrink-0 w-12 text-center">
                          <p
                            className="font-bold text-lg text-[#0C0D0E]">{event.parsedDate?.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                        </div>
                        <div
                          className={`w-1 flex-shrink-0 h-16 rounded-full ${categoryColors[event.category] || categoryColors.default}`}></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#0C0D0E]">{event.title}</h4>
                          <p className="text-sm text-[rgb(12,13,14,0.52)]">{event.location}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-[rgb(12,13,14,0.52)] py-10">
                    <p>На этот день дел не запланировано</p>
                  </div>
                )}
              </>
            )
          )}
        </div>

      </main>
    </div>
  );
};

export default CalendarPage;
