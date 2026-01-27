"use client";

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NovaTurmaModal } from "@/components/turmas/NovaTurmaModal";
import { DetalhesTurma } from "@/components/turmas/DetalhesTurma";
import { EditarTurmaModal } from "@/components/turmas/EditarTurmaModal";
import { listarTurmas, listarAlunosAtivos } from "@/services/TurmaService";
import { toast } from "sonner";

export default function GerenciarTurmasPage() {
  const [turmas, setTurmas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [isNovaTurmaOpen, setIsNovaTurmaOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<"listar-turmas" | "detalhes-turma">("listar-turmas");
  const [selectedTurma, setSelectedTurma] = useState<any>(null);
  const [isEditarTurmaOpen, setIsEditarTurmaOpen] = useState(false);

  useEffect(() => {
    async function carregarTurmasComAlunos() {
      try {
        setLoading(true);

        // Buscar todas as turmas
        const turmasData = await listarTurmas();

        // Para cada turma, buscar os alunos ativos e adicionar contagem
        const turmasComContador = await Promise.all(
          turmasData.map(async (turma: any) => {
            try {
              const alunosAtivos = await listarAlunosAtivos(turma.id);
              return {
                ...turma,
                alunosCount: alunosAtivos.length, // contador de alunos ativos
              };
            } catch (err) {
              console.error(`Erro ao contar alunos da turma ${turma.id}`, err);
              return { ...turma, alunosCount: 0 };
            }
          })
        );

        setTurmas(turmasComContador);
      } catch (error: any) {
        toast.error(error.message || "Erro ao carregar turmas");
      } finally {
        setLoading(false);
      }
    }

    carregarTurmasComAlunos();
  }, []);

  const turmasFiltradas = turmas.filter((t) =>
    t.nome?.toLowerCase().includes(busca.toLowerCase())
  );

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

  const handleEditClick = () => {
    setIsEditarTurmaOpen(true);
  };

  const handleSaveNovaTurma = async () => {
    const data = await listarTurmas();
    setTurmas(data);
  };

  const handleUpdateTurma = (updatedTurma: any) => {
    const updatedList = turmas.map(t => t.id === updatedTurma.id ? updatedTurma : t);
    setTurmas(updatedList);
    setSelectedTurma(updatedTurma);
  };

  const handleInactivateTurma = () => {
    if (selectedTurma) {
      const updated = { ...selectedTurma, status: "Inativa" };
      const updatedList = turmas.map(t => t.id === selectedTurma.id ? updated : t);
      setTurmas(updatedList);
      handleBackToGerenciarTurmas();
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-[#F1F5F9] min-h-screen">
      {currentPage === "listar-turmas" && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-10 gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-[#0D4F97]">Gerenciar Turmas</h1>
              <p className="text-sm md:text-base text-gray-700">Visualize e administre todas as turmas</p>
            </div>

            <div className="flex gap-4 items-center">
              <Button
                variant="primary"
                className="w-full md:w-auto"
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

          <div className="mb-4 md:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar turma por nome..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 bg-white border-[#B2D7EC] h-11 md:h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {turmasFiltradas.map((turma) => (
              <div
                key={turma.id}
                onClick={() => handleCardClick(turma)}
                className="border border-[#B2D7EC] bg-white rounded-xl shadow-sm p-4 md:p-6 relative cursor-pointer hover:shadow-md transition-shadow group"
              >
                <div className="absolute right-3 md:right-4 top-3 md:top-4 flex flex-wrap gap-2 justify-end">
                  <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${turma.isAtiva
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}>
                    {turma.isAtiva ? "Ativa" : "Inativa"}
                  </div>

                  <div className="bg-[#E8F3FF] text-[#0D4F97] px-2 md:px-3 py-1 rounded-full text-xs font-medium border border-[#B2D7EC]">
                    {turma.alunosCount ?? 0} alunos
                  </div>
                </div>

                <h2 className="text-base md:text-lg font-semibold text-[#0D4F97] mb-3 pr-32 group-hover:text-[#0B3E78]">
                  {turma.nome}
                </h2>

                <div className="text-gray-700 space-y-1 text-sm md:text-base">
                  <p>
                    <strong>Professor:</strong> {turma.professor?.nome}
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
            onBack={handleBackToGerenciarTurmas}
            onNavigate={handleNavigate}
            onEdit={handleEditClick}
            onInactivate={handleInactivateTurma}
          />
          <EditarTurmaModal
            isOpen={isEditarTurmaOpen}
            onClose={() => setIsEditarTurmaOpen(false)}
            turmaData={selectedTurma}
            onSave={handleUpdateTurma}
          />
        </>
      )}
    </div>
  );
}
