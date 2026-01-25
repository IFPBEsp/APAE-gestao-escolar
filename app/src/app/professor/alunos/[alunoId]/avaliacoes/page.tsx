'use client'

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, FileText, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
<<<<<<< HEAD
  
  // Verifica se params ou params.alunoId são nulos/undefined
  if (!params?.alunoId) {
    router.push('/professor/turmas');
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#0D4F97]" />
      </div>
    );
  }
  
  const alunoId = parseInt(Array.isArray(params.alunoId) ? params.alunoId[0] : params.alunoId);
=======

  const alunoId = params?.alunoId ? parseInt(Array.isArray(params.alunoId) ? params.alunoId[0] : params.alunoId) : 0;
>>>>>>> af227ef8d450f9f14ad0abb3348b35831f1b5297
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
    const carregarDadosIniciais = async () => {
      if (!alunoId || isNaN(alunoId)) return;

      try {
        setLoadingAluno(true);
        const [aluno, turma] = await Promise.all([
          buscarAlunoPorId(alunoId),
          turmaId ? buscarTurmaPorId(Number(turmaId)) : Promise.resolve(null)
        ]);
        setAlunoData(aluno);
        setTurmaData(turma);
        await carregarAvaliacoes();
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados do aluno");
      } finally {
        setLoadingAluno(false);
      }
    };

    carregarDadosIniciais();
  }, [alunoId, turmaId]);

  const carregarAvaliacoes = async () => {
    try {
      setLoading(true);
      const data = await AvaliacaoService.listarAvaliacoesPorAluno(alunoId);
      setAvaliacoes(data);
    } catch (error: any) {
      toast.error("Erro ao carregar avaliações");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "inicio") router.push("/professor");
    else if (tab === "turmas") router.push("/professor/turmas");
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
    if (!descricaoAvaliacao.trim()) return toast.error("Preencha a descrição!");
    try {
      setSaving(true);
      await AvaliacaoService.criarAvaliacao({
        descricao: descricaoAvaliacao,
        alunoId,
        professorId,
      });
      toast.success("Avaliação adicionada!");
      setIsAdicionarDialogOpen(false);
      carregarAvaliacoes();
    } catch (error) {
      toast.error("Erro ao adicionar");
    } finally {
      setSaving(false);
    }
  };

  const handleEditarAvaliacao = async () => {
    if (!avaliacaoEditando || !descricaoAvaliacao.trim()) return;
    try {
      setSaving(true);
      await AvaliacaoService.atualizarAvaliacao(avaliacaoEditando.id, {
        descricao: descricaoAvaliacao,
        alunoId,
        professorId,
      });
      toast.success("Avaliação atualizada!");
      setIsEditarDialogOpen(false);
      carregarAvaliacoes();
    } catch (error) {
      toast.error("Erro ao atualizar");
    } finally {
      setSaving(false);
    }
  };

  const handleExcluirAvaliacao = async () => {
    if (!avaliacaoExcluindo) return;
    try {
      setSaving(true);
      await AvaliacaoService.deletarAvaliacao(avaliacaoExcluindo.id);
      toast.success("Avaliação excluída!");
      setIsExcluirDialogOpen(false);
      carregarAvaliacoes();
    } catch (error) {
      toast.error("Erro ao excluir");
    } finally {
      setSaving(false);
    }
  };

  const formatarData = (dataString: string) => {
    try {
      return format(new Date(dataString), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "---";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      <ProfessorSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={() => router.push("/")}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <Button
              onClick={() => router.push(turmaId ? `/professor/turmas/${turmaId}/alunos` : "/professor/turmas")}
              variant="outline"
              className="mb-6 h-12 border-2 border-[#B2D7EC] text-[#0D4F97] hover:bg-[#B2D7EC]/20"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
            </Button>

            <div className="flex items-start gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                <FileText className="h-6 w-6 text-[#0D4F97]" />
              </div>
              <div>
                <h2 className="text-[#0D4F97] text-2xl font-bold">Avaliações e Desempenho</h2>
                <p className="text-[#222222]">Histórico de {alunoData?.nome || "..."}</p>
              </div>
            </div>

            <EstudanteCard
              nome={alunoData?.nome || "Carregando..."}
              turma={turmaData?.nome || "..."}
              turno={turmaData?.turno}
              turmaId={turmaId}
              alunoId={alunoId}
              loading={loadingAluno}
              action={
                <Button
                  onClick={handleOpenAdicionarDialog}
                  className="h-12 bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97] font-semibold"
                  disabled={loading || saving}
                >
                  <Plus className="mr-2 h-5 w-5" /> Adicionar Avaliação
                </Button>
              }
            />

            <Card className="mt-6 rounded-xl border-2 border-[#B2D7EC] shadow-md">
              <CardContent className="p-0">
                <div className="hidden border-b-2 border-[#B2D7EC] bg-[#B2D7EC]/20 md:grid md:grid-cols-12 md:gap-4 md:p-4">
                  <div className="col-span-2 text-[#0D4F97] font-semibold">Data</div>
                  <div className="col-span-8 text-[#0D4F97] font-semibold">Descrição</div>
                  <div className="col-span-2 text-center text-[#0D4F97] font-semibold">Ações</div>
                </div>

                {loading ? (
                  <div className="p-8 text-center flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0D4F97]" />
                  </div>
                ) : avaliacoes.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Nenhuma avaliação encontrada.</div>
                ) : (
                  avaliacoes.map((av) => (
                    <div key={av.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-[#B2D7EC] items-center hover:bg-gray-50">
                      <div className="md:col-span-2 font-medium">{formatarData(av.dataAvaliacao)}</div>
                      <div className="md:col-span-8 text-sm text-gray-700">{av.descricao}</div>
                      <div className="md:col-span-2 flex justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEditarDialog(av)} className="text-blue-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenExcluirDialog(av)} className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Dialog Adicionar/Editar */}
            <Dialog open={isAdicionarDialogOpen || isEditarDialogOpen} onOpenChange={(val) => {
              if (!val) { setIsAdicionarDialogOpen(false); setIsEditarDialogOpen(false); }
            }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isEditarDialogOpen ? "Editar Avaliação" : "Nova Avaliação"}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Textarea
                    placeholder="Descreva o desempenho do aluno..."
                    value={descricaoAvaliacao}
                    onChange={(e) => setDescricaoAvaliacao(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setIsAdicionarDialogOpen(false); setIsEditarDialogOpen(false); }}>Cancelar</Button>
                  <Button 
                    onClick={isEditarDialogOpen ? handleEditarAvaliacao : handleAdicionarAvaliacao}
                    disabled={saving}
                    className="bg-[#0D4F97]"
                  >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Dialog Excluir */}
            <Dialog open={isExcluirDialogOpen} onOpenChange={setIsExcluirDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-red-600">Excluir Avaliação</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsExcluirDialogOpen(false)}>Cancelar</Button>
                  <Button variant="destructive" onClick={handleExcluirAvaliacao} disabled={saving}>
                    {saving ? "Excluindo..." : "Excluir"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </div>
      </main>
    </div>
  );
}