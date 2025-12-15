'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Plus, 
  Eye, 
  Trash2, 
  UserCircle, 
  FileText
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter, useParams, useSearchParams } from "next/navigation";

interface Relatorio {
  id: number;
  data: Date;
  atividades: string;
  habilidades: string;
  estrategias: string;
  recursos: string;
}

export default function RelatoriosAlunoListaPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const alunoId = params?.alunoId ? String(params.alunoId) : null;
  const turmaId = searchParams?.get('turmaId');

  // Mock data
  const [relatorios, setRelatorios] = useState<Relatorio[]>([
    {
      id: 1,
      data: new Date(2025, 10, 5),
      atividades: "Atividades de coordenação motora fina, incluindo desenho livre, recorte e colagem.",
      habilidades: "Demonstrou evolução na preensão do lápis e controle dos movimentos.",
      estrategias: "Utilização de materiais adaptados e reforço positivo constante.",
      recursos: "Lápis adaptado, tesoura sem ponta, papel colorido, cola em bastão.",
    },
    {
      id: 2,
      data: new Date(2025, 10, 10),
      atividades: "Atividades de escrita do nome com apoio de modelos visuais e tracejados.",
      habilidades: "Reconhecimento de letras e escrita com auxílio visual.",
      estrategias: "Uso de modelos tracejados e reforço positivo a cada letra escrita.",
      recursos: "Caderno adaptado, lápis grosso, fichas de letras.",
    },
    {
      id: 3,
      data: new Date(2025, 10, 15),
      atividades: "Atividades em grupo com jogos cooperativos e brincadeiras dirigidas.",
      habilidades: "Interação social, compartilhamento, trabalho em equipe.",
      estrategias: "Mediação do professor e estímulo à participação em duplas.",
      recursos: "Jogos de tabuleiro, bolas, materiais para brincadeiras coletivas.",
    },
  ]);

  // Mock data do aluno
  const alunosData: Record<string, any> = {
    "1": { nome: "Ana Silva", turmaNome: "Alfabetização 2025 - Manhã" },
    "2": { nome: "Bruno Costa", turmaNome: "Alfabetização 2025 - Manhã" },
    "3": { nome: "Carlos Oliveira", turmaNome: "Alfabetização 2025 - Manhã" },
    "4": { nome: "Diana Santos", turmaNome: "Alfabetização 2025 - Manhã" },
    "5": { nome: "Eduardo Ferreira", turmaNome: "Alfabetização 2025 - Manhã" },
    "6": { nome: "Fernanda Lima", turmaNome: "Alfabetização 2025 - Manhã" },
    "7": { nome: "Gabriel Souza", turmaNome: "Alfabetização 2025 - Manhã" },
    "8": { nome: "Helena Rodrigues", turmaNome: "Alfabetização 2025 - Manhã" },
    "9": { nome: "Igor Martins", turmaNome: "Estimulação 2025 - Tarde" },
    "10": { nome: "Juliana Alves", turmaNome: "Estimulação 2025 - Tarde" },
    "11": { nome: "Lucas Pereira", turmaNome: "Estimulação 2025 - Tarde" },
    "12": { nome: "Maria Cardoso", turmaNome: "Estimulação 2025 - Tarde" },
    "13": { nome: "Nicolas Ribeiro", turmaNome: "Estimulação 2025 - Tarde" },
    "14": { nome: "Olivia Gomes", turmaNome: "Estimulação 2025 - Tarde" },
  };

  const aluno = alunoId ? alunosData[alunoId] : { 
    nome: "Aluno não encontrado", 
    turmaNome: "Turma não encontrada" 
  };
  
  const [isExcluirDialogOpen, setIsExcluirDialogOpen] = useState(false);
  const [relatorioExcluindo, setRelatorioExcluindo] = useState<Relatorio | null>(null);
  const [activeTab, setActiveTab] = useState("alunos");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleOpenExcluirDialog = (relatorio: Relatorio) => {
    setRelatorioExcluindo(relatorio);
    setIsExcluirDialogOpen(true);
  };

  const handleExcluirRelatorio = () => {
    if (!relatorioExcluindo) return;

    setRelatorios(relatorios.filter((rel) => rel.id !== relatorioExcluindo.id));
    setIsExcluirDialogOpen(false);
    setRelatorioExcluindo(null);
    toast.success("Relatório excluído com sucesso!");
  };

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
    if (turmaId) {
      router.push(`/professor/turmas/${turmaId}/alunos`);
    } else {
      router.push("/professor/turmas");
    }
  };

  const handleAdicionarRelatorio = () => {
    if (alunoId) {
      const query = turmaId ? `?turmaId=${turmaId}` : '';
      router.push(`/professor/alunos/${alunoId}/relatorios/criarRelatorio${query}`);
    }
  };

  // **CORREÇÃO AQUI**: Removido "/visualizar" da rota
  const handleVisualizarRelatorio = (relatorioId: number) => {
    if (alunoId) {
      const query = turmaId ? `?turmaId=${turmaId}` : '';
      // Rota corrigida: /professor/alunos/[alunoId]/relatorios/[relatorioId]
      router.push(`/professor/alunos/${alunoId}/relatorios/${relatorioId}${query}`);
    }
  };

  // Função helper para truncar texto
  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>

            {/* Título Principal */}
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                <FileText className="h-6 w-6 text-[#0D4F97]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0D4F97]">Relatórios do Aluno</h1>
                <p className="text-[#222222]">Visualize e gerencie os relatórios de {aluno.nome}</p>
              </div>
            </div>

            {/* Card de Informações do Aluno */}
            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                      <UserCircle className="h-10 w-10 text-[#0D4F97]" />
                    </div>
                    <div>
                      <h2 className="text-[#0D4F97] text-xl font-bold">{aluno.nome}</h2>
                      <p className="text-[#222222]">{aluno.turmaNome}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleAdicionarRelatorio}
                    className="h-12 justify-center bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Adicionar Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Relatórios */}
            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
              <CardContent className="p-0">
                {/* Header da Tabela - Desktop */}
                <div className="hidden border-b-2 border-[#B2D7EC] bg-[#B2D7EC]/20 md:grid md:grid-cols-[120px_1fr_1fr_1fr_1fr_100px] md:gap-3 md:p-4">
                  <div className="text-[#0D4F97] font-medium">Data</div>
                  <div className="text-[#0D4F97] font-medium">Atividades</div>
                  <div className="text-[#0D4F97] font-medium">Habilidades</div>
                  <div className="text-[#0D4F97] font-medium">Estratégias</div>
                  <div className="text-[#0D4F97] font-medium">Recursos</div>
                  <div className="text-center text-[#0D4F97] font-medium">Ações</div>
                </div>

                {/* Linhas da Tabela */}
                <div className="divide-y-2 divide-[#B2D7EC]">
                  {relatorios.length === 0 ? (
                    <div className="p-8 text-center text-[#222222]">
                      Nenhum relatório registrado ainda.
                    </div>
                  ) : (
                    relatorios
                      .sort((a, b) => b.data.getTime() - a.data.getTime())
                      .map((relatorio) => (
                        <div
                          key={relatorio.id}
                          className="grid grid-cols-1 gap-4 p-4 transition-all hover:bg-[#B2D7EC]/10 md:grid-cols-[120px_1fr_1fr_1fr_1fr_100px] md:gap-3"
                        >
                          {/* Data */}
                          <div className="flex flex-col">
                            <p className="text-[#0D4F97] md:hidden font-medium">Data:</p>
                            <p className="text-[#0D4F97]">
                              {format(relatorio.data, "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                          </div>

                          {/* Atividades */}
                          <div className="flex flex-col">
                            <p className="text-[#0D4F97] md:hidden font-medium">Atividades:</p>
                            <p className="text-[#222222]" title={relatorio.atividades}>
                              {truncateText(relatorio.atividades, 80)}
                            </p>
                          </div>

                          {/* Habilidades */}
                          <div className="flex flex-col">
                            <p className="text-[#0D4F97] md:hidden font-medium">Habilidades:</p>
                            <p className="text-[#222222]" title={relatorio.habilidades}>
                              {truncateText(relatorio.habilidades, 80)}
                            </p>
                          </div>

                          {/* Estratégias */}
                          <div className="flex flex-col">
                            <p className="text-[#0D4F97] md:hidden font-medium">Estratégias:</p>
                            <p className="text-[#222222]" title={relatorio.estrategias}>
                              {truncateText(relatorio.estrategias, 80)}
                            </p>
                          </div>

                          {/* Recursos */}
                          <div className="flex flex-col">
                            <p className="text-[#0D4F97] md:hidden font-medium">Recursos:</p>
                            <p className="text-[#222222]" title={relatorio.recursos}>
                              {truncateText(relatorio.recursos, 80)}
                            </p>
                          </div>

                          {/* Ações - APENAS 2 ÍCONES */}
                          <div className="flex gap-2 md:justify-center">
                            <Button
                              onClick={() => handleVisualizarRelatorio(relatorio.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-[#0D4F97] hover:bg-[#B2D7EC]/20 hover:text-[#0D4F97]"
                              title="Visualizar/Editar"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleOpenExcluirDialog(relatorio)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialog: Excluir Relatório */}
      <Dialog open={isExcluirDialogOpen} onOpenChange={setIsExcluirDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0D4F97]">Excluir Relatório</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {relatorioExcluindo && (
            <div className="my-4 p-4 border border-red-200 bg-red-50 rounded-lg">
              <p className="font-medium text-gray-800">Relatório selecionado:</p>
              <p className="text-sm text-gray-600 mt-1">
                Data: {format(relatorioExcluindo.data, "dd/MM/yyyy", { locale: ptBR })}
              </p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {relatorioExcluindo.atividades.substring(0, 100)}...
              </p>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setIsExcluirDialogOpen(false)}
              variant="outline"
              className="border-2 border-[#B2D7EC] hover:bg-[#B2D7EC]/20"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExcluirRelatorio}
              className="bg-red-500 text-white hover:bg-red-600 font-semibold"
            >
              Excluir Relatório
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}