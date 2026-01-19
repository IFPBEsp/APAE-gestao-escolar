'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar } from "lucide-react";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { useRouter } from "next/navigation";

export default function TurmasPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("turmas");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mock data para turmas
  const turmas = [
    {
      id: "1",
      nome: "Alfabetização 2025 - Manhã",
      alunos: 8,
      periodo: "Manhã"
    },
    {
      id: "2",
      nome: "Estimulação 2025 - Tarde",
      alunos: 6,
      periodo: "Tarde"
    }
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    router.push("/");
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleVerTurma = (turmaId: string) => {
    router.push(`/professor/turmas/${turmaId}`);
  };

  const handleFazerChamada = (turmaId: string) => {
    router.push(`/professor/turmas/${turmaId}/chamada`);
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0D4F97]">Minhas Turmas</h1>
            <p className="text-[#222222] mt-2">Gerencie suas turmas e alunos</p>
          </div>

          {/* Lista de Turmas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {turmas.map((turma) => (
              <Card key={turma.id} className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                        <BookOpen className="h-6 w-6 text-[#0D4F97]" />
                      </div>
                      <div>
                        <h3 className="text-[#0D4F97] font-semibold text-lg">{turma.nome}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-[#222222]">
                            <Users className="h-4 w-4" />
                            <span>{turma.alunos} alunos</span>
                          </div>
                          <div className="flex items-center gap-1 text-[#222222]">
                            <Calendar className="h-4 w-4" />
                            <span>{turma.periodo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleVerTurma(turma.id)}
                      variant="outline"
                      className="flex-1 h-10 border-2 border-[#B2D7EC] text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                    >
                      Ver Turma
                    </Button>
                    <Button
                      onClick={() => handleFazerChamada(turma.id)}
                      className="flex-1 h-10 bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                    >
                      Fazer Chamada
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}