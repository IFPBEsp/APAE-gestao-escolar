"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NovaTurmaModal } from "@/components/turmas/NovaTurmaModal";
import { DetalhesTurma } from "@/components/turmas/DetalhesTurma";
import { EditarTurmaModal } from "@/components/turmas/EditarTurmaModal";

const mockTurmasInitial = [
  {
    id: 1,
    name: "Alfabetização 2025 - Manhã",
    students: 8,
    teacher: "Prof. Maria Silva",
    schedule: "Segunda a Sexta - 08:00 às 12:00",
    turno: "Manhã",
    status: "Ativa",
    ano: "2025"
  },
  {
    id: 2,
    name: "Estimulação 2025 - Tarde",
    students: 6,
    teacher: "Prof. João Santos",
    schedule: "Segunda a Sexta - 14:00 às 18:00",
    turno: "Tarde",
    status: "Ativa",
    ano: "2025"
  },
  {
    id: 3,
    name: "Matemática Básica 2025 - Manhã",
    students: 10,
    teacher: "Prof. Ana Costa",
    schedule: "Segunda a Sexta - 09:00 às 11:00",
    turno: "Manhã",
    status: "Ativa",
    ano: "2025"
  },
  {
    id: 4,
    name: "Educação Física 2025 - Tarde",
    students: 12,
    teacher: "Prof. Carlos Lima",
    schedule: "Terça e Quinta - 15:00 às 17:00",
    turno: "Tarde",
    status: "Ativa",
    ano: "2025"
  },
];

export default function GerenciarTurmasPage() {
  const [turmas, setTurmas] = useState(mockTurmasInitial);
  const [busca, setBusca] = useState("");
  const [isNovaTurmaOpen, setIsNovaTurmaOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<"listar-turmas" | "detalhes-turma">("listar-turmas");
  const [selectedTurma, setSelectedTurma] = useState<any>(null);
  const [isEditarTurmaOpen, setIsEditarTurmaOpen] = useState(false);

  const turmasFiltradas = turmas.filter((t) =>
    t.name.toLowerCase().includes(busca.toLowerCase())
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
    // Placeholder para navegação futura se necessário
    console.log("Navigate to:", screen);
  };

  const handleEditClick = () => {
    setIsEditarTurmaOpen(true);
  };

  const handleSaveNovaTurma = (novaTurma: any) => {
    setTurmas([...turmas, novaTurma]);
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
    <div className="p-6 md:p-10 bg-[#F1F5F9] min-h-screen">
      {currentPage === "listar-turmas" && (
        <>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl font-semibold text-[#0D4F97]">Gerenciar Turmas</h1>
              <p className="text-gray-700">Visualize e administre todas as turmas</p>
            </div>

            <div className="flex gap-4 items-center">
              <Button
                className="bg-[#0D4F97] hover:bg-[#0B3E78] text-white flex items-center gap-2"
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

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar turma por nome..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 bg-white border-[#B2D7EC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {turmasFiltradas.map((turma) => (
              <div
                key={turma.id}
                onClick={() => handleCardClick(turma)}
                className="border border-[#B2D7EC] bg-white rounded-xl shadow-sm p-6 relative cursor-pointer hover:shadow-md transition-shadow group"
              >
                <div className="absolute right-4 top-4 flex gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${turma.status === "Ativa"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}>
                    {turma.status}
                  </div>
                  <div className="bg-[#E8F3FF] text-[#0D4F97] px-3 py-1 rounded-full text-xs font-medium border border-[#B2D7EC]">
                    {turma.students} alunos
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-[#0D4F97] mb-3 group-hover:text-[#0B3E78]">
                  {turma.name}
                </h2>

                <div className="text-gray-700 space-y-1">
                  <p>
                    <strong>Professor:</strong> {turma.teacher}
                  </p>
                  <p>
                    <strong>Turno:</strong> {turma.turno}
                  </p>
                  <p>
                    <strong>Horário:</strong> {turma.schedule}
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
            turmaData={selectedTurma}
            onSave={handleUpdateTurma}
          />
        </>
      )}
    </div>
  );
}
