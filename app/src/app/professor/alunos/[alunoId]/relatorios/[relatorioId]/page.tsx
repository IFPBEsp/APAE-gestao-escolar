'use client'

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Printer, Eye, Edit, Save, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface Relatorio {
  id: number;
  data: Date;
  atividades: string;
  habilidades: string;
  estrategias: string;
  recursos: string;
  professor?: string;
}

export default function VisualizarEditarRelatorioPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const alunoId = params?.alunoId ? String(params.alunoId) : null;
  const relatorioId = params?.relatorioId ? String(params.relatorioId) : null;
  const turmaId = searchParams?.get('turmaId');

  const [isEditando, setIsEditando] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dados do relatório
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  
  // Estados do formulário
  const [dataRelatorio, setDataRelatorio] = useState<Date>(new Date());
  const [atividades, setAtividades] = useState("");
  const [habilidades, setHabilidades] = useState("");
  const [estrategias, setEstrategias] = useState("");
  const [recursos, setRecursos] = useState("");
  const [activeTab, setActiveTab] = useState("alunos");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mock data do aluno
  const alunosData: Record<string, any> = {
    "1": { 
      nome: "Ana Silva", 
      dataNascimento: "15/03/2010",
      turmaNome: "Alfabetização 2025 - Manhã" 
    },
    "2": { 
      nome: "Bruno Costa", 
      dataNascimento: "20/05/2011",
      turmaNome: "Alfabetização 2025 - Manhã" 
    },
    "3": { 
      nome: "Carlos Oliveira", 
      dataNascimento: "10/08/2010",
      turmaNome: "Alfabetização 2025 - Manhã" 
    },
    "4": { 
      nome: "Diana Santos", 
      dataNascimento: "25/11/2012",
      turmaNome: "Alfabetização 2025 - Manhã" 
    },
    "5": { 
      nome: "Eduardo Ferreira", 
      dataNascimento: "05/02/2009",
      turmaNome: "Alfabetização 2025 - Manhã" 
    },
    "6": { 
      nome: "Fernanda Lima", 
      dataNascimento: "18/07/2011",
      turmaNome: "Alfabetização 2025 - Manhã" 
    },
    "7": { 
      nome: "Gabriel Souza", 
      dataNascimento: "30/04/2010",
      turmaNome: "Alfabetização 2025 - Manhã" 
    },
    "8": { 
      nome: "Helena Rodrigues", 
      dataNascimento: "12/09/2012",
      turmaNome: "Alfabetização 2025 - Manhã" 
    },
    "9": { 
      nome: "Igor Martins", 
      dataNascimento: "22/01/2009",
      turmaNome: "Estimulação 2025 - Tarde" 
    },
    "10": { 
      nome: "Juliana Alves", 
      dataNascimento: "14/06/2010",
      turmaNome: "Estimulação 2025 - Tarde" 
    },
    "11": { 
      nome: "Lucas Pereira", 
      dataNascimento: "08/12/2011",
      turmaNome: "Estimulação 2025 - Tarde" 
    },
    "12": { 
      nome: "Maria Cardoso", 
      dataNascimento: "19/03/2012",
      turmaNome: "Estimulação 2025 - Tarde" 
    },
    "13": { 
      nome: "Nicolas Ribeiro", 
      dataNascimento: "03/10/2009",
      turmaNome: "Estimulação 2025 - Tarde" 
    },
    "14": { 
      nome: "Olivia Gomes", 
      dataNascimento: "27/07/2011",
      turmaNome: "Estimulação 2025 - Tarde" 
    }
  };

  const aluno = alunoId && alunosData[alunoId] 
    ? alunosData[alunoId] 
    : { 
        nome: "Aluno não encontrado", 
        dataNascimento: "00/00/0000",
        turmaNome: "Turma não encontrada" 
      };

  // Buscar dados do relatório (simulação)
  useEffect(() => {
    if (relatorioId) {
      // Simulando busca de dados
      const relatoriosMock: Relatorio[] = [
        {
          id: 1,
          data: new Date(2025, 10, 5),
          atividades: "Atividades de coordenação motora fina, incluindo desenho livre, recorte e colagem.",
          habilidades: "Demonstrou evolução na preensão do lápis e controle dos movimentos.",
          estrategias: "Utilização de materiais adaptados e reforço positivo constante.",
          recursos: "Lápis adaptado, tesoura sem ponta, papel colorido, cola em bastão.",
          professor: "Prof. Maria Silva"
        },
        {
          id: 2,
          data: new Date(2025, 10, 10),
          atividades: "Atividades de escrita do nome com apoio de modelos visuais e tracejados.",
          habilidades: "Reconhecimento de letras e escrita com auxílio visual.",
          estrategias: "Uso de modelos tracejados e reforço positivo a cada letra escrita.",
          recursos: "Caderno adaptado, lápis grosso, fichas de letras.",
          professor: "Prof. João Santos"
        },
        {
          id: 3,
          data: new Date(2025, 10, 15),
          atividades: "Atividades em grupo com jogos cooperativos e brincadeiras dirigidas.",
          habilidades: "Interação social, compartilhamento, trabalho em equipe.",
          estrategias: "Mediação do professor e estímulo à participação em duplas.",
          recursos: "Jogos de tabuleiro, bolas, materiais para brincadeiras coletivas.",
          professor: "Prof. Ana Oliveira"
        },
      ];

      const relatorioEncontrado = relatoriosMock.find(r => r.id === parseInt(relatorioId));
      if (relatorioEncontrado) {
        setRelatorio(relatorioEncontrado);
        setDataRelatorio(relatorioEncontrado.data);
        setAtividades(relatorioEncontrado.atividades);
        setHabilidades(relatorioEncontrado.habilidades);
        setEstrategias(relatorioEncontrado.estrategias);
        setRecursos(relatorioEncontrado.recursos);
      } else {
        toast.error("Relatório não encontrado");
        handleVoltar();
      }
    }
  }, [relatorioId]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    switch(tab) {
      case "inicio":
        router.push("/professor");
        break;
      case "turmas":
        router.push("/professor/turmas");
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    router.push("/");
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleVoltar = () => {
    if (alunoId) {
      const query = turmaId ? `?turmaId=${turmaId}` : '';
      router.push(`/professor/alunos/${alunoId}/relatorios${query}`);
    } else {
      router.push("/professor/turmas");
    }
  };

  const handleIniciarEdicao = () => {
    setIsEditando(true);
  };

  const handleCancelarEdicao = () => {
    if (relatorio) {
      setDataRelatorio(relatorio.data);
      setAtividades(relatorio.atividades);
      setHabilidades(relatorio.habilidades);
      setEstrategias(relatorio.estrategias);
      setRecursos(relatorio.recursos);
    }
    setIsEditando(false);
  };

  const handleSalvarEdicao = async () => {
    // Validação
    if (!atividades.trim() || !habilidades.trim() || !estrategias.trim() || !recursos.trim()) {
      toast.error("Por favor, preencha todos os campos!");
      return;
    }

    setIsLoading(true);

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar relatório local
      if (relatorio) {
        const relatorioAtualizado: Relatorio = {
          ...relatorio,
          data: dataRelatorio,
          atividades,
          habilidades,
          estrategias,
          recursos,
        };
        setRelatorio(relatorioAtualizado);
      }

      toast.success("Relatório atualizado com sucesso!");
      setIsEditando(false);
      
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar alterações.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImprimir = () => {
    // Preparar dados para impressão
    const dadosParaImprimir = {
      alunoId,
      alunoNome: aluno.nome,
      data: format(dataRelatorio, "dd/MM/yyyy"),
      dataRelatorio: dataRelatorio.toISOString(),
      atividades,
      habilidades,
      estrategias,
      recursos,
      turmaId,
      turmaNome: aluno.turmaNome,
      dataNascimento: aluno.dataNascimento,
      professor: relatorio?.professor || "Professor(a)",
      turma: aluno.turmaNome,
    };

    // Salvar no localStorage
    localStorage.setItem('relatorioParaImprimir', JSON.stringify(dadosParaImprimir));
    
    // Redirecionar para página de impressão
    if (alunoId && relatorioId) {
      const query = turmaId ? `?turmaId=${turmaId}` : '';
      router.push(`/professor/alunos/${alunoId}/relatorios/imprimir${query}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      {/* Sidebar */}
      <ProfessorSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Conteúdo Principal */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Botão Voltar Superior */}
            <Button
              onClick={handleVoltar}
              variant="outline"
              className="h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>

            {/* Título Principal */}
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                {isEditando ? <Edit className="h-6 w-6 text-[#0D4F97]" /> : <Eye className="h-6 w-6 text-[#0D4F97]" />}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-[#0D4F97]">
                      {isEditando ? "Editando Relatório" : "Visualizando Relatório"} - {aluno.nome}
                    </h1>
                    <p className="text-[#222222]">
                      {isEditando 
                        ? "Edite os campos abaixo para atualizar o relatório"
                        : "Visualize as informações do relatório do aluno"}
                    </p>
                  </div>
                  
                  {/* Botão Editar Relatório (apenas no modo visualização) */}
                  {!isEditando && (
                    <Button
                      onClick={handleIniciarEdicao}
                      className="h-12 bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                    >
                      <Edit className="mr-2 h-5 w-5" />
                      Editar Relatório
                    </Button>
                  )}
                  {/* NOTA: Botões Cancelar e Salvar Alterações foram REMOVIDOS do header */}
                </div>
              </div>
            </div>

            {/* Formulário do Relatório */}
            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Data do Relatório */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-medium">
                      Data do Relatório <span className="text-red-500">*</span>
                    </label>
                    {isEditando ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start border-2 border-[#B2D7EC] text-left font-normal hover:bg-[#B2D7EC]/20"
                            disabled={isLoading}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(dataRelatorio, "dd/MM/yyyy", { locale: ptBR })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dataRelatorio}
                            onSelect={(date) => date && setDataRelatorio(date)}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <div className="rounded-lg border-2 border-[#B2D7EC] bg-gray-50 p-3">
                        <p className="text-gray-800">{format(dataRelatorio, "dd/MM/yyyy", { locale: ptBR })}</p>
                      </div>
                    )}
                  </div>

                  {/* Atividades */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-medium">
                      Atividades <span className="text-red-500">*</span>
                    </label>
                    {isEditando ? (
                      <Textarea
                        value={atividades}
                        onChange={(e) => setAtividades(e.target.value)}
                        className="min-h-[150px] resize-y border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus-visible:ring-0"
                        disabled={isLoading}
                      />
                    ) : (
                      <div className="rounded-lg border-2 border-[#B2D7EC] bg-gray-50 p-4">
                        <p className="text-gray-800 whitespace-pre-wrap">{atividades}</p>
                      </div>
                    )}
                  </div>

                  {/* Habilidades */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-medium">
                      Habilidades <span className="text-red-500">*</span>
                    </label>
                    {isEditando ? (
                      <Textarea
                        value={habilidades}
                        onChange={(e) => setHabilidades(e.target.value)}
                        className="min-h-[150px] resize-y border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus-visible:ring-0"
                        disabled={isLoading}
                      />
                    ) : (
                      <div className="rounded-lg border-2 border-[#B2D7EC] bg-gray-50 p-4">
                        <p className="text-gray-800 whitespace-pre-wrap">{habilidades}</p>
                      </div>
                    )}
                  </div>

                  {/* Estratégias */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-medium">
                      Estratégias <span className="text-red-500">*</span>
                    </label>
                    {isEditando ? (
                      <Textarea
                        value={estrategias}
                        onChange={(e) => setEstrategias(e.target.value)}
                        className="min-h-[150px] resize-y border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus-visible:ring-0"
                        disabled={isLoading}
                      />
                    ) : (
                      <div className="rounded-lg border-2 border-[#B2D7EC] bg-gray-50 p-4">
                        <p className="text-gray-800 whitespace-pre-wrap">{estrategias}</p>
                      </div>
                    )}
                  </div>

                  {/* Recursos */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-medium">
                      Recursos <span className="text-red-500">*</span>
                    </label>
                    {isEditando ? (
                      <Textarea
                        value={recursos}
                        onChange={(e) => setRecursos(e.target.value)}
                        className="min-h-[150px] resize-y border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus-visible:ring-0"
                        disabled={isLoading}
                      />
                    ) : (
                      <div className="rounded-lg border-2 border-[#B2D7EC] bg-gray-50 p-4">
                        <p className="text-gray-800 whitespace-pre-wrap">{recursos}</p>
                      </div>
                    )}
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                      onClick={isEditando ? handleCancelarEdicao : handleVoltar}
                      variant="outline"
                      className="h-12 border-2 border-[#B2D7EC] text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                      disabled={isLoading}
                    >
                      {isEditando ? "Cancelar" : "Voltar"}
                    </Button>
                    <Button
                      onClick={handleImprimir}
                      variant="outline"
                      className="h-12 border-2 border-[#0D4F97] text-[#0D4F97] hover:bg-[#0D4F97] hover:text-white"
                      disabled={isLoading}
                    >
                      <Printer className="mr-2 h-5 w-5" />
                      Imprimir
                    </Button>
                    {/* Botão Salvar (aparece apenas no modo edição) */}
                    {isEditando && (
                      <Button
                        onClick={handleSalvarEdicao}
                        className="h-12 bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Salvando...
                          </>
                        ) : (
                          "Salvar"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}