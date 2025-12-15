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
import ModalVisualizarEditarRelatorio from "@/components/ModalVisualizarEditarRelatorio";
import RelatorioService from "@/services/RelatorioService";
import { useEffect } from "react";

interface Relatorio {
  id: number;
  data: Date | string;
  atividades: string;
  habilidades: string;
  estrategias: string;
  recursos: string;
  professor?: string;
  turma?: string;
}

export default function RelatoriosAlunoListaPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const alunoId = params?.alunoId ? String(params.alunoId) : null;
  const turmaId = searchParams?.get('turmaId');
  
  // Mock data - iniciar com alguns relatórios de exemplo
  const [relatorios, setRelatorios] = useState<Relatorio[]>([
    {
      id: 1,
      data: new Date(2025, 10, 5),
      atividades: "Atividades de coordenação motora fina, incluindo desenho livre, recorte e colagem.",
      habilidades: "Demonstrou evolução na preensão do lápis e controle dos movimentos.",
      estrategias: "Utilização de materiais adaptados e reforço positivo constante.",
      recursos: "Lápis adaptado, tesoura sem ponta, papel colorido, cola em bastão.",
      professor: "Prof. Maria Silva",
      turma: "Alfabetização 2025 - Manhã"
    },
  ]);

  // Mock data do aluno
  const alunosData: Record<string, any> = {
    "1": { 
      nome: "Ana Silva", 
      dataNascimento: "15/03/2010",
      turmaNome: "Alfabetização 2025 - Manhã" 
    },
  };

  const alunoNaoEncontrado = { 
  nome: "Aluno não encontrado", 
  dataNascimento: "00/00/0000",
  turmaNome: "Turma não encontrada" 
  };

  const aluno = alunoId 
  ? (alunosData[alunoId] || alunoNaoEncontrado)
  : alunoNaoEncontrado;

  const [isExcluirDialogOpen, setIsExcluirDialogOpen] = useState(false);
  const [relatorioExcluindo, setRelatorioExcluindo] = useState<Relatorio | null>(null);
  const [isModalRelatorioOpen, setIsModalRelatorioOpen] = useState(false);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<Relatorio | null>(null);
  const [activeTab, setActiveTab] = useState("alunos");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Função para garantir que a data seja um objeto Date
  const getSafeDate = (date: any): Date => {
    if (date instanceof Date) return date;
    if (typeof date === 'string') {
      if (date.includes('/')) {
        const [day, month, year] = date.split('/').map(Number);
        return new Date(year, month - 1, day);
      }
      return new Date(date);
    }
    if (date?.toDate) return date.toDate();
    return new Date();
  };

  // Abrir modal para visualizar/editar relatório
  const handleVisualizarRelatorio = (relatorio: Relatorio) => {
    setRelatorioSelecionado({
      ...relatorio,
      data: getSafeDate(relatorio.data)
    });
    setIsModalRelatorioOpen(true);
  };

  // Abrir modal para criar novo relatório
  const handleCriarRelatorio = () => {
    const novoRelatorio: Relatorio = {
      id: 0, // ID 0 indica novo relatório
      data: new Date(),
      atividades: "",
      habilidades: "",
      estrategias: "",
      recursos: "",
      professor: "Professor(a)",
      turma: aluno.turmaNome
    };
    
    console.log("Criando novo relatório:", novoRelatorio);
    setRelatorioSelecionado(novoRelatorio);
    setIsModalRelatorioOpen(true);
  };

  // Salvar relatório (criar ou atualizar)
  const handleSalvarRelatorio = (relatorioAtualizado: any) => {
    console.log("Recebendo relatório para salvar:", relatorioAtualizado);
    
    const isNovoRelatorio = !relatorioAtualizado.id || relatorioAtualizado.id === 0;
    
    if (isNovoRelatorio) {
      // Criar novo relatório
      const novoId = Date.now(); // Gerar um ID único
      const novoRelatorio: Relatorio = {
        id: novoId,
        data: relatorioAtualizado.dataOriginal || getSafeDate(relatorioAtualizado.data),
        atividades: relatorioAtualizado.atividades || "",
        habilidades: relatorioAtualizado.habilidades || "",
        estrategias: relatorioAtualizado.estrategias || "",
        recursos: relatorioAtualizado.recursos || "",
        professor: relatorioAtualizado.professor || "Professor(a)",
        turma: aluno.turmaNome
      };
      
      console.log("Novo relatório criado com ID:", novoId, novoRelatorio);
      
      // Adicionar no início da lista
      setRelatorios(prev => [novoRelatorio, ...prev]);
      toast.success("Relatório criado com sucesso!");
    } else {
      // Atualizar relatório existente
      setRelatorios(prev => prev.map(rel => {
        if (rel.id === relatorioAtualizado.id) {
          return {
            ...rel,
            data: relatorioAtualizado.dataOriginal || getSafeDate(relatorioAtualizado.data),
            atividades: relatorioAtualizado.atividades || rel.atividades,
            habilidades: relatorioAtualizado.habilidades || rel.habilidades,
            estrategias: relatorioAtualizado.estrategias || rel.estrategias,
            recursos: relatorioAtualizado.recursos || rel.recursos,
            professor: relatorioAtualizado.professor || rel.professor
          };
        }
        return rel;
      }));
      toast.success("Relatório atualizado com sucesso!");
    }
    
    setIsModalRelatorioOpen(false);
    setRelatorioSelecionado(null);
  };

  // Resto do código permanece igual...
  const handleOpenExcluirDialog = (relatorio: Relatorio) => {
    setRelatorioExcluindo(relatorio);
    setIsExcluirDialogOpen(true);
  };

  const handleExcluirRelatorio = () => {
    if (!relatorioExcluindo) return;
    setRelatorios(prev => prev.filter((rel) => rel.id !== relatorioExcluindo.id));
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

  const truncateText = (text: string, maxLength: number = 60) => {
    if (!text || text.length <= maxLength) return text || "";
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
                      <p className="text-sm text-gray-500">Nascimento: {aluno.dataNascimento}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleCriarRelatorio}
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
                      .sort((a, b) => getSafeDate(b.data).getTime() - getSafeDate(a.data).getTime())
                      .map((relatorio) => {
                        const safeDate = getSafeDate(relatorio.data);
                        return (
                          <div
                            key={relatorio.id}
                            className="grid grid-cols-1 gap-4 p-4 transition-all hover:bg-[#B2D7EC]/10 md:grid-cols-[120px_1fr_1fr_1fr_1fr_100px] md:gap-3"
                          >
                            {/* Data */}
                            <div className="flex flex-col">
                              <p className="text-[#0D4F97] md:hidden font-medium">Data:</p>
                              <p className="text-[#0D4F97]">
                                {format(safeDate, "dd/MM/yyyy", { locale: ptBR })}
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
                            
                            {/* Ações */}
                            <div className="flex gap-2 md:justify-center">
                              <Button
                                onClick={() => handleVisualizarRelatorio(relatorio)}
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
                        );
                      })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal: Visualizar/Editar Relatório (CORRIGIDO AQUI) */}
      {isModalRelatorioOpen && relatorioSelecionado && (
          <ModalVisualizarEditarRelatorio
              isOpen={isModalRelatorioOpen}
              onClose={() => {
                  setIsModalRelatorioOpen(false);
                  setRelatorioSelecionado(null);
              }}
              relatorio={relatorioSelecionado}
              alunoNome={aluno.nome}
              alunoDataNascimento={aluno.dataNascimento}
              onSalvar={handleSalvarRelatorio}
          />
      )}

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
                Data: {format(getSafeDate(relatorioExcluindo.data), "dd/MM/yyyy", { locale: ptBR })}
              </p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {truncateText(relatorioExcluindo.atividades, 100)}
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