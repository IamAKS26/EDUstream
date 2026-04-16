"use client";

import React, { useState, useMemo } from "react";

interface CalendarEvent {
  date: string; // "YYYY-MM-DD"
  label: string;
  type: "task" | "milestone" | "deadline";
}

interface Props {
  events?: CalendarEvent[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const TYPE_COLOR: Record<CalendarEvent["type"], string> = {
  task: "bg-primary",
  milestone: "bg-blue-400",
  deadline: "bg-red-400",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// ISO week: Monday = 0 … Sunday = 6
function getWeekdayOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay(); // 0=Sun
  return (day + 6) % 7; // convert to Mon=0
}

export function DynamicCalendar({ events = [] }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [popoverEvents, setPopoverEvents] = useState<CalendarEvent[]>([]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const offset = getWeekdayOffset(viewYear, viewMonth);

  // Map "YYYY-MM-DD" → events[]
  const eventMap = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [events]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const eventsForDay = (day: number) => {
    const key = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
    return eventMap.get(key) ?? [];
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setPopoverEvents(eventsForDay(day));
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
    setPopoverEvents([]);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
    setPopoverEvents([]);
  };

  // Build calendar grid cells
  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full 6-week grid
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white dark:bg-[#141414] rounded-3xl border border-black/5 dark:border-white/10 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {MONTHS[viewMonth]} <span className="text-slate-400 dark:text-slate-500 font-normal">{viewYear}</span>
        </h3>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          </button>
          <button
            onClick={nextMonth}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const dayEvents = eventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          const isSelected = day === selectedDay;
          const isTodayCell = isToday(day);

          return (
            <button
              key={`day-${day}`}
              onClick={() => handleDayClick(day)}
              className={`relative mx-auto flex flex-col items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all
                ${isTodayCell && !isSelected ? "bg-primary/15 text-primary ring-1 ring-primary/30" : ""}
                ${isSelected ? "bg-primary text-slate-900 shadow-sm" : ""}
                ${!isTodayCell && !isSelected ? "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5" : ""}
              `}
            >
              {day}
              {hasEvents && (
                <span
                  className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                    isSelected ? "bg-slate-900" : TYPE_COLOR[dayEvents[0].type]
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-3 pt-1 border-t border-black/5 dark:border-white/5">
        {(["task","milestone","deadline"] as const).map(type => (
          <span key={type} className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
            <span className={`w-2 h-2 rounded-full ${TYPE_COLOR[type]}`} />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        ))}
      </div>

      {/* Event list for selected day */}
      {selectedDay && (
        <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-2">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {MONTHS[viewMonth]} {selectedDay}
          </p>
          {popoverEvents.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-600 italic">No events this day</p>
          ) : (
            popoverEvents.map((ev, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${TYPE_COLOR[ev.type]}`} />
                <span className="text-xs text-slate-700 dark:text-slate-300">{ev.label}</span>
                <span className="ml-auto text-[10px] text-slate-400 capitalize">{ev.type}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
