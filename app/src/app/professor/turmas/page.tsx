'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
// Importei Calendar, pois é usado nos detalhes da turma
import { BookOpen, Users, ClipboardCheck, Calendar } from "lucide-react"; 
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

  // Função para navegar e evitar clique no card quando clicar no botão
  const handleNavigation = (path: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      router.push(path);
  }

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      <ProfessorSidebar
        activeTab="turmas"
        onTabChange={(tab) => router.push(`/professor/${tab === 'inicio' ? '' : tab}`)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={() => router.push("/")}
      />

      {/* Main Content - Responsivo e com padding para o menu mobile */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 pt-16 md:pt-0 ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        <div className="p-4 md:p-8"> 
          
          {/* Título da Página */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-[#0D4F97] text-2xl md:text-3xl font-bold">Minhas Turmas</h1>
            <p className="text-[#222222] mt-1 text-sm md:text-lg">Gerencie suas turmas e alunos</p>
          </div>

          {/* CARD GRANDE QUE CONTÉM AS TURMAS */}
          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md bg-white">
            <CardHeader className="border-b border-[#B2D7EC]/30 pb-4 md:pb-6">
              <div className="flex items-center gap-3 md:gap-4">
                {/* Ícone Turmas Ativas */}
                <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#B2D7EC]/20 text-[#0D4F97]">
                  <BookOpen className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  {/* Título Turmas Ativas */}
                  <CardTitle className="text-[#0D4F97] text-xl md:text-2xl font-bold">Turmas Ativas</CardTitle>
                  <CardDescription className="text-[#222222] font-medium text-sm md:text-base">
                    {turmas.length} turmas cadastradas
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            {/* CONTEÚDO PRINCIPAL: A GRADE DOS CARDS DE TURMAS */}
            <CardContent className="pt-6">
              {/* Ajuste da Grid: grid-cols-1 em mobile, md:grid-cols-2 em desktop */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {turmas.map((turma) => (
                  <div 
                    key={turma.id} 
                    className="rounded-xl border-2 border-[#B2D7EC] bg-white p-4 md:p-6 transition-all hover:border-[#0D4F97] hover:shadow-lg cursor-pointer"
                    onClick={() => handleNavigation(`/professor/turmas/${turma.id}/alunos`)}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      {/* Nome da Turma */}
                      <h3 className="text-[#0D4F97] font-bold text-lg md:text-xl pr-2">{turma.name}</h3>
                      
                      {/* Contador de Alunos - Fundo Azul Claro */}
                      <span className="flex-shrink-0 rounded-full bg-[#B2D7EC] px-3 py-1 text-[#0D4F97] font-bold text-xs uppercase">
                        {turma.students} ALUNOS
                      </span>
                    </div>
                    
                    {/* Detalhes da Turma - Ícones e Texto */}
                    <div className="mb-6 space-y-2 text-[#222222] text-sm md:text-base">
                      {/* Horário (com ícone Calendar) */}
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#0D4F97]/70" /> 
                        <strong>Horário:</strong> {turma.schedule}
                      </p>
                      {/* Próxima Aula (com ícone BookOpen) */}
                      <p className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-[#0D4F97]/70" /> 
                        <strong>Próxima aula:</strong> {turma.nextClass}
                      </p>
                    </div>
                    
                    {/* Botões - Ficam em linha (flex-row) no desktop e empilhados (flex-col) no mobile */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={(e) => handleNavigation(`/professor/turmas/${turma.id}/alunos`, e)}
                        variant="outline"
                        className="h-10 flex-1 border-2 border-[#0D4F97] text-[#0D4F97] font-bold hover:bg-[#0D4F97] hover:text-white"
                      >
                        <Users className="mr-2 h-4 w-4" /> Ver Alunos
                      </Button>
                      <Button
                        onClick={(e) => handleNavigation(`/professor/turmas/${turma.id}/chamada`, e)}
                        className="h-10 flex-1 bg-[#0D4F97] text-white font-bold hover:bg-[#FFD000] hover:text-[#0D4F97]"
                      >
                        <ClipboardCheck className="mr-2 h-4 w-4" /> Fazer Chamada
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