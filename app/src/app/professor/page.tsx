
'use client'

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Users,
  XCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { buscarDashboardProfessor } from "@/services/ProfessorService";
import { useAuth } from "@/contexts/AuthContext";

interface ProfessorDashboard {
  professorId: string;
  nome: string;
  totalTurmasAtivas: number;
  totalAlunosAtivos: number;
  frequenciaMedia: number;
  aulasRealizadas: number;
  alunosComFrequenciaBaixa: number;
  totalPresencas: number;
  totalFaltas: number;
}

const CORES = {
  azul: "#0D4F97",
  azulClaro: "#B2D7EC",
  vermelho: "#DC2626",
  cinza: "#64748B",
};

function formatarNumero(valor: number) {
  return valor.toLocaleString("pt-BR");
}

export default function ProfessorDashboardPage() {
  const { usuario, loading: authLoading } = useAuth();

  const [dashboard, setDashboard] = useState<ProfessorDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!usuario) {
  setDashboard(null);
  setError(null);
  setLoading(false);
  return;
}
    let ativo = true;

    async function carregarDashboard() {
      try {
        setLoading(true);
        setError(null);

        const response = await buscarDashboardProfessor();

        if (ativo) {
          setDashboard(response);
        }
      } catch (err: unknown) {
        if (ativo) {
          const mensagem =
            err instanceof Error
              ? err.message
              : "Erro ao carregar o dashboard do professor.";

          setError(mensagem);
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarDashboard();

    return () => {
      ativo = false;
    };
  }, [authLoading, usuario]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-semibold text-[#0D4F97]">
          Carregando painel...
        </p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-semibold text-red-600">
          Usuário não autenticado.
        </p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <Card className="rounded-xl border border-red-200">
          <CardContent className="p-6">
            <p className="font-semibold text-red-600">
              {error || "Não foi possível carregar os dados do dashboard."}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-[#0D4F97] px-4 py-2 font-medium text-white transition hover:bg-[#093b72]"
            >
              Tentar novamente
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalTurmas = dashboard.totalTurmasAtivas ?? 0;
  const totalAlunos = dashboard.totalAlunosAtivos ?? 0;
  const frequenciaMedia = dashboard.frequenciaMedia ?? 0;
  const aulasRealizadas = dashboard.aulasRealizadas ?? 0;
  const alunosFrequenciaBaixa = dashboard.alunosComFrequenciaBaixa ?? 0;
  const totalPresencas = dashboard.totalPresencas ?? 0;
  const totalFaltas = dashboard.totalFaltas ?? 0;

  const dadosFrequencia = [
    { nome: "Presenças", quantidade: totalPresencas, cor: CORES.azul },
    { nome: "Faltas", quantidade: totalFaltas, cor: CORES.vermelho },
  ];

  const dadosComparacao = [
    { nome: "Presenças", quantidade: totalPresencas },
    { nome: "Faltas", quantidade: totalFaltas },
  ];

  const indicadores = [
    {
      titulo: "Turmas ativas",
      valor: formatarNumero(totalTurmas),
      descricao: "Turmas vinculadas a você",
      icone: BookOpen,
    },
    {
      titulo: "Alunos ativos",
      valor: formatarNumero(totalAlunos),
      descricao: "Alunos nas suas turmas",
      icone: Users,
    },
    {
      titulo: "Frequência média",
      valor: `${frequenciaMedia.toLocaleString("pt-BR", {
        maximumFractionDigits: 1,
      })}%`,
      descricao: "Média de frequência dos alunos",
      icone: Activity,
    },
    {
      titulo: "Aulas realizadas",
      valor: formatarNumero(aulasRealizadas),
      descricao: "Aulas das suas turmas",
      icone: CalendarCheck,
    },
    {
      titulo: "Alunos com frequência baixa",
      valor: formatarNumero(alunosFrequenciaBaixa),
      descricao: "Frequência inferior a 75%",
      icone: AlertTriangle,
    },
    {
      titulo: "Presenças registradas",
      valor: formatarNumero(totalPresencas),
      descricao: "Registros de presença",
      icone: CheckCircle2,
    },
    {
      titulo: "Faltas registradas",
      valor: formatarNumero(totalFaltas),
      descricao: "Registros de falta",
      icone: XCircle,
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[#0D4F97] md:text-3xl">
            Painel do Professor
          </h1>
          <p className="mt-2 text-[#222222]">
            Bem-vindo, {dashboard.nome || usuario.email}!
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Confira os indicadores das suas turmas e o acompanhamento dos alunos.
          </p>
        </header>

        <section
          aria-label="Indicadores do professor"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {indicadores.map((indicador) => {
            const Icone = indicador.icone;

            return (
              <Card
                key={indicador.titulo}
                className="rounded-xl border-2 border-[#B2D7EC] shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-600">
                        {indicador.titulo}
                      </p>
                      <p className="mt-3 text-3xl font-bold text-[#0D4F97]">
                        {indicador.valor}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#B2D7EC]/30">
                      <Icone className="h-6 w-6 text-[#0D4F97]" />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    {indicador.descricao}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className="rounded-xl border border-slate-200 shadow-sm">
            <CardContent className="p-5 md:p-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-[#0D4F97]">
                  Distribuição de presenças e faltas
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Comparação dos registros de frequência das suas turmas.
                </p>
              </div>

              <div className="h-72 w-full">
                {totalPresencas + totalFaltas > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosFrequencia}
                        dataKey="quantidade"
                        nameKey="nome"
                        cx="50%"
                        cy="45%"
                        outerRadius={85}
                        paddingAngle={3}
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toLocaleString(
                            "pt-BR",
                            { maximumFractionDigits: 1 }
                          )}%`
                        }
                      >
                        {dadosFrequencia.map((item) => (
                          <Cell key={item.nome} fill={item.cor} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          formatarNumero(Number(value)),
                          "Registros",
                        ]}
                      />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm text-slate-500">
                    Ainda não há registros de frequência para exibir.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-slate-200 shadow-sm">
            <CardContent className="p-5 md:p-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-[#0D4F97]">
                  Comparativo de frequência
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Quantidade de presenças e faltas registradas.
                </p>
              </div>

              <div className="h-72 w-full">
                {totalPresencas + totalFaltas > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dadosComparacao}
                      margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value) => [
                          formatarNumero(Number(value)),
                          "Registros",
                        ]}
                      />
                      <Bar
                        dataKey="quantidade"
                        name="Registros"
                        radius={[6, 6, 0, 0]}
                      >
                        {dadosComparacao.map((item) => (
                          <Cell
                            key={item.nome}
                            fill={
                              item.nome === "Presenças"
                                ? CORES.azul
                                : CORES.vermelho
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm text-slate-500">
                    Ainda não há registros de frequência para comparar.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Card className="rounded-xl border border-[#B2D7EC] bg-[#B2D7EC]/10 shadow-sm">
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-[#0D4F97]">
                  Atenção à frequência dos alunos
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Alunos com frequência abaixo de 75% precisam de acompanhamento.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-7 w-7 text-amber-600" />
                <span className="text-2xl font-bold text-[#0D4F97]">
                  {formatarNumero(alunosFrequenciaBaixa)}
                </span>
                <span className="text-sm text-slate-600">
                  {alunosFrequenciaBaixa === 1
                    ? "aluno"
                    : "alunos"}
                </span>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
