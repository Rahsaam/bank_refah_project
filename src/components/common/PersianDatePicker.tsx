import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft } from 'lucide-react';

interface PersianDatePickerProps {
  value: string; // فرمت: YYYY/MM/DD
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const months = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const toPersianDigits = (str: string | number) => {
  return String(str).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

// تبدیل تاریخ جلالی به میلادی
const jalaliToGregorian = (jY: number, jM: number, jD: number): Date => {
  const jy = jY - 979;
  const jm = jM - 1;
  const jd = jD - 1;

  let jDayNo = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4);
  for (let i = 0; i < jm; ++i) {
    jDayNo += i < 6 ? 31 : 30;
  }
  jDayNo += jd;

  let gDayNo = jDayNo + 79;
  const gy = 1600 + 400 * Math.floor(gDayNo / 146097);
  gDayNo %= 146097;

  let leap = 1;
  if (gDayNo >= 36525) {
    gDayNo--;
    gDayNo %= 36524;
    if (gDayNo >= 365) {
      gDayNo++;
    } else {
      leap = 0;
    }
  }

  const gd = gDayNo;
  const g_days_in_months = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  let gm = 0;
  let totalGDays = 0;
  while (gm < 12 && gd >= totalGDays + g_days_in_months[gm]) {
    totalGDays += g_days_in_months[gm];
    gm++;
  }
  const day = gd - totalGDays + 1;

  return new Date(gy, gm, day);
};

const isLeapJalali = (year: number): boolean => {
  const matches = [1, 5, 9, 13, 17, 22, 26, 30];
  return matches.includes(year % 33);
};

export const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ انقضا',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // دریافت تاریخ امروز به عنوان مبنای مقایسه
  const todayJson = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric', month: 'numeric', day: 'numeric'
  }).format(new Date());
  const [tY, tM, tD] = todayJson.split('/').map(Number);

  const [currentYear, setCurrentYear] = useState(tY);
  const [currentMonth, setCurrentMonth] = useState(tM);

  const wrapperRef = useRef<HTMLDivElement>(null);

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
    if (value && value.includes('/')) {
      const [y, m] = value.split('/').map(Number);
      if (!isNaN(y) && !isNaN(m)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentYear(y);
        setCurrentMonth(m);
      }
    }
  }, [value]);

  const getMonthDetails = (year: number, month: number) => {
    let totalDays = 30;
    if (month <= 6) totalDays = 31;
    else if (month === 12) totalDays = isLeapJalali(year) ? 30 : 29;

    const firstDayGregorian = jalaliToGregorian(year, month, 1);
    const dayOfWeek = firstDayGregorian.getDay();
    const startDayIndex = (dayOfWeek + 1) % 7;

    return { totalDays, startDayIndex };
  };

  const { totalDays, startDayIndex } = getMonthDetails(currentYear, currentMonth);

  const blankDays = Array(startDayIndex).fill(null);
  const monthDays = Array.from({ length: totalDays }, (_, i) => i + 1);
  const allCalendarSlots = [...blankDays, ...monthDays];

  const handleSelectDay = (day: number) => {
    const formattedMonth = currentMonth.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    onChange(`${currentYear}/${formattedMonth}/${formattedDay}`);
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

  const isSelected = (day: number) => {
    if (!value) return false;
    const [y, m, d] = value.split('/').map(Number);
    return y === currentYear && m === currentMonth && d === day;
  };

  // تابع بررسی اینکه آیا این روز در گذشته قرار دارد یا خیر
  const isPastDay = (day: number) => {
    if (currentYear < tY) return true;
    if (currentYear > tY) return false;
    
    // اگر سال مساوی بود، ماه را بررسی می‌کنیم
    if (currentMonth < tM) return true;
    if (currentMonth > tM) return false;
    
    // اگر سال و ماه مساوی بود، روز را بررسی می‌کنیم
    return day < tD;
  };

  return (
    <div className="relative w-full" dir="rtl" ref={wrapperRef}>
     <p className='text-gray-700 mb-2'>تاریخ انقضا *</p>
      <div
        className={`w-full p-2 border rounded-lg cursor-pointer bg-white flex items-center justify-between select-none transition-colors ${
          error ? 'border-red-500 bg-red-50/10' : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {value ? toPersianDigits(value) : placeholder}
        </span>
        <CalendarIcon size={18} className="text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-75 select-none animate-in fade-in slide-in-from-top-1 duration-150">
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
                return <div key={`blank-${index}`} />;
              }

              const selected = isSelected(day);
              const isTodayDay = tY === currentYear && tM === currentMonth && tD === day;
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
                      : isTodayDay
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