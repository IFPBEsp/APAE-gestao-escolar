'use client'
import { useState, useEffect, useCallback } from "react"; 
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserCircle, Search, Loader2 } from "lucide-react"; 
import { useRouter } from "next/navigation";
import { listarAlunos } from "@/services/AlunoService";

interface AlunoResponseDTO {
  id: string;
  nome: string;
  dataNascimento: string; 
  deficiencia: string;
  telefoneResponsavel: string;
  nomeResponsavel: string;
  nomeTurma: string | null;
  turnoTurma: string | null;
}

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<AlunoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchAlunos = useCallback(async (nome: string) => {
    setLoading(true);
    try {
      const data = await listarAlunos(nome);
      setAlunos(data.content ?? []);
    } catch (error) {
      console.error("Falha ao carregar alunos:", error);
      setAlunos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAlunos(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchAlunos]);

  const formatarTurma = (nome: string | null, turno: string | null) => {
    if (!nome) return "Sem Turma Ativa";
    
    const nomeLimpo = nome.trim();
    const turnoLimpo = turno?.trim();

    if (turnoLimpo && nomeLimpo.toUpperCase().endsWith(turnoLimpo.toUpperCase())) {
      return nomeLimpo;
    }

    return turnoLimpo ? `${nomeLimpo} - ${turnoLimpo}` : nomeLimpo;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#0D4F97]" />
        <span className="ml-2 text-[#0D4F97]">Carregando alunos...</span>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0D4F97] mb-2">
            Gerenciamento de Alunos
          </h1>
          <p className="text-sm md:text-base text-[#222222]">
            Visualize e gerencie as avaliações de todos os alunos
          </p>
        </div>

        {/* Campo de Busca */}
        <div className="mb-4 md:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0D4F97]" />

            <Input
              type="text"
              placeholder="Buscar Aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 md:h-12 pl-10 border-2 border-[#B2D7EC] bg-white text-[#222222] placeholder:text-gray-400 focus:border-[#0D4F97]"
            />
          </div>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {alunos.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              Nenhum aluno encontrado.
            </p>
          ) : (
            alunos.map((aluno, index) => {
              const turmaExibicao = formatarTurma(aluno.nomeTurma, aluno.turnoTurma);

              return (
                <Card
                  key={`${aluno.id}-${index}`}
                  onClick={() =>
                    router.push(`/admin/alunos/detalhes/${aluno.id}`)
                  }
                  className="cursor-pointer rounded-xl border-2 border-[#B2D7EC]
                            shadow-md transition-all hover:border-[#0D4F97]
                            hover:shadow-lg"
                >
                  <CardContent className="p-6 mt-4">
                    {/* Header */}
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center
                                      rounded-full bg-[#B2D7EC]/20">
                        <UserCircle className="h-7 w-7 text-[#0D4F97]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-[#0D4F97]">
                          {aluno.nome}
                        </h3>
                        <p
                          className="truncate text-sm text-[#222222]"
                          title={aluno.deficiencia}
                        >
                          {aluno.deficiencia}
                        </p>
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center gap-2">
                        <span className="shrink-0">Turma Atual:</span>
                        <span className="font-bold text-[#0D4F97] text-right">
                          {turmaExibicao}
                        </span>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <span className="shrink-0">Responsável:</span>
                        <span
                          className="truncate font-medium text-right"
                          title={aluno.nomeResponsavel}
                        >
                          {aluno.nomeResponsavel}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
