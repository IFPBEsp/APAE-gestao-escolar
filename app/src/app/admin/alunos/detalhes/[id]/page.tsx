"use client"
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


export default function DetalhesDoAluno({ params }: { params: { id: string } }) {
  const router = useRouter();
  const alunoId = parseInt(params.id);
  
  const [alunoData, setAlunoData] = useState<AlunoDetailDTO | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoHistoricoDTO[]>([]); 
  const [loadingAluno, setLoadingAluno] = useState(true);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState<any>(null); 
  const [selectedRelatorio, setSelectedRelatorio] = useState<any>(null); 

  const mockRelatorios = [
    {
      data: "15/11/2025",
      professor: "Prof. Maria Silva",
      turma: "Alfabetização 2025 - Manhã",
      aluno: "Ana Silva",
      atividade: "Atividades em grupo com jogos cooperativos e brincadeiras dirigidas.",
      atividades: "Jogos cooperativos com bola, dança das cadeiras adaptada...",
      habilidades: "Trabalho em equipe, respeito às regras...",
      estrategias: "Divisão da turma em pequenos grupos...",
      recursos: "Bola de borracha, cadeiras..."
    },
  ];

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
                console.log("Dados de Avaliações Recebidos:", data); // <-- Adicione isto
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
    <div className="w-full">
      {/* Topo azul */}
      <div className="bg-[#0D4F97] text-white px-8 py-4 shadow-sm">
        <h1 className="text-xl font-bold">Detalhes do Aluno</h1>
      </div>

      {/* Conteúdo */}
      <div className="px-[50px] py-[30px] space-y-8">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/alunos")}
          className="flex items-center gap-2 border-[#B2D7EC] text-[#0D4F97] hover:bg-blue-50"
        >
          <ArrowLeft size={18} /> Voltar para Alunos
        </Button>

        {/* Card principal */}
        <Card className="border border-blue-200 shadow-md rounded-2xl">
          <CardContent className="p-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <User size={40} className="text-blue-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0D4F97] mt-8">{alunoData.nome}</h2>
                  <p className="text-gray-600 text-lg">{calcularIdade(alunoData.dataNascimento)} anos</p>
                </div>
              </div>

              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 bg-[#0D4F97] hover:bg-[#0A4080] text-white px-6 mt-8"
              >
                <PenSquare size={18} />
                Editar Aluno
              </Button>
            </div>

            {/* Informações */}
            <div className="grid grid-cols-2 gap-y-6 mt-10 text-gray-800">
              <div className="flex gap-3">
                <Calendar className="text-[#0D4F97]" />
                <div>
                  <p className="font-semibold text-[#0D4F97]">Data de Nascimento</p>
                  <p>{alunoData.dataNascimento}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <BookOpen className="text-[#0D4F97]" />
                <div>
                  <p className="font-semibold text-[#0D4F97]">Turma Atual</p>
                  <p className="font-medium text-[#0D4F97]">{turmaCompleta}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Heart className="text-[#0D4F97]" />
                <div>
                  <p className="font-semibold text-[#0D4F97]">Deficiência</p>
                  <p>{alunoData.deficiencia}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar className="text-[#0D4F97]" />
                <div>
                  <p className="font-semibold text-[#0D4F97]">Data de Matrícula</p>
                  <p>N/A (Não fornecido)</p>
                </div>
              </div>

              <div className="flex gap-3 col-span-2">
                <Phone className="text-[#0D4F97]" />
                <div>
                  <p className="font-semibold text-[#0D4F97]">Responsável</p>
                  <p>{alunoData.nomeResponsavel}</p>
                  <p>{alunoData.telefoneResponsavel}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-200 shadow-md rounded-2xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#0D4F97] mb-2 mt-8">Histórico de Avaliações</h2>
            <p className="text-gray-600 mb-6">Avaliações realizadas pelos professores ({avaliacoes.length} registros)</p>

            {loadingAvaliacoes ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0D4F97]" />
                </div>
            ) : avaliacoes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Nenhuma avaliação encontrada para este aluno.</p>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                        <th className="pb-3 font-bold text-[#0D4F97]">Data</th>
                        <th className="pb-3 font-bold text-[#0D4F97]">Professor</th>
                        <th className="pb-3 font-bold text-[#0D4F97]">Turma</th>
                        <th className="pb-3 font-bold text-[#0D4F97]">Descrição</th>
                        <th className="pb-3 font-bold text-[#0D4F97]">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {avaliacoes.map((avaliacao: any, index: number) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 font-medium text-gray-900">{formatarData(avaliacao.dataAvaliacao)}</td> 
                            <td className="font-medium text-gray-900">{avaliacao.professorNome}</td>
                            <td className="text-gray-600">{avaliacao.turmaNomeCompleto}</td>
                            <td className="text-gray-600 max-w-md truncate" title={avaliacao.descricao}>{avaliacao.descricao}</td>
                            <td>
                            <Eye
                                className="h-5 w-5 text-[#B2D7EC] cursor-pointer hover:text-[#0D4F97]"
                                onClick={() => setSelectedAvaliacao(avaliacao)}
                            />
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}
          </CardContent>
        </Card>

        {/* Histórico de Relatórios Individuais (MANTIDO COM MOCK TEMPORARIAMENTE) */}
        <Card className="border border-blue-200 shadow-md rounded-2xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#0D4F97] mb-2 mt-8">Histórico de Relatórios Individuais</h2>
            <p className="text-gray-600 mb-6">Relatórios individuais realizados pelos professores ({mockRelatorios.length} registros - MOCK)</p>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 font-bold text-[#0D4F97]">Data</th>
                  <th className="pb-3 font-bold text-[#0D4F97]">Professor</th>
                  <th className="pb-3 font-bold text-[#0D4F97]">Turma</th>
                  <th className="pb-3 font-bold text-[#0D4F97]">Atividades</th>
                  <th className="pb-3 font-bold text-[#0D4F97]">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {mockRelatorios.map((relatorio: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 font-medium text-gray-900">{relatorio.data}</td>
                    <td className="font-medium text-gray-900">{relatorio.professor}</td>
                    <td className="text-gray-600">{relatorio.turma}</td>
                    <td className="text-gray-600 max-w-md truncate" title={relatorio.atividade}>{relatorio.atividade}</td>
                    <td>
                      <Eye
                        className="h-5 w-5 text-[#B2D7EC] cursor-pointer hover:text-[#0D4F97]"
                        onClick={() => setSelectedRelatorio(relatorio)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
