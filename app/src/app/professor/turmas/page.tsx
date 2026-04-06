'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users, ClipboardCheck, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listarTurmasDeProfessor } from "@/services/ProfessorService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Turma } from "@/types/turma";
import { buscarProfessorPorId } from "@/services/ProfessorService";

interface Professor {
  id: number;
  nome: string;
  email: string;
}

export default function TurmasPage() {
  const router = useRouter();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const { usuario, professorId, loading: authLoading } = useAuth();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!professorId) {
      toast.error("Usuário não autenticado");
      router.push("/");
      return;
    }
    buscarProfessorPorId(professorId)
      .then(setProfessor)
      .catch(() => toast.error("Erro ao carregar professor"));

    setLoading(true);
    listarTurmasDeProfessor(professorId)
      .then((data) => {
          const ativas = data.filter(t => t.isAtiva);
          const ordenadas = ativas.sort((a, b) =>
            (b.anoCriacao || 0) - (a.anoCriacao || 0) || a.nome.localeCompare(b.nome)
          );
          setTurmas(ordenadas);
      })
      .catch((err: any) => toast.error(err.message || "Erro ao carregar dados"))
      .finally(() => setLoading(false));
  }, [professorId, router]);

  const handleNavigation = (path: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    router.push(path);
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[#0D4F97] font-semibold">Carregando dados...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600 font-semibold">Usuário não autenticado.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0D4F97] mb-2">
          Minhas Turmas
        </h1>

        <p className="text-[#222222] mt-1 text-sm md:text-lg">
          Bem-vindo, {professor?.nome || usuario.email}!
        </p>

        <p className="text-[#222222] mt-1 text-sm md:text-base">
          Gerencie suas turmas e alunos
        </p>
      </div>

      <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md bg-white">
        <CardHeader className="border-b border-[#B2D7EC]/30 pb-4 md:pb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F97]/10">
              <BookOpen className="h-5 w-5 text-[#0D4F97]" />
            </div>

            <div>
              <CardTitle className="text-[#0D4F97] text-xl md:text-2xl font-bold">
                Turmas Ativas
              </CardTitle>

              <CardDescription className="text-[#222222] font-medium text-sm md:text-base">
                {turmas.length} turmas ativas
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {turmas.length === 0 ? (
            <p className="text-center">Nenhuma turma ativa encontrada.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">

              {turmas.map((turma: Turma) => (

                <div
                  key={turma.id}
                  className="rounded-xl border-2 border-[#B2D7EC] bg-white p-4 md:p-6 transition-all hover:border-[#0D4F97] hover:shadow-lg cursor-pointer"
                  onClick={() =>
                    handleNavigation(`/professor/turmas/${turma.id}/alunos`)
                  }
                >

                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">

                    <h3 className="text-[#0D4F97] font-bold text-lg md:text-xl pr-2 flex-1 min-w-0 break-words">
                      {turma.nome}
                    </h3>

                    <span className="flex-shrink-0 rounded-full bg-[#B2D7EC] px-3 py-1 text-[#0D4F97] font-bold text-xs uppercase mt-1">
                      {turma.totalAlunosAtivos ?? 0} ALUNOS
                    </span>

                  </div>

                  <div className="mb-6 space-y-2 text-[#222222] text-sm md:text-base">

                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-[#0D4F97]/70 mt-1 flex-shrink-0" />
                      <p className="break-words min-w-0 flex-1">
                        <strong>Horário:</strong> {turma.horario}
                      </p>
                    </div>

                    <p>
                      <strong>Turno:</strong> {turma.turno}
                    </p>

                    <p>
                      <strong>Tipo:</strong> {turma.tipo}
                    </p>

                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">

                    <Button
                      onClick={(e) =>
                        handleNavigation(
                          `/professor/turmas/${turma.id}/alunos`,
                          e
                        )
                      }
                      variant="outline"
                      className="h-10 flex-1 border-2 border-[#0D4F97] text-[#0D4F97] font-bold hover:bg-[#0D4F97] hover:text-white"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Ver Alunos
                    </Button>

                    <Button
                      onClick={(e) =>
                        handleNavigation(
                          `/professor/turmas/${turma.id}/frequencia`,
                          e
                        )
                      }
                      className="h-10 flex-1 bg-[#0D4F97] text-white font-bold hover:bg-[#FFD000] hover:text-[#0D4F97]"
                    >
                      <ClipboardCheck className="mr-2 h-4 w-4" />
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