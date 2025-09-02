"use client";

import React, { useState, useMemo } from "react";
import { formatDate, parseDateLocal } from "@/app/utils/dateUtils";

interface ScheduleCalendarProps {
  startDate: string;
  endDate: string;
  days: string[]; // Array of day numbers (1-7, where 1=Monday, 7=Sunday)
  weekType: string; // "weekday", "weekend", "all", "manual"
  title?: string;
}

interface CalendarDay {
  date: Date;
  isClassDay: boolean;
  isCurrentMonth: boolean;
  isToday: boolean;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  startDate,
  endDate,
  days,
  weekType,
  title = "Class Schedule",
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(startDate));

  // Day names for header
  const dayNames = ["M", "T", "W", "T", "F", "S", "S"];

  // Week type display mapping
  const weekTypeDisplay = {
    weekday: "Weekdays",
    weekend: "Weekends",
    all: "All Days",
    manual: "Custom",
  };

  // Calculate all class dates
  const classDates = useMemo(() => {
    const dates: Date[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Convert days array to numbers
    const selectedDays = days.map(day => parseInt(day));
    

    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
      const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert to 1=Monday, 7=Sunday
      
      if (selectedDays.includes(adjustedDay)) {
        dates.push(new Date(date));

      }
    }
    

    return dates;
  }, [startDate, endDate, days]);

  // Generate calendar days for current month view
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from Monday of the week containing the first day
    const startCalendar = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0 days to subtract
    startCalendar.setDate(firstDay.getDate() - daysToSubtract);
    
    // Generate 42 days (6 weeks)
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startCalendar);
      date.setDate(startCalendar.getDate() + i);
      date.setHours(0, 0, 0, 0); // Normalize time for comparison
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getTime() === today.getTime();
      const isClassDay = classDates.some(classDate => {
        const normalizedClassDate = new Date(classDate);
        normalizedClassDate.setHours(0, 0, 0, 0);
        return normalizedClassDate.getTime() === date.getTime();
      });
      
      days.push({
        date,
        isClassDay,
        isCurrentMonth,
        isToday,
      });
    }
    
    return days;
  }, [currentMonth, classDates]);

  // Navigate months
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-2 shadow-xl w-full max-w-xs mx-auto">
      {/* Header */}
      <div className="mb-2">
        <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
        <div className="flex gap-1 text-xs text-gray-300">
          <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">
            {weekTypeDisplay[weekType as keyof typeof weekTypeDisplay] || weekType}
          </span>
          <span className="px-1.5 py-0.5 bg-green-500/20 text-green-300 rounded text-xs">
            {classDates.length}
          </span>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h4 className="text-xs font-semibold text-white">
          {currentMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </h4>
        
        <button
          onClick={() => navigateMonth("next")}
          className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {dayNames.map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-400 py-0.5">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              w-6 h-6 flex items-center justify-center text-xs rounded transition-all duration-200 cursor-pointer
              ${day.isCurrentMonth ? 'text-white' : 'text-gray-600'}
              ${day.isToday ? 'ring-1 ring-yellow-400' : ''}
              ${day.isClassDay 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold shadow-sm hover:shadow-md transform hover:scale-105' 
                : 'hover:bg-white/5'
              }
            `}
            title={day.isClassDay ? `Class Day - ${formatDate(day.date)}` : formatDate(day.date)}
          >
            {day.date.getDate()}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
          <span className="text-gray-300">Class</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar; 