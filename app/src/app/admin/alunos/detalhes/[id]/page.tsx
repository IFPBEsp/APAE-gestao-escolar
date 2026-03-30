'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, BookOpen, Heart, Phone, Eye, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, use } from "react"; 
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
    <div className="w-full min-h-screen bg-[#F4F6FB]">
      <div className="p-4 md:p-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0D4F97] mb-2">
              Detalhes do Aluno
            </h1>
            <p className="text-[#222222]">
              Visualize e gerencie as informações do aluno
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/alunos")}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar
          </Button>
        </div>

        {/* CARD PRINCIPAL ÚNICO */}
        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
          <CardContent className="p-8">

            {/* DADOS DO ALUNO */}
            <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-3 w-full">
                <div className="h-10 w-10 bg-[#E8F3FF] rounded-full flex items-center justify-center text-[#0D4F97] shrink-0">
                  <User className="h-6 w-6 text-[#0D4F97]" />
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-[#0D4F97] truncate">
                    {alunoData.nome}
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    {calcularIdade(alunoData.dataNascimento)} anos
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-6 md:mt-10">
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <Calendar size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1 truncate">Data de Nascimento</p>
                  <p className="text-[#0D4F97] font-medium break-words">{formatarData(alunoData.dataNascimento)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <BookOpen size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1 truncate">Turma Atual</p>
                  <p className="text-[#0D4F97] font-medium break-words">{turmaCompleta}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <Heart size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1 truncate">Deficiência</p>
                  <p className="text-[#0D4F97] font-medium break-words">{alunoData.deficiencia}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#E8F3FF] rounded-md text-[#0D4F97]">
                    <Phone size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1 truncate">Responsável</p>
                  <p className="text-[#0D4F97] font-medium break-words">{alunoData.nomeResponsavel}</p>
                  <p className="text-gray-500 text-sm break-words">{alunoData.telefoneResponsavel}</p>
                </div>
              </div>

            </div>

            {/* HISTÓRICO DE AVALIAÇÕES */}
            <div className="mt-10 border-t-8 border-[#E2E8F0] pt-8">

              <h2 className="text-xl font-bold text-[#0D4F97] mb-2">
                Histórico de Avaliações
              </h2>

              <p className="text-gray-500 mb-6">
                Avaliações realizadas pelos professores ({avaliacoes.length} registros)
              </p>

              {loadingAvaliacoes ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-[#0D4F97]" />
                </div>

              ) : avaliacoes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  Nenhuma avaliação encontrada para este aluno.
                </p>

              ) : (
                <div className="overflow-x-auto max-h-80 overflow-y-auto border-2 border-[#B2D7EC] rounded-lg">

                  <Table className="w-full table-fixed">
                      {/* Ordem das colunas: Data, Professor, Turma, Descrição, Ações*/}
                    <colgroup>
                      <col style={{ width: '130px' }} /> 
                      <col style={{ width: '160px' }} /> 
                      <col style={{ width: '200px' }} /> 
                      <col style={{ width: '300px' }} /> 
                      <col style={{ width: '70px' }} /> 
                    </colgroup>

                    <TableHeader className="sticky top-0 z-20 bg-[#EAF4FB]">
                      <TableRow className="bg-[#EAF4FB] hover:bg-[#EAF4FB]">

                        <TableHead className="text-[#0D4F97] font-semibold px-4 sm:px-6">
                          Data
                        </TableHead>

                        <TableHead className="text-[#0D4F97] font-semibold px-4 sm:px-6">
                          Professor
                        </TableHead>

                        <TableHead className="text-[#0D4F97] font-semibold px-4 sm:px-6">
                          Turma
                        </TableHead>

                        <TableHead className="text-[#0D4F97] font-semibold px-4 sm:px-6">
                          Descrição
                        </TableHead>

                        <TableHead className="sticky right-0 z-10 bg-[#EAF4FB] text-[#0D4F97] font-semibold text-center shadow-[-4px_0_8px_rgba(0,0,0,0.08)]">
                          Ações
                        </TableHead>

                      </TableRow>
                    </TableHeader>

                    <TableBody className="text-gray-600">
                      {avaliacoes.map((avaliacao: any, index: number) => (
                        <TableRow key={index}>

                          <TableCell className="font-medium text-gray-900 truncate px-4 sm:px-6">
                            {formatarData(avaliacao.dataAvaliacao)}
                          </TableCell>

                          <TableCell className="truncate px-4 sm:px-6">
                            {avaliacao.professorNome}
                          </TableCell>

                          <TableCell className="truncate px-4 sm:px-6">
                            {avaliacao.turmaNomeCompleto}
                          </TableCell>

                          <TableCell
                            className="truncate px-4 sm:px-6"
                            title={avaliacao.descricao}
                          >
                            {avaliacao.descricao}
                          </TableCell>

                          <TableCell className="sticky right-0 z-10 bg-white group-hover:bg-[#B2D7EC]/10 text-center shadow-[-4px_0_8px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center justify-center h-full">
                              <Eye
                                className="h-5 w-5 cursor-pointer hover:text-[#0D4F97] transition-colors"
                                onClick={() => setSelectedAvaliacao(avaliacao)}
                              />
                            </div>
                          </TableCell>

                        </TableRow>
                      ))}
                    </TableBody>

                  </Table>
                </div>
              )}
            </div>

            {/* HISTÓRICO DE RELATÓRIOS */}
            <div className="mt-10 border-t-8 border-[#E2E8F0] pt-8">
              <h2 className="text-xl font-bold text-[#0D4F97] mb-2">
                Histórico de Relatórios
              </h2>

              <p className="text-gray-500 mb-6">
                Relatórios pedagógicos registrados ({relatorios.length} registros).
              </p>

            {loadingRelatorios ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-[#0D4F97]" />
              </div>

            ) : relatorios.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Nenhum relatório encontrado para este aluno.
              </p>

            ) : (
              <div className="overflow-x-auto max-h-80 overflow-y-auto border-2 border-[#B2D7EC] rounded-lg">

                <Table className="w-full table-fixed">
                  {/* Ordem das colunas: Data, Professor, Turma, Atividades, Habilidades, Estratégias, Recursos, Ações*/}
                  <colgroup>
                    <col style={{ width: '130px' }} /> 
                    <col style={{ width: '160px' }} /> 
                    <col style={{ width: '200px' }} /> 
                    <col style={{ width: '220px' }} /> 
                    <col style={{ width: '220px' }} /> 
                    <col style={{ width: '220px' }} /> 
                    <col style={{ width: '220px' }} /> 
                    <col style={{ width: '70px' }} /> 
                  </colgroup>

                  <TableHeader className="sticky top-0 z-20 bg-[#EAF4FB]">
                    <TableRow className="bg-[#EAF4FB] hover:bg-[#EAF4FB]">

                      <TableHead className="text-[#0D4F97] font-semibold px-4 sm:px-6 truncate">
                        Data
                      </TableHead>

                      <TableHead className="text-[#0D4F97] font-semibold px-4 sm:px-6 truncate">
                        Professor
                      </TableHead>

                      <TableHead className="text-[#0D4F97] font-semibold px-4 sm:px-6 truncate">
                        Turma
                      </TableHead>

                      <TableHead className="text-[#0D4F97] font-semibold px-4 sm:px-6 truncate">
                        Atividades
                      </TableHead>

                      <TableHead className="text-[#0D4F97] font-semibold px-4 sm:px-6 truncate">
                        Habilidades
                      </TableHead>

                      <TableHead className="text-[#0D4F97] font-semibold px-4 sm:px-6 truncate">
                        Estratégias
                      </TableHead>

                      <TableHead className="text-[#0D4F97] font-semibold px-4 sm:px-6 truncate">
                        Recursos
                      </TableHead>

                      <TableHead className="sticky right-0 z-10 bg-[#EAF4FB] text-[#0D4F97] font-semibold text-center shadow-[-4px_0_8px_rgba(0,0,0,0.08)]">
                        Ações
                      </TableHead>

                    </TableRow>
                  </TableHeader>

                  <TableBody className="text-gray-600">
                    {relatorios.map((relatorio: any, index: number) => (
                      <TableRow key={index}>

                        <TableCell
                          className="font-medium text-gray-900 truncate px-4 sm:px-6"
                          title={formatarData(relatorio.createdAt)}
                        >
                          {formatarData(relatorio.createdAt)}
                        </TableCell>

                        <TableCell
                          className="truncate px-4 sm:px-6"
                          title={relatorio.professorNome}
                        >
                          {relatorio.professorNome}
                        </TableCell>

                        <TableCell
                          className="truncate px-4 sm:px-6"
                          title={relatorio.turmaNome || "Sem Turma"}
                        >
                          {relatorio.turmaNome || "Sem Turma"}
                        </TableCell>

                        <TableCell
                          className="truncate px-4 sm:px-6"
                          title={relatorio.atividades}
                        >
                          {relatorio.atividades}
                        </TableCell>

                        <TableCell
                          className="truncate px-4 sm:px-6"
                          title={relatorio.habilidades}
                        >
                          {relatorio.habilidades}
                        </TableCell>

                        <TableCell
                          className="truncate px-4 sm:px-6"
                          title={relatorio.estrategias}
                        >
                          {relatorio.estrategias}
                        </TableCell>

                        <TableCell
                          className="truncate px-4 sm:px-6"
                          title={relatorio.recursos}
                        >
                          {relatorio.recursos}
                        </TableCell>

                        <TableCell className="sticky right-0 z-10 bg-white group-hover:bg-[#B2D7EC]/10 text-center shadow-[-4px_0_8px_rgba(0,0,0,0.05)]">
                          <div className="flex items-center justify-center h-full">
                            <Eye
                              className="h-5 w-5 cursor-pointer hover:text-[#0D4F97] transition-colors"
                              onClick={() => setSelectedRelatorio(relatorio)}
                            />
                          </div>
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </div>
            )}

          </div>

          </CardContent>
        </Card>

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