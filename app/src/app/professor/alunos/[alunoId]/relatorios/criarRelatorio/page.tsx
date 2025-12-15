'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Printer } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function CriarRelatorioPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const alunoId = params?.alunoId ? String(params.alunoId) : null;
  const turmaId = searchParams?.get('turmaId');

  // Mock data CORRETA com apenas os 14 alunos das 2 turmas
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

  // Busca o aluno pelo ID ou usa valores padrão
  const aluno = alunoId && alunosData[alunoId] 
    ? alunosData[alunoId] 
    : { 
        nome: "Aluno não encontrado", 
        dataNascimento: "00/00/0000",
        turmaNome: "Turma não encontrada" 
      };

  // Estados do formulário
  const [dataRelatorio, setDataRelatorio] = useState<Date>(new Date());
  const [atividades, setAtividades] = useState("");
  const [habilidades, setHabilidades] = useState("");
  const [estrategias, setEstrategias] = useState("");
  const [recursos, setRecursos] = useState("");
  const [activeTab, setActiveTab] = useState("alunos");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    // Volta para a lista de relatórios do aluno
    if (alunoId) {
      const query = turmaId ? `?turmaId=${turmaId}` : '';
      router.push(`/professor/alunos/${alunoId}/relatorios${query}`);
    } else {
      router.push("/professor/turmas");
    }
  };

  const handleImprimir = () => {
    // Validação antes de ir para a tela de impressão
    if (!atividades.trim() || !habilidades.trim() || !estrategias.trim() || !recursos.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios antes de imprimir!");
      return;
    }

    // Criar objeto com os dados do relatório
    const dadosRelatorio = {
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
      // Adicionando campos necessários para o modal de impressão
      professor: "Professor(a)", // Você pode pegar do usuário logado
      turma: aluno.turmaNome,
    };

    // Salvar dados temporariamente no localStorage para usar na página de impressão
    localStorage.setItem('relatorioParaImprimir', JSON.stringify(dadosRelatorio));
    
    // Redirecionar para a página de impressão
    if (alunoId) {
      const query = turmaId ? `?turmaId=${turmaId}` : '';
      router.push(`/professor/alunos/${alunoId}/relatorios/imprimir${query}`);
    }
  };

  const handleSalvar = async () => {
    // Validação dos campos obrigatórios
    if (!atividades.trim() || !habilidades.trim() || !estrategias.trim() || !recursos.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    setIsLoading(true);

    try {
      // Aqui você faria uma requisição para salvar no banco de dados
      const novoRelatorio = {
        alunoId,
        alunoNome: aluno.nome,
        data: format(dataRelatorio, "yyyy-MM-dd"),
        dataFormatada: format(dataRelatorio, "dd/MM/yyyy", { locale: ptBR }),
        atividades,
        habilidades,
        estrategias,
        recursos,
        turmaId,
        turmaNome: aluno.turmaNome,
        dataNascimento: aluno.dataNascimento,
        criadoEm: new Date().toISOString(),
      };

      console.log("Salvando relatório:", novoRelatorio);

      // Simulando uma requisição de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Relatório criado com sucesso!");
      
      // Redirecionar de volta para a lista
      handleVoltar();
      
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      toast.error("Erro ao salvar relatório. Tente novamente.");
    } finally {
      setIsLoading(false);
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
            {/* Botão Voltar */}
            <Button
              onClick={handleVoltar}
              variant="outline"
              className="h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>

            {/* Título Principal da Página */}
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                <FileText className="h-6 w-6 text-[#0D4F97]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0D4F97]">Novo Relatório - {aluno.nome}</h1>
                <p className="text-[#222222]">
                  Preencha os campos abaixo para registrar o relatório do aluno
                </p>
              </div>
            </div>

            {/* Formulário */}
            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Data do Relatório */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-medium">
                      Data do Relatório <span className="text-red-500">*</span>
                    </label>
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
                  </div>

                  {/* Atividades */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-medium">
                      Atividades <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={atividades}
                      onChange={(e) => setAtividades(e.target.value)}
                      placeholder="Descreva as atividades realizadas..."
                      className="min-h-[150px] resize-y border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus-visible:ring-0"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Habilidades */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-medium">
                      Habilidades <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={habilidades}
                      onChange={(e) => setHabilidades(e.target.value)}
                      placeholder="Descreva as habilidades observadas..."
                      className="min-h-[150px] resize-y border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus-visible:ring-0"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Estratégias */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-medium">
                      Estratégias <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={estrategias}
                      onChange={(e) => setEstrategias(e.target.value)}
                      placeholder="Descreva as estratégias utilizadas..."
                      className="min-h-[150px] resize-y border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus-visible:ring-0"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Recursos */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-medium">
                      Recursos <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={recursos}
                      onChange={(e) => setRecursos(e.target.value)}
                      placeholder="Descreva os recursos utilizados..."
                      className="min-h-[150px] resize-y border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus-visible:ring-0"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Três Botões de Ação */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                      onClick={handleVoltar}
                      variant="outline"
                      className="h-12 border-2 border-[#B2D7EC] text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                      disabled={isLoading}
                    >
                      Cancelar
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
                    <Button
                      onClick={handleSalvar}
                      className="h-12 bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Salvando...
                        </>
                      ) : (
                        "Salvar Relatório"
                      )}
                    </Button>
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