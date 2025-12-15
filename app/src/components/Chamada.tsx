'use client'

import { useState, useEffect, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

import { Loader2, Users, ArrowLeft, CalendarIcon, AlertCircle } from "lucide-react";
import { format, isPast, startOfDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

import ChamadaCalendar from "./ChamadaCalendar";

import { 
  getChamadaPorTurmaEData, 
  registrarChamada, 
  getAlunosDaTurma 
} from "@/services/ChamadaService"; 

interface StudentAttendance {
    id: number;
    name: string; 
    isAbsent: boolean; 
}

interface ChamadaProps {
  turmaNome?: string; 
  students?: { id: number; name: string }[]; 
  onBack: () => void;
  initialClass?: string; 
  onLogout?: () => void;
  onNavigateToDashboard?: (tab: string) => void;
  data?: Date; 
  descricao?: string; 
}

export default function Chamada({ 
  onBack, 
  initialClass, 
  onLogout, 
  onNavigateToDashboard,
  data: selectedDateProp,
  descricao: initialDescription
}: ChamadaProps) {
  
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Date>(selectedDateProp || new Date());
  
  const [descricaoAula, setDescricaoAula] = useState(initialDescription || "");
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("turmas");
  
  const today = startOfDay(new Date());
  const isEditingPastDate = isPast(startOfDay(selectedDate)) && !isSameDay(selectedDate, today);
  
  const [savedAttendanceDates, setSavedAttendanceDates] = useState<string[]>([]);
  const savedDatesAsObjects = useMemo(() => {
    return savedAttendanceDates.map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    });
  }, [savedAttendanceDates]);


  const { turmaId, turmaNome } = useMemo(() => {
    if (!initialClass) return { turmaId: undefined, turmaNome: "Turma Inválida" };
    const parts = initialClass.split('-');
    const id = parseInt(parts[0], 10);
    const name = parts.slice(1).join('-').trim();
    return { 
      turmaId: isNaN(id) ? undefined : id, 
      turmaNome: name || "Turma Selecionada" 
    };
  }, [initialClass]);

  const dateFormatted = format(selectedDate, "yyyy-MM-dd"); 


  const loadAttendanceData = async () => {
    if (!turmaId) {
      setIsLoading(false);
      return; 
    }

    setIsLoading(true);
    let isFound = false;
    let studentsFromApi: StudentAttendance[] = [];
    
    try {
      const chamadaResponse: any = await getChamadaPorTurmaEData(turmaId, dateFormatted);
      
      studentsFromApi = chamadaResponse.listaPresencas.map((p: any) => ({
        id: p.alunoId,
        name: p.alunoNome,
        isAbsent: p.status !== 'PRESENTE', 
      }));
      isFound = true;

      setDescricaoAula(chamadaResponse.descricao || initialDescription || "");

    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 204) {
          console.log("Chamada não encontrada. Carregando lista de alunos da turma.");
          isFound = false;
          setDescricaoAula(initialDescription || ""); 
      } else {
        console.error("Erro ao carregar chamada existente:", error);
        toast.error("Erro ao carregar a chamada: " + (error.message || "Verifique a conexão."));
        setIsLoading(false);
        return; 
      }
    }

    if (!isFound) {
        try {
            const alunosResponse: any[] = await getAlunosDaTurma(turmaId);
            
            studentsFromApi = alunosResponse.map((aluno: any) => ({
              id: aluno.id,
              name: aluno.nome || aluno.name, 
              isAbsent: false, 
            }));
            
        } catch (listError: any) {
            console.error("Erro ao buscar lista de alunos:", listError);
            toast.error("Erro ao carregar a lista de alunos: " + (listError.message || "Verifique a Turma."));
            studentsFromApi = [];
        }
    }

    setStudents(studentsFromApi);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAttendanceData();
  }, [turmaId, dateFormatted]);


  const handleAttendanceChange = (studentId: number, checked: boolean) => {
    setStudents(prevStudents => 
        prevStudents.map(student => 
            student.id === studentId ? { ...student, isAbsent: checked } : student
        )
    );
  };


  const handleSaveChamada = async () => {
    if (!turmaId) return;
    if (!descricaoAula.trim()) {
      toast.error("Por favor, adicione uma descrição para a aula.");
      return;
    }

    setIsSaving(true);
    
    const requestBody = {
      descricao: descricaoAula, 
      presencas: students.map(student => ({
        alunoId: student.id,
        status: student.isAbsent ? 'AUSENTE' : 'PRESENTE', 
      }))
    };

    try {
      await registrarChamada(turmaId, dateFormatted, requestBody);
      
      toast.success("Chamada salva com sucesso!");
      
      setTimeout(() => {
        onBack(); 
      }, 1500);

    } catch (error: any) {
      console.error("Erro ao salvar chamada:", error);
      toast.error(error.message || "Falha ao salvar a chamada. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const totalCount = students.length;
  const absentCount = students.filter(s => s.isAbsent).length;
  const presentCount = totalCount - absentCount;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onNavigateToDashboard) {
      onNavigateToDashboard(tab);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  if (!turmaId) {
    return (
      <div className="flex min-h-screen bg-[#E5E5E5] items-center justify-center">
        <div className="text-red-500">Erro: ID da Turma não encontrado.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#E5E5E5] items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-[#0D4F97]" />
        <div className="text-[#0D4F97] text-xl">Carregando Chamada...</div>
      </div>
    );
  }


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
              <p className="text-[#0D4F97] text-sm">Visualizando/Editando chamada de: <strong>{format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}</strong></p>
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

          {/* Contador de Presença */}
          <div className="bg-[#B2D7EC]/20 rounded-xl p-3 flex justify-center items-center gap-2 text-[#0D4F97] font-semibold border border-[#B2D7EC]">
            <Users className="h-5 w-5" /> <strong>{presentCount}</strong> de <strong>{totalCount}</strong> presentes
          </div>

          {/* Tabela de Alunos */}
          {students.length > 0 ? (
            <div className="rounded-xl border-2 border-[#B2D7EC] overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-[#B2D7EC]/20">
                  <TableRow>
                    <TableHead className="text-[#0D4F97] font-bold text-lg">Nome do Aluno(a)</TableHead>
                    <TableHead className="text-center text-[#0D4F97] font-bold text-lg w-32">Ausente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="hover:bg-[#B2D7EC]/5 border-b border-[#B2D7EC]/30">
                      <TableCell className="text-[#222222] font-medium text-lg">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {/* Usando Checkbox do HEAD (true=Ausente) */}
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={student.isAbsent}
                            onCheckedChange={(checked) =>
                              handleAttendanceChange(student.id, checked as boolean)
                            }
                            className="h-6 w-6 border-2 border-[#0D4F97] data-[state=checked]:bg-[#0D4F97] data-[state=checked]:text-white"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-[#222222]">
              Nenhum aluno encontrado para esta turma.
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveChamada}
              disabled={isSaving || students.length === 0 || !descricaoAula.trim()}
              className="h-12 min-w-[200px] justify-center bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97] font-semibold text-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Chamada"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}