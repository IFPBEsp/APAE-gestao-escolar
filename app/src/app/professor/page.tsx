'use client'

import { BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { useEffect, useState } from "react";
import { buscarProfessorPorId } from "@/services/ProfessorService";
import { listarTurmasDeProfessor } from "@/services/ProfessorService";
<<<<<<< HEAD

=======
import { Turma }from "@/types/turma";
import { Professor } from "@/types/professor";
>>>>>>> 26457ec400d8091bebc84bc7a284e7b15a99e492

export default function ProfessorDashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [turmas, setTurmas] = useState([]);

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    async function carregarProfessor() {
      try {
        // 🔹 solução temporária: professor fixo ID = 1
        const response = await buscarProfessorPorId(1);
        setProfessor(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    carregarProfessor();
  }, []);

  useEffect(() => {
  async function carregarTurmas() {
    try {
      const response = await listarTurmasDeProfessor(1); 
      setTurmas(response);
    } catch (err) {
      console.error(err);
    }
  }

  carregarTurmas();
}, []);


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[#0D4F97] font-semibold">Carregando painel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      <ProfessorSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
          }`}
      >
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-[#0D4F97] text-2xl font-bold">
                Painel do Professor
              </h1>
              <p className="text-[#222222]">
                Bem-vindo, {professor.nome}!
              </p>
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
                      {turmas.length}
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
                      {turmas.reduce(
                        (total, turma) => total + (turma.alunosIds?.length ?? 0), 0
                      )}
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
