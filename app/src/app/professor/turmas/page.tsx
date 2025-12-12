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

      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-[#0D4F97] text-3xl font-bold">Minhas Turmas</h1>
            <p className="text-[#222222] mt-1 text-lg">Gerencie suas turmas e alunos</p>
          </div>

          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md bg-white">
            <CardHeader className="border-b border-[#B2D7EC]/30 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B2D7EC]/20 text-[#0D4F97]">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-[#0D4F97] text-2xl font-bold">Minhas Turmas</CardTitle>
                  <CardDescription className="text-[#222222] font-medium">
                    {turmas.length} turmas ativas
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {turmas.map((turma) => (
                  <div key={turma.id} className="rounded-xl border-2 border-[#B2D7EC] bg-white p-6 transition-all hover:border-[#0D4F97] hover:shadow-lg">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-[#0D4F97] font-bold text-xl">{turma.name}</h3>
                      <span className="rounded-full bg-[#B2D7EC] px-4 py-1 text-[#0D4F97] font-bold text-xs uppercase">
                        {turma.students} alunos
                      </span>
                    </div>
                    <div className="mb-6 space-y-2 text-[#222222] text-sm">
                      <p><strong>Horário:</strong> {turma.schedule}</p>
                      <p><strong>Próxima aula:</strong> {turma.nextClass}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => router.push(`/professor/turmas/${turma.id}`)}
                        variant="outline"
                        className="h-12 flex-1 border-2 border-[#0D4F97] text-[#0D4F97] font-bold hover:bg-[#0D4F97] hover:text-white"
                      >
                        <Users className="mr-2 h-5 w-5" /> Ver Turma
                      </Button>
                      <Button
                        onClick={() => router.push(`/professor/turmas/${turma.id}/chamada`)}
                        className="h-12 flex-1 bg-[#0D4F97] text-white font-bold hover:bg-[#FFD000] hover:text-[#0D4F97]"
                      >
                        <ClipboardCheck className="mr-2 h-5 w-5" /> Fazer Chamada
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