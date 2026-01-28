'use client'

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  BookOpen,
  Users,
  UserCircle,
  Search,
  Grid3x3,
  List,
  FileText,
  BarChart3,
  Loader2
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { listarAvaliacoesPorAluno } from "@/services/AvaliacaoService";
import { getAlunosDaTurma } from "@/services/ChamadaService";
import { buscarTurmaPorId } from "@/services/TurmaService";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TurmaDetalhesPage() {
  const params = useParams();
  const turmaId = params?.turmaId ? Number(params.turmaId) : null;
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [turma, setTurma] = useState<any>(null);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarUltimaAvaliacao(alunoId: number) {
    if (!alunoId) {
      return { ultimaAvaliacao: "—" };
    }
    try {
      const avaliacoes = await listarAvaliacoesPorAluno(alunoId);
      if (!avaliacoes || avaliacoes.length === 0) {
        return { ultimaAvaliacao: "—" };
      }
      const ultima = avaliacoes.reduce((maisRecente: any, atual: any) =>
        new Date(atual.dataAvaliacao) > new Date(maisRecente.dataAvaliacao) ? atual : maisRecente
      );
      return { ultimaAvaliacao: format(new Date(ultima.dataAvaliacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) };
    } catch {
      return { ultimaAvaliacao: "—" };
    }
  }

  useEffect(() => {
    if (!turmaId) return;

    async function carregarDados() {
      try {
        setLoading(true);

        const turmaResponse = await buscarTurmaPorId(turmaId);
        setTurma({
          id: turmaResponse.id,
          nome: turmaResponse.nome,
          descricao: turmaResponse.descricao,
          ativa: turmaResponse.ativa
        });

        const alunosResponse = await getAlunosDaTurma(turmaId);

        const alunosFormatados = await Promise.all(
          alunosResponse.map(async (aluno: any) => {
            const alunoId = aluno.alunoId;
            const avaliacao = await carregarUltimaAvaliacao(alunoId);

            return {
              id: alunoId,
              nome: aluno.nome,
              ultimaAvaliacao: avaliacao.ultimaAvaliacao
            };
          })
        );

        setAlunos(alunosFormatados);
      } catch (error: any) {
        toast.error(error.message || "Erro ao carregar dados da turma");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [turmaId]);

  const filteredAlunos = alunos.filter((aluno: any) =>
    aluno.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAvaliacoes = (alunoId: number) => {
    router.push(`/professor/alunos/${alunoId}/avaliacoes?turmaId=${turmaId}`);
  };

  const handleRelatorios = (alunoId: number) => {
    router.push(`/professor/alunos/${alunoId}/relatorios?turmaId=${turmaId}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[`#0D4F97`]" />
      </div>
    );
  }
  if (!turma) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-gray-500">
        Turma não encontrada.
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <Button
              onClick={() => router.push("/professor/turmas")}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0D4F97] mb-2">
              Acompanhe seus Alunos - {turma?.nome}
            </h1>
            <p className="text-[#222222] text-lg">{turma?.descricao}</p>
          </div>

          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0D4F97]/10">
                    <BookOpen className="h-8 w-8 text-[#0D4F97]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0D4F97]">{turma?.nome}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2 text-[#222222]">
                        <Users className="h-5 w-5" />
                        <span>{alunos.length} alunos</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Status da Turma</div>
                  <div
                    className={`font-semibold ${
                      "text-green-600"
                    }`}
                  >
                    {"Ativa"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md mb-6">
            <CardContent className="p-6">
              <h3 className="text-[#0D4F97] font-semibold text-lg mb-4 mt-4">Filtros</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[#0D4F97] font-medium mb-2">Buscar Aluno</label>
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Digite o nome do aluno"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 w-full border-2 border-[#B2D7EC] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#0D4F97] font-medium mb-2">Visualização</label>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setViewMode("grid")}
                      variant={viewMode === "grid" ? "primary" : "outline"}
                      className="flex-1"
                    >
                      <Grid3x3 className="h-5 w-5" />
                    </Button>

                    <Button
                      onClick={() => setViewMode("list")}
                      variant={viewMode === "list" ? "primary" : "outline"}
                      className="flex-1"
                    >
                      <List className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filteredAlunos.map((aluno: any) => (
                <Card
                  key={aluno.id}
                  className="rounded-xl border-2 border-[#B2D7EC] shadow-md transition-all hover:border-[#0D4F97] hover:shadow-lg"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-[#B2D7EC]/20 flex items-center justify-center">
                        <UserCircle className="h-6 w-6 text-[#0D4F97]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0D4F97] mt-4">{aluno.nome}</h3>
                        <p className="text-sm text-gray-500">{turma?.nome}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700">Última Avaliação:</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{aluno.ultimaAvaliacao}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAvaliacoes(aluno.id)}
                        className="flex-1 bg-[#0D4F97] hover:bg-[#0A3D75]"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Avaliações
                      </Button>

                      <Button
                        onClick={() => handleRelatorios(aluno.id)}
                        variant="outline"
                        className="flex-1 border-[#0D4F97] text-[#0D4F97] hover:bg-[#0D4F97]/10"
                      >
                        Relatórios
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md mb-6">
              <CardContent className="p-0">
                <div className="p-6 border-b-2 border-[#B2D7EC]">
                  <h2 className="text-xl font-semibold text-[#0D4F97]">Alunos da Turma</h2>
                  <p className="text-gray-500 text-sm">{filteredAlunos.length} alunos encontrados</p>
                </div>

                <div className="divide-y-2 divide-[#B2D7EC]">
                  {filteredAlunos.length > 0 ? (
                    filteredAlunos.map((aluno: any) => (
                      <div key={aluno.id} className="p-6 hover:bg-[#B2D7EC]/10 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                              <UserCircle className="h-6 w-6 text-[#0D4F97]" />
                            </div>
                            <div>
                              <h3 className="text-[#0D4F97] font-semibold">{aluno.nome}</h3>
                              <div className="flex gap-4 mt-1">
                                <span className="text-sm text-green-600">
                                  Última avaliação: {aluno.ultimaAvaliacao}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAvaliacoes(aluno.id)}
                              variant="outline"
                              className="border-[#0D4F97] text-[#0D4F97]"
                            >
                              Avaliações
                            </Button>

                            <Button
                              onClick={() => handleRelatorios(aluno.id)}
                              variant="outline"
                              className="border-[#0D4F97] text-[#0D4F97]"
                            >
                              Relatórios
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum aluno encontrado
                      </h3>
                      <p className="text-gray-500">
                        {searchTerm 
                          ? `Nenhum resultado para "${searchTerm}"`
                          : 'Esta turma ainda não tem alunos matriculados'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 text-center text-gray-500 text-sm">
            Mostrando {filteredAlunos.length} de {alunos.length} alunos
          </div>
        </div>
      </div>
    </div>
  );
}