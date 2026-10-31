"use client";

import { useState, useEffect } from "react";
import { GraduationCap, ArrowRight, UserPlus, Search, Shield, ChevronRight, Activity, BookOpen, BarChart2, Users2, Users, School } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { listarAlunos } from "@/services/AlunoService";
import { listarTurmas } from "@/services/TurmaService";
import { listarProfessores } from "@/services/ProfessorService";
import { contarAulasRealizadas, getEstatisticasTurma } from "@/services/ChamadaService";
import type { TurmaResumo } from "@/types/turma";


export interface TurmasData {
  ativas: number;
  total: number;
  ocupacao: number;
  capacidadeTotal: number;
}

export interface GraficoMetas {
  dadas: number;
  restantes: number;
}

export interface FatiaGrafico {
  name: string;
  value: number;
  color: string;
}

export type TurmaLotacao = TurmaResumo & {
  capacidade: number;
  ocupacao: number;
};

export default function AdminHomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [totalAlunos, setTotalAlunos] = useState<number | string>("--");
  const [totalProfessores, setTotalProfessores] = useState<number | string>("--");
  
  const [turmasData, setTurmasData] = useState<TurmasData>({ ativas: 0, total: 0, ocupacao: 0, capacidadeTotal: 0 });
  const [ultimosAlunos, setUltimosAlunos] = useState<any[]>([]);
  const [topTurmas, setTopTurmas] = useState<TurmaLotacao[]>([]);

  const [localSearchActive, setLocalSearchActive] = useState(false);
  const [localSearchResults, setLocalSearchResults] = useState<any[]>([]);
  const [localSearchLoading, setLocalSearchLoading] = useState(false);
  const [selectedLocalAluno, setSelectedLocalAluno] = useState<any | null>(null);

  const [frequenciaMediaGlobal, setFrequenciaMediaGlobal] = useState<number>(0);
  const [graficoMetas, setGraficoMetas] = useState<GraficoMetas>({ dadas: 0, restantes: 200 });

  useEffect(() => {
    async function carregarInteligencia() {
      setLoading(true);
      
      try {
        const resAlunos = await listarAlunos("");
        const alunosList = Array.isArray(resAlunos) ? resAlunos : (resAlunos?.content || []);
        
        const recentActivities = [...alunosList].sort((a: any, b: any) => {
           const timeA = a.dataUltimaAvaliacao ? new Date(a.dataUltimaAvaliacao).getTime() : 0;
           const timeB = b.dataUltimaAvaliacao ? new Date(b.dataUltimaAvaliacao).getTime() : 0;
           return timeB - timeA;
        });

        setUltimosAlunos(recentActivities.slice(0, 5));
        setTotalAlunos(resAlunos?.totalElements || alunosList.length || 0);

      } catch (e) {
        console.error("Erro ao puxar alunos", e);
      }

      try {
        const resTurmas = await listarTurmas();
        const turmasList = Array.isArray(resTurmas) ? resTurmas : (resTurmas?.content || []);
        
        let ocupacaoTotal = 0;
        let ativasCount = 0;
        let cTotal = 0;
        
        let sumPorcentagemFreq = 0;
        let countFreqValid = 0;
        let turmasAulasSum = 0; 

        const turmasFormatadas: any[] = [];

        const perTurmaStats = await Promise.all(turmasList.map(async (t: any) => {
           try {
              const [estatisticas, aulasRealizadasData] = await Promise.all([
                 getEstatisticasTurma(t.id),
                 contarAulasRealizadas(t.id),
              ]);
              return { t, estatisticas, aulasRealizadasData };
           } catch {
              return { t, estatisticas: null, aulasRealizadasData: 0 };
           }
        }));

        for (const { t, estatisticas, aulasRealizadasData } of perTurmaStats) {
           const ocup = t.totalAlunosAtivos || 0;
           const capLine = t.capacidade || 15;
           
           if (t.ativa) {
              ativasCount++;
              cTotal += capLine;
              ocupacaoTotal += ocup;
              turmasAulasSum += (aulasRealizadasData || 0);
           }
           
           if (estatisticas && estatisticas.length > 0) {
              const avgFreqTurma = estatisticas.reduce((acc: any, curr: any) => acc + curr.frequencia, 0) / estatisticas.length;
              sumPorcentagemFreq += avgFreqTurma;
              countFreqValid++;
           }
           
           turmasFormatadas.push({
              ...t,
              capacidade: capLine,
              ocupacao: ocup
           });
        }

        setTurmasData({
           ativas: ativasCount,
           total: turmasList.length,
           ocupacao: ocupacaoTotal,
           capacidadeTotal: cTotal
        });

        const sortedTurmas = turmasFormatadas.sort((a: any, b: any) => b.ocupacao - a.ocupacao);
        setTopTurmas(sortedTurmas.slice(0, 4));

        setFrequenciaMediaGlobal(
           countFreqValid > 0 ? Math.round(sumPorcentagemFreq / countFreqValid) : 0
        );

        const mediaAulas = ativasCount > 0 ? Math.round(turmasAulasSum / ativasCount) : 0;
        const META_BRASIL = 200;
        setGraficoMetas({ dadas: mediaAulas, restantes: Math.max(0, META_BRASIL - mediaAulas) });

      } catch (e) {
        console.error("Erro ao puxar turmas", e);
      }

      try {
        const resProfessores: any = await listarProfessores(); 
        const countProf = Array.isArray(resProfessores) ? resProfessores.length : (resProfessores?.totalElements || resProfessores?.content?.length || 0);
        setTotalProfessores(countProf);
      } catch (e) {
        console.error("Erro ao puxar professores", e);
      }
      
      setLoading(false);
    }

    carregarInteligencia();
  }, []);

  const handleSearchCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(searchTerm.trim() !== "") {
      setLocalSearchActive(true);
      setLocalSearchLoading(true);
      setSelectedLocalAluno(null);
      try {
         const found = await listarAlunos(searchTerm);
         const arr = Array.isArray(found) ? found : (found?.content || []);
         setLocalSearchResults(arr);
         
         if(arr.length === 1) {
            abrirPerfilLocal(arr[0]);
         }
      } catch(err) {
         console.warn(err);
         setLocalSearchResults([]);
      } finally {
         setLocalSearchLoading(false);
      }
    } else {
       limparPesquisaLocal();
    }
  }

  const limparPesquisaLocal = () => {
     setSearchTerm("");
     setLocalSearchActive(false);
     setLocalSearchResults([]);
     setSelectedLocalAluno(null);
  }

  const abrirPerfilLocal = async (aluno: any) => {
     setSelectedLocalAluno({...aluno, isMetricsLoading: true});
     try {
       // Lazy require service para não dar ciclico na page
       const frequenciaService = await import("@/services/FrequenciaService");
       const historico = await frequenciaService.getHistoricoIndividualAluno(aluno.id);
       
       let frequenciaCalc = 0;
       if (historico && historico.length > 0) {
          const presentes = historico.filter((h:any) => h.status === 'Presente').length;
          frequenciaCalc = Math.round((presentes / historico.length) * 100);
       }
       setSelectedLocalAluno((prev: any) => {
          if (!prev || prev.id !== aluno.id) return prev;
          return {...prev, isMetricsLoading: false, freqHistorico: historico, frequenciaVal: historico.length > 0 ? frequenciaCalc : null};
       });
     } catch(err) {
       setSelectedLocalAluno((prev: any) => {
          if (!prev || prev.id !== aluno.id) return prev;
          return {...prev, isMetricsLoading: false, freqHistorico: [], frequenciaVal: null};
       });
     }
  }

  const freqData: FatiaGrafico[] = [
     { name: "Presenças", value: frequenciaMediaGlobal, color: "#0D4F97" },
     { name: "Faltas Médias", value: 100 - frequenciaMediaGlobal, color: "#F1F5F9" }
  ];

  const letivosData: FatiaGrafico[] = [
     { name: "Lecionadas (Média)", value: graficoMetas.dadas, color: "#0D4F97" },
     { name: "Restantes na Meta", value: graficoMetas.restantes, color: "#E8F3FF" }
  ];
  
  const vagasHeroData = [
    { name: "Alunos Ativos", value: turmasData.ocupacao || 0, color: "#0D4F97" }, 
    { name: "Vagas Totais Livres", value: Math.max(0, (turmasData.capacidadeTotal || 0) - (turmasData.ocupacao || 0)), color: "#B2D7EC" } 
  ];

  return (
    <main className="p-4 md:p-8 w-full max-w-[1400px] mx-auto min-h-screen bg-[#F8FAFC]/50">
      <div className="space-y-8">
        <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#B2D7EC] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2 md:pl-4 space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#0D4F97]" strokeWidth={2} />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#0D4F97] tracking-tight">
                  Painel do Administrador
                </h1>
              </div>
              <p className="text-gray-500 text-sm md:text-base font-medium">
                Pesquise matrículas, turmas ou gerencie o perfil da instituição APAE.
              </p>
            </div>

            <form onSubmit={handleSearchCommit} className="relative group w-full max-w-lg mt-4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#0D4F97]/50 group-focus-within:text-[#0D4F97] transition-colors" />
              </div>
              <input
                type="text"
                className="w-full bg-white border border-[#B2D7EC]/40 text-[#0D4F97] rounded-full pl-12 pr-16 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0D4F97]/30 focus:border-[#0D4F97] focus:shadow-md transition-all text-sm md:text-base font-medium placeholder-[#0D4F97]/40 shadow-sm"
                placeholder="Buscar aluno cadastrado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute inset-y-1.5 right-1.5 bg-[#0D4F97] hover:bg-[#1265BE] text-white rounded-full px-5 flex items-center justify-center transition-colors font-bold shadow-md text-sm"
              >
                Buscar
              </button>
            </form>
          </div>
          
          <div className="hidden md:flex flex-col items-center justify-center w-full md:w-1/3 relative lg:min-h-[220px]">
              {localSearchActive && (
                 <button onClick={limparPesquisaLocal} className="absolute top-0 right-0 text-[#0D4F97]/50 hover:text-rose-500 transition-colors text-[10px] font-bold bg-white px-3 py-1.5 rounded-lg border border-[#B2D7EC]/30 z-10 shadow-sm uppercase tracking-widest">
                   Sair do Raio-X
                 </button>
              )}
              {loading ? (
                 <div className="animate-pulse flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full border-4 border-gray-100 mb-2"></div>
                    <div className="w-32 h-4 rounded bg-gray-100"></div>
                 </div> 
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                   <div className="w-full h-44 relative mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie 
                               data={vagasHeroData} 
                               cx="50%" cy="100%" 
                               startAngle={180} endAngle={0} 
                               innerRadius={85} outerRadius={100} 
                               paddingAngle={3}
                               cornerRadius={5}
                               dataKey="value" stroke="none"
                            >
                               {vagasHeroData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} Ocupadas`, 'Vagas']} contentStyle={{ borderRadius: '8px', border: 'none', color: '#1F2937', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#1F2937', fontWeight: 'bold' }} cursor={{fill: 'transparent'}} />
                         </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-baseline gap-1 pointer-events-none pb-1">
                         <span className="text-5xl font-black text-[#0D4F97] tracking-tighter">{turmasData.ocupacao}</span>
                      </div>
                   </div>
                   <p className="text-[#0D4F97]/60 font-extrabold uppercase tracking-[0.2em] text-[10px] mt-6 text-center flex items-center justify-center gap-1.5">
                      <Users2 className="w-3.5 h-3.5 text-[#FFD000]" /> Ocupação Atual
                   </p>
                </div>
              )}
          </div>
        </section>

       {localSearchActive ? (
         <LocalSearchPanel
           searchTerm={searchTerm}
           localSearchLoading={localSearchLoading}
           selectedLocalAluno={selectedLocalAluno}
           localSearchResults={localSearchResults}
           abrirPerfilLocal={abrirPerfilLocal}
           limparPesquisaLocal={limparPesquisaLocal}
           router={router}
         />
       ) : (
         <AdminDashboardPanel
           loading={loading}
           turmasData={turmasData}
           totalProfessores={totalProfessores}
           graficoMetas={graficoMetas}
           letivosData={letivosData}
           frequenciaMediaGlobal={frequenciaMediaGlobal}
           freqData={freqData}
           ultimosAlunos={ultimosAlunos}
           topTurmas={topTurmas}
           router={router}
         />
       )}
     </div>
    </main>
  );
}

interface AdminDashboardPanelProps {
  loading: boolean;
  turmasData: TurmasData;
  totalProfessores: number | string;
  graficoMetas: GraficoMetas;
  letivosData: FatiaGrafico[];
  frequenciaMediaGlobal: number;
  freqData: FatiaGrafico[];
  ultimosAlunos: any[];
  topTurmas: TurmaLotacao[];
  router: ReturnType<typeof useRouter>;
}

function AdminDashboardPanel({
  loading,
  turmasData,
  totalProfessores,
  graficoMetas,
  letivosData,
  frequenciaMediaGlobal,
  freqData,
  ultimosAlunos,
  topTurmas,
  router,
}: Readonly<AdminDashboardPanelProps>) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TurmasSummaryCard loading={loading} turmasData={turmasData} />
        <DocenteSummaryCard totalProfessores={totalProfessores} router={router} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DiasLetivosChartCard loading={loading} letivosData={letivosData} graficoMetas={graficoMetas} />
        <FrequenciaChartCard loading={loading} freqData={freqData} frequenciaMediaGlobal={frequenciaMediaGlobal} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <MovimentacoesRecentesCard loading={loading} ultimosAlunos={ultimosAlunos} router={router} />
        </div>

        <LotacaoPanelCard loading={loading} topTurmas={topTurmas} router={router} />
      </section>
    </div>
  );
}

interface TurmasSummaryCardProps {
  loading: boolean;
  turmasData: TurmasData;
}

function TurmasSummaryCard({ loading, turmasData }: Readonly<TurmasSummaryCardProps>) {
  return (
    <Card className="rounded-2xl border-2 border-[#B2D7EC] shadow-sm hover:shadow-md transition-shadow bg-white hover:border-[#0D4F97]">
      <CardContent className="p-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[#0D4F97] font-bold text-sm uppercase tracking-wide">Painel de Turmas</p>
          <div className="w-10 h-10 rounded-full bg-[#B2D7EC]/20 flex items-center justify-center text-[#0D4F97]">
            <School className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-[#0D4F97]">{loading ? "--" : turmasData.ativas}</span>
          <span className="text-[#0D4F97]/60 text-xs font-semibold bg-[#B2D7EC]/20 px-2 py-1 rounded-md">Ativas de {loading ? "--" : turmasData.total}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface DocenteSummaryCardProps {
  totalProfessores: number | string;
  router: ReturnType<typeof useRouter>;
}

function DocenteSummaryCard({ totalProfessores, router }: Readonly<DocenteSummaryCardProps>) {
  return (
    <Card className="rounded-2xl border-2 border-[#B2D7EC] shadow-sm hover:shadow-md hover:border-[#0D4F97] transition-all bg-white cursor-pointer group" onClick={() => router.push("/admin/professores")}>
      <CardContent className="p-6 pt-6 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[#0D4F97] font-bold text-sm uppercase tracking-wide">Corpo Docente</p>
          <div className="w-10 h-10 rounded-full bg-[#B2D7EC]/20 flex items-center justify-center text-[#0D4F97] transition-transform group-hover:scale-110">
            <Users className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0D4F97]">{totalProfessores}</span>
            <span className="text-[#0D4F97]/60 text-xs font-semibold bg-[#B2D7EC]/20 px-2 py-1 rounded-md">Professores</span>
          </div>
          <ChevronRight className="text-[#B2D7EC] group-hover:text-[#0D4F97] transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
}

interface DiasLetivosChartCardProps {
  loading: boolean;
  letivosData: FatiaGrafico[];
  graficoMetas: GraficoMetas;
}

function DiasLetivosChartCard({ loading, letivosData, graficoMetas }: Readonly<DiasLetivosChartCardProps>) {
  return (
    <Card className="rounded-2xl shadow-sm border-2 border-[#B2D7EC] bg-white hover:border-[#0D4F97] hover:shadow-md transition-all">
      <CardHeader className="pb-2 border-b border-[#B2D7EC]/20 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-[#0D4F97] uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0D4F97]/60" /> Progresso de Dias Letivos
          </CardTitle>
          <p className="text-xs text-[#0D4F97]/50 mt-1">Comparativo de aulas dadas e a meta de 200 dias</p>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative min-h-[220px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-gray-100 border-t-[#0D4F97] rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={letivosData}
                  cx="50%" cy="80%"
                  startAngle={180} endAngle={0}
                  innerRadius={75} outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {letivosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Aulas`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
              <p className="text-4xl font-extrabold text-[#0D4F97]">{graficoMetas.dadas}</p>
              <p className="text-xs font-bold text-[#0D4F97]/40 uppercase tracking-widest mt-1">/ 200 Dias</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface FrequenciaChartCardProps {
  loading: boolean;
  freqData: FatiaGrafico[];
  frequenciaMediaGlobal: number;
}

function FrequenciaChartCard({ loading, freqData, frequenciaMediaGlobal }: Readonly<FrequenciaChartCardProps>) {
  return (
    <Card className="rounded-2xl shadow-sm border-2 border-[#B2D7EC] bg-white hover:border-[#0D4F97] hover:shadow-md transition-all">
      <CardHeader className="pb-2 border-b border-[#B2D7EC]/20 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-[#0D4F97] uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#0D4F97]/60" /> Frequência Média Escolar
          </CardTitle>
          <p className="text-xs text-[#0D4F97]/50 mt-1">Média percentual de Presenças ativas nas Turmas</p>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative min-h-[220px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-gray-100 border-t-[#0D4F97] rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={freqData}
                  cx="50%" cy="50%"
                  innerRadius={65} outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {freqData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-4xl font-extrabold text-[#0D4F97]">{frequenciaMediaGlobal}%</p>
              <p className="text-xs font-bold text-[#0D4F97]/40 uppercase tracking-widest mt-1">Presença</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface MovimentacoesRecentesCardProps {
  loading: boolean;
  ultimosAlunos: any[];
  router: ReturnType<typeof useRouter>;
}

function MovimentacoesRecentesCard({ loading, ultimosAlunos, router }: Readonly<MovimentacoesRecentesCardProps>) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0D4F97] flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#B2D7EC]" />
          Movimentações Recentes
        </h2>
        <button 
          onClick={() => router.push("/admin/alunos")}
          className="text-sm font-semibold text-[#0D4F97] hover:text-[#1265BE] py-1 transition-colors flex items-center gap-1 group"
        >
          Base Completa <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <Card className="rounded-2xl shadow-sm border-2 border-[#B2D7EC] overflow-hidden bg-white hover:border-[#0D4F97] hover:shadow-md transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#B2D7EC]/30 text-xs font-bold text-[#0D4F97] uppercase tracking-wider bg-[#B2D7EC]/10">
                <th className="px-6 py-4">Nome do Aluno</th>
                <th className="px-6 py-4">Condição / Patologia</th>
                <th className="px-6 py-4">Turma Alocada</th>
                <th className="px-6 py-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B2D7EC]/20">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-4 bg-[#B2D7EC]/20 rounded w-24 animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-[#B2D7EC]/20 rounded w-32 animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-[#B2D7EC]/20 rounded w-20 animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-[#B2D7EC]/20 rounded-md w-16 mx-auto animate-pulse"></div></td>
                  </tr>
                ))
              ) : ultimosAlunos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#0D4F97]/50 font-semibold">Nenhum aluno registrado no banco de dados.</td>
                </tr>
              ) : (
                ultimosAlunos.map((aluno: any) => (
                  <tr key={aluno.id} className="hover:bg-[#B2D7EC]/10 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#0D4F97] text-sm">{aluno.nome}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-[#FFF9C4]/80 text-[#A8720B] border border-[#FFF9C4]">
                        {aluno.deficiencia || "Não categorizada"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-500">
                        {aluno.nomeTurma || "Sem Vínculo"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => router.push(`/admin/alunos/detalhes/${aluno.id}`)}
                        className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold text-white bg-[#0D4F97] hover:bg-[#1265BE] shadow-sm rounded-md transition-colors w-full md:w-auto"
                      >
                        Ficha
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

interface LotacaoPanelCardProps {
  loading: boolean;
  topTurmas: TurmaLotacao[];
  router: ReturnType<typeof useRouter>;
}

function LotacaoPanelCard({ loading, topTurmas, router }: Readonly<LotacaoPanelCardProps>) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#0D4F97] flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-[#B2D7EC]" />
        Painel de Lotação
      </h2>

      <Card className="rounded-2xl shadow-sm border-2 border-[#B2D7EC] bg-white h-[calc(100%-2.75rem)] hover:border-[#0D4F97] hover:shadow-md transition-all">
        <CardHeader className="pb-4 pt-5 border-b border-[#B2D7EC]/30">
          <CardTitle className="text-xs font-bold text-[#0D4F97] uppercase tracking-widest">
            Turmas Mais Preenchidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-5">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-[#B2D7EC]/20 rounded w-full flex-1 animate-pulse"></div>
                <div className="h-2 bg-[#B2D7EC]/10 rounded w-full animate-pulse"></div>
              </div>
            ))
          ) : topTurmas.length === 0 ? (
            <p className="text-sm text-[#0D4F97]/50 text-center py-6 font-semibold">Nenhuma turma estruturada encontrada</p>
          ) : (
            topTurmas.map((turma) => {
              const maxCap = turma.capacidade || 15;
              const oc = turma.ocupacao || 0;
              const percent = Math.min(100, Math.round((oc / maxCap) * 100));

              let barColor = "bg-[#B2D7EC] scale-y-100";
              if (percent > 60) barColor = "bg-[#FFD000] scale-y-110";
              if (percent >= 100) barColor = "bg-[#0D4F97] scale-y-125";

              return (
                <div key={turma.id} className="group cursor-pointer" onClick={() => router.push("/admin/turmas")}>
                  <div className="flex justify-between items-end mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#0D4F97] truncate pr-2 group-hover:text-[#1265BE] transition-colors">
                        {turma.nome}
                      </p>
                      <p className="text-xs font-semibold text-gray-500 truncate mt-0.5">{turma.turno || turma.tipo || "Turma"}</p>
                    </div>
                    <div className="text-right pl-2">
                      <span className="text-sm font-extrabold text-[#0D4F97]">{oc}</span>
                      <span className="text-xs font-bold text-[#B2D7EC] ml-0.5">/{maxCap}</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#B2D7EC]/20 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface LocalSearchPanelProps {
  searchTerm: string;
  localSearchLoading: boolean;
  selectedLocalAluno: any | null;
  localSearchResults: any[];
  abrirPerfilLocal: (aluno: any) => void;
  limparPesquisaLocal: () => void;
  router: ReturnType<typeof useRouter>;
}

function LocalSearchPanel({
  searchTerm,
  localSearchLoading,
  selectedLocalAluno,
  localSearchResults,
  abrirPerfilLocal,
  limparPesquisaLocal,
  router,
}: Readonly<LocalSearchPanelProps>) {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <div>
          <h2 className="text-xl font-extrabold text-[#0D4F97]">Raio-X Módulo do Aluno</h2>
          <p className="text-sm font-semibold text-gray-500">Resultado da busca focada para "{searchTerm}"</p>
        </div>
        <button 
          onClick={limparPesquisaLocal} 
          className="text-xs font-bold text-gray-400 border border-gray-200 bg-white hover:bg-gray-50 hover:text-rose-500 rounded-md px-3 py-1.5 transition-colors"
        >
          Encerrar Pesquisa [X]
        </button>
      </div>

      {localSearchLoading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-[#B2D7EC] border-t-[#0D4F97] rounded-full animate-spin"></div>
        </div>
      ) : selectedLocalAluno ? (
        <SelectedLocalAlunoCard aluno={selectedLocalAluno} router={router} />
      ) : (
        <SearchResultsGrid results={localSearchResults} abrirPerfilLocal={abrirPerfilLocal} searchTerm={searchTerm} />
      )}
    </div>
  );
}

interface SelectedLocalAlunoCardProps {
  aluno: any;
  router: ReturnType<typeof useRouter>;
}

function SelectedLocalAlunoCard({ aluno, router }: Readonly<SelectedLocalAlunoCardProps>) {
  const formatDate = (value: string | null) => {
    if (!value) return "Não Lançado";
    const [y, m, d] = String(value).split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString("pt-BR");
  };

  return (
    <Card className="rounded-3xl border border-[#B2D7EC]/50 bg-white p-2 shadow-sm flex flex-col md:flex-row shadow-lg">
      <div className="w-full md:w-2/3 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#B2D7EC]/20">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0D4F97] text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {aluno.nome?.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#0D4F97]">{aluno.nome}</h3>
              <p className="text-xs font-semibold text-gray-500">
                Responsável Legal: {aluno.nomeResponsavel || "Não Informado"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
            <div className="bg-[#B2D7EC]/10 p-3 rounded-xl border border-[#B2D7EC]/30">
              <span className="text-[10px] font-bold tracking-wider text-[#0D4F97]/60 uppercase block">Turma Presencial</span>
              <span className="text-sm font-extrabold text-[#0D4F97] truncate block">{aluno.nomeTurma || "Sem Turma"}</span>
            </div>
            <div className="bg-[#FFF9C4]/30 p-3 rounded-xl border border-[#FFF9C4]">
              <span className="text-[10px] font-bold tracking-wider text-[#A8720B] uppercase block">Condição Primária</span>
              <span className="text-sm font-extrabold text-[#A8720B] truncate block">{aluno.deficiencia || "Não Declarada"}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase block">Data de Nascimento</span>
              <span className="text-sm font-extrabold text-gray-600 block">{formatDate(aluno.dataNascimento)}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-auto">
          <button 
            onClick={() => router.push(`/admin/alunos/detalhes/${aluno.id}`)}
            className="w-full bg-white hover:bg-[#B2D7EC]/10 text-[#0D4F97] border-2 border-[#0D4F97] font-bold py-2.5 rounded-xl transition-all shadow-sm text-sm"
          >
            Acessar Ficha do Aluno
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/3 p-6 flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl">
        <span className="text-[10px] font-bold tracking-wider text-[#0D4F97]/60 uppercase mb-4">Frequência Pessoal</span>
        <div className="w-32 h-32 relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
          <div className="absolute inset-0 rounded-full border-8 border-[#0D4F97] border-t-transparent animate-in duration-1000"></div>
          <span className="text-3xl font-extrabold text-[#0D4F97]">{aluno.frequenciaGeral || 0}%</span>
        </div>
        <div className="text-center mt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#B2D7EC]/20 text-[#0D4F97]">
            Assiduidade Ativa
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Registrada baseada nas aulas da turma.</p>
        </div>
      </div>
    </Card>
  );
}

interface SearchResultsGridProps {
  results: any[];
  abrirPerfilLocal: (aluno: any) => void;
  searchTerm: string;
}

function SearchResultsGrid({ results, abrirPerfilLocal, searchTerm }: Readonly<SearchResultsGridProps>) {
  if (results.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400 font-bold text-lg">Infelizmente, zero resultados encontrados!</p>
          <p className="text-gray-400 text-sm mt-1">Nenhum aluno ativo possui ou contém "{searchTerm}".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {results.map((al: any) => (
        <Card key={al.id} className="cursor-pointer hover:border-[#0D4F97] hover:shadow-md transition-all group" onClick={() => abrirPerfilLocal(al)}>
          <CardContent className="p-5 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-[#B2D7EC]/20 text-[#0D4F97] flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">{al.nome?.charAt(0)}</div>
            <div>
              <p className="font-extrabold text-[#0D4F97] text-sm leading-tight group-hover:text-[#1265BE]">{al.nome}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1 bg-gray-50 rounded px-2 py-0.5 inline-block">{al.nomeTurma || "Nenhuma Turma Designada"}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
