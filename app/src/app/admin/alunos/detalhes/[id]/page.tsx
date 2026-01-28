'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, BookOpen, Heart, Phone, Eye, PenSquare, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, use } from "react"; 
import ModalEditarAluno from "@/components/alunos/ModalEditarAluno";
import ModalVisualizarAvaliacao from "@/components/alunos/ModalVisualizarAvaliacao";
import ModalVisualizarRelatorio from "@/components/alunos/ModalVisualizarRelatorio";
import { buscarAlunoPorId, buscarAvaliacoesPorAlunoId } from "@/services/AlunoService"; 
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; 
import { buscarRelatorioPorAluno } from "@/services/RelatorioService";


interface AlunoDetailDTO {
    id: number;
    nome: string;
    dataNascimento: string; 
    deficiencia: string;
    nomeResponsavel: string;
    telefoneResponsavel: string;
    nomeTurmaAtual: string | null;
    turnoTurmaAtual: string | null;
}

interface AvaliacaoHistoricoDTO {
    dataAvaliacao: string; 
    professorNome: string;
    turmaNomeCompleto: string;
    descricao: string;
    desenvolvimentoCognitivo: string;
}

interface RelatorioHistoricoDTO {
  createdAt: string;
  professorNome: string;
  turmaNome: string;
  atividades: string;
  habilidades: string;
  estrategias: string;
  recursos: string;
}

export default function DetalhesDoAluno({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params); 
  const alunoId = parseInt(resolvedParams.id);
  
  const [alunoData, setAlunoData] = useState<AlunoDetailDTO | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoHistoricoDTO[]>([]);
  const [relatorios, setRelatorios] = useState<RelatorioHistoricoDTO[]>([]);
  const [loadingAluno, setLoadingAluno] = useState(true);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(true);
  const [loadingRelatorios, setLoadingRelatorios] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState<any>(null); 
  const [selectedRelatorio, setSelectedRelatorio] = useState<any>(null); 

  useEffect(() => {
    async function loadAlunoData() {
        setLoadingAluno(true);
        try {
            if (alunoId) {
                const data = await buscarAlunoPorId(alunoId);
                setAlunoData(data);
            }
        } catch (error) {
            console.error("Erro ao carregar dados do aluno:", error);
        } finally {
            setLoadingAluno(false);
        }
    }
    loadAlunoData();
  }, [alunoId]);

  useEffect(() => {
    async function loadAvaliacoes() {
        setLoadingAvaliacoes(true);
        try {
            if (alunoId) {
                const data = await buscarAvaliacoesPorAlunoId(alunoId);
                setAvaliacoes(data);
            }
        } catch (error) {
            console.error("Erro ao carregar avaliações:", error);
        } finally {
            setLoadingAvaliacoes(false);
        }
    }
    loadAvaliacoes();
  }, [alunoId]);

  useEffect(() => {
    async function loadRelatorios() {
      setLoadingRelatorios(true);
      try {
        if (alunoId) {
          const data = await buscarRelatorioPorAluno(alunoId);
          setRelatorios(data);
        }
      } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
      } finally {
        setLoadingRelatorios(false);
      }
    }
    loadRelatorios();
  }, [alunoId]);

  const turmaCompleta = useMemo(() => {
      if (!alunoData) return "Carregando...";
      if (!alunoData.nomeTurmaAtual) return "Sem Turma Ativa";

      const nome = alunoData.nomeTurmaAtual.trim();
      const turno = alunoData.turnoTurmaAtual?.trim();

      if (turno && nome.toUpperCase().endsWith(turno.toUpperCase())) {
          return nome;
      }
      
      return turno ? `${nome} - ${turno}` : nome;
  }, [alunoData]);

  const calcularIdade = (dataNascimento: string | undefined) => {
    if (!dataNascimento) return 'N/A';
    const birthDate = new Date(dataNascimento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const formatarData = (dataString: string) => {
    if (!dataString || dataString === "N/A") return 'N/A';
    try {
        const cleanDataString = dataString.split('.')[0]; 
        const dataObj = new Date(cleanDataString);
        if (isNaN(dataObj.getTime())) return "Data Inválida";
        return format(dataObj, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
        return "Data Inválida";
    }
  };

  const handleSaveAluno = (alunoAtualizado: AlunoDetailDTO) => {
    setAlunoData(alunoAtualizado);
  };

  if (loadingAluno) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <Loader2 className="h-10 w-10 animate-spin text-[#0D4F97]" />
            <span className="ml-3 text-lg text-[#0D4F97]">Carregando detalhes do aluno...</span>
        </div>
    );
  }

  if (!alunoData) {
    return (
        <div className="p-8 text-center text-red-600">
            Aluno não encontrado ou erro ao carregar dados.
        </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#E5E5E5]">
      {/* Conteúdo - Padronizado com Detalhes da Turma */}
      <div className="p-4 md:p-8 space-y-6">
        
        {/* Cabeçalho de Navegação */}
        <div>
            <Button
                variant="ghost"
                onClick={() => router.push("/admin/alunos")}
                className="text-[#0D4F97] hover:bg-[#E8F3FF] pl-0 gap-2 mb-4"
            >
                <ArrowLeft size={20} />
                Voltar
            </Button>

            <h1 className="text-2xl font-bold text-[#0D4F97]">Detalhes do Aluno</h1>
            <p className="text-gray-500">Visualize e gerencie as informações do aluno</p>
        </div>

        {/* Card principal do Aluno */}
        <Card className="border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="h-12 w-12 bg-[#E8F3FF] rounded-full flex items-center justify-center text-[#0D4F97]">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#0D4F97]">{alunoData.nome}</h2>
                  <p className="text-gray-600 text-sm md:text-lg">{calcularIdade(alunoData.dataNascimento)} anos</p>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => setIsEditModalOpen(true)}
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <PenSquare size={16} />
                Editar Aluno
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-8 gap-x-12 mt-6 md:mt-10">
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Data de Nascimento</p>
                  <p className="text-[#0D4F97] font-medium">{formatarData(alunoData.dataNascimento)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Turma Atual</p>
                  <p className="text-[#0D4F97] font-medium">{turmaCompleta}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <Heart size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Deficiência</p>
                  <p className="text-[#0D4F97] font-medium">{alunoData.deficiencia}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Responsável</p>
                  <p className="text-[#0D4F97] font-medium">{alunoData.nomeResponsavel}</p>
                  <p className="text-gray-500 text-sm">{alunoData.telefoneResponsavel}</p>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Histórico de Avaliações */}
        <Card className="border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4 md:p-8">
            <h2 className="text-xl font-bold text-[#0D4F97] mb-2">Histórico de Avaliações</h2>
            <p className="text-gray-500 mb-6">Avaliações realizadas pelos professores ({avaliacoes.length} registros)</p>

            {loadingAvaliacoes ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0D4F97]" />
                </div>
            ) : avaliacoes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Nenhuma avaliação encontrada para este aluno.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-3 pr-3 font-semibold text-[#0D4F97] w-[120px]">Data</th>
                                <th className="pb-3 pr-3 font-semibold text-[#0D4F97] w-[150px]">Professor</th>
                                <th className="pb-3 pr-3 font-semibold text-[#0D4F97] w-[180px]">Turma</th>
                                <th className="pb-3 pr-3 font-semibold text-[#0D4F97]">Descrição</th>
                                <th className="pb-3 font-semibold text-[#0D4F97] w-[80px]">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {avaliacoes.map((avaliacao: any, index: number) => (
                            <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 font-medium text-gray-900 pr-3">{formatarData(avaliacao.dataAvaliacao)}</td> 
                                <td className="py-4 pr-3">{avaliacao.professorNome}</td>
                                <td className="py-4 pr-3">{avaliacao.turmaNomeCompleto}</td>
                                <td className="py-4 pr-3 truncate max-w-[200px]" title={avaliacao.descricao}>{avaliacao.descricao}</td>
                                <td className="py-4">
                                <Eye
                                    className="h-5 w-5 text-gray-400 cursor-pointer hover:text-[#0D4F97]"
                                    onClick={() => setSelectedAvaliacao(avaliacao)}
                                />
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Histórico de Relatórios */}
        <Card className="border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden mt-8">
          <CardContent className="p-4 md:p-8">
            <h2 className="text-xl font-bold text-[#0D4F97] mb-2">Histórico de Relatórios</h2>
            <p className="text-gray-500 mb-6">Relatórios pedagógicos registrados ({relatorios.length} registros)</p>

            {loadingRelatorios ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-[#0D4F97]" />
              </div>
            ) : relatorios.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Nenhum relatório encontrado para este aluno.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 pr-3 font-semibold text-[#0D4F97] w-[120px]">Data</th>
                      <th className="pb-3 pr-3 font-semibold text-[#0D4F97] w-[150px]">Professor</th>
                      <th className="pb-3 pr-3 font-semibold text-[#0D4F97] w-[180px]">Turma</th>
                      <th className="pb-3 pr-3 font-semibold text-[#0D4F97]">Atividades</th>
                      <th className="pb-3 font-semibold text-[#0D4F97] w-[80px]">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    {relatorios.map((relatorio, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-medium text-gray-900 pr-3">{formatarData(relatorio.createdAt)}</td>
                        <td className="py-4 pr-3">{relatorio.professorNome}</td>
                        <td className="py-4 pr-3">{relatorio.turmaNome || "Sem Turma"}</td>
                        <td className="py-4 pr-3 truncate max-w-[220px]" title={relatorio.atividades}>{relatorio.atividades}</td>
                        <td className="py-4">
                          <Eye
                            className="h-5 w-5 text-gray-400 cursor-pointer hover:text-[#0D4F97]"
                            onClick={() => setSelectedRelatorio(relatorio)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modais */}
        <ModalEditarAluno
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          aluno={alunoData}
          onSave={handleSaveAluno}
        />

        <ModalVisualizarAvaliacao
          isOpen={!!selectedAvaliacao}
          onClose={() => setSelectedAvaliacao(null)}
          avaliacao={selectedAvaliacao}
          alunoNome={alunoData.nome}
        />

        <ModalVisualizarRelatorio
          isOpen={!!selectedRelatorio}
          onClose={() => setSelectedRelatorio(null)}
          relatorio={selectedRelatorio}
          alunoNome={alunoData.nome}
          alunoDataNascimento={alunoData.dataNascimento}
        />
      </div>
    </div>
  );
}