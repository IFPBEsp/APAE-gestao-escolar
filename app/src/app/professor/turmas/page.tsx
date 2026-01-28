'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, ClipboardCheck, Calendar } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { listarTurmasDeProfessor } from '@/services/ProfessorService';
import { toast } from 'sonner';

interface Turma {
  id: number;
  nome: string;
  horario: string;
  turno: string;
  tipo: string;
  isAtiva: boolean;
  totalAlunosAtivos?: number;
}

export default function TurmasPage() {
  const router = useRouter();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);

  const professorId = 1; // TODO: vir do login

  async function carregarTurmas() {
    try {
      const data: Turma[] = await listarTurmasDeProfessor(professorId);
      setTurmas(data.filter((turma) => turma.isAtiva));
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarTurmas();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="space-y-8">
      {/* Título */}
      <div>
        <h1 className="text-[#0D4F97] text-2xl md:text-3xl font-bold">
          Minhas Turmas
        </h1>
        <p className="text-[#222222] mt-1 text-sm md:text-lg">
          Gerencie suas turmas e alunos
        </p>
      </div>

      {/* Card principal */}
      <Card className="w-full rounded-xl border-2 border-[#B2D7EC] shadow-md bg-white">
        <CardHeader className="border-b border-[#B2D7EC]/30 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B2D7EC]/20 text-[#0D4F97]">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-[#0D4F97] text-2xl font-bold">
                Turmas Ativas
              </CardTitle>
              <CardDescription className="text-[#222222] font-medium">
                {loading
                  ? 'Carregando...'
                  : `${turmas.length} turmas ativas`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <p className="text-center">Carregando turmas...</p>
          ) : turmas.length === 0 ? (
            <p className="text-center">Nenhuma turma ativa encontrada.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {turmas.map((turma) => (
                <div
                  key={turma.id}
                  className="cursor-pointer rounded-xl border-2 border-[#B2D7EC] bg-white p-6 transition-all hover:border-[#0D4F97] hover:shadow-lg"
                  onClick={() =>
                    handleNavigation(
                      `/professor/turmas/${turma.id}/alunos`
                    )
                  }
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[#0D4F97] font-bold text-xl">
                      {turma.nome}
                    </h3>

                    <span className="rounded-full bg-[#B2D7EC] px-3 py-1 text-xs font-bold uppercase text-[#0D4F97]">
                      {turma.totalAlunosAtivos ?? 0} alunos
                    </span>
                  </div>

                  <div className="mb-6 space-y-2 text-sm text-[#222222]">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#0D4F97]/70" />
                      <strong>Horário:</strong> {turma.horario}
                    </p>
                    <p>
                      <strong>Turno:</strong> {turma.turno}
                    </p>
                    <p>
                      <strong>Tipo:</strong> {turma.tipo}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigation(
                          `/professor/turmas/${turma.id}/alunos`
                        );
                      }}
                    >
                      <Users className="mr-2 h-5 w-5" strokeWidth={1.75} />
                      Ver Alunos
                    </Button>

                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigation(
                          `/professor/turmas/${turma.id}/frequencia`
                        );
                      }}
                    >
                      <ClipboardCheck className="mr-2 h-5 w-5" strokeWidth={1.75} />
                      Frequência
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
