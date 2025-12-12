'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, Eye } from "lucide-react";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { useRouter } from "next/navigation";

export default function TurmasPage() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleVerAlunos = (turmaId: string) => {
    router.push(`/professor/turmas/${turmaId}/alunos`);
  };

  const handleFazerChamada = (turmaId: string) => {
    router.push(`/professor/turmas/${turmaId}/chamada`);
  };

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      <ProfessorSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6">
              <h1 className="text-[#0D4F97]">Minhas Turmas</h1>
              <p className="text-[#222222]">Gerencie suas turmas e alunos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {turmas.map((turma) => (
              <Card key={turma.id} className="rounded-xl border-2 border-[#B2D7EC] bg-white shadow-md transition-all hover:border-[#0D4F97] hover:shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                        <BookOpen className="h-6 w-6 text-[#0D4F97]" />
                      </div>
                      <div>
                        <h3 className="text-[#0D4F97] cursor-pointer hover:underline">{turma.nome}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="rounded-full bg-[#B2D7EC] px-3 py-1 text-[#0D4F97] text-sm">
                            {turma.alunos} alunos
                          </span>
                          <span className="text-[#222222] text-sm">{turma.periodo}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleVerAlunos(turma.id)}
                      variant="outline"
                      className="flex-1 h-12 justify-center px-4 bg-white border-2 border-[#0D4F97] text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
                    >
                      <Eye className="mr-2 h-5 w-5" />
                      Ver Alunos
                    </Button>
                    
                    <Button
                      onClick={() => handleFazerChamada(turma.id)}
                      className="flex-1 h-12 justify-center px-4 bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Fazer Chamada
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}