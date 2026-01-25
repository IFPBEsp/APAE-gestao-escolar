'use client'

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, FileText, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { buscarAlunoPorId } from "@/services/AlunoService";
import { buscarTurmaPorId } from "@/services/TurmaService";
import * as AvaliacaoService from "@/services/AvaliacaoService";
import { EstudanteCard } from "@/components/alunos/EstudanteCard";

interface Avaliacao {
  id: number;
  descricao: string;
  dataAvaliacao: string;
  professorNome: string;
}

export default function AvaliacoesAlunoPage() {
  const { alunoId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const turmaId = searchParams.get("turmaId");
  const idAluno = Number(alunoId);

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [descricao, setDescricao] = useState("");
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<Avaliacao | null>(null);

  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [aluno, setAluno] = useState<any>(null);
  const [turma, setTurma] = useState<any>(null);

  const professorId = 1;

  useEffect(() => {
    if (!idAluno) return;

    const load = async () => {
      try {
        const [alunoData, turmaData, avaliacoesData] = await Promise.all([
          buscarAlunoPorId(idAluno),
          turmaId ? buscarTurmaPorId(Number(turmaId)) : null,
          AvaliacaoService.listarAvaliacoesPorAluno(idAluno),
        ]);

        setAluno(alunoData);
        setTurma(turmaData);
        setAvaliacoes(avaliacoesData);
      } catch {
        toast.error("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [idAluno, turmaId]);

  const formatarData = (data: string) =>
    format(new Date(data), "dd/MM/yyyy", { locale: ptBR });

  const salvarAvaliacao = async () => {
    if (!descricao.trim()) return toast.error("Descrição obrigatória");

    try {
      setSaving(true);

      if (avaliacaoSelecionada) {
        await AvaliacaoService.atualizarAvaliacao(avaliacaoSelecionada.id, {
          descricao,
          alunoId: idAluno,
          professorId,
        });
      } else {
        await AvaliacaoService.criarAvaliacao({
          descricao,
          alunoId: idAluno,
          professorId,
        });
      }

      toast.success("Avaliação salva");
      setOpenForm(false);
      setDescricao("");
      setAvaliacaoSelecionada(null);

      const data = await AvaliacaoService.listarAvaliacoesPorAluno(idAluno);
      setAvaliacoes(data);
    } finally {
      setSaving(false);
    }
  };

  const excluirAvaliacao = async () => {
    if (!avaliacaoSelecionada) return;

    try {
      setSaving(true);
      await AvaliacaoService.deletarAvaliacao(avaliacaoSelecionada.id);
      toast.success("Avaliação excluída");

      setOpenDelete(false);
      setAvaliacaoSelecionada(null);

      const data = await AvaliacaoService.listarAvaliacoesPorAluno(idAluno);
      setAvaliacoes(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Voltar */}
      <Button
        variant="outline"
        onClick={() =>
          router.push(
            turmaId
              ? `/professor/turmas/${turmaId}/alunos`
              : "/professor/turmas"
          )
        }
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-primary">
            Avaliações do Aluno
          </h1>
          <p className="text-sm text-muted-foreground">
            Histórico de {aluno?.nome}
          </p>
        </div>
      </div>

      <EstudanteCard
        nome={aluno?.nome}
        turma={turma?.nome}
        turno={turma?.turno}
        action={
          <Button variant="primary" onClick={() => setOpenForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Avaliação
          </Button>
        }
      />

      <Card className="mt-6">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            avaliacoes.map((av) => (
              <div
                key={av.id}
                className="grid grid-cols-12 gap-4 p-4 border-b items-center"
              >
                <div className="col-span-2">{formatarData(av.dataAvaliacao)}</div>
                <div className="col-span-8">{av.descricao}</div>
                <div className="col-span-2 flex justify-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setAvaliacaoSelecionada(av);
                      setDescricao(av.descricao);
                      setOpenForm(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="danger"
                    onClick={() => {
                      setAvaliacaoSelecionada(av);
                      setOpenDelete(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {avaliacaoSelecionada ? "Editar Avaliação" : "Nova Avaliação"}
            </DialogTitle>
          </DialogHeader>

          <Textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="min-h-[140px]"
          />

          <DialogFooter>
            <Button   
              variant="outline" 
              onClick={() => setOpenForm(false)}
            >
              Cancelar
            </Button>

            <Button 
              variant="primary" 
              onClick={salvarAvaliacao} 
              disabled={saving}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Excluir Avaliação
            </DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpenDelete(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={excluirAvaliacao} 
              disabled={saving}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
