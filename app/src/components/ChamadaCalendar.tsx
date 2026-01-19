'use client'

import { Calendar } from "@/components/ui/calendar";
import Holidays from "date-holidays";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ChamadaCalendarProps {
  selected: Date;
  onSelect: (date: Date | undefined) => void;
}

const hd = new Holidays("BR");

export default function ChamadaCalendar({ selected, onSelect }: ChamadaCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(selected);

  const isFutureDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
  };

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; 
  };

  const isHoliday = (date: Date): boolean => {
    const holidays = hd.isHoliday(date);
    return holidays !== false;
  };

  const isDisabled = (date: Date): boolean => {
    return isFutureDate(date) || isWeekend(date) || isHoliday(date);
  };

  const modifiers = {
    weekend: (date: Date) => isWeekend(date) && !isFutureDate(date),
    holiday: (date: Date) => isHoliday(date) && !isFutureDate(date),
    future: (date: Date) => isFutureDate(date),
  };

  const modifiersClassNames = {
    weekend: "!bg-red-50 !text-red-500 hover:!bg-red-50 hover:!text-red-500 !cursor-not-allowed !opacity-60 pointer-events-none",
    holiday: "!bg-red-100 !text-red-600 hover:!bg-red-100 hover:!text-red-600 !cursor-not-allowed !font-semibold pointer-events-none",
    future: "!text-gray-300 hover:!bg-transparent hover:!text-gray-300 !cursor-not-allowed !opacity-40 pointer-events-none",
  };

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="rounded-xl p-3 bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4 px-2">
        <button
          onClick={goToPreviousMonth}
          className="h-7 w-7 bg-transparent p-0 text-[#0D4F97] hover:bg-[#B2D7EC]/20 rounded-md transition-colors flex items-center justify-center"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <span className="text-[#0D4F97] text-base font-medium capitalize">
          {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </span>
        
        <button
          onClick={goToNextMonth}
          className="h-7 w-7 bg-transparent p-0 text-[#0D4F97] hover:bg-[#B2D7EC]/20 rounded-md transition-colors flex items-center justify-center"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        locale={ptBR}
        disabled={isDisabled}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        initialFocus
        className="p-0 bg-transparent"
        classNames={{
          months: "flex flex-col sm:flex-row gap-2 w-full",
          month: "flex flex-col gap-2 w-full",
          
          caption: "hidden",
          caption_dropdowns: "hidden",
          caption_label: "hidden",
          nav: "hidden", 
          
          table: "w-full border-collapse space-y-0",
          
          head_row: "flex justify-between w-full mb-1",
          head_cell: "text-[#0D4F97] rounded-md w-9 h-9 font-medium text-[0.8rem] flex items-center justify-center",
          
          row: "flex w-full mt-1 justify-between",
          
          cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex items-center justify-center",
          
          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#B2D7EC]/20 hover:text-[#0D4F97] rounded-md transition-colors flex items-center justify-center",
          day_selected: "bg-[#0D4F97] text-white hover:bg-[#0D4F97] hover:text-white focus:bg-[#0D4F97] focus:text-white",
          day_today: "bg-[#B2D7EC]/30 text-[#0D4F97] font-semibold",
          day_outside: "text-gray-300 opacity-50 aria-selected:bg-gray-100 aria-selected:text-gray-300",
          day_disabled: "text-gray-300 opacity-30 cursor-not-allowed pointer-events-none",
          day_range_middle: "aria-selected:bg-[#B2D7EC] aria-selected:text-[#0D4F97]",
          day_hidden: "invisible",
        }}
        showOutsideDays={true}
        fixedWeeks={true}
      />
    </div>
  );
}