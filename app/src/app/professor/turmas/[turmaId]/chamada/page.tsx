'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import Chamada from "@/components/Chamada";
import { Button } from "@/components/ui/button";
import { buscarTurmaPorId } from "@/services/TurmaService";
import { toast } from "sonner";

export default function ChamadaPage() {
  const router = useRouter();
  const params = useParams();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [turma, setTurma] = useState(null);
  const [loading, setLoading] = useState(true);

  const turmaId = params?.turmaId ? String(params.turmaId) : null;

  useEffect(() => {
    if (!turmaId) return;

    async function carregarTurma() {
      try {
        const data = await buscarTurmaPorId(turmaId);
        setTurma(data);
      } catch (error) {
        toast.error(error.message || "Erro ao carregar a turma");
      } finally {
        setLoading(false);
      }
    }

    carregarTurma();
  }, [turmaId]);

  const handleBack = () => {
    router.push("/professor/turmas");
  };

  const handleSaveSuccess = () => {
    setTimeout(() => {
      router.push("/professor/turmas");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#E5E5E5] items-center justify-center">
        <p className="text-[#0D4F97] text-lg font-bold">
          Carregando turma...
        </p>
      </div>
    );
  }

  if (!turma) {
    return (
      <div className="flex min-h-screen bg-[#E5E5E5] items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl border-2 border-[#B2D7EC] text-center shadow-md">
          <h2 className="text-[#0D4F97] text-2xl font-bold mb-4">
            Turma não identificada
          </h2>
          <Button
            onClick={() => router.push("/professor/turmas")}
            className="bg-[#0D4F97]"
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      <ProfessorSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() =>
          setIsSidebarCollapsed(!isSidebarCollapsed)
        }
      />

      <main
        className={`flex-1 p-4 md:p-8 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <Chamada
          turmaIdProp={turma.id}
          turmaNomeProp={turma.nome}
          onBack={handleBack}
          onSaveSuccess={handleSaveSuccess}
        />
      </main>
    </div>
  );
}
