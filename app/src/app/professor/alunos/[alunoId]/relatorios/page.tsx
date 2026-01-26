'use client'

import { useState, useEffect, useCallback } from "react";
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
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import ModalVisualizarEditarRelatorio from "@/components/ModalVisualizarEditarRelatorio";

import { EstudanteCard } from "@/components/alunos/EstudanteCard";
import { buscarAlunoPorId } from "@/services/AlunoService";
import {
  listarRelatorios,
  criarRelatorio,
  atualizarRelatorio,
  deletarRelatorio
} from "@/services/RelatorioService";
import { buscarTurmaPorId } from "@/services/TurmaService";

export default function RelatoriosAlunoListaPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const alunoIdFromUrl = params?.alunoId ? String(params.alunoId) : null;
  const turmaId = searchParams?.get('turmaId');

  const [relatorios, setRelatorios] = useState<any[]>([]);
  const [isExcluirDialogOpen, setIsExcluirDialogOpen] = useState(false);
  const [relatorioExcluindo, setRelatorioExcluindo] = useState<any | null>(null);
  const [isModalRelatorioOpen, setIsModalRelatorioOpen] = useState(false);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<any | null>(null);

  const [alunoData, setAlunoData] = useState<any>(null);
  const [loadingAluno, setLoadingAluno] = useState(true);
  const [turmaData, setTurmaData] = useState<any>(null);

  useEffect(() => {
    const carregarAluno = async () => {
      if (!alunoIdFromUrl || isNaN(Number(alunoIdFromUrl))) return;

      try {
        setLoadingAluno(true);
        const data = await buscarAlunoPorId(Number(alunoIdFromUrl));
        setAlunoData(data);
      } catch (error) {
        console.error("Erro ao carregar aluno:", error);
        toast.error("Erro ao carregar dados do aluno");
      } finally {
        setLoadingAluno(false);
      }
    };

    carregarAluno();
  }, [alunoIdFromUrl]);

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

  const carregarRelatorios = useCallback(async () => {
    if (!alunoIdFromUrl) return;
    try {
      const dados = await listarRelatorios();
      const filtrados = dados.filter((r: any) =>
        Number(r.alunoId) === Number(alunoIdFromUrl)
      );
      setRelatorios(filtrados);
    } catch {
      toast.error("Erro ao carregar relatórios.");
    }
  }, [alunoIdFromUrl]);

  useEffect(() => {
    carregarRelatorios();
  }, [carregarRelatorios]);

  const handleSalvarRelatorio = async (dadosDoModal: any) => {
    try {
      const isNovo =
        !dadosDoModal.id ||
        dadosDoModal.id === 0 ||
        Number(dadosDoModal.id) > 999999;

      const payload = {
        atividades: dadosDoModal.atividades,
        habilidades: dadosDoModal.habilidades,
        estrategias: dadosDoModal.estrategias,
        recursos: dadosDoModal.recursos,
        alunoId: Number(alunoIdFromUrl),
        turmaId: Number(turmaId) || 1,
        professorId: 1
      };

      if (isNovo) {
        await criarRelatorio(payload);
        toast.success("Relatório criado com sucesso!");
      } else {
        await atualizarRelatorio(dadosDoModal.id, payload);
        toast.success("Relatório atualizado com sucesso!");
      }

      setIsModalRelatorioOpen(false);
      setRelatorioSelecionado(null);
      setTimeout(() => carregarRelatorios(), 400);
    } catch (error: any) {
      toast.error("Erro ao processar relatório.");
    }
  };

  const handleExcluirRelatorio = async () => {
    if (!relatorioExcluindo) return;
    try {
      await deletarRelatorio(relatorioExcluindo.id);
      toast.success("Relatório excluído.");
      setIsExcluirDialogOpen(false);
      carregarRelatorios();
    } catch {
      toast.error("Erro ao excluir.");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="p-4 md:p-8">
        <div className="mx-auto max-w-6xl space-y-6">

          {/* BOTÃO VOLTAR */}
          <Button
            onClick={() => router.back()}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" strokeWidth={1.75} />
            Voltar
          </Button>

          {/* SEÇÃO RELATÓRIOS */}
          <div className="space-y-4">

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B2D7EC]/40">
                <FileText className="h-5 w-5 text-[#0D4F97]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0D4F97]">
                  Relatórios do Aluno
                </h1>
                <p className="text-sm text-gray-600">
                  Visualize e gerencie os relatórios de aluno
                </p>
              </div>
            </div>

              <EstudanteCard
                nome={alunoData?.nome || "Nome não encontrado"}
                turma={turmaData?.nome || alunoData?.turma?.nome || "Turma não encontrada"}
                turno={turmaData?.turno || alunoData?.turma?.turno}
                turmaId={turmaId}
                alunoId={alunoIdFromUrl}
                loading={loadingAluno}
                action={
                  <Button
                    onClick={() => {
                      setRelatorioSelecionado({ id: 0 });
                      setIsModalRelatorioOpen(true);
                    }}
                    variant="primary"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Adicionar Relatório
                  </Button>
                }
              />

          {/* TABELA */}
          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#B2D7EC]/20 text-[#0D4F97] font-bold">
                    <tr>
                      <th className="p-4">Data</th>
                      <th className="p-4">Atividades</th>
                      <th className="p-4">Habilidades</th>
                      <th className="p-4">Estratégias</th>
                      <th className="p-4">Recursos</th>
                      <th className="p-4 text-center">Ações</th>
                    </tr>
                  </thead>

            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
              <CardContent className="p-0">
                <div className="hidden border-b-2 border-[#B2D7EC] bg-[#B2D7EC]/20 md:grid md:grid-cols-12 md:gap-4 md:p-4">
                  <div className="col-span-2 text-[#0D4F97] font-semibold">Data</div>
                  <div className="col-span-2 text-[#0D4F97] font-semibold">Atividades</div>
                  <div className="col-span-2 text-[#0D4F97] font-semibold">Habilidades</div>
                  <div className="col-span-2 text-[#0D4F97] font-semibold">Estratégias</div>
                  <div className="col-span-2 text-[#0D4F97] font-semibold">Recursos</div>
                  <div className="col-span-2 text-center text-[#0D4F97] font-semibold">Ações</div>
                </div>

                <div className="divide-y-2 divide-[#B2D7EC]">
                  {relatorios.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      Nenhum relatório encontrado.
                    </div>
                  ) : (
                    relatorios.map((rel) => (
                      <div
                        key={rel.id}
                        className="grid grid-cols-1 gap-4 p-4 transition-all hover:bg-[#B2D7EC]/10 md:grid-cols-12 md:items-start"
                      >
                        <div className="col-span-1 md:col-span-2">
                          <p className="text-[#0D4F97] md:hidden font-semibold">Data:</p>
                          <p className="text-[#0D4F97] font-medium">
                            {rel.createdAt
                              ? format(new Date(rel.createdAt), "dd/MM/yyyy")
                              : "---"}
                          </p>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                          <p className="text-[#0D4F97] md:hidden font-semibold">Atividades:</p>
                          <p className="text-sm text-[#222222] line-clamp-3">{rel.atividades}</p>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                          <p className="text-[#0D4F97] md:hidden font-semibold">Habilidades:</p>
                          <p className="text-sm text-[#222222] line-clamp-3">{rel.habilidades}</p>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                          <p className="text-[#0D4F97] md:hidden font-semibold">Estratégias:</p>
                          <p className="text-sm text-[#222222] line-clamp-3">{rel.estrategias}</p>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                          <p className="text-[#0D4F97] md:hidden font-semibold">Recursos:</p>
                          <p className="text-sm text-[#222222] line-clamp-3">{rel.recursos}</p>
                        </div>

                        <div className="col-span-1 md:col-span-2 flex justify-center gap-2">
                          <Button
                            onClick={() => {
                              setRelatorioSelecionado(rel);
                              setIsModalRelatorioOpen(true);
                            }}
                            variant="ghost"
                            size="icon"
                            >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              setRelatorioExcluindo(rel);
                              setIsExcluirDialogOpen(true);
                            }}
                            variant="ghost"
                            size="icon"
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

      {isModalRelatorioOpen && (
        <ModalVisualizarEditarRelatorio
          isOpen={isModalRelatorioOpen}
          onClose={() => {
            setIsModalRelatorioOpen(false);
            setRelatorioSelecionado(null);
          }}
          relatorio={relatorioSelecionado}
          onSalvar={handleSalvarRelatorio}
        />
      )}

      <Dialog
        open={isExcluirDialogOpen}
        onOpenChange={setIsExcluirDialogOpen}
      >
        <DialogContent>
          <DialogTitle>Excluir Relatório</DialogTitle>
          <DialogDescription>
            Deseja realmente excluir este registro?
          </DialogDescription>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={() => setIsExcluirDialogOpen(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExcluirRelatorio}
              variant="danger"
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
