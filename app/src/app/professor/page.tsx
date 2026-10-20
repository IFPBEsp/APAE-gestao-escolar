
'use client';

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Users,
  XCircle,
  BarChart3,
  ClipboardList,
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

interface TooltipPersonalizadoProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
    payload?: {
      nome?: string;
      quantidade?: number;
      cor?: string;
      name?: string;
      value?: number;
      color?: string;
    };
  }>;
  label?: string;
}

const CORES = {
  azul: "#0D4F97",
  azulClaro: "#B2D7EC",
  vermelho: "#DC2626",
  cinza: "#64748B",
  fundo: "#F1F5F9",
};

function formatarNumero(valor: number) {
  return valor.toLocaleString("pt-BR");
}

function formatarPercentual(valor: number) {
  return valor.toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  });
}

function TooltipPersonalizado({
  active,
  payload,
  label,
}: TooltipPersonalizadoProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      {label && (
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>
      )}

      <div className="space-y-2">
        {payload.map((item, index) => {
          const nome =
            item.payload?.nome ??
            item.payload?.name ??
            item.name ??
            "Registros";

          const cor =
            item.payload?.cor ??
            item.payload?.color ??
            item.color ??
            CORES.azul;

          return (
            <div
              key={`${nome}-${index}`}
              className="flex items-center justify-between gap-5"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: cor }}
                />
                <span className="text-sm text-slate-600">{nome}</span>
              </div>

              <span className="text-sm font-bold text-[#0D4F97]">
                {formatarNumero(Number(item.value ?? 0))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EstadoVazio({
  mensagem,
  detalhe,
}: {
  mensagem: string;
  detalhe: string;
}) {
  return (
    <div className="flex h-full min-h-56 flex-col items-center justify-center px-5 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B2D7EC]/25">
        <ClipboardList className="h-7 w-7 text-[#0D4F97]" />
      </div>

      <p className="font-semibold text-slate-700">{mensagem}</p>

      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
        {detalhe}
      </p>
    </div>
  );
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
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#B2D7EC] border-t-[#0D4F97]" />
          <p className="font-semibold text-[#0D4F97]">
            Carregando painel...
          </p>
        </div>
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
        <Card className="rounded-2xl border-2 border-red-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />

              <div>
                <p className="font-semibold text-red-600">
                  {error || "Não foi possível carregar os dados do dashboard."}
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-lg bg-[#0D4F97] px-4 py-2 font-medium text-white transition-colors hover:bg-[#093b72] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D4F97] focus-visible:ring-offset-2"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
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

  const frequenciaSegura = Math.min(100, Math.max(0, frequenciaMedia));
  const totalRegistros = totalPresencas + totalFaltas;
  const possuiRegistros = totalRegistros > 0;

  const dadosFrequencia = [
    {
      nome: "Presenças",
      quantidade: totalPresencas,
      cor: CORES.azul,
    },
    {
      nome: "Faltas",
      quantidade: totalFaltas,
      cor: CORES.vermelho,
    },
  ];

  const dadosComparacao = [
    {
      nome: "Presenças",
      quantidade: totalPresencas,
      cor: CORES.azul,
    },
    {
      nome: "Faltas",
      quantidade: totalFaltas,
      cor: CORES.vermelho,
    },
  ];

  const dadosFrequenciaMedia = [
    {
      nome: "Frequência média",
      quantidade: frequenciaSegura,
      cor: CORES.azul,
    },
    {
      nome: "Restante",
      quantidade: 100 - frequenciaSegura,
      cor: CORES.fundo,
    },
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
      valor: `${formatarPercentual(frequenciaMedia)}%`,
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
    <main className="min-h-screen bg-slate-50/60 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B2D7EC]/30 text-[#0D4F97]">
              <Activity className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-[#0D4F97] md:text-3xl">
                Painel do Professor
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Acompanhamento de turmas e frequência escolar
              </p>
            </div>
          </div>

          <p className="mt-4 text-[#222222]">
            Bem-vindo, {dashboard.nome || usuario.email}!
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Confira os indicadores das suas turmas e o acompanhamento dos alunos.
          </p>
        </header>

        <section
          aria-label="Indicadores do professor"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {indicadores.map((indicador) => {
            const Icone = indicador.icone;

            return (
              <Card
                key={indicador.titulo}
                className="rounded-2xl border-2 border-[#B2D7EC] bg-white shadow-sm transition-all duration-200 hover:border-[#0D4F97] hover:shadow-md"
              >
                <CardContent className="p-6 pt-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-bold uppercase tracking-wide text-[#0D4F97]">
                      {indicador.titulo}
                    </p>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/25 text-[#0D4F97] transition-transform duration-200 hover:scale-105">
                      <Icone className="h-5 w-5" strokeWidth={2.5} />
                    </div>
                  </div>

                  <p className="text-3xl font-extrabold text-[#0D4F97]">
                    {indicador.valor}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-slate-500">
                    {indicador.descricao}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section
          aria-label="Gráficos de frequência"
          className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2"
        >
          <Card className="rounded-2xl border-2 border-[#B2D7EC] bg-white shadow-sm transition-all duration-200 hover:border-[#0D4F97] hover:shadow-md">
            <CardContent className="p-6 pt-6">
              <div className="mb-5 flex items-start gap-3 border-b border-[#B2D7EC]/40 pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B2D7EC]/25 text-[#0D4F97]">
                  <Activity className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-[#0D4F97]">
                    Frequência média
                  </h2>

                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    Percentual médio de frequência dos alunos.
                  </p>
                </div>
              </div>

              <div className="relative h-64 w-full">
                {totalAlunos > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosFrequenciaMedia}
                          dataKey="quantidade"
                          nameKey="nome"
                          cx="50%"
                          cy="48%"
                          innerRadius={70}
                          outerRadius={95}
                          paddingAngle={2}
                          stroke="none"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {dadosFrequenciaMedia.map((item) => (
                            <Cell key={item.nome} fill={item.cor} />
                          ))}
                        </Pie>

                        <Tooltip
                          content={<TooltipPersonalizado />}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-[#0D4F97]">
                        {formatarPercentual(frequenciaMedia)}%
                      </span>

                      <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Frequência
                      </span>
                    </div>
                  </>
                ) : (
                  <EstadoVazio
                    mensagem="Sem dados de frequência"
                    detalhe="Ainda não há alunos ativos para calcular a frequência média."
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 border-[#B2D7EC] bg-white shadow-sm transition-all duration-200 hover:border-[#0D4F97] hover:shadow-md">
            <CardContent className="p-6 pt-6">
              <div className="mb-5 flex items-start gap-3 border-b border-[#B2D7EC]/40 pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B2D7EC]/25 text-[#0D4F97]">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-[#0D4F97]">
                    Distribuição de presenças e faltas
                  </h2>

                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    Proporção dos registros de frequência das suas turmas.
                  </p>
                </div>
              </div>

              <div className="h-72 w-full">
                {possuiRegistros ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosFrequencia}
                        dataKey="quantidade"
                        nameKey="nome"
                        cx="50%"
                        cy="45%"
                        outerRadius={90}
                        innerRadius={48}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {dadosFrequencia.map((item) => (
                          <Cell key={item.nome} fill={item.cor} />
                        ))}
                      </Pie>

                      <Tooltip content={<TooltipPersonalizado />} />

                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        formatter={(value) => (
                          <span className="text-sm font-medium text-slate-600">
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EstadoVazio
                    mensagem="Nenhuma frequência registrada"
                    detalhe="Quando houver registros de presença ou falta, a distribuição será exibida aqui."
                  />
                )}
              </div>

              {possuiRegistros && (
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#B2D7EC]/20 p-3">
                    <p className="text-xs font-semibold text-slate-500">
                      Presenças
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-[#0D4F97]">
                      {formatarNumero(totalPresencas)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 p-3">
                    <p className="text-xs font-semibold text-slate-500">
                      Faltas
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-red-600">
                      {formatarNumero(totalFaltas)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 border-[#B2D7EC] bg-white shadow-sm transition-all duration-200 hover:border-[#0D4F97] hover:shadow-md">
            <CardContent className="p-6 pt-6">
              <div className="mb-5 flex items-start gap-3 border-b border-[#B2D7EC]/40 pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B2D7EC]/25 text-[#0D4F97]">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-[#0D4F97]">
                    Comparativo de frequência
                  </h2>

                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    Quantidade de presenças e faltas registradas.
                  </p>
                </div>
              </div>

              <div className="h-72 w-full">
                {possuiRegistros ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dadosComparacao}
                      margin={{ top: 10, right: 12, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E2E8F0"
                      />

                      <XAxis
                        dataKey="nome"
                        tick={{ fontSize: 12, fill: CORES.cinza }}
                        axisLine={{ stroke: "#CBD5E1" }}
                        tickLine={false}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: CORES.cinza }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip content={<TooltipPersonalizado />} />

                      <Bar
                        dataKey="quantidade"
                        name="Registros"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={72}
                      >
                        {dadosComparacao.map((item) => (
                          <Cell key={item.nome} fill={item.cor} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EstadoVazio
                    mensagem="Sem dados para comparar"
                    detalhe="O gráfico será preenchido assim que forem registradas presenças ou faltas."
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Card className="rounded-2xl border-2 border-[#B2D7EC] bg-white shadow-sm transition-all duration-200 hover:border-[#0D4F97] hover:shadow-md">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="font-bold text-[#0D4F97]">
                    Atenção à frequência dos alunos
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
                    Alunos com frequência abaixo de 75% precisam de acompanhamento.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 rounded-xl bg-[#B2D7EC]/20 px-5 py-3">
                <span className="text-3xl font-extrabold text-[#0D4F97]">
                  {formatarNumero(alunosFrequenciaBaixa)}
                </span>

                <span className="text-sm font-medium text-slate-600">
                  {alunosFrequenciaBaixa === 1 ? "aluno" : "alunos"}
                </span>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
