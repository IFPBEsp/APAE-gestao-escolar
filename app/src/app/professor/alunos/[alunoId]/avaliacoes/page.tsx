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
import { buscarTurmaPorId } from "@/services/TurmaService";
import * as AvaliacaoService from "@/services/AvaliacaoService";
import { buscarAlunoPorId } from "@/services/AlunoService";
import { EstudanteCard } from "@/components/alunos/EstudanteCard";

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

  const alunoId = params?.alunoId ? parseInt(Array.isArray(params.alunoId) ? params.alunoId[0] : params.alunoId) : 0;
  const turmaId = searchParams?.get('turmaId') || '';
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

  const [alunoData, setAlunoData] = useState<any>(null);
  const [loadingAluno, setLoadingAluno] = useState(true);
  const [turmaData, setTurmaData] = useState<any>(null);

  const professorId = 1; // TODO: Substituir por auth context

  useEffect(() => {
    const carregarAluno = async () => {
      if (!alunoId || isNaN(alunoId)) return;

      try {
        setLoadingAluno(true);
        const data = await buscarAlunoPorId(alunoId);
        setAlunoData(data);
      } catch (error) {
        console.error("Erro ao carregar aluno:", error);
        toast.error("Erro ao carregar dados do aluno");
      } finally {
        setLoadingAluno(false);
      }
    };

    carregarAluno();
  }, [alunoId]);

  useEffect(() => {
    const carregarTurma = async () => {
      if (!turmaId) return;
      try {
        const data = await buscarTurmaPorId(Number(turmaId));
        setTurmaData(data);
      } catch (error) {
        console.error("Erro ao carregar turma:", error);
      }
    };

    carregarTurma();
  }, [turmaId]);



  useEffect(() => {
    if (isNaN(alunoId) || alunoId <= 0) {
      console.error("alunoId inválido:", alunoId);
      toast.error("ID do aluno inválido!");
      router.push("/professor/turmas");
    }
  }, [alunoId, router]);

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
      <ProfessorSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}>
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <Button
              onClick={() => router.push(turmaId ? `/professor/turmas/${turmaId}/alunos` : "/professor/turmas")}
              variant="outline"
              className="mb-6 h-12 justify-center border-2 border-[#B2D7EC] px-4 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>

            <div className="flex items-start gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                <FileText className="h-6 w-6 text-[#0D4F97]" />
              </div>
              <div>
                <h2 className="text-[#0D4F97] text-2xl font-bold">Avaliações e Desempenho do Aluno</h2>
                <p className="text-[#222222]">Acompanhe o progresso e histórico de avaliações de {alunoData?.nome || "..."}</p>
              </div>
            </div>

            <EstudanteCard
              nome={alunoData?.nome || "Nome não encontrado"}
              turma={turmaData?.nome || alunoData?.turma?.nome || "Turma não encontrada"}
              turno={turmaData?.turno || alunoData?.turma?.turno}
              turmaId={turmaId}
              alunoId={alunoId}
              loading={loadingAluno}
              action={
                <Button
                  onClick={handleOpenAdicionarDialog}
                  className="h-12 justify-center bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97] font-semibold"
                  disabled={loading || saving}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Adicionar Avaliação
                </Button>
              }
            />

            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
              <CardContent className="p-0">
                <div className="hidden border-b-2 border-[#B2D7EC] bg-[#B2D7EC]/20 md:grid md:grid-cols-12 md:gap-4 md:p-4">
                  <div className="col-span-2 text-[#0D4F97] font-semibold">Data</div>
                  <div className="col-span-8 text-[#0D4F97] font-semibold">Descrição</div>
                  <div className="col-span-2 text-center text-[#0D4F97] font-semibold">Ações</div>
                </div>

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