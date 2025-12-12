'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Loader2, Users, ArrowLeft, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import ChamadaCalendar from "@/components/ChamadaCalendar";

// Mock data for students
const studentsByClass = {
  "1": [
    { id: 1, name: "Ana Silva" },
    { id: 2, name: "Bruno Costa" },
    { id: 3, name: "Carlos Oliveira" },
    { id: 4, name: "Diana Santos" },
    { id: 5, name: "Eduardo Ferreira" },
    { id: 6, name: "Fernanda Lima" },
    { id: 7, name: "Gabriel Souza" },
    { id: 8, name: "Helena Rodrigues" },
  ],
  "2": [
    { id: 9, name: "Igor Martins" },
    { id: 10, name: "Juliana Alves" },
    { id: 11, name: "Lucas Pereira" },
    { id: 12, name: "Maria Cardoso" },
    { id: 13, name: "Nicolas Ribeiro" },
    { id: 14, name: "Olivia Gomes" },
  ],
};

const turmaNomes = {
  "1": "Alfabetização 2025 - Manhã",
  "2": "Estimulação 2025 - Tarde"
};

export default function ChamadaPage() {
  const router = useRouter();
  const params = useParams();
  
  const turmaId = params?.turmasId ? String(params.turmasId) : null;
  
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [descricaoAula, setDescricaoAula] = useState<string>("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!turmaId) {
    return (
      <div className="flex min-h-screen bg-[#E5E5E5] items-center justify-center">
        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md p-8">
          <CardContent className="text-center">
            <h2 className="text-[#0D4F97] text-2xl font-bold mb-4">Turma não encontrada</h2>
            <p className="text-[#222222] mb-6">Não foi possível identificar a turma.</p>
            <Button
              onClick={() => router.push("/professor/turmas")}
              className="h-12 bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
            >
              Voltar para Turmas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const turmaNome = turmaNomes[turmaId as keyof typeof turmaNomes] || "Turma Desconhecida";
  const students = studentsByClass[turmaId as keyof typeof studentsByClass] || [];

  useEffect(() => {
    const initialAttendance: Record<number, boolean> = {};
    students.forEach((student) => {
      initialAttendance[student.id] = true; // Inicialmente todos presentes
    });
    setAttendance(initialAttendance);
  }, [turmaId, students]);

  // Resetar presença quando a data mudar
  useEffect(() => {
    const resetAttendance: Record<number, boolean> = {};
    students.forEach((student) => {
      resetAttendance[student.id] = true; // Todos presentes ao mudar de data
    });
    setAttendance(resetAttendance);
  }, [selectedDate, students]);

  const handleAttendanceChange = (studentId: number, checked: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: checked,
    }));
  };

  const handleSaveChamada = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Chamada salva com sucesso!");
    setTimeout(() => {
      router.push(`/professor/turmas`);
    }, 1500);
  };

  const handleBack = () => {
    router.push(`/professor/turmas`);
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const totalCount = students.length;
  const presentCount = Object.values(attendance).filter((isPresent) => isPresent).length;

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      <ProfessorSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            <Button
              onClick={handleBack}
              variant="outline"
              className="mb-6 h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>

            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle className="text-[#0D4F97]">Registro de Presença</CardTitle>
                    <CardDescription className="text-[#222222]">
                      {turmaNome}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Data e Descrição - Campos Editáveis */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Data da Chamada */}
                    <div className="rounded-xl border-2 border-[#B2D7EC] bg-white p-4">
                      <div className="mb-2 flex items-center gap-2 text-[#0D4F97]">
                        <CalendarIcon className="h-5 w-5" />
                        <span>Data da Chamada</span>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="flex h-12 w-full items-center justify-start rounded-lg border-2 border-[#B2D7EC] bg-white px-4 text-[#222222] transition-colors hover:bg-[#B2D7EC]/20 focus:outline-none focus:ring-2 focus:ring-[#0D4F97] focus:ring-offset-2"
                          >
                            {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <ChamadaCalendar
                            selected={selectedDate}
                            onSelect={(date) => date && setSelectedDate(date)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Descrição da Aula */}
                    <div className="rounded-xl border-2 border-[#B2D7EC] bg-white p-4">
                      <div className="mb-2 flex items-center gap-2 text-[#0D4F97]">
                        <span>Descrição da Aula</span>
                      </div>
                      <Textarea
                        value={descricaoAula}
                        onChange={(e) => setDescricaoAula(e.target.value)}
                        placeholder="Adicione uma descrição para a aula (opcional)"
                        className="min-h-[48px] resize-none border-2 border-[#B2D7EC] bg-white"
                      />
                    </div>
                  </div>

                  {/* Contador de Presentes */}
                  <div className="rounded-xl border-2 border-[#B2D7EC] bg-[#B2D7EC]/20 p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="h-5 w-5 text-[#0D4F97]" />
                      <span className="text-[#0D4F97]">
                        <strong>{presentCount}</strong> de <strong>{totalCount}</strong> alunos presentes
                      </span>
                    </div>
                  </div>

                  {/* Tabela de Alunos com SWITCHES */}
                  <div className="rounded-xl border-2 border-[#B2D7EC] bg-white overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#B2D7EC]/20 hover:bg-[#B2D7EC]/20">
                          <TableHead className="text-[#0D4F97]">Nome do Aluno(a)</TableHead>
                          <TableHead className="text-center text-[#0D4F97] w-32">Presença</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => {
                          const isPresent = attendance[student.id] ?? true;
                          
                          return (
                            <TableRow
                              key={student.id}
                              className="transition-colors hover:bg-[#B2D7EC]/10"
                            >
                              <TableCell className="text-[#222222]">
                                {student.name}
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex justify-center">
                                  <Switch
                                    id={`student-${student.id}`}
                                    checked={isPresent}
                                    onCheckedChange={(checked) =>
                                      handleAttendanceChange(student.id, checked as boolean)
                                    }
                                    className={cn(
                                      "data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600"
                                    )}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSaveChamada}
                      disabled={isSaving}
                      className="h-12 min-w-[200px] justify-center bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}