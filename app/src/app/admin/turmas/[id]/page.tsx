'use client'

import {
  ArrowLeft,
  Users,
  Edit,
  Power,
  TrendingUp,
  AlertTriangle,
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import {
  buscarTurmaPorId,
  listarAlunos,
  listarAlunosAtivos,
  desativarTurma
} from "@/services/TurmaService";
import { getAlunosComFrequencia } from "@/services/FrequenciaService";
import { getEstatisticasTurma, contarAulasRealizadas } from "@/services/ChamadaService";

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
  const [alunosFrequencia, setAlunosFrequencia] = useState<any[]>([]);
  const [estatisticas, setEstatisticas] = useState<any[]>([]);
  const [totalAulasRealizadas, setTotalAulasRealizadas] = useState(0);
  const [alunosAtivosCount, setAlunosAtivosCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditarOpen, setIsEditarOpen] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        const [
          turmaResponse,
          alunosResponse,
          alunosAtivosResponse,
          alunosFrequenciaResponse,
          estatisticasResponse,
          totalAulasResponse
        ] = await Promise.all([
          buscarTurmaPorId(turmaId),
          listarAlunos(turmaId),
          listarAlunosAtivos(turmaId),
          getAlunosComFrequencia(turmaId),
          getEstatisticasTurma(turmaId),
          contarAulasRealizadas(turmaId)
        ]);

        setTurma(turmaResponse);
        setAlunos(alunosResponse);
        setAlunosAtivosCount(alunosAtivosResponse.length);
        setAlunosFrequencia(alunosFrequenciaResponse || []);
        setEstatisticas(Array.isArray(estatisticasResponse) ? estatisticasResponse : []);
        setTotalAulasRealizadas(totalAulasResponse || 0);
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

        <HistoricoFrequenciaAdmin
          alunos={alunosFrequencia}
          estatisticas={estatisticas}
          totalAulasRealizadas={totalAulasRealizadas}
        />

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

interface HistoricoFrequenciaAdminProps {
  alunos: any[];
  estatisticas?: any[];
  totalAulasRealizadas?: number;
}

function HistoricoFrequenciaAdmin({
  alunos,
  estatisticas = [],
  totalAulasRealizadas = 0
}: HistoricoFrequenciaAdminProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);

  const alunosComFrequencia = alunos.map((aluno) => {
    const stat = estatisticas.find(
      (s: any) => String(s.alunoId) === String(aluno.id)
    );

    return {
      ...aluno,
      frequencia: stat?.frequencia || aluno.frequencia || aluno.percentualFrequencia || 0,
      totalAulas: stat?.totalAulas || aluno.totalAulas || 0,
      totalPresencas: stat?.totalPresencas || aluno.totalPresencas || 0,
    };
  });

  const mediaFrequencia =
    alunosComFrequencia.length > 0
      ? Math.round(
          alunosComFrequencia.reduce(
            (sum, a) => sum + (a.frequencia || 0),
            0
          ) / alunosComFrequencia.length
        )
      : 0;

  const alunosEmAlerta = alunosComFrequencia.filter(
    (a) => (a.frequencia || 0) < 75
  ).length;
  const aulasRegistradas = totalAulasRealizadas;
  const totalDiasLetivos = 200;

  const filteredAlunos = alunosComFrequencia.filter((aluno) => {
    const matchSearch = aluno.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    let matchAlert = true;
    if (showAlertsOnly) {
      matchAlert = (aluno.frequencia || 0) < 75;
    }
    return matchSearch && matchAlert;
  });

  return (
    <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md bg-white mb-6">
      <CardHeader className="bg-[#F8F9FA] border-b-2 border-[#B2D7EC]">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-[#0D4F97]">Histórico de Frequência</CardTitle>
            <CardDescription className="text-[#222222]">
              Estatísticas e registros de presença da turma
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-6">
          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
            <CardContent className="p-6 pt-12 text-center flex flex-col items-center justify-start h-full">
              <p className="text-[#0D4F97] text-2xl font-bold">{mediaFrequencia}%</p>
              <p className="text-[#222222] text-sm mt-1">
                Frequência média anual da turma
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-2 border-orange-200 shadow-md">
            <CardContent className="p-6 pt-12 text-center flex flex-col items-center justify-start h-full">
              <p className="text-orange-600 text-2xl font-bold">
                {alunosEmAlerta} Alunos
              </p>
              <p className="text-[#222222] text-sm mt-1">
                Com frequência abaixo de 75%
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
            <CardContent className="p-6 pt-12 text-center flex flex-col items-center justify-start h-full">
              <p className="text-[#0D4F97] text-2xl font-bold">
                {aulasRegistradas} / {totalDiasLetivos}
              </p>
              <p className="text-[#222222] text-sm mt-1">
                {aulasRegistradas} chamadas de {totalDiasLetivos} dias letivos
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome do aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-[#B2D7EC]"
              />
            </div>
            <button
              onClick={() => setShowAlertsOnly(!showAlertsOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 shadow-sm hover:shadow ${
                showAlertsOnly
                  ? "bg-orange-50 border-orange-200 text-orange-700 shadow-orange-200/50"
                  : "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 shadow-gray-300/50"
              }`}
            >
              <span className="text-sm font-medium">Apenas Alertas</span>
              <div className="relative inline-flex items-center h-5 rounded-full w-10 bg-gray-200">
                <span
                  className={`absolute flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200 ${
                    showAlertsOnly ? "left-5 bg-orange-500" : "left-0 bg-white"
                  }`}
                >
                  <AlertTriangle
                    className={`h-3 w-3 ${
                      showAlertsOnly ? "text-white" : "text-gray-400"
                    }`}
                  />
                </span>
              </div>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border-2 border-[#B2D7EC]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#B2D7EC]/20 hover:bg-[#B2D7EC]/20">
                <TableHead className="text-[#0D4F97] font-semibold pl-6">
                  Nome do Aluno
                </TableHead>
                <TableHead className="text-[#0D4F97] font-semibold pl-4">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlunos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-[#222222] py-8"
                  >
                    Nenhum aluno encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlunos.map((aluno) => {
                  const frequencia = aluno.frequencia || 0;
                  const isAlert = frequencia < 75;

                  return (
                    <TableRow
                      key={aluno.id}
                      className={`transition-all hover:bg-[#B2D7EC]/10 ${
                        isAlert ? "bg-orange-50/30" : ""
                      }`}
                    >
                      <TableCell className="font-medium text-[#222222] pl-6">
                        <div className="flex items-center gap-2">
                          {isAlert && (
                            <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                          )}
                          <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                            {aluno.nome}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div
                          className={`font-semibold ${
                            isAlert ? "text-orange-600" : "text-[#0D4F97]"
                          }`}
                        >
                          {frequencia}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {frequencia >= 75 ? "Presente" : "Ausente"}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
