"use client";

import { useState, useEffect } from "react";
import { Plus, Search, BookOpen} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NovaTurmaModal } from "@/components/turmas/NovaTurmaModal";
import { DetalhesTurma } from "@/components/turmas/DetalhesTurma";
import { EditarTurmaModal } from "@/components/turmas/EditarTurmaModal";
import { listarTurmas, listarAlunosAtivos, buscarTurmaPorId } from "@/services/TurmaService";
import { toast } from "sonner";

export default function GerenciarTurmasPage() {
  const [turmas, setTurmas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNovaTurmaOpen, setIsNovaTurmaOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<"listar-turmas" | "detalhes-turma">("listar-turmas");
  const [selectedTurma, setSelectedTurma] = useState<any>(null);
  const [isEditarTurmaOpen, setIsEditarTurmaOpen] = useState(false);
  const [turmaParaEditar, setTurmaParaEditar] = useState<any | null>(null);

  useEffect(() => {
    async function carregarTurmasComAlunos() {
        try {
              setLoading(true);

              const turmasData = await listarTurmas();

              setTurmas(turmasData);
            } catch (error: any) {
              toast.error(error.message || "Erro ao carregar turmas");
            } finally {
              setLoading(false);
            }
    }

    carregarTurmasComAlunos();
  }, []);

  const turmasFiltradas = turmas
    .filter((t) => t.nome?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (b.anoCriacao !== a.anoCriacao) {
        return (b.anoCriacao || 0) - (a.anoCriacao || 0);
      }
      return a.nome.localeCompare(b.nome);
    });

  const handleCardClick = (turma: any) => {
    setSelectedTurma(turma);
    setCurrentPage("detalhes-turma");
  };

  const handleBackToGerenciarTurmas = () => {
    setSelectedTurma(null);
    setCurrentPage("listar-turmas");
  };

  const handleNavigate = (screen: string) => {
    console.log("Navigate to:", screen);
  };

  const handleEditClick = async () => {
    if (!selectedTurma) return;

    try {
      const turmaCompleta = await buscarTurmaPorId(selectedTurma.id);
      setTurmaParaEditar(turmaCompleta);
      setIsEditarTurmaOpen(true);
    } catch (error: any) {
      console.error("Erro ao carregar dados da turma para edição:", error);
      toast.error(error.message || "Erro ao carregar dados completos da turma.");
    }
  };

  const handleSaveNovaTurma = async () => {
    const data = await listarTurmas();
    setTurmas(data);
  };

  const handleUpdateTurma = async (updatedTurma: any) => {
    try {
      // Recarrega todas as turmas para garantir contadores e dados agregados atualizados
      const todasTurmas = await listarTurmas();
      setTurmas(todasTurmas);

      const turmaAtualizadaLista = todasTurmas.find(t => t.id === updatedTurma.id) || updatedTurma;
      setSelectedTurma(turmaAtualizadaLista);
      setTurmaParaEditar(turmaAtualizadaLista);
    } catch (error: any) {
      console.error("Erro ao atualizar lista de turmas após edição:", error);
      toast.error(error.message || "Erro ao atualizar lista de turmas.");
    }
  };

  const handleInactivateTurma = async (turmaAtualizada?: any) => {
    if (turmaAtualizada) {
      setSelectedTurma(turmaAtualizada);
      const updatedList = turmas.map(t => t.id === turmaAtualizada.id ? turmaAtualizada : t);
      setTurmas(updatedList);
    } else if (selectedTurma) {
      try {
        const todasTurmas = await listarTurmas();
        const turmaEncontrada = todasTurmas.find(t => t.id === selectedTurma.id);
        if (turmaEncontrada) {
          setSelectedTurma(turmaEncontrada);
          setTurmas(todasTurmas);
        }
      } catch (error) {
        console.error("Erro ao atualizar turma:", error);
      }
    }
  };

  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {currentPage === "listar-turmas" && (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#0D4F97] mb-2">
                  Gerenciar Turmas
                </h1>
                <p className="text-sm md:text-base text-[#222222]">
                  Visualize e administre todas as turmas
                </p>
              </div>

              <div className="flex gap-4 items-center">
                <Button
                  variant="primary"
                  onClick={() => setIsNovaTurmaOpen(true)}
                >
                  <Plus size={18} />
                  Nova Turma
                </Button>
                <NovaTurmaModal
                  isOpen={isNovaTurmaOpen}
                  onClose={() => setIsNovaTurmaOpen(false)}
                  onSave={handleSaveNovaTurma}
                />
              </div>
            </div>

            {/* Campo de Busca */}
            <div className="mb-4 md:mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0D4F97]" />

                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 md:h-12 pl-10 border-2 border-[#B2D7EC] bg-white text-[#222222] placeholder:text-gray-400 focus:border-[#0D4F97]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {turmasFiltradas.map((turma) => (
                <div
                  key={turma.id}
                  onClick={() => handleCardClick(turma)}
                  className="border-2 border-[#B2D7EC] bg-white rounded-xl shadow-sm p-4 md:p-6 relative cursor-pointer hover:shadow-md transition-shadow group"
                >
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                      <BookOpen className="h-6 w-6 md:h-7 md:w-7 text-[#0D4F97]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-[#0D4F97] mb-1">
                        {turma.nome}
                      </h3>

                      <div className="flex gap-2 flex-wrap">

                        <span
                          className={`inline-block rounded-full px-2 md:px-3 py-1 text-xs md:text-sm font-medium ${
                            turma.isAtiva
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {turma.isAtiva ? "Ativa" : "Inativa"}
                        </span>

                        <span className="inline-block bg-[#E8F3FF] text-[#0D4F97] px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium border border-[#B2D7EC]">
                          {turma.totalAlunosAtivos ?? 0} alunos
                        </span>

                      </div>

                    </div>
                  </div>

                  <div className="text-gray-700 space-y-1 text-sm md:text-base">
                    <p>
                      <strong>Professor:</strong> {turma.professorNome}
                    </p>
                    <p>
                      <strong>Turno:</strong> {turma.turno}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {currentPage === "detalhes-turma" && selectedTurma && (
          <>
            <DetalhesTurma
              turmaId={selectedTurma.id}
              turmaData={selectedTurma}
              onBack={handleBackToGerenciarTurmas}
              onNavigate={handleNavigate}
              onEdit={handleEditClick}
              onInactivate={handleInactivateTurma}
            />
            <EditarTurmaModal
              isOpen={isEditarTurmaOpen}
              onClose={() => setIsEditarTurmaOpen(false)}
              turmaData={turmaParaEditar || selectedTurma}
              onSave={handleUpdateTurma}
            />
          </>
        )}
      </div>
    </main>
  );
}