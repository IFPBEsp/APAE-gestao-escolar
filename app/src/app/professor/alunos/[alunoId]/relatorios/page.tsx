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

import {
  listarRelatorios,
  criarRelatorio,
  atualizarRelatorio,
  deletarRelatorio
} from "@/services/RelatorioService";

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

            {/* CARD DO ALUNO */}
            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B2D7EC]/40">
                    <UserCircle className="h-6 w-6 text-[#0D4F97]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#0D4F97]">
                      Nome do Aluno
                    </p>
                    <p className="text-sm text-gray-600">
                      Nome da Turma - Manhã
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setRelatorioSelecionado({ id: 0 });
                    setIsModalRelatorioOpen(true);
                  }}
                  variant="primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Relatório
                </Button>
              </CardContent>
            </Card>

          </div>

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

                  <tbody className="divide-y divide-[#B2D7EC]">
                    {relatorios.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-gray-500"
                        >
                          Nenhum relatório encontrado.
                        </td>
                      </tr>
                    ) : (
                      relatorios.map((rel) => (
                        <tr
                          key={rel.id}
                          className="hover:bg-white transition-colors align-top"
                        >
                          <td className="p-4 font-medium whitespace-nowrap">
                            {rel.createdAt
                              ? format(
                                new Date(rel.createdAt),
                                "dd/MM/yyyy"
                              )
                              : "---"}
                          </td>
                          <td className="p-4 text-sm max-w-[220px] truncate">
                            {rel.atividades}
                          </td>
                          <td className="p-4 text-sm max-w-[220px] truncate">
                            {rel.habilidades}
                          </td>
                          <td className="p-4 text-sm max-w-[220px] truncate">
                            {rel.estrategias}
                          </td>
                          <td className="p-4 text-sm max-w-[220px] truncate">
                            {rel.recursos}
                          </td>
                          <td className="p-4 flex justify-center gap-2">
                            <Button
                              onClick={() => {
                                setRelatorioSelecionado(rel);
                                setIsModalRelatorioOpen(true);
                              }}
                              variant="ghost"
                              size="sm"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              onClick={() => {
                                setRelatorioExcluindo(rel);
                                setIsExcluirDialogOpen(true);
                              }}
                              variant="danger"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* MODAIS */}
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
