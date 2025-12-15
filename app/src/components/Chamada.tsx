'use client'

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CalendarIcon, AlertCircle, Users } from "lucide-react";
import { format, isPast, startOfDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

import ChamadaCalendar from "./ChamadaCalendar";

interface ChamadaProps {
  turmaNome: string; 
  students: { id: number; name: string }[];
  onBack: () => void;
  onSaveSuccess: () => void;
}

export default function Chamada({ turmaNome, students, onBack, onSaveSuccess }: ChamadaProps) {
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [descricaoAula, setDescricaoAula] = useState("");
  const [isEditingPastDate, setIsEditingPastDate] = useState(false);
  const [savedAttendanceDates, setSavedAttendanceDates] = useState<string[]>([]);

  const storageKey = `chamadas_${turmaNome}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsedData = JSON.parse(saved);
      setSavedAttendanceDates(Object.keys(parsedData));
    }
  }, [storageKey]);

  useEffect(() => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      const parsedData = JSON.parse(saved);
      const dataForThisDay = parsedData[dateKey];

      if (dataForThisDay) {
        setAttendance(dataForThisDay.attendance);
        setDescricaoAula(dataForThisDay.descricao || "");
        toast.info(`Dados do dia ${format(selectedDate, 'dd/MM')} carregados.`);
      } else {
        resetFields();
      }
    } else {
      resetFields();
    }

    const today = startOfDay(new Date());
    setIsEditingPastDate(isPast(startOfDay(selectedDate)) && !isSameDay(selectedDate, today));
  }, [selectedDate, storageKey]);

  const resetFields = () => {
    const initial: Record<number, boolean> = {};
    students.forEach(s => { initial[s.id] = true; }); 
    setAttendance(initial);
    setDescricaoAula("");
  };

  const savedDatesAsObjects = useMemo(() => {
    return savedAttendanceDates.map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    });
  }, [savedAttendanceDates]);

  const handleSave = async () => {
    if (!descricaoAula.trim()) {
      toast.error("Por favor, adicione uma descrição para a aula.");
      return;
    }

    setIsSaving(true);
    
    try {
      await new Promise(r => setTimeout(r, 800));

      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const existingData = JSON.parse(localStorage.getItem(storageKey) || "{}");
      
      existingData[dateKey] = {
        attendance,
        descricao: descricaoAula,
        lastUpdate: new Date().toISOString()
      };

      localStorage.setItem(storageKey, JSON.stringify(existingData));
      
      setSavedAttendanceDates(Object.keys(existingData));

      toast.success("Chamada salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter(v => v).length;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Button onClick={onBack} variant="outline" className="mb-6 border-[#B2D7EC] text-[#0D4F97] hover:bg-[#B2D7EC]/20 h-12">
        <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
      </Button>

      <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-[#0D4F97] text-2xl">Registro de Presença</CardTitle>
          <CardDescription className="text-[#222222] font-semibold text-lg">{turmaNome}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isEditingPastDate && (
            <div className="rounded-xl border-2 border-[#FFD000] bg-[#FFD000]/10 p-4 flex gap-3 items-center">
              <AlertCircle className="text-[#0D4F97] h-5 w-5 flex-shrink-0" />
              <p className="text-[#0D4F97] text-sm">Visualizando/Editando chamada de: <strong>{format(selectedDate, "dd/MM/yyyy")}</strong></p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border-2 border-[#B2D7EC] p-4 bg-[#F8FAFC]">
              <label className="text-[#0D4F97] text-sm font-bold flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4" /> Data da Chamada
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start border-[#B2D7EC] h-11 bg-white">
                    {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <ChamadaCalendar 
                    selected={selectedDate} 
                    onSelect={(d) => d && setSelectedDate(d)} 
                    savedDates={savedDatesAsObjects} 
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="rounded-xl border-2 border-[#B2D7EC] p-4 bg-[#F8FAFC]">
              <label className="text-[#0D4F97] text-sm font-bold mb-2 block">Resumo da Aula</label>
              <Textarea 
                value={descricaoAula} 
                onChange={(e) => setDescricaoAula(e.target.value)} 
                placeholder="O que foi ensinado hoje?" 
                className="min-h-[44px] border-[#B2D7EC] bg-white text-[#222222]"
              />
            </div>
          </div>

          <div className="bg-[#B2D7EC]/20 rounded-xl p-3 flex justify-center items-center gap-2 text-[#0D4F97] font-semibold border border-[#B2D7EC]">
            <Users className="h-5 w-5" /> {presentCount} de {students.length} presentes
          </div>

          <div className="rounded-xl border-2 border-[#B2D7EC] overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-[#B2D7EC]/20">
                <TableRow>
                  <TableHead className="text-[#0D4F97] font-bold">Aluno</TableHead>
                  <TableHead className="text-center text-[#0D4F97] font-bold w-32">Presença</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id} className="hover:bg-[#B2D7EC]/5 border-b border-[#B2D7EC]/30">
                    <TableCell className="text-[#222222] font-medium">{s.name}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Switch 
                          checked={attendance[s.id] ?? true} 
                          onCheckedChange={(v) => setAttendance(p => ({...p, [s.id]: v}))} 
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={isSaving} className="bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97] h-12 px-10 font-bold">
              {isSaving ? <Loader2 className="animate-spin mr-2" /> : "Salvar Chamada"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}