'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Chamada from "@/components/Chamada";
import { Button } from "@/components/ui/button";
import { buscarTurmaPorId } from "@/services/TurmaService";
import { toast } from "sonner";
import { TurmaResumo } from "@/types/turma";

export default function ChamadaPage() {
  const router = useRouter();
  const params = useParams();

  const [turma, setTurma] = useState<TurmaResumo | null>(null);
  const [loading, setLoading] = useState(true);

  const turmaId = params?.turmaId
    ? String(Array.isArray(params.turmaId) ? params.turmaId[0] : params.turmaId)
    : null;

  useEffect(() => {
    if (!turmaId) return;

    const carregarTurma = async () => {
      try {
        const data = await buscarTurmaPorId(turmaId);
        setTurma(data);
      } catch (error: any) {
        toast.error(error.message || 'Erro ao carregar a turma');
      } finally {
        setLoading(false);
      }
    };

    carregarTurma();
  }, [turmaId]);

  const handleBack = () => router.push('/professor/turmas');
  const handleSaveSuccess = () =>
    setTimeout(() => router.push('/professor/turmas'), 1500);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[#0D4F97] text-lg font-bold">
          Carregando turma...
        </p>
      </div>
    );
  }

  if (!turma) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl border-2 border-[#B2D7EC] text-center shadow-md">
          <h2 className="text-[#0D4F97] text-2xl font-bold mb-4">
            Turma não identificada
          </h2>

          <Button
            variant="outline"
            onClick={() => router.push("/professor/turmas")}
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <Chamada
        turmaIdProp={turma.id}
        turmaNomeProp={turma.nome}
        onBack={handleBack}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}