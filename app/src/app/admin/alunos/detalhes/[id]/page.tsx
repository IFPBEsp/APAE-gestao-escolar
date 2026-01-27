'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, BookOpen, Heart, Phone, Eye, PenSquare, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react"; 
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
    turmaIdAtiva?: number | null;
}

interface AvaliacaoHistoricoDTO {
    dataAvaliacao: string; 
    professorNome: string;
    turmaNomeCompleto: string;
    descricao: string;
    desenvolvimentoCognitivo: string;
}

interface RelatorioHistoricoDTO {
  dataRelatorio: string;
  professorNome: string;
  turmaNomeCompleto: string;
  atividades: string;
  habilidades: string;
  estrategias: string;
  recursos: string;
}

export default function DetalhesDoAluno({ params }: { params: { id: string } }) {
  const router = useRouter();
  const alunoId = parseInt(params.id);
  
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
                console.log("Dados de Avaliações Recebidos:", data); 
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
        console.log("Dados de Relatórios Recebidos:", data);
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
      if (alunoData.nomeTurmaAtual) {
          return `${alunoData.nomeTurmaAtual} - ${alunoData.turnoTurmaAtual}`;
      }
      return "Sem Turma Ativa";
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
    if (!dataString) return 'N/A';
    try {
        const cleanDataString = dataString.split('.')[0]; 
        const dataObj = new Date(cleanDataString);

        if (isNaN(dataObj.getTime())) {
            const originalDate = new Date(dataString);
            if(isNaN(originalDate.getTime())) return "Data Inválida";
            return format(originalDate, "dd/MM/yyyy", { locale: ptBR });
        }

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
      {/* Topo azul - Responsivo com padding adequado */}
      <div className="bg-[#0D4F97] text-white px-4 md:px-8 py-4 shadow-md">
        <h1 className="text-lg md:text-xl font-bold">Detalhes do Aluno</h1>
      </div>

      {/* Conteúdo - Padding responsivo */}
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        
        {/* Botão Voltar */}
        <Button
          variant="outline"
          onClick={() => router.push("/admin/alunos")}
          className="flex items-center gap-2 border-[#B2D7EC] text-[#0D4F97] hover:bg-blue-50 text-sm md:text-base h-9 md:h-10"
        >
          <ArrowLeft size={18} /> Voltar para Alunos
        </Button>

        {/* Card principal do Aluno */}
        <Card className="border border-blue-200 shadow-lg rounded-xl">
          <CardContent className="p-4 md:p-8">
            {/* Flex container para Título/Info e Botão */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              
              {/* Informações de Nome e Avatar */}
              <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-blue-100 p-3 md:p-4 rounded-full flex-shrink-0">
                  <User size={30} className="text-blue-700 md:size-8" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#0D4F97]">{alunoData.nome}</h2>
                  <p className="text-gray-600 text-sm md:text-lg">{calcularIdade(alunoData.dataNascimento)} anos</p>
                </div>
              </div>

              {/* Botão Editar Aluno - Ajustado para mobile */}
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full sm:w-auto flex items-center gap-2 bg-[#0D4F97] hover:bg-[#0A4080] text-white text-sm md:text-base h-10 px-4 md:px-6"
              >
                <PenSquare size={16} />
                Editar Aluno
              </Button>
            </div>

            {/* Informações em Grade Responsiva: 1 coluna no mobile, 2 em telas maiores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-6 mt-6 md:mt-10 text-gray-800">
              
              {/* Data de Nascimento */}
              <div className="flex gap-3 items-center">
                <Calendar className="text-[#0D4F97] flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-[#0D4F97] text-sm md:text-base">Data de Nascimento</p>
                  <p className="text-sm md:text-base">{alunoData.dataNascimento}</p>
                </div>
              </div>

              {/* Turma Atual */}
              <div className="flex gap-3 items-center">
                <BookOpen className="text-[#0D4F97] flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-[#0D4F97] text-sm md:text-base">Turma Atual</p>
                  <p className="font-medium text-[#0D4F97] text-sm md:text-base">{turmaCompleta}</p>
                </div>
              </div>

              {/* Deficiência */}
              <div className="flex gap-3 items-center">
                <Heart className="text-[#0D4F97] flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-[#0D4F97] text-sm md:text-base">Deficiência</p>
                  <p className="text-sm md:text-base">{alunoData.deficiencia}</p>
                </div>
              </div>

              {/* Responsável - Ocupa 1 coluna inteira no mobile e 2 no desktop, para dar espaço ao telefone */}
              <div className="flex gap-3 col-span-1 md:col-span-2 items-start">
                <Phone className="text-[#0D4F97] flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-[#0D4F97] text-sm md:text-base">Responsável</p>
                  <p className="text-sm md:text-base">{alunoData.nomeResponsavel}</p>
                  <p className="text-sm md:text-base">{alunoData.telefoneResponsavel}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Avaliações */}
        <Card className="border border-blue-200 shadow-lg rounded-xl">
          <CardContent className="p-4 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#0D4F97] mb-2">Histórico de Avaliações</h2>
            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Avaliações realizadas pelos professores ({avaliacoes.length} registros)</p>

            {loadingAvaliacoes ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0D4F97]" />
                </div>
            ) : avaliacoes.length === 0 ? (
                <p className="text-center text-gray-500 py-4 text-sm md:text-base">Nenhuma avaliação encontrada para este aluno.</p>
            ) : (
                /* Contêiner com overflow-x-auto para responsividade de tabela */
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-sm md:text-base">
                                <th className="pb-3 pr-3 font-bold text-[#0D4F97] w-[120px]">Data</th>
                                <th className="pb-3 pr-3 font-bold text-[#0D4F97] w-[150px]">Professor</th>
                                <th className="pb-3 pr-3 font-bold text-[#0D4F97] w-[180px]">Turma</th>
                                <th className="pb-3 pr-3 font-bold text-[#0D4F97]">Descrição</th>
                                <th className="pb-3 font-bold text-[#0D4F97] w-[80px]">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm md:text-base">
                            {avaliacoes.map((avaliacao: any, index: number) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 font-medium text-gray-900 pr-3">{formatarData(avaliacao.dataAvaliacao)}</td> 
                                <td className="font-medium text-gray-900 pr-3">{avaliacao.professorNome}</td>
                                <td className="text-gray-600 pr-3">{avaliacao.turmaNomeCompleto}</td>
                                <td className="text-gray-600 truncate max-w-[200px]" title={avaliacao.descricao}>{avaliacao.descricao}</td>
                                <td className="py-3">
                                <Eye
                                    className="h-5 w-5 text-[#B2D7EC] cursor-pointer hover:text-[#0D4F97]"
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
        <Card className="border border-blue-200 shadow-lg rounded-xl mt-8">
          <CardContent className="p-4 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#0D4F97] mb-2">
              Histórico de Relatórios
            </h2>

            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
              Relatórios pedagógicos registrados ({relatorios.length} registros)
            </p>

            {loadingRelatorios ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-[#0D4F97]" />
              </div>
            ) : relatorios.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm md:text-base">
                Nenhum relatório encontrado para este aluno.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm md:text-base">
                      <th className="pb-3 pr-3 font-bold text-[#0D4F97] w-[120px]">Data</th>
                      <th className="pb-3 pr-3 font-bold text-[#0D4F97] w-[150px]">Professor</th>
                      <th className="pb-3 pr-3 font-bold text-[#0D4F97] w-[180px]">Turma</th>
                      <th className="pb-3 pr-3 font-bold text-[#0D4F97]">Atividades</th>
                      <th className="pb-3 font-bold text-[#0D4F97] w-[80px]">Ações</th>
                    </tr>
                  </thead>

                  <tbody className="text-gray-600 text-sm md:text-base">
                    {relatorios.map((relatorio, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 font-medium text-gray-900 pr-3">
                          {formatarData(relatorio.dataRelatorio)}
                        </td>

                        <td className="font-medium text-gray-900 pr-3">
                          {relatorio.professorNome}
                        </td>

                        <td className="text-gray-600 pr-3">
                          {relatorio.turmaNomeCompleto}
                        </td>

                        <td
                          className="text-gray-600 truncate max-w-[220px]"
                          title={relatorio.atividades}
                        >
                          {relatorio.atividades}
                        </td>

                        <td className="py-3">
                          <Eye
                            className="h-5 w-5 text-[#B2D7EC] cursor-pointer hover:text-[#0D4F97]"
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
