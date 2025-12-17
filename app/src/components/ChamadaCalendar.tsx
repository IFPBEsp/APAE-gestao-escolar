'use client'

import { Calendar } from "@/components/ui/calendar";
import Holidays from "date-holidays";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { isSameDay, isFuture } from "date-fns";

interface ChamadaCalendarProps {
  selected: Date;
  onSelect: (date: Date | undefined) => void;
  savedDates?: Date[];
}

const hd = new Holidays("BR");

export default function ChamadaCalendar({ selected, onSelect, savedDates = [] }: ChamadaCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(selected || new Date());

  const isFutureDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isFuture(date);
  };

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; 
  };

  const isHoliday = (date: Date): boolean => hd.isHoliday(date) !== false;
  const isDisabled = (date: Date): boolean => isFutureDate(date) || isWeekend(date) || isHoliday(date);

  const hasSavedAttendance = (date: Date): boolean => {
    return savedDates.some(savedDate => isSameDay(savedDate, date));
  };
  
  const isSavedAndSelected = (date: Date): boolean => 
      hasSavedAttendance(date) && isSameDay(date, selected);

  const modifiers = {
    weekend: (date: Date) => isWeekend(date) && !isFutureDate(date),
    holiday: (date: Date) => isHoliday(date) && !isFutureDate(date),
    future: (date: Date) => isFutureDate(date),
    saved: (date: Date) => hasSavedAttendance(date),
    selectedSaved: isSavedAndSelected, // Adiciona o modificador combinado
  };

  const modifiersClassNames = {
    weekend: "!text-red-400 !bg-red-50/30 opacity-60 pointer-events-none",
    holiday: "!text-red-600 !bg-red-100/50 pointer-events-none",
    future: "!text-gray-300 opacity-30 pointer-events-none",
    saved: "!bg-[#86efac] !text-[#0D4F97] !font-bold !opacity-100 hover:!bg-[#4ade80] border-2 border-white shadow-sm",
    selectedSaved: "!bg-[#4ade80] !text-white !font-bold border-2 border-white ring-2 ring-offset-2 ring-[#0D4F97] hover:!bg-[#22c55e] shadow-lg",
  };

  return (
    <div className="rounded-xl p-3 bg-white border border-gray-200 shadow-lg">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        locale={ptBR}
        disabled={isDisabled}
        modifiersClassNames={modifiersClassNames}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        className="p-0"
        classNames={{
          months: "w-full",
          table: "w-full border-collapse",
          head_row: "flex justify-between mb-2",
          head_cell: "text-[#0D4F97] w-9 font-bold text-xs uppercase",
          row: "flex w-full justify-between mt-1",
          cell: "relative p-0 text-center flex items-center justify-center",
          day: "h-9 w-9 p-0 font-normal hover:bg-[#B2D7EC]/20 rounded-md transition-all flex items-center justify-center",
          day_selected: "bg-[#0D4F97] text-white hover:bg-[#0D4F97] !opacity-100 z-10",
          day_today: "border-2 border-[#0D4F97] text-[#0D4F97] font-black",
          day_outside: "text-gray-300 opacity-20",
          day_disabled: "text-gray-200 opacity-20 cursor-not-allowed",
          
          caption: "flex justify-between items-center pt-1 mb-4",
          caption_label: "text-[#0D4F97] font-bold capitalize",
          nav: "flex items-center gap-1",
          nav_button: "h-8 w-8 flex items-center justify-center text-[#0D4F97] hover:bg-[#B2D7EC]/20 rounded-full",
        }}
        showOutsideDays={false}
      />
      
      {/* Legenda atualizada */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-[10px] justify-center font-medium text-gray-700">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#86efac] rounded" /> Chamada Feita</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#0D4F97] rounded" /> Dia Selecionado</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 border border-[#0D4F97] bg-white rounded" /> Hoje</div>
      </div>
    </div>
  );
}