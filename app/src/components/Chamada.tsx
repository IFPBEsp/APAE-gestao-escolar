'use client'

import { useState, useEffect, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Users, ArrowLeft, CalendarIcon } from "lucide-react";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
// Importa as funções de serviço (assumindo que estão exportadas no arquivo)
import { 
  getChamadaPorTurmaEData, 
  registrarChamada, 
  getAlunosDaTurma // Incluindo a função de buscar alunos
} from "@/services/chamadaService"; 

// --- Tipos Locais (Simplificados) ---
// Usamos a interface de aluno com name em vez de nome para compatibilidade com o código original.
interface StudentAttendance {
    id: number;
    name: string; // Nome do aluno
    isAbsent: boolean; // true = AUSENTE (checkbox marcado), false = PRESENTE
}

// --- Props do Componente ---
interface ChamadaProps {
  onBack: () => void;
  initialClass?: string; 
  onLogout?: () => void;
  onNavigateToDashboard?: (tab: string) => void;
  data?: Date;
  descricao?: string; 
}

// --- Componente Chamada ---
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
  
  const selectedDate = selectedDateProp || new Date();
  const dateFormatted = format(selectedDate, "yyyy-MM-dd"); // Formato exigido pelo backend
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("turmas");
  
  // Extrai Turma ID e Nome de initialClass (Ex: "10-Alfabetização 2025 - Manhã")
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

  // Função de carregamento dos dados
  const loadAttendanceData = async () => {
    if (!turmaId) {
      setIsLoading(false);
      toast.error("ID da Turma inválido. Não foi possível carregar a chamada.");
      return;
    }

    setIsLoading(true);
    let isFound = false;
    let studentsFromApi: any[] = [];
    
    // 1. Tenta carregar a chamada já registrada
    try {
      // Usamos 'any' para a resposta, já que o arquivo service não tem a tipagem formal
      const chamadaResponse: any = await getChamadaPorTurmaEData(turmaId, dateFormatted);
      
      // Mapeia a chamada existente para o estado local
      studentsFromApi = chamadaResponse.listaPresencas.map((p: any) => ({
        id: p.alunoId,
        name: p.alunoNome,
        // status: true = AUSENTE, false = PRESENTE
        isAbsent: p.status !== 'PRESENTE', 
      }));
      isFound = true;

    } catch (error: any) {
      // Se a chamada NÃO EXISTE (e.g., erro 404/204), tentamos carregar APENAS a lista de alunos
      if (error.response?.status === 404 || error.response?.status === 204) {
          console.log("Chamada não encontrada. Carregando lista de alunos da turma.");
          isFound = false;
      } else {
        // Outros erros de backend (500, etc.)
        console.error("Erro ao carregar chamada existente:", error);
        toast.error("Erro ao carregar a chamada: " + (error.message || "Verifique a conexão."));
        setIsLoading(false);
        return; // Sai da função em caso de erro grave
      }
    }

    // 2. Se a chamada não foi encontrada, carrega a lista de alunos para iniciar uma nova
    if (!isFound) {
        try {
            // Chama a função real para buscar alunos da turma
            const alunosResponse: any[] = await getAlunosDaTurma(turmaId);
            
            // Mapeia alunos para o estado, definindo todos como PRESENTE (isAbsent: false)
            studentsFromApi = alunosResponse.map((aluno: any) => ({
              id: aluno.id,
              name: aluno.nome || aluno.name, // Suporta 'nome' ou 'name' vindo do backend
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaId, dateFormatted]);


  // Função para mudar o status de presença/ausência de um aluno
  const handleAttendanceChange = (studentId: number, checked: boolean) => {
    setStudents(prevStudents => 
        prevStudents.map(student => 
            student.id === studentId ? { ...student, isAbsent: checked } : student
        )
    );
  };


  // Função de salvar (integração real)
  const handleSaveChamada = async () => {
    if (!turmaId) return;

    setIsSaving(true);
    
    // Converte o estado local (StudentAttendance[]) para o DTO de requisição
    const requestBody = {
      descricao: initialDescription || `Chamada do dia ${format(selectedDate, "dd/MM/yyyy")}`,
      presencas: students.map(student => ({
        alunoId: student.id,
        // Converte o booleano 'isAbsent' para o enum de String exigido pelo backend
        status: student.isAbsent ? 'AUSENTE' : 'PRESENTE', 
      }))
    };

    try {
      await registrarChamada(turmaId, dateFormatted, requestBody);
      
      toast.success("Chamada salva com sucesso!");
      
      setTimeout(() => {
        onBack(); // Retorna para a página anterior após salvar
      }, 1500);

    } catch (error: any) {
      console.error("Erro ao salvar chamada:", error);
      // Pega a mensagem de erro do objeto Error ou usa uma mensagem genérica
      toast.error(error.message || "Falha ao salvar a chamada. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  // Cálculos de contagem
  const totalCount = students.length;
  const absentCount = students.filter(s => s.isAbsent).length;
  const presentCount = totalCount - absentCount;

  // Handlers de Sidebar (mantidos)
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
  
  // Tratamento de carregamento e IDs inválidos
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


  // --- Renderização (Sem alterações de Design) ---
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
                      {turmaNome}
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
                    {initialDescription && (
                      <div className="rounded-xl border-2 border-[#B2D7EC] bg-white p-4">
                        <div className="flex items-center gap-2 text-[#0D4F97] font-semibold">
                          <span>Descrição da Aula</span>
                        </div>
                        <p className="mt-2 text-[#222222] text-lg">{initialDescription}</p>
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
                          {students.map((student) => (
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