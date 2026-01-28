'use client'

import { useEffect, useState } from "react";
import { BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { buscarProfessorPorId, listarTurmasDeProfessor } from "@/services/ProfessorService";
import { useAuth } from "@/contexts/AuthContext";

interface Turma {
  id: number;
  nome: string;
  horario: string;
  turno: string;
  tipo: string;
  isAtiva: boolean;
  totalAlunosAtivos?: number;
}

interface Professor {
  id: number;
  nome: string;
  email: string;
}

export default function ProfessorDashboardPage() {
  const { usuario, professorId, loading: authLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    if (!professorId) return;

    async function carregarProfessor() {
      try {
        const response = await buscarProfessorPorId(professorId);
        setProfessor(response);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados do professor.");
      } finally {
        setLoading(false);
      }
    }

    carregarProfessor();
  }, [professorId]);

  useEffect(() => {
    if (!professorId) return;

    async function carregarTurmas() {
      try {
        const response = await listarTurmasDeProfessor(professorId);
        setTurmas(response.filter(t => t.isAtiva));
      } catch (err: any) {
        console.error(err);
      }
    }

    carregarTurmas();
  }, [professorId]);

  const totalAlunosAtivos = turmas.reduce((total, turma) => {
    const valor = Number(turma.totalAlunosAtivos);
    return total + (isNaN(valor) ? 0 : valor);
  }, 0);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[#0D4F97] font-semibold">Carregando painel...</p>
      </div>
    );
  }

  if (error || !usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600 font-semibold">{error || "Usuário não autenticado."}</p>
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
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h1 className="text-[#0D4F97] text-2xl font-bold">
                Painel do Professor
              </h1>
              <p className="text-[#222222]">
                Bem-vindo, {professor?.nome || usuario.email}!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
                <CardContent className="p-6 mt-4">
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
                <CardContent className="p-6 mt-4">
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