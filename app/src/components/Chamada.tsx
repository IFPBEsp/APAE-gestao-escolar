'use client'

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Users, ArrowLeft, CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const studentsByClass: Record<string, Array<{id: number, name: string}>> = {
  "Alfabetização 2025 - Manhã": [
    { id: 1, name: "Ana Silva" },
    { id: 2, name: "Bruno Costa" },
    { id: 3, name: "Carlos Oliveira" },
    { id: 4, name: "Diana Santos" },
    { id: 5, name: "Eduardo Ferreira" },
    { id: 6, name: "Fernanda Lima" },
    { id: 7, name: "Gabriel Souza" },
    { id: 8, name: "Helena Rodrigues" },
  ],
  "Estimulação 2025 - Tarde": [
    { id: 9, name: "Igor Martins" },
    { id: 10, name: "Juliana Alves" },
    { id: 11, name: "Lucas Pereira" },
    { id: 12, name: "Maria Cardoso" },
    { id: 13, name: "Nicolas Ribeiro" },
    { id: 14, name: "Olivia Gomes" },
  ],
  "Alfabetização 2025": [
    { id: 1, name: "Ana Silva" },
    { id: 2, name: "Bruno Costa" },
    { id: 3, name: "Carlos Oliveira" },
    { id: 4, name: "Diana Santos" },
    { id: 5, name: "Eduardo Ferreira" },
    { id: 6, name: "Fernanda Lima" },
    { id: 7, name: "Gabriel Souza" },
    { id: 8, name: "Helena Rodrigues" },
  ],
  "Estimulação 2025": [
    { id: 9, name: "Igor Martins" },
    { id: 10, name: "Juliana Alves" },
    { id: 11, name: "Lucas Pereira" },
    { id: 12, name: "Maria Cardoso" },
    { id: 13, name: "Nicolas Ribeiro" },
    { id: 14, name: "Olivia Gomes" },
  ],
};

interface ChamadaProps {
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
  data,
  descricao 
}: ChamadaProps) {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const selectedDate = data || new Date();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("turmas");

  useEffect(() => {
    if (initialClass) {
      const availableClass = Object.keys(studentsByClass).find(
        className => className.includes(initialClass) || initialClass.includes(className)
      ) || Object.keys(studentsByClass)[0]; // Fallback para a primeira turma
      
      setSelectedClass(availableClass);
    } else {
      setSelectedClass(Object.keys(studentsByClass)[0]);
    }
  }, [initialClass]);

  useEffect(() => {
    if (selectedClass && studentsByClass[selectedClass]) {
      const students = studentsByClass[selectedClass];
      const initialAttendance: Record<number, boolean> = {};
      students.forEach((student) => {
        initialAttendance[student.id] = false; // false = checkbox desmarcado = presente
      });
      setAttendance(initialAttendance);
    }
  }, [selectedClass]);

  const handleAttendanceChange = (studentId: number, checked: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: checked,
    }));
  };

  const handleSaveChamada = async () => {
    if (!selectedClass) return;

    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    toast.success("Chamada salva com sucesso!");
    
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  const students = selectedClass && studentsByClass[selectedClass] 
    ? studentsByClass[selectedClass] 
    : [];
  const totalCount = students.length;
  const absentCount = Object.values(attendance).filter((isAbsent) => isAbsent).length;
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

  if (!selectedClass) {
    return (
      <div className="flex min-h-screen bg-[#E5E5E5] items-center justify-center">
        <div className="text-[#0D4F97]">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      {/* Sidebar - SEMPRE VISÍVEL */}
      <ProfessorSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            {/* Botão Voltar */}
            <Button
              onClick={onBack}
              variant="outline"
              className="mb-6 h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar para Turmas
            </Button>

            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle className="text-[#0D4F97] text-2xl">Registro de Presença</CardTitle>
                    <CardDescription className="text-[#222222] text-lg">
                      {selectedClass}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informações da Chamada */}
                <div className="space-y-4">
                  {/* Data e Descrição */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl border-2 border-[#B2D7EC] bg-white p-4">
                      <div className="flex items-center gap-2 text-[#0D4F97] font-semibold">
                        <CalendarIcon className="h-5 w-5" />
                        <span>Data da Chamada</span>
                      </div>
                      <p className="mt-2 text-[#222222] text-lg">
                        {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    {descricao && (
                      <div className="rounded-xl border-2 border-[#B2D7EC] bg-white p-4">
                        <div className="flex items-center gap-2 text-[#0D4F97] font-semibold">
                          <span>Descrição da Aula</span>
                        </div>
                        <p className="mt-2 text-[#222222] text-lg">{descricao}</p>
                      </div>
                    )}
                  </div>

                  {/* Contador de Presentes */}
                  <div className="rounded-xl border-2 border-[#B2D7EC] bg-[#B2D7EC]/20 p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="h-6 w-6 text-[#0D4F97]" />
                      <span className="text-[#0D4F97] text-lg font-semibold">
                        <strong>{presentCount}</strong> de <strong>{totalCount}</strong> alunos presentes
                      </span>
                    </div>
                  </div>

                  {/* Tabela de Alunos */}
                  {students.length > 0 ? (
                    <div className="rounded-xl border-2 border-[#B2D7EC] bg-white overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-[#B2D7EC]/20 hover:bg-[#B2D7EC]/20">
                            <TableHead className="text-[#0D4F97] font-semibold text-lg">Nome do Aluno(a)</TableHead>
                            <TableHead className="text-center text-[#0D4F97] font-semibold text-lg w-32">Ausente</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => {
                            const isAbsent = attendance[student.id] || false;
                            
                            return (
                              <TableRow
                                key={student.id}
                                className="transition-colors hover:bg-[#B2D7EC]/10"
                              >
                                <TableCell className="text-[#222222] text-lg">
                                  {student.name}
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex justify-center">
                                    <Checkbox
                                      id={`student-${student.id}`}
                                      checked={isAbsent}
                                      onCheckedChange={(checked) =>
                                        handleAttendanceChange(student.id, checked as boolean)
                                      }
                                      className="h-6 w-6 border-2 border-[#0D4F97] data-[state=checked]:bg-[#0D4F97] data-[state=checked]:text-white"
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
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
                      disabled={isSaving || students.length === 0}
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}