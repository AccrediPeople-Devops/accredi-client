"use client";

import React from "react";
import { createPortal } from "react-dom";
import ScheduleCalendar from "./ScheduleCalendar";

interface ScheduleCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  days: string[];
  weekType: string;
  title?: string;
}

const ScheduleCalendarModal: React.FC<ScheduleCalendarModalProps> = ({
  isOpen,
  onClose,
  startDate,
  endDate,
  days,
  weekType,
  title = "Class Schedule",
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="relative w-full max-w-sm max-h-[70vh] overflow-y-auto">
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-lg shadow-2xl border border-white/10">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-1 right-1 z-10 w-5 h-5 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="Close calendar"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Content */}
          <div className="p-2">
            <ScheduleCalendar
              startDate={startDate}
              endDate={endDate}
              days={days}
              weekType={weekType}
              title={title}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ScheduleCalendarModal; 