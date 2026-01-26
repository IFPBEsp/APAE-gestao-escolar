'use client'

import { BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { buscarProfessorPorId } from "@/services/ProfessorService";
import { listarTurmasDeProfessor } from "@/services/ProfessorService";

import { Turma }from "@/types/turma";
import { Professor } from "@/types/professor";


export default function ProfessorDashboardPage() {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [turmas, setTurmas] = useState<any[]>([]);

  const professorId = 1; // depois você pode trocar pelo ID do usuário logado

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 🔹 Apenas turmas ativas
  const turmasAtivas = turmas.filter(turma => turma.isAtiva === true);

  // 🔹 Soma dos alunos ativos das turmas ativas
  const totalAlunosAtivos = turmasAtivas.reduce((total, turma) => {
    const valor = Number(turma.totalAlunosAtivos);
    return total + (isNaN(valor) ? 0 : valor);
  }, 0);

  useEffect(() => {
    async function carregarProfessor() {
      try {
        const response = await buscarProfessorPorId(professorId);
        setProfessor(response);
      } catch (err: any) {
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
        const response = await listarTurmasDeProfessor(professorId);
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
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#0D4F97] text-2xl font-bold">
          Painel do Professor
        </h1>
        {professor ? (
          <p className="text-[#222222]">Bem-vindo, {professor.nome}!</p>
        ) : (
          <p className="text-[#222222]">Carregando informações...</p>
        )}
      </div>

      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
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
                Bem-vindo, {professor?.nome}!
              </p>
            </div>
          </CardContent>
        </Card>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Turmas Ativas */}
              <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B2D7EC]/20 mb-4">
                      <BookOpen className="h-7 w-7 text-[#0D4F97]" />
                    </div>
                    <p className="text-[#222222] mb-2">Turmas Ativas</p>
                    <p className="text-[#0D4F97] text-3xl font-bold">
                      {turmasAtivas.length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Total de Alunos Ativos */}
              <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B2D7EC]/20 mb-4">
                      <Users className="h-7 w-7 text-[#0D4F97]" />
                    </div>
                    <p className="text-[#222222] mb-2">Total de Alunos Ativos</p>
                    <p className="text-[#0D4F97] text-3xl font-bold">
                      {totalAlunosAtivos}
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
