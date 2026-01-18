'use client'

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, FileText, UserCircle, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import * as AvaliacaoService from "@/services/AvaliacaoService";

interface Avaliacao {
  id: number;
  descricao: string;
  dataAvaliacao: string;
  alunoId: number;
  alunoNome: string;
  professorId: number;
  professorNome: string;
}

export default function AvaliacoesAlunoPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const alunoId = parseInt(params.alunoId as string);
  const turmaId = searchParams.get('turmaId');
  
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isAdicionarDialogOpen, setIsAdicionarDialogOpen] = useState(false);
  const [isEditarDialogOpen, setIsEditarDialogOpen] = useState(false);
  const [isExcluirDialogOpen, setIsExcluirDialogOpen] = useState(false);
  const [avaliacaoEditando, setAvaliacaoEditando] = useState<Avaliacao | null>(null);
  const [avaliacaoExcluindo, setAvaliacaoExcluindo] = useState<Avaliacao | null>(null);
  
  const [descricaoAvaliacao, setDescricaoAvaliacao] = useState("");
  const [activeTab, setActiveTab] = useState("turmas");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mock data para aluno (temporário - depois buscar da API)
  const mockAlunoData: Record<number, any> = {
    1: { name: "Ana Silva", turma: "Alfabetização 2025 - Manhã" },
    2: { name: "Bruno Costa", turma: "Alfabetização 2025 - Manhã" },
    3: { name: "Carlos Oliveira", turma: "Alfabetização 2025 - Manhã" },
    4: { name: "Diana Santos", turma: "Alfabetização 2025 - Manhã" },
    5: { name: "Eduardo Ferreira", turma: "Alfabetização 2025 - Manhã" },
    6: { name: "Fernanda Lima", turma: "Alfabetização 2025 - Manhã" },
    7: { name: "Gustavo Pereira", turma: "Alfabetização 2025 - Manhã" },
    8: { name: "Helena Rodrigues", turma: "Alfabetização 2025 - Manhã" },
    9: { name: "Igor Martins", turma: "Estimulação 2025 - Tarde" },
    10: { name: "Julia Almeida", turma: "Estimulação 2025 - Tarde" },
    11: { name: "Lucas Mendes", turma: "Estimulação 2025 - Tarde" },
    12: { name: "Marina Souza", turma: "Estimulação 2025 - Tarde" },
    13: { name: "Nicolas Cardoso", turma: "Estimulação 2025 - Tarde" },
    14: { name: "Olivia Barbosa", turma: "Estimulação 2025 - Tarde" },
  };

  const alunoData = mockAlunoData[alunoId] || {
    name: `Aluno ${alunoId}`,
    turma: "Turma não especificada",
  };

  // ID do professor logado (substituir por auth context depois)
  const professorId = 1;

  // Validação do alunoId
  useEffect(() => {
    if (isNaN(alunoId) || alunoId <= 0) {
      console.error("alunoId inválido:", alunoId);
      toast.error("ID do aluno inválido!");
      router.push("/professor/turmas");
    }
  }, [alunoId, router]);

  // Carregar avaliações do backend
  useEffect(() => {
    if (alunoId > 0 && !isNaN(alunoId)) {
      carregarAvaliacoes();
    }
  }, [alunoId]);

  const carregarAvaliacoes = async () => {
    try {
      setLoading(true);
      const data = await AvaliacaoService.listarAvaliacoesPorAluno(alunoId);
      setAvaliacoes(data);
    } catch (error: any) {
      toast.error(error.message || "Erro ao carregar avaliações");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "inicio") {
      router.push("/professor");
    } else if (tab === "turmas") {
      router.push("/professor/turmas");
    }
  };

  const handleLogout = () => {
    router.push("/");
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleOpenAdicionarDialog = () => {
    setDescricaoAvaliacao("");
    setIsAdicionarDialogOpen(true);
  };

  const handleOpenEditarDialog = (avaliacao: Avaliacao) => {
    setAvaliacaoEditando(avaliacao);
    setDescricaoAvaliacao(avaliacao.descricao);
    setIsEditarDialogOpen(true);
  };

  const handleOpenExcluirDialog = (avaliacao: Avaliacao) => {
    setAvaliacaoExcluindo(avaliacao);
    setIsExcluirDialogOpen(true);
  };

  const handleAdicionarAvaliacao = async () => {
    if (!descricaoAvaliacao.trim()) {
      toast.error("Por favor, preencha a descrição da avaliação!");
      return;
    }

    if (alunoId === 0 || isNaN(alunoId)) {
      toast.error("ID do aluno inválido!");
      return;
    }

    try {
      setSaving(true);
      
      const avaliacaoData = {
        descricao: descricaoAvaliacao,
        alunoId: alunoId,
        professorId: professorId,
      };

      console.log("Enviando para API:", avaliacaoData);
      
      await AvaliacaoService.criarAvaliacao(avaliacaoData);
      
      toast.success("Avaliação adicionada com sucesso!");
      setIsAdicionarDialogOpen(false);
      setDescricaoAvaliacao("");
      
      // Recarregar lista
      await carregarAvaliacoes();
      
    } catch (error: any) {
      toast.error(error.message || "Erro ao adicionar avaliação");
      console.error("Erro detalhado:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditarAvaliacao = async () => {
    if (!descricaoAvaliacao.trim()) {
      toast.error("Por favor, preencha a descrição da avaliação!");
      return;
    }

    if (!avaliacaoEditando) return;

    try {
      setSaving(true);
      
      const avaliacaoData = {
        descricao: descricaoAvaliacao,
        alunoId: alunoId,
        professorId: professorId,
      };

      await AvaliacaoService.atualizarAvaliacao(avaliacaoEditando.id, avaliacaoData);
      
      toast.success("Avaliação atualizada com sucesso!");
      setIsEditarDialogOpen(false);
      setAvaliacaoEditando(null);
      
      // Recarregar lista
      await carregarAvaliacoes();
      
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar avaliação");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleExcluirAvaliacao = async () => {
    if (!avaliacaoExcluindo) return;

    try {
      setSaving(true);
      
      await AvaliacaoService.deletarAvaliacao(avaliacaoExcluindo.id);
      
      toast.success("Avaliação excluída com sucesso!");
      setIsExcluirDialogOpen(false);
      setAvaliacaoExcluindo(null);
      
      // Recarregar lista
      await carregarAvaliacoes();
      
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir avaliação");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const formatarData = (dataString: string) => {
    try {
      return format(new Date(dataString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
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

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {/* Botão Voltar */}
            <Button
              onClick={() => router.push(turmaId ? `/professor/turmas/${turmaId}/alunos` : "/professor/turmas")}
              variant="outline"
              className="mb-6 h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>

            {/* Título Principal da Página */}
            <div className="flex items-start gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                <FileText className="h-6 w-6 text-[#0D4F97]" />
              </div>
              <div>
                <h2 className="text-[#0D4F97] text-2xl font-bold">Avaliações e Desempenho do Aluno</h2>
                <p className="text-[#222222]">Acompanhe o progresso e histórico de avaliações de {alunoData.name}</p>
              </div>
            </div>

            {/* Card de Informações do Aluno */}
            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4 mt-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                      <UserCircle className="h-10 w-10 text-[#0D4F97]" />
                    </div>
                    <div>
                      <h2 className="text-[#0D4F97] text-xl font-bold">{alunoData.name}</h2>
                      <p className="text-[#222222]">{alunoData.turma}</p>
                      {turmaId && (
                        <p className="text-sm text-gray-500 mt-1">
                          Turma ID: {turmaId} | Aluno ID: {alunoId}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleOpenAdicionarDialog}
                    className="h-12 justify-center bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97] font-semibold"
                    disabled={loading || saving}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Adicionar Avaliação
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Avaliações */}
            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
              <CardContent className="p-0">
                {/* Header da Tabela */}
                <div className="hidden border-b-2 border-[#B2D7EC] bg-[#B2D7EC]/20 md:grid md:grid-cols-12 md:gap-4 md:p-4">
                  <div className="col-span-2 text-[#0D4F97] font-semibold">Data</div>
                  <div className="col-span-8 text-[#0D4F97] font-semibold">Descrição</div>
                  <div className="col-span-2 text-center text-[#0D4F97] font-semibold">Ações</div>
                </div>

                {/* Loading State */}
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-[#0D4F97]" />
                      <span className="ml-3 text-[#222222]">Carregando avaliações...</span>
                    </div>
                  </div>
                ) : avaliacoes.length === 0 ? (
                  <div className="p-8 text-center text-[#222222]">
                    Nenhuma avaliação registrada ainda.
                    <p className="text-sm text-gray-500 mt-2">Clique em "Adicionar Avaliação" para começar.</p>
                  </div>
                ) : (
                  <div className="divide-y-2 divide-[#B2D7EC]">
                    {avaliacoes.map((avaliacao) => (
                      <div
                        key={avaliacao.id}
                        className="grid grid-cols-1 gap-4 p-4 transition-all hover:bg-[#B2D7EC]/10 md:grid-cols-12 md:items-center"
                      >
                        {/* Data */}
                        <div className="col-span-1 md:col-span-2">
                          <p className="text-[#0D4F97] md:hidden font-semibold">Data:</p>
                          <p className="text-[#0D4F97] font-medium">
                            {formatarData(avaliacao.dataAvaliacao)}
                          </p>
                        </div>

                        {/* Descrição */}
                        <div className="col-span-1 md:col-span-8">
                          <p className="text-[#0D4F97] md:hidden font-semibold">Descrição:</p>
                          <p className="text-[#222222]">{avaliacao.descricao}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              Professor: {avaliacao.professorNome}
                            </span>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="col-span-1 md:col-span-2">
                          <div className="flex gap-2 justify-center">
                            <Button
                              onClick={() => handleOpenEditarDialog(avaliacao)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-[#0D4F97] hover:bg-[#B2D7EC]/20 hover:text-[#0D4F97]"
                              title="Editar"
                              disabled={saving}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleOpenExcluirDialog(avaliacao)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                              title="Excluir"
                              disabled={saving}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dialog: Adicionar Avaliação */}
            <Dialog open={isAdicionarDialogOpen} onOpenChange={setIsAdicionarDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#0D4F97]">Adicionar Avaliação</DialogTitle>
                  <DialogDescription>
                    Registre uma nova avaliação para {alunoData.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Descrição */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-semibold">
                      Descrição da Avaliação *
                    </label>
                    <Textarea
                      value={descricaoAvaliacao}
                      onChange={(e) => setDescricaoAvaliacao(e.target.value)}
                      placeholder="Descreva a avaliação do aluno..."
                      className="min-h-[120px] resize-none border-2 border-[#B2D7EC] focus:border-[#0D4F97]"
                      disabled={saving}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Descreva os pontos positivos, negativos, observações gerais...
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={() => setIsAdicionarDialogOpen(false)}
                      variant="outline"
                      className="border-2 border-[#B2D7EC] hover:bg-[#B2D7EC]/20"
                      disabled={saving}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAdicionarAvaliacao}
                      className="bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97] font-semibold"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adicionando...
                        </>
                      ) : (
                        "Adicionar Avaliação"
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Dialog: Editar Avaliação */}
            <Dialog open={isEditarDialogOpen} onOpenChange={setIsEditarDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#0D4F97]">Editar Avaliação</DialogTitle>
                  <DialogDescription>
                    Atualize as informações da avaliação de {alunoData.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Descrição */}
                  <div>
                    <label className="mb-2 block text-[#0D4F97] font-semibold">
                      Descrição da Avaliação *
                    </label>
                    <Textarea
                      value={descricaoAvaliacao}
                      onChange={(e) => setDescricaoAvaliacao(e.target.value)}
                      placeholder="Descreva a avaliação do aluno..."
                      className="min-h-[120px] resize-none border-2 border-[#B2D7EC] focus:border-[#0D4F97]"
                      disabled={saving}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={() => setIsEditarDialogOpen(false)}
                      variant="outline"
                      className="border-2 border-[#B2D7EC] hover:bg-[#B2D7EC]/20"
                      disabled={saving}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleEditarAvaliacao}
                      className="bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97] font-semibold"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar Alterações"
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Dialog: Excluir Avaliação */}
            <Dialog open={isExcluirDialogOpen} onOpenChange={setIsExcluirDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-[#0D4F97]">Excluir Avaliação</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.
                  </DialogDescription>
                </DialogHeader>
                {avaliacaoExcluindo && (
                  <div className="my-4 p-4 border border-red-200 bg-red-50 rounded-lg">
                    <p className="font-medium text-gray-800">Avaliação selecionada:</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      "{avaliacaoExcluindo.descricao.substring(0, 100)}..."
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Data: {formatarData(avaliacaoExcluindo.dataAvaliacao)}
                    </p>
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => setIsExcluirDialogOpen(false)}
                    variant="outline"
                    className="border-2 border-[#B2D7EC] hover:bg-[#B2D7EC]/20"
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleExcluirAvaliacao}
                    className="bg-red-500 text-white hover:bg-red-600 font-semibold"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Excluindo...
                      </>
                    ) : (
                      "Excluir Avaliação"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
    </div>
  );
}