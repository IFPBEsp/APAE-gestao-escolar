'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";

export default function TurmasPage() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const turmas = [
    {
      id: "1",
      name: "Alfabetização 2025 - Manhã",
      students: 8,
      schedule: "Segunda a Sexta - 07:30 às 13:30",
      nextClass: "Segunda-feira às 07:30",
    },
    {
      id: "2",
      name: "Estimulação 2025 - Tarde",
      students: 6,
      schedule: "Segunda a Sexta - 13:30 às 17:00",
      nextClass: "Segunda-feira às 13:30",
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      <ProfessorSidebar
        activeTab="turmas"
        onTabChange={(tab) => router.push(`/professor/${tab === 'inicio' ? '' : tab}`)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={() => router.push("/")}
      />

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 pt-16 md:pt-0 ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0D4F97]">Minhas Turmas</h1>
            <p className="text-sm md:text-base text-[#222222] mt-2">Gerencie suas turmas e alunos</p>
          </div>

          {/* Lista de Turmas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {turmas.map((turma) => (
              <Card key={turma.id} className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                        <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-[#0D4F97]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[#0D4F97] font-semibold text-base md:text-lg truncate">{turma.nome}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                          <div className="flex items-center gap-1 text-[#222222] text-xs md:text-sm">
                            <Users className="h-3 w-3 md:h-4 md:w-4" />
                            <span>{turma.alunos} alunos</span>
                          </div>
                          <div className="flex items-center gap-1 text-[#222222] text-xs md:text-sm">
                            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                            <span>{turma.periodo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => handleVerTurma(turma.id)}
                      variant="outline"
                      className="flex-1 h-10 border-2 border-[#B2D7EC] text-[#0D4F97] hover:bg-[#B2D7EC]/20 text-sm md:text-base"
                    >
                      Ver Turma
                    </Button>
                    <Button
                      onClick={() => handleFazerChamada(turma.id)}
                      className="flex-1 h-10 bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97] text-sm md:text-base"
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