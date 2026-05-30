
import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import moment from 'moment-jalaali';


moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false });

interface PersianDatePickerProps {
  value: string; 
  onChange: (value: string) => void; 
  placeholder?: string;
  error?: string;
}

const gregorianToJalali = (date: string): { year: number; month: number; day: number } => {
  const m = moment(date);
  if (!m.isValid()) {
    const now = moment();
    return { year: now.jYear(), month: now.jMonth() + 1, day: now.jDate() };
  }
  return {
    year: m.jYear(),
    month: m.jMonth() + 1,
    day: m.jDate(),
  };
};


const jalaliToGregorian = (year: number, month: number, day: number): string => {
  const m = moment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD');
  return m.format('YYYY-MM-DD');
};


const getTodayJalali = (): { year: number; month: number; day: number } => {
  const now = moment();
  return {
    year: now.jYear(),
    month: now.jMonth() + 1,
    day: now.jDate(),
  };
};

const months = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const toPersianDigits = (str: string | number): string => {
  return String(str).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

const getJalaliMonthDays = (year: number, month: number): number => {
  if (month <= 6) return 31;
  if (month <= 11) return 30;

  const isLeap = moment(`${year}/12/01`, 'jYYYY/jMM/jDD').isLeapYear();
  return isLeap ? 30 : 29;
};

const getFirstDayOfJalaliMonth = (year: number, month: number): number => {

  const m = moment(`${year}/${month}/01`, 'jYYYY/jMM/jDD');
  const dayOfWeek = m.day(); 
  

  return (dayOfWeek + 1) % 7;
};

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ انقضا',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);


  const todayJalali = getTodayJalali();


  const getCurrentYearMonth = () => {
    if (value && value.trim()) {
      const jalali = gregorianToJalali(value);
      return { year: jalali.year, month: jalali.month };
    }
    return { year: todayJalali.year, month: todayJalali.month };
  };

  const [currentYear, setCurrentYear] = useState(getCurrentYearMonth().year);
  const [currentMonth, setCurrentMonth] = useState(getCurrentYearMonth().month);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {
    if (value && value.trim()) {
      const jalali = gregorianToJalali(value);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentYear(jalali.year);
      setCurrentMonth(jalali.month);
    }
  }, [value]);

  const totalDays = getJalaliMonthDays(currentYear, currentMonth);
  const startDayIndex = getFirstDayOfJalaliMonth(currentYear, currentMonth);

  const blankDays = Array(startDayIndex).fill(null);
  const monthDays = Array.from({ length: totalDays }, (_, i) => i + 1);
  const allCalendarSlots = [...blankDays, ...monthDays];

  const handleSelectDay = (day: number) => {
    const gregorianDate = jalaliToGregorian(currentYear, currentMonth, day);
    onChange(gregorianDate);
    setIsOpen(false);
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const isSelected = (day: number): boolean => {
    if (!value) return false;
    const jalali = gregorianToJalali(value);
    return jalali.year === currentYear && jalali.month === currentMonth && jalali.day === day;
  };

  const isPastDay = (day: number): boolean => {
    if (currentYear < todayJalali.year) return true;
    if (currentYear > todayJalali.year) return false;
    if (currentMonth < todayJalali.month) return true;
    if (currentMonth > todayJalali.month) return false;
    return day < todayJalali.day;
  };


  const displayValue = (): string => {
    if (!value) return '';
    const jalali = gregorianToJalali(value);
    return `${jalali.year}/${String(jalali.month).padStart(2, '0')}/${String(jalali.day).padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full" dir="rtl" ref={wrapperRef}>
      <p className="text-gray-700 mb-2">تاریخ انقضا *</p>
      <div
        className={`w-full p-2 border rounded-lg cursor-pointer bg-white flex items-center justify-between select-none transition-colors ${
          error ? 'border-red-500 bg-red-50/10' : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {value ? toPersianDigits(displayValue()) : placeholder}
        </span>
        <CalendarIcon size={18} className="text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-75 select-none">
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight size={18} className="text-gray-600" />
            </button>
            <div className="text-gray-800 font-bold text-sm">
              {months[currentMonth - 1]} {toPersianDigits(currentYear)}
            </div>
            <button type="button" onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {weekDays.map((wd, index) => (
              <div key={index} className={`text-xs font-semibold ${index === 6 ? 'text-red-500' : 'text-gray-400'}`}>
                {wd}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {allCalendarSlots.map((day, index) => {
              if (day === null) {
                return <div key={`blank-${index}`} className="h-8 w-8" />;
              }

              const selected = isSelected(day);
              const isToday = todayJalali.year === currentYear && todayJalali.month === currentMonth && todayJalali.day === day;
              const disabled = isPastDay(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectDay(day)}
                  className={`text-sm h-8 w-8 mx-auto flex items-center justify-center rounded-lg transition-all ${
                    disabled
                      ? 'text-gray-300 bg-gray-50 cursor-not-allowed line-through'
                      : selected
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-200'
                      : isToday
                      ? 'border border-blue-500 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {toPersianDigits(day)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1 mr-1">{error}</p>}
    </div>
  );
};

export default PersianDatePicker;

