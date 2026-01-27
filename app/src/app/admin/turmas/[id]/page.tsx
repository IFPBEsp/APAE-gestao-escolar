'use client'

import {
  ArrowLeft,
  Users,
  Edit,
  Power,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditarTurmaModal } from "@/components/turmas/EditarTurmaModal";

import {
  buscarTurmaPorId,
  listarAlunos,
  listarAlunosAtivos,
  desativarTurma
} from "@/services/TurmaService";

interface VerInformacoesTurmaPageProps {
  params: {
    id: string;
  };
}

export default function VerInformacoesTurmaPage({ params }: VerInformacoesTurmaPageProps) {
  const router = useRouter();
  const turmaId = Number(params.id);

  const [turma, setTurma] = useState<any>(null);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [alunosAtivosCount, setAlunosAtivosCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditarOpen, setIsEditarOpen] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        const turmaResponse = await buscarTurmaPorId(turmaId);
        const alunosResponse = await listarAlunos(turmaId);
        const alunosAtivosResponse = await listarAlunosAtivos(turmaId);

        setTurma(turmaResponse);
        setAlunos(alunosResponse);
        setAlunosAtivosCount(alunosAtivosResponse.length); // contador atualizado
      } catch (error) {
        console.error("Erro ao carregar turma:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [turmaId]);

  async function handleDesativarTurma() {
    try {
      await desativarTurma(turmaId);
      router.back();
    } catch (error) {
      console.error("Erro ao desativar turma:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        Carregando turma...
      </div>
    );
  }

  if (!turma) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] p-4 md:p-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 justify-center"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </Button>
        <div className="text-center">Turma não encontrada</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">

        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 justify-center"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </Button>

        {/* Cabeçalho + Ações dentro de Card (igual Professores) */}
        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md mb-6">
          <CardContent className="p-8">
            <div>
              <h1 className="mb-2 text-[#0D4F97] text-2xl font-bold">
                {`${turma.tipo} ${turma.anoCriacao} - ${turma.turno}`}
              </h1>
              <p className="text-[#222222]">Informações detalhadas da turma</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t-2 border-[#B2D7EC] pt-6 md:flex-row">
              <Button
                variant="primary"
                onClick={() => setIsEditarOpen(true)}
                className="w-full flex-1"
              >
                <Edit className="mr-2 h-5 w-5" />
                Editar Turmassssss
              </Button>

              <Button
                variant={turma?.isAtiva ? "danger" : "primary"}
                onClick={handleDesativarTurma}
                className="w-full flex-1"
              >
                <Power className="mr-2 h-5 w-5" />
                {turma?.isAtiva ? "Inativar Turma" : "Ativar Turma"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <EditarTurmaModal
          isOpen={isEditarOpen}
          onClose={() => setIsEditarOpen(false)}
          turmaData={turma}
        />

        {/* Cards de resumo */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">

          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-[#0D4F97]" />
                <div>
                  <p>Total de Alunos</p>
                  <p className="text-[#0D4F97]">{alunos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <div>
                  <p>Alunos Ativos</p>
                  <p className="text-green-600">{alunosAtivosCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Tabela de alunos */}
        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
          <CardHeader>
            <CardTitle className="text-[#0D4F97]">Alunos da Turma</CardTitle>
            <CardDescription>Lista de alunos vinculados</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#B2D7EC]">
                  <th className="p-3 text-left text-[#0D4F97]">Aluno</th>
                  <th className="p-3 text-center text-[#0D4F97]">Status</th>
                </tr>
              </thead>

              <tbody>
                {alunos.map((aluno) => (
                  <tr key={aluno.id} className="border-b border-[#B2D7EC]">
                    <td className="p-3">{aluno.nome}</td>

                    <td className="p-3 text-center">
                      {aluno.isAtivo ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          Ativo
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          Inativo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
