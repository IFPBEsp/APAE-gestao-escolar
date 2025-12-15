'use client'

import { BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { useState } from "react";

export default function ProfessorDashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const professorData = {
    nome: "Maria Santos",
    turmas: [
      {
        id: 1,
        name: "Alfabetização 2025 - Manhã",
        students: 8,
      },
      {
        id: 2,
        name: "Estimulação 2025 - Tarde",
        students: 6,
      },
    ],
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
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