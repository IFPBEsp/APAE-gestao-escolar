'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Users, UserCircle } from "lucide-react";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns"; // Importado para formatar a data

export default function TurmaDetalhesPage() {
  const params = useParams()!;
  const turmaId = params.turmaId as string;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("turmas");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mock data para turma e alunos
  const turmaData: Record<string, any> = {
    "1": {
      nome: "Alfabetização 2025 - Manhã",
      periodo: "Manhã",
      alunos: [
        { id: 1, name: "Ana Silva" },
        { id: 2, name: "Bruno Costa" },
        { id: 3, name: "Carlos Oliveira" },
        { id: 4, name: "Diana Santos" },
        { id: 5, name: "Eduardo Ferreira" },
        { id: 6, name: "Fernanda Lima" },
        { id: 7, name: "Gabriel Souza" },
        { id: 8, name: "Helena Rodrigues" },
      ]
    },
    "2": {
      nome: "Estimulação 2025 - Tarde",
      periodo: "Tarde",
      alunos: [
        { id: 9, name: "Igor Martins" },
        { id: 10, name: "Juliana Alves" },
        { id: 11, name: "Lucas Pereira" },
        { id: 12, name: "Maria Cardoso" },
        { id: 13, name: "Nicolas Ribeiro" },
        { id: 14, name: "Olivia Gomes" },
      ]
    }
  };

  const turma = turmaData[turmaId] || { nome: "Turma não encontrada", alunos: [] };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    router.push("/");
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleVerAvaliacoes = (alunoId: number) => {
    router.push(`/professor/turmas/${turmaId}/alunos/${alunoId}/avaliacoes`);
  };

  const handleFazerChamada = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    // Junta o ID e o Nome no formato que a página de chamada espera: "ID-NOME"
    const turmaParam = `${turmaId}-${turma.nome}`; 

    router.push(
      `/professor/turmas/${turmaId}/chamada?data=${today}&turmaNome=${turmaParam}`
    );
  };

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      {/* Sidebar */}
      <ProfessorSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => router.push("/professor/turmas")}
              variant="outline"
              className="h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>

            <Button
              onClick={handleFazerChamada}
              className="h-12 bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
            >
              Fazer Chamada
            </Button>
          </div>
          {/* ... restante do código da TurmaDetalhesPage ... */}
          {/* Info da Turma */}
          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                  <BookOpen className="h-8 w-8 text-[#0D4F97]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#0D4F97]">{turma.nome}</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-[#222222]">
                      <Users className="h-5 w-5" />
                      <span>{turma.alunos.length} alunos</span>
                    </div>
                    <div className="text-[#222222]">
                      Período: {turma.periodo}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Alunos */}
          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
            <CardContent className="p-0">
              <div className="p-6 border-b-2 border-[#B2D7EC]">
                <h2 className="text-xl font-semibold text-[#0D4F97]">Alunos da Turma</h2>
              </div>

              <div className="divide-y-2 divide-[#B2D7EC]">
                {turma.alunos.map((aluno: any) => (
                  <div key={aluno.id} className="p-6 hover:bg-[#B2D7EC]/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                          <UserCircle className="h-6 w-6 text-[#0D4F97]" />
                        </div>
                        <div>
                          <h3 className="text-[#0D4F97] font-semibold">{aluno.name}</h3>
                          <p className="text-[#222222] text-sm">Alfabetização 2025</p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleVerAvaliacoes(aluno.id)}
                        variant="outline"
                        className="border-2 border-[#B2D7EC] text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                      >
                        Ver Avaliações
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}