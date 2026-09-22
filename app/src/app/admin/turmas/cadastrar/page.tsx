'use client'

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { BookOpen, GraduationCap, Loader2, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { criarTurma, adicionarProfessor } from "@/services/TurmaService";
import { listarAlunos } from "@/services/AlunoService";
import { listarProfessores } from "@/services/ProfessorService";

interface Aluno {
  id: string;
  nome: string;
  deficiencia?: string;
}

interface Professor {
  id: string;
  nome: string;
  email?: string;
  ativo?: boolean;
}

export default function CadastrarTurmaPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipo, setTipo] = useState("");
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [turno, setTurno] = useState("");

  const [buscaProfessor, setBuscaProfessor] = useState("");
  const [professoresEncontrados, setProfessoresEncontrados] = useState<Professor[]>([]);
  const [professorSelecionado, setProfessorSelecionado] = useState<Professor | null>(null);
  const [isBuscandoProfessores, setIsBuscandoProfessores] = useState(false);

  const [buscaAluno, setBuscaAluno] = useState("");
  const [alunosEncontrados, setAlunosEncontrados] = useState<Aluno[]>([]);
  const [alunosSelecionados, setAlunosSelecionados] = useState<Aluno[]>([]);
  const [alunoParaRemover, setAlunoParaRemover] = useState<Aluno | null>(null);

  const nomeTurma = [
    tipo ? formatTipo(tipo) : null,
    turno ? formatTurno(turno) : null,
    ano ? `- ${ano}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  function formatTipo(val: string) {
    if (!val) return "";
    return `${val}° ano`;
  }

  function formatTurno(val: string) {
    if (val === "manha") return "Manhã";
    if (val === "tarde") return "Tarde";
    return val;
  }

  useEffect(() => {
    const termo = buscaProfessor.trim();
    if (termo.length > 0) {
      const delayDebounceFn = setTimeout(() => {
        fetchProfessores(termo);
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setProfessoresEncontrados([]);
    }
  }, [buscaProfessor]);

  async function fetchProfessores(nome: string) {
    setIsBuscandoProfessores(true);
    try {
      const data = await listarProfessores(nome, true);
      setProfessoresEncontrados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
      setProfessoresEncontrados([]);
    } finally {
      setIsBuscandoProfessores(false);
    }
  }

  function selecionarProfessor(prof: Professor) {
    setProfessorSelecionado(prof);
    setBuscaProfessor("");
    setProfessoresEncontrados([]);
  }

  function removerProfessor() {
    setProfessorSelecionado(null);
  }

  useEffect(() => {
    if (buscaAluno.length > 0) {
      const delayDebounceFn = setTimeout(() => {
        fetchAlunos(buscaAluno);
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setAlunosEncontrados([]);
    }
  }, [buscaAluno]);

  async function fetchAlunos(nome: string) {
    try {
      const page = await listarAlunos(nome);
      setAlunosEncontrados(page.content ?? []);
    } catch {
      setAlunosEncontrados([]);
    }
  }

  function adicionarAluno(aluno: Aluno) {
    if (!alunosSelecionados.find((a) => a.id === aluno.id)) {
      setAlunosSelecionados([...alunosSelecionados, aluno]);
    }
    setBuscaAluno("");
    setAlunosEncontrados([]);
  }

  function removerAluno(id: string) {
    setAlunosSelecionados(alunosSelecionados.filter((a) => a.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!tipo || !ano || !turno) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      const novaTurma = await criarTurma({
        tipo: formatTipo(tipo),
        anoCriacao: Number(ano),
        turno: formatTurno(turno),
        ativa: true,
        alunosIds: alunosSelecionados.map((a) => a.id),
      });

      if (professorSelecionado && novaTurma?.id) {
        try {
          await adicionarProfessor(novaTurma.id, professorSelecionado.id);
        } catch (profError: any) {
          console.error("Erro ao vincular professor:", profError);
          toast.warning("Turma criada, mas ocorreu um erro ao vincular o professor.");
          router.push("/admin/turmas");
          return;
        }
      }

      toast.success("Turma criada com sucesso!");
      router.push("/admin/turmas");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar turma");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F4F6FB] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                <BookOpen className="h-6 w-6 text-[#0D4F97]" />
              </div>
              <div>
                <CardTitle className="text-[#0D4F97]">Nova Turma</CardTitle>
                <CardDescription className="text-[#222222]">
                  Cadastre uma nova turma no sistema
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[#0D4F97]">Série *</Label>
                <Select onValueChange={setTipo}>
                  <SelectTrigger className="bg-white border-2 border-[#B2D7EC] focus:border-[#0D4F97]">
                    <SelectValue placeholder="Selecione a série" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="1">1° ano</SelectItem>
                    <SelectItem value="2">2° ano</SelectItem>
                    <SelectItem value="3">3° ano</SelectItem>
                    <SelectItem value="4">4° ano</SelectItem>
                    <SelectItem value="5">5° ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#0D4F97]">Ano de Criação *</Label>
                  <Input
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                    placeholder="Ex: 2026"
                    className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#0D4F97]">Turno *</Label>
                  <Select onValueChange={setTurno}>
                    <SelectTrigger className="bg-white border-2 border-[#B2D7EC] focus:border-[#0D4F97]">
                      <SelectValue placeholder="Selecione o turno" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem
                        value="manha"
                        className="cursor-pointer hover:bg-[#D0E7FA] focus:bg-[#D0E7FA] transition-colors"
                      >
                        Manhã
                      </SelectItem>
                      <SelectItem
                        value="tarde"
                        className="cursor-pointer hover:bg-[#D0E7FA] focus:bg-[#D0E7FA] transition-colors"
                      >
                        Tarde
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#0D4F97]">Nome da Turma *</Label>
                <Input
                  value={nomeTurma}
                  disabled
                  className="bg-gray-50 border-2 border-[#B2D7EC]"
                />
                <p className="text-xs text-[#0D4F97]">
                  Este campo é gerado automaticamente a partir do Tipo, Ano e
                  Turno selecionados.
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-[#0D4F97] font-medium border-b border-[#B2D7EC] pb-2 block">
                  Professor Responsável
                </Label>

                {professorSelecionado ? (
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border-2 border-[#B2D7EC] shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-[#E8F3FF] rounded-full flex items-center justify-center text-[#0D4F97]">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0D4F97]">
                          {professorSelecionado.nome}
                        </p>
                        {professorSelecionado.email && (
                          <p className="text-xs text-gray-500">
                            {professorSelecionado.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="hover:text-red-600 hover:bg-red-50"
                      onClick={removerProfessor}
                      title="Remover Professor"
                      aria-label={`Remover professor ${professorSelecionado.nome}`}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Buscar professor por nome..."
                        className="pl-10 bg-white border-2 border-[#B2D7EC] focus:border-[#0D4F97]"
                        value={buscaProfessor}
                        onChange={(e) => setBuscaProfessor(e.target.value)}
                      />
                    </div>

                    {isBuscandoProfessores && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 p-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Buscando professores...</span>
                      </div>
                    )}

                    {!isBuscandoProfessores && buscaProfessor.trim().length > 0 && professoresEncontrados.length === 0 && (
                      <p className="text-xs text-gray-500 p-2">Nenhum professor encontrado.</p>
                    )}

                    {professoresEncontrados.length > 0 && (
                      <div className="border rounded-md max-h-40 overflow-y-auto bg-white shadow-sm mt-1 divide-y divide-gray-100">
                        {professoresEncontrados.map((prof) => (
                          <div
                            key={prof.id}
                            className="p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors"
                            onClick={() => selecionarProfessor(prof)}
                          >
                            <div>
                              <span className="text-sm font-medium text-gray-800 block">
                                {prof.nome}
                              </span>
                              {prof.email && (
                                <span className="text-xs text-gray-500">{prof.email}</span>
                              )}
                            </div>
                            <span className="text-xs text-[#0D4F97] font-medium">
                              Selecionar
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-[#0D4F97] font-medium border-b border-[#B2D7EC] pb-2 block">
                  Gerenciar Alunos na Turma
                </Label>

                <div className="space-y-2">
                  <Label className="text-[#0D4F97]">Adicionar Aluno</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar aluno por nome..."
                      className="pl-10 bg-white border-2 border-[#B2D7EC] focus:border-[#0D4F97]"
                      value={buscaAluno}
                      onChange={(e) => setBuscaAluno(e.target.value)}
                    />
                  </div>

                  {alunosEncontrados.length > 0 && (
                    <div className="border rounded-md max-h-40 overflow-y-auto bg-white shadow-sm mt-1">
                      {alunosEncontrados.map((aluno) => (
                        <div
                          key={aluno.id}
                          className="p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                          onClick={() => adicionarAluno(aluno)}
                        >
                          <span className="text-sm font-medium">
                            {aluno.nome}
                          </span>
                          <span className="text-xs text-gray-500">
                            Adicionar
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border border-[#B2D7EC] rounded-lg p-4 bg-white">
                  <Label className="text-[#0D4F97] mb-2 block font-medium">
                    Alunos na Turma ({alunosSelecionados.length})
                  </Label>
                  <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
                    {alunosSelecionados.length === 0 && (
                      <p className="text-sm text-gray-400 italic text-center py-4">
                        Nenhum aluno vinculado.
                      </p>
                    )}
                    {alunosSelecionados.map((aluno) => (
                      <div
                        key={aluno.id}
                        className="flex justify-between items-center bg-white p-3 rounded-lg border border-[#B2D7EC] shadow-sm hover:shadow transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-[#E8F3FF] rounded-full flex items-center justify-center text-[#0D4F97]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-[#0D4F97]">
                            {aluno.nome}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setAlunoParaRemover(aluno)}
                          aria-label={`Remover aluno ${aluno.nome}`}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} variant="primary">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    "Salvar Turma"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={!!alunoParaRemover}
        onOpenChange={(open) => !open && setAlunoParaRemover(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#0D4F97]">
              Atenção!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Tem certeza de que deseja remover o aluno{" "}
              <strong className="text-gray-900">{alunoParaRemover?.nome}</strong>{" "}
              desta turma?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlunoParaRemover(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (alunoParaRemover) {
                  removerAluno(alunoParaRemover.id);
                  setAlunoParaRemover(null);
                }
              }}
              className="bg-red-600 text-white hover:bg-red-700 hover:text-white border-0"
            >
              Remover Aluno
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
