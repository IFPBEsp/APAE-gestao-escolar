"use client";

import { useState, useEffect } from "react";
import { GraduationCap, ArrowRight, UserPlus, Search, Shield, ChevronRight, Activity, BookOpen, BarChart2, Users2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { listarAlunos } from "@/services/AlunoService";
import { listarTurmas } from "@/services/TurmaService";
import { listarProfessores } from "@/services/ProfessorService";
import { contarAulasRealizadas, getEstatisticasTurma } from "@/services/ChamadaService";

export default function AdminHomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [totalAlunos, setTotalAlunos] = useState<number | string>("--");
  const [totalProfessores, setTotalProfessores] = useState<number | string>("--");
  
  const [turmasData, setTurmasData] = useState<{ ativas: number, total: number, ocupacao: number, capacidadeTotal: number }>({ ativas: 0, total: 0, ocupacao: 0, capacidadeTotal: 0 });
  const [ultimosAlunos, setUltimosAlunos] = useState<any[]>([]);
  const [topTurmas, setTopTurmas] = useState<any[]>([]);

  const [localSearchActive, setLocalSearchActive] = useState(false);
  const [localSearchResults, setLocalSearchResults] = useState<any[]>([]);
  const [localSearchLoading, setLocalSearchLoading] = useState(false);
  const [selectedLocalAluno, setSelectedLocalAluno] = useState<any | null>(null);

  const [frequenciaMediaGlobal, setFrequenciaMediaGlobal] = useState<number>(0);
  const [graficoMetas, setGraficoMetas] = useState<{ dadas: number, restantes: number }>({ dadas: 0, restantes: 200 });

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

        for (const t of turmasList) {
           const ocup = t.totalAlunosAtivos || 0;
           ocupacaoTotal += ocup;
           const capLine = t.capacidade || 15;
           
           if (t.isAtiva) {
              ativasCount++;
              cTotal += capLine;
           }
           
           try {
              const estatisticas = await getEstatisticasTurma(t.id);
              if (estatisticas && estatisticas.length > 0) {
                 const avgFreqTurma = estatisticas.reduce((acc: any, curr: any) => acc + curr.frequencia, 0) / estatisticas.length;
                 sumPorcentagemFreq += avgFreqTurma;
                 countFreqValid++;
              }
              
              const aulasRealizadasData = await contarAulasRealizadas(t.id);
              turmasAulasSum += (aulasRealizadasData || 0);

           } catch(err) {
              // Ignore stats for this class if none exist
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

        if (countFreqValid > 0) {
           setFrequenciaMediaGlobal(Math.round(sumPorcentagemFreq / countFreqValid));
        } else {
           setFrequenciaMediaGlobal(100); 
        }

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
       setSelectedLocalAluno((prev: any) => ({...prev, isMetricsLoading: false, freqHistorico: historico, frequenciaVal: historico.length > 0 ? frequenciaCalc : null}));
     } catch(err) {
       setSelectedLocalAluno((prev: any) => ({...prev, isMetricsLoading: false, freqHistorico: [], frequenciaVal: null}));
     }
  }

  const freqData = [
     { name: "Presenças", value: frequenciaMediaGlobal, color: "#10B981" },
     { name: "Faltas Médias", value: 100 - frequenciaMediaGlobal, color: "#F1F5F9" }
  ];

  const letivosData = [
     { name: "Lecionadas (Média)", value: graficoMetas.dadas, color: "#0D4F97" },
     { name: "Restantes na Meta", value: graficoMetas.restantes, color: "#E8F3FF" }
  ];
  
  const vagasHeroData = [
    { name: "Alunos Ativos", value: turmasData.ocupacao || 0, color: "#10B981" }, 
    { name: "Vagas Totais Livres", value: Math.max(0, (turmasData.capacidadeTotal || 0) - (turmasData.ocupacao || 0)), color: "#F1F5F9" } 
  ];

  return (
    <main className="p-4 md:p-8 w-full max-w-[1400px] mx-auto min-h-screen bg-[#F8FAFC]/50">
      <div className="space-y-8">
        <section className="bg-gradient-to-br from-[#E6F0FC] to-[#F4F9FF] rounded-3xl p-6 md:p-8 border border-[#B2D7EC]/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
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
                      <Users2 className="w-3.5 h-3.5 text-[#10B981]" /> Ocupação Atual
                   </p>
                </div>
              )}
          </div>
        </section>

        {!localSearchActive ? (
           <div className="space-y-8 animate-in fade-in duration-500">
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <Card className="rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow bg-emerald-50 hover:border-emerald-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-emerald-800/80 font-bold text-sm uppercase tracking-wide">Painel de Turmas</p>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Activity className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-700">{loading ? "--" : turmasData.ativas}</span>
                <span className="text-emerald-700/60 text-xs font-semibold bg-emerald-100 px-2 py-1 rounded-md">Ativas de {loading ? "--" : turmasData.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-violet-100 shadow-sm hover:shadow-md hover:border-violet-300 transition-all bg-violet-50 cursor-pointer group" onClick={() => router.push('/admin/professores')}>
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <p className="text-violet-800/80 font-bold text-sm uppercase tracking-wide">Corpo Docente</p>
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 transition-transform group-hover:scale-110">
                  <GraduationCap className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-violet-700">{totalProfessores}</span>
                  <span className="text-violet-700/60 text-xs font-semibold bg-violet-100 px-2 py-1 rounded-md">Professores</span>
                </div>
                <ChevronRight className="text-violet-300 group-hover:text-violet-600 transition-colors" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Card className="rounded-2xl shadow-sm border border-[#B2D7EC]/40 bg-[#F8FAFC]/50 hover:shadow-md transition-shadow">
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
                          <Tooltip formatter={(value) => [`${value} Aulas`, '']} />
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

          {/* GRÁFICO 2: FREQUENCIA GLOBAL */}
          <Card className="rounded-2xl shadow-sm border border-[#B2D7EC]/40 bg-[#F8FAFC]/50 hover:shadow-md transition-shadow">
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
                     <div className="w-24 h-24 border-4 border-gray-100 border-t-emerald-500 rounded-full animate-spin"></div>
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
                          <Tooltip formatter={(value) => [`${value}%`, '']} />
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

        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0D4F97] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#B2D7EC]" />
                Movimentações Recentes
              </h2>
              <button 
                onClick={() => router.push('/admin/alunos')}
                className="text-sm font-semibold text-[#0D4F97] hover:text-[#1265BE] py-1 transition-colors flex items-center gap-1 group"
              >
                Base Completa <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <Card className="rounded-2xl shadow-sm border border-[#B2D7EC]/50 overflow-hidden bg-white">
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
                      ultimosAlunos.map((aluno, i) => (
                        <tr key={i} className="hover:bg-[#B2D7EC]/10 transition-colors group">
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
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0D4F97] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#B2D7EC]" />
              Painel de Lotação
            </h2>
            
            <Card className="rounded-2xl shadow-sm border border-[#B2D7EC]/50 bg-white h-[calc(100%-2.75rem)]">
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
                  topTurmas.map((turma, i) => {
                    const maxCap = turma.capacidade || 15;
                    const oc = turma.ocupacao || 0;
                    const percent = Math.min(100, Math.round((oc / maxCap) * 100));
                    
                    let barColor = "bg-emerald-500 scale-y-100";
                    if (percent > 60) barColor = "bg-[#0D4F97] scale-y-110"; 
                    if (percent >= 100) barColor = "bg-red-500 scale-y-125"; 

                    return (
                      <div key={i} className="group cursor-pointer" onClick={() => router.push('/admin/turmas')}>
                        <div className="flex justify-between items-end mb-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-[#0D4F97] truncate pr-2 group-hover:text-[#1265BE] transition-colors">
                               {turma.nome}
                            </p>
                            <p className="text-xs font-semibold text-gray-500 truncate mt-0.5">{turma.professorNome || "Sem Docente"}</p>
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
        </section>
        </div>
        ) : (
           <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                 <div>
                   <h2 className="text-xl font-extrabold text-[#0D4F97]">Raio-X Módulo do Aluno</h2>
                   <p className="text-sm font-semibold text-gray-500">Resultado da busca focada para "{searchTerm}"</p>
                 </div>
                 <button onClick={limparPesquisaLocal} className="text-xs font-bold text-gray-400 border border-gray-200 bg-white hover:bg-gray-50 hover:text-rose-500 rounded-md px-3 py-1.5 transition-colors">Encerrar Pesquisa [X]</button>
              </div>
              
              {localSearchLoading ? (
                 <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-[#B2D7EC] border-t-[#0D4F97] rounded-full animate-spin"></div></div>
              ) : selectedLocalAluno ? (
                 <Card className="rounded-3xl border border-[#B2D7EC]/50 bg-white p-2 shadow-sm flex flex-col md:flex-row shadow-lg">
                     <div className="flex-1 space-y-5 p-6">
                        <div className="flex items-center gap-5 border-b border-gray-100 pb-6">
                           <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0D4F97] to-[#1265BE] shadow-md text-white flex items-center justify-center text-3xl font-extrabold">
                              {selectedLocalAluno.nome?.substring(0,2).toUpperCase()}
                           </div>
                           <div>
                              <h3 className="text-3xl font-extrabold text-[#0D4F97] tracking-tight">{selectedLocalAluno.nome}</h3>
                              <p className="text-sm font-semibold text-gray-400 mt-0.5">Responsável Legal: {selectedLocalAluno.nomeResponsavel || selectedLocalAluno.telefoneResponsavel || "Não Informado"}</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                           <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                              <p className="text-[10px] font-bold text-[#0D4F97]/60 uppercase tracking-widest mb-1">Turma Presencial</p>
                              <p className="text-sm font-extrabold text-gray-800">{selectedLocalAluno.nomeTurma || "Nenhuma Alocação"}</p>
                           </div>
                           <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                              <p className="text-[10px] font-bold text-rose-500/60 uppercase tracking-widest mb-1">Condição Primária</p>
                              <p className="text-sm font-extrabold text-rose-700">{selectedLocalAluno.deficiencia || "Não Declarada"}</p>
                           </div>
                           <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100 hidden lg:block">
                              <p className="text-[10px] font-bold text-[#0D4F97]/60 uppercase tracking-widest mb-1">Data de Nascimento</p>
                              <p className="text-sm font-extrabold text-gray-800">{selectedLocalAluno.dataNascimento ? new Date(selectedLocalAluno.dataNascimento).toLocaleDateString('pt-BR') : "Não Lançado"}</p>
                           </div>
                        </div>
                        <div className="pt-2">
                            <button onClick={() => router.push(`/admin/alunos/detalhes/${selectedLocalAluno.id}`)} className="bg-white border-2 border-[#0D4F97] hover:bg-[#0D4F97] hover:text-white text-[#0D4F97] px-6 py-2.5 rounded-xl font-bold w-full transition-all shadow-sm">
                              Acessar Ficha do Aluno
                            </button>
                        </div>
                     </div>
                     
                     <div className="w-full md:w-[35%] bg-gradient-to-b from-[#F8FAFC] to-white rounded-3xl p-6 border-l border-gray-100 flex flex-col items-center justify-center relative">
                        <div className="flex flex-col items-center justify-center space-y-2">
                           <p className="text-xs font-extrabold text-[#0D4F97]/50 uppercase tracking-widest text-center">Frequência Pessoal</p>
                           {selectedLocalAluno.isMetricsLoading ? (
                              <div className="w-16 h-16 border-4 border-gray-100 border-t-[#0D4F97] rounded-full animate-spin my-4"></div>
                           ) : selectedLocalAluno.frequenciaVal !== null ? (
                              <>
                                <div className="w-40 h-40 relative">
                                   <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                         <Pie data={[
                                           {value: selectedLocalAluno.frequenciaVal, fill: '#10B981'},
                                           {value: 100 - selectedLocalAluno.frequenciaVal, fill: '#F1F5F9'}
                                         ]} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" stroke="none" />
                                      </PieChart>
                                   </ResponsiveContainer>
                                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                                      <span className="text-3xl font-extrabold text-emerald-600">{selectedLocalAluno.frequenciaVal}%</span>
                                   </div>
                                </div>
                                <div className="text-center mt-3 bg-white border border-emerald-100 shadow-sm px-4 py-2 rounded-xl">
                                  <p className="text-xs text-emerald-800 font-bold">Assiduidade Ativa</p>
                                  <p className="text-[10px] text-gray-400 mt-1">Registrada baseada nas aulas da turma.</p>
                                </div>
                              </>
                           ) : (
                              <div className="my-8 text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                 <p className="text-sm font-bold text-gray-500">Métrica Indisponível</p>
                                 <p className="text-xs font-semibold text-gray-400 mt-1">O professor de {selectedLocalAluno.nomeTurma || "sua turma"} ainda não operou diários.</p>
                              </div>
                           )}
                        </div>
                     </div>
                 </Card>
              ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                     {localSearchResults.length === 0 ? (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                           <p className="text-gray-400 font-bold text-lg">Infelizmente, zero resultados encontrados!</p>
                           <p className="text-gray-400 text-sm mt-1">Nenhum aluno ativo possui ou contém "{searchTerm}".</p>
                        </div>
                     ) : (
                        localSearchResults.map(al => (
                           <Card key={al.id} className="cursor-pointer hover:border-[#0D4F97] hover:shadow-md transition-all group" onClick={() => abrirPerfilLocal(al)}>
                              <CardContent className="p-5 flex flex-col items-center gap-3 text-center">
                                  <div className="w-14 h-14 rounded-full bg-[#B2D7EC]/20 text-[#0D4F97] flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">{al.nome?.charAt(0)}</div>
                                  <div>
                                     <p className="font-extrabold text-[#0D4F97] text-sm leading-tight group-hover:text-[#1265BE]">{al.nome}</p>
                                     <p className="text-xs font-semibold text-gray-500 mt-1 bg-gray-50 rounded px-2 py-0.5 inline-block">{al.nomeTurma || "Nenhuma Turma Designada"}</p>
                                  </div>
                              </CardContent>
                           </Card>
                        ))
                     )}
                 </div>
              )}
           </div>
        )}
      </div>
    </main>
  );
}