'use client'

import { useState } from "react";
import { useRouter } from "next/navigation"; // Adicionado
import { BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { toast } from "sonner"; // Verifique se você usa sonner ou outra lib de toast

export default function ProfessorDashboardPage() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // --- ESTADOS ADICIONADOS PARA RESOLVER O CONFLITO ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [descricaoChamada, setDescricaoChamada] = useState("");
  const [dataChamada, setDataChamada] = useState(new Date());
  const [chamadaData, setChamadaData] = useState({ turmaId: null, turmaNome: "" });
  const [turmaAlunosSelecionada, setTurmaAlunosSelecionada] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  // ----------------------------------------------------

  const professorData = {
    nome: "Maria Santos",
    turmas: [
      { id: 1, name: "Alfabetização 2025 - Manhã", students: 8 },
      { id: 2, name: "Estimulação 2025 - Tarde", students: 6 },
    ],
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleOpenChamadaDialog = (turmaId: any, turmaNome: string) => {
    setChamadaData({ turmaId, turmaNome });
    setDescricaoChamada("");
    setDataChamada(new Date());
    setIsDialogOpen(true);
  };

  const handleCriarChamada = () => {
    if (!descricaoChamada.trim()) {
      toast.error("Por favor, preencha a descrição da aula!");
      return;
    }
    
    setIsDialogOpen(false);
    
    // Redirecionar para página de chamada COM os dados
    router.push(`/professor/turmas/${chamadaData.turmaId}/chamada?data=${dataChamada.toISOString()}&descricao=${encodeURIComponent(descricaoChamada)}`);
    
    toast.success("Chamada criada com sucesso! Redirecionando...");
  };

  const alunosData = [
    { id: 1, nome: "Ana Silva", turma: "Alfabetização 2025 - Manhã", presenca: 92, ultimaAvaliacao: "05/11/2025" },
    { id: 2, nome: "Bruno Costa", turma: "Alfabetização 2025 - Manhã", presenca: 88, ultimaAvaliacao: "04/11/2025" },
    { id: 3, nome: "Carlos Oliveira", turma: "Alfabetização 2025 - Manhã", presenca: 95, ultimaAvaliacao: "05/11/2025" },
    { id: 4, nome: "Diana Santos", turma: "Alfabetização 2025 - Manhã", presenca: 85, ultimaAvaliacao: "03/11/2025" },
    { id: 5, nome: "Eduardo Ferreira", turma: "Alfabetização 2025 - Manhã", presenca: 90, ultimaAvaliacao: "05/11/2025" },
    { id: 6, nome: "Fernanda Lima", turma: "Alfabetização 2025 - Manhã", presenca: 87, ultimaAvaliacao: "04/11/2025" },
    { id: 7, nome: "Gustavo Pereira", turma: "Alfabetização 2025 - Manhã", presenca: 94, ultimaAvaliacao: "05/11/2025" },
    { id: 8, nome: "Helena Rodrigues", turma: "Alfabetização 2025 - Manhã", presenca: 91, ultimaAvaliacao: "04/11/2025" },
    { id: 9, nome: "Igor Martins", turma: "Estimulação 2025 - Tarde", presenca: 93, ultimaAvaliacao: "04/11/2025" },
    { id: 10, nome: "Julia Almeida", turma: "Estimulação 2025 - Tarde", presenca: 89, ultimaAvaliacao: "03/11/2025" },
    { id: 11, nome: "Lucas Mendes", turma: "Estimulação 2025 - Tarde", presenca: 92, ultimaAvaliacao: "05/11/2025" },
    { id: 12, nome: "Marina Souza", turma: "Estimulação 2025 - Tarde", presenca: 86, ultimaAvaliacao: "04/11/2025" },
    { id: 13, nome: "Nicolas Cardoso", turma: "Estimulação 2025 - Tarde", presenca: 95, ultimaAvaliacao: "05/11/2025" },
    { id: 14, nome: "Olivia Barbosa", turma: "Estimulação 2025 - Tarde", presenca: 88, ultimaAvaliacao: "03/11/2025" },
  ];

  const getPresencaColor = (presenca: number) => {
    if (presenca >= 90) return "text-green-600";
    if (presenca >= 85) return "text-yellow-600";
    return "text-orange-600";
  };

  const handleVerAlunos = (turmaNome: string) => {
    setTurmaAlunosSelecionada(turmaNome);
    setActiveTab("alunos");
  };

  const handleVerAvaliacoes = (alunoId: number) => {
    const aluno = alunosData.find(a => a.id === alunoId);
    if (aluno) {
      const turma = professorData.turmas.find(t => t.name === aluno.turma);
      if (turma) {
        router.push(`/professor/alunos/${alunoId}/avaliacoes?turmaId=${turma.id}`);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      <ProfessorSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-[#0D4F97] text-2xl font-bold">Painel do Professor</h1>
              <p className="text-[#222222]">Bem-vindo, {professorData.nome}!</p>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B2D7EC]/20 mb-4">
                      <BookOpen className="h-7 w-7 text-[#0D4F97]" />
                    </div>
                    <p className="text-[#222222] mb-2">Turmas Ativas</p>
                    <p className="text-[#0D4F97] text-3xl font-bold">
                      {professorData.turmas.length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B2D7EC]/20 mb-4">
                      <Users className="h-7 w-7 text-[#0D4F97]" />
                    </div>
                    <p className="text-[#222222] mb-2">Total de Alunos</p>
                    <p className="text-[#0D4F97] text-3xl font-bold">
                      {professorData.turmas.reduce((sum, t) => sum + t.students, 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
